const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM products WHERE stock > 0';
  const params = [];
  if (category && category !== 'all') { query += ' AND category = ?'; params.push(category); }
  if (search) { query += ' AND (name LIKE ? OR description LIKE ?)'; params.push('%'+search+'%', '%'+search+'%'); }
  res.json(db.prepare(query).all(...params));
});

app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.get('/api/categories', (req, res) => {
  const cats = db.prepare('SELECT DISTINCT category FROM products').all();
  res.json(cats.map(c => c.category));
});

app.get('/api/cart/:sessionId', (req, res) => {
  const items = db.prepare(`SELECT c.id, c.quantity, p.name, p.price, p.image_url, p.category, (c.quantity * p.price) as subtotal FROM cart c JOIN products p ON c.product_id = p.id WHERE c.session_id = ?`).all(req.params.sessionId);
  const total = items.reduce((sum, i) => sum + i.subtotal, 0);
  res.json({ items, total });
});

app.post('/api/cart', (req, res) => {
  const { sessionId, productId, quantity } = req.body;
  const existing = db.prepare('SELECT * FROM cart WHERE session_id = ? AND product_id = ?').get(sessionId, productId);
  if (existing) { db.prepare('UPDATE cart SET quantity = quantity + ? WHERE id = ?').run(quantity, existing.id); }
  else { db.prepare('INSERT INTO cart (session_id, product_id, quantity) VALUES (?, ?, ?)').run(sessionId, productId, quantity); }
  res.json({ success: true });
});

app.put('/api/cart/:id', (req, res) => {
  const { quantity } = req.body;
  if (quantity <= 0) { db.prepare('DELETE FROM cart WHERE id = ?').run(req.params.id); }
  else { db.prepare('UPDATE cart SET quantity = ? WHERE id = ?').run(quantity, req.params.id); }
  res.json({ success: true });
});

app.delete('/api/cart/:id', (req, res) => {
  db.prepare('DELETE FROM cart WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.post('/api/orders', (req, res) => {
  const { sessionId, customer } = req.body;
  const cartItems = db.prepare('SELECT c.quantity, c.product_id, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.session_id = ?').all(sessionId);
  if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' });
  const total = cartItems.reduce((s, i) => s + i.quantity * i.price, 0);
  const custResult = db.prepare('INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)').run(customer.name, customer.email, customer.phone, customer.address);
  const ordResult = db.prepare('INSERT INTO orders (customer_id, total, status) VALUES (?, ?, ?)').run(custResult.lastInsertRowid, total, 'confirmed');
  const itemStmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)');
  cartItems.forEach(i => itemStmt.run(ordResult.lastInsertRowid, i.product_id, i.quantity, i.price));
  db.prepare('DELETE FROM cart WHERE session_id = ?').run(sessionId);
  res.json({ success: true, orderId: ordResult.lastInsertRowid, total });
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.prepare('SELECT o.*, c.name, c.email, c.phone, c.address FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.id = ?').get(req.params.id);
  const items = db.prepare('SELECT oi.*, p.name as product_name, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?').all(req.params.id);
  res.json({ order, items });
});

app.listen(PORT, () => console.log('KigaliStyle Shop running at http://localhost:' + PORT));