
function getWishlist(){
  try { return JSON.parse(localStorage.getItem('dsz_wishlist') || '[]'); }
  catch(e){ return []; }
}
function saveWishlist(list){
  localStorage.setItem('dsz_wishlist', JSON.stringify(list));
  updateWishlistBadge();
}
function isWishlisted(id){
  return getWishlist().includes(id);
}
function toggleWishlist(id){
  let list = getWishlist();
  if (list.includes(id)) list = list.filter(x => x !== id);
  else list.push(id);
  saveWishlist(list);
  document.querySelectorAll(`[data-wishlist-id="${id}"]`).forEach(btn => {
    btn.classList.toggle('active', list.includes(id));
  });
}
function updateWishlistBadge(){
  const badge = document.getElementById('wishlist-badge');
  if (!badge) return;
  const count = getWishlist().length;
  if (count > 0){ badge.textContent = count; badge.style.display = 'flex'; }
  else { badge.style.display = 'none'; }
}
function renderWishlistPage(){
  const root = document.getElementById('wishlist-root');
  if (!root) return;
  const ids = getWishlist();
  if (ids.length === 0){
    root.innerHTML = '<p class="cart-empty">Your wishlist is empty. <a href="shop.html" style="color:var(--gold-light);">Browse the collection</a></p>';
    return;
  }
  root.innerHTML = '<div class="product-grid">' + ids.map(id => {
    const p = (typeof findProduct === 'function') ? findProduct(id) : null;
    if (!p) return '';
    return `
      <a class="p-card" href="product.html?id=${p.id}">
        <div class="photo-frame"><svg class="shirt-mark" viewBox="0 0 100 120" style="width:34%"><path d="M25 15 40 5 50 12 60 5 75 15 75 25 60 20 60 110 40 110 40 20 25 25Z" style="fill:none;stroke:#C9B79C;stroke-width:1.4;"/></svg></div>
        <div class="p-name">${p.name}</div>
        <div class="p-price">PKR ${p.price.toLocaleString()}</div>
      </a>`;
  }).join('') + '</div>';
}
document.addEventListener('DOMContentLoaded', () => {
  updateWishlistBadge();
  renderWishlistPage();
  const saved = getWishlist();
  document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
    if (saved.includes(btn.dataset.wishlistId)) btn.classList.add('active');
  });
});
