
const WHATSAPP_NUMBER = "923333084397"; // edit here if this number changes

function getCart(){
  try { return JSON.parse(localStorage.getItem('dsz_cart') || '[]'); }
  catch(e){ return []; }
}
function saveCart(cart){
  localStorage.setItem('dsz_cart', JSON.stringify(cart));
  updateCartBadge();
}
function findProduct(id){
  return PRODUCTS.find(p => p.id === id);
}
function addToCart(id, size, qty){
  const cart = getCart();
  const existing = cart.find(item => item.id === id && item.size === size);
  if (existing) { existing.qty += qty; }
  else { cart.push({ id, size, qty }); }
  saveCart(cart);
}
function removeFromCart(index){
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  if (typeof renderCartPage === 'function') renderCartPage();
}
function setCartQty(index, qty){
  const cart = getCart();
  if (cart[index]) cart[index].qty = Math.max(1, qty);
  saveCart(cart);
  if (typeof renderCartPage === 'function') renderCartPage();
}
function cartCount(){
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}
function cartTotal(){
  return getCart().reduce((sum, item) => {
    const p = findProduct(item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
}
function updateCartBadge(){
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = cartCount();
  if (count > 0){ badge.textContent = count; badge.style.display = 'flex'; }
  else { badge.style.display = 'none'; }
}
function whatsappCheckoutLink(){
  const cart = getCart();
  if (cart.length === 0) return `https://wa.me/${WHATSAPP_NUMBER}`;
  let lines = ["Hi De-Shahzaib, I'd like to order:"];
  cart.forEach(item => {
    const p = findProduct(item.id);
    if (p) lines.push(`- ${p.name} [${typeof getVariantSKU === 'function' ? getVariantSKU(p, item.size) : p.id}] (Collar ${item.size}") x${item.qty} — PKR ${(p.price*item.qty).toLocaleString()}`);
  });
  lines.push(`Total: PKR ${cartTotal().toLocaleString()}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}
document.addEventListener('DOMContentLoaded', updateCartBadge);
