const API = '';

function getSessionId() {
  let id = localStorage.getItem('ks_session');
  if (!id) { id = 'sess_' + Math.random().toString(36).substr(2, 9); localStorage.setItem('ks_session', id); }
  return id;
}

function showToast(msg, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> ${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function formatPrice(p) {
  return 'RWF ' + Number(p).toLocaleString();
}

async function updateCartCount() {
  try {
    const r = await fetch(`${API}/api/cart/${getSessionId()}`);
    const data = await r.json();
    const count = data.items ? data.items.reduce((s, i) => s + i.quantity, 0) : 0;
    const el = document.getElementById('cart-count');
    if (el) { el.textContent = count; el.style.display = count > 0 ? 'flex' : 'none'; }
  } catch {}
}

async function addToCart(productId, quantity = 1) {
  try {
    const r = await fetch(`${API}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: getSessionId(), productId, quantity })
    });
    if (r.ok) { showToast('Added to cart!'); updateCartCount(); }
  } catch { showToast('Error adding to cart', 'error'); }
}

document.addEventListener('DOMContentLoaded', () => {
  const ham = document.getElementById('hamburger');
  const links = document.getElementById('navbar-links');
  if (ham && links) {
    ham.addEventListener('click', () => links.classList.toggle('open'));
  }
  updateCartCount();
  setInterval(updateCartCount, 5000);
});