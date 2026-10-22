// Shared storefront labels and a dashboard-controlled featured collection.
(()=>{
 const E=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const money=n=>'PKR '+Number(n).toLocaleString('en-PK');
 const safeImage=url=>typeof url==='string'&&(/^assets\/[A-Za-z0-9_.-]+\.(webp|png|jpe?g)$/i.test(url)||/^https:\/\/[^\s<>"']+$/i.test(url));
 function badgeMarkup(p){const sale=Number(p.regular_price)>Number(p.price)&&Number(p.discount_percent)>0;return sale?'<span class="product-ribbon ribbon-sale">Sale</span>':p.is_new===true?'<span class="product-ribbon ribbon-new">New</span>':'';}
 function featuredProducts(products){return products.filter(p=>p.featured===true&&p.published!==false&&p.sales_enabled!==false&&safeImage(p.image));}
 function priceMarkup(p){return Number(p.regular_price)>Number(p.price)&&Number(p.discount_percent)>0?`<del class="sale-original">${money(p.regular_price)}</del> <span class="sale-current">${money(p.price)}</span> <span class="sale-badge">${Number(p.discount_percent)}% OFF</span>`:money(p.price);}
 window.DSMerchandising={badgeMarkup,featuredProducts};
 const section=document.getElementById('featuredCollection'),grid=document.getElementById('featuredGrid');if(!section||!grid)return;
 const products=featuredProducts(window.DE_SHAHZAIB_PRODUCTS||[]);if(!products.length)return;
 section.hidden=false;let page=0;
 const size=()=>matchMedia('(max-width:540px)').matches?1:matchMedia('(max-width:900px)').matches?2:4;
 const previous=document.getElementById('featuredPrevious'),next=document.getElementById('featuredNext'),status=document.getElementById('featuredStatus');
 const render=()=>{const count=size(),pages=Math.ceil(products.length/count);page=(page+pages)%pages;const start=page*count,shown=products.slice(start,start+count);
 grid.innerHTML=shown.map(p=>{const href='product.html?id='+encodeURIComponent(p.id);return `<article class="product-card"><div class="product-photo"><a class="product-image-button" data-product-id="${E(p.id)}" href="${href}" aria-label="View ${E(p.name)}"><img src="${E(p.image)}" alt="${E(p.name)}" loading="lazy" width="600" height="600"></a>${badgeMarkup(p)}</div><div class="product-category"><span>${E(p.category==='Dobby'?'Dobby & texture':p.category)}</span><span>${E(p.colour)}</span></div><h3><a class="product-title" href="${href}">${E(p.name)}</a></h3><p class="product-price">${priceMarkup(p)}</p></article>`}).join('');
 previous.hidden=next.hidden=pages<2;status.textContent=(start+1)+'–'+(start+shown.length)+' of '+products.length;};
 previous.onclick=()=>{page--;render()};next.onclick=()=>{page++;render()};let width=size();window.addEventListener('resize',()=>{if(size()!==width){width=size();page=0;render()}});render();
})();
