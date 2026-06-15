const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'shop.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image_url TEXT,
    stock INTEGER DEFAULT 10
  );
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    total REAL NOT NULL,
    status TEXT DEFAULT 'confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

const count = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
if (count === 0) {
  const ins = db.prepare('INSERT INTO products (name,category,price,description,image_url,stock) VALUES (?,?,?,?,?,?)');
  [
    ['Kigali Kitenge Dress','Dresses',35000,'Beautiful traditional Rwandan kitenge dress with modern cut.','https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',15],
    ['Ankara Print Maxi Dress','Dresses',42000,'Elegant Ankara print maxi dress perfect for formal occasions.','https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400',10],
    ["Men's Safari Shirt",'Shirts',18000,'Classic Rwandan safari shirt in breathable cotton.','https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',20],
    ['Traditional Imigongo Shirt','Shirts',22000,'Unique shirt featuring traditional Imigongo geometric patterns.','https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',12],
    ['Kigali Denim Jacket','Jackets',55000,'Modern denim jacket with subtle Rwandan embroidery.','https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400',8],
    ['Woven Basket Bag','Accessories',15000,'Handwoven Rwanda basket bag. Supports local artisans.','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',25],
    ['Leather Sandals','Shoes',28000,'Handcrafted leather sandals made by Kigali artisans.','https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400',18],
    ['Kitenge Wrap Skirt','Skirts',20000,'Versatile kitenge wrap skirt in bold African prints.','https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400',14],
    ['Agaseke Print Blouse','Shirts',16000,'Light cotton blouse featuring the iconic Agaseke basket pattern.','https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400',16],
    ["Men's Chino Trousers",'Trousers',32000,'Premium slim-fit chino trousers. Tailored by Kigali designers.','https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',11],
    ['Kids Kitenge Set','Kids',25000,'Matching kitenge top and bottom set for children aged 2-10.','https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400',9],
    ['Beaded Necklace Set','Accessories',12000,'Handmade beaded necklace crafted by women cooperatives in Kigali.','https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',30],
  ].forEach(p => ins.run(...p));
}

module.exports = db;