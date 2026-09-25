
const PRODUCTS = [
  { id:"ivory-spread", name:"The Ivory Spread", price:4200, badge:{label:"New", type:"new"},
    category:"plain", rating:5, reviewCount:24, featured:true,
    sizes:{ "14":4, "14.5":3, "15":5, "15.5":4, "16":6, "16.5":5, "17":4 },
    specs:{ fabric:"100% Cotton Poplin", fit:"Regular Fit", pattern:"Plain", collar:"Spread Collar", cuff:"Button Cuff", care:"Machine wash cold, hang dry, warm iron", origin:"Made in Pakistan" } },
  { id:"charcoal-oxford", name:"The Charcoal Oxford", price:3680, was:4600, badge:{label:"-20%", type:"sale"},
    category:"textured", rating:5, reviewCount:18, featured:true,
    sizes:{ "14":2, "14.5":0, "15":3, "15.5":0, "16":5, "16.5":4, "17":3 },
    specs:{ fabric:"Brushed Cotton Oxford", fit:"Regular Fit", pattern:"Textured Weave", collar:"Spread Collar", cuff:"Button Cuff", care:"Machine wash cold, hang dry, warm iron", origin:"Made in Pakistan" } },
  { id:"slate-french-cuff", name:"The Slate French Cuff", price:5100, badge:null,
    category:"check", rating:4, reviewCount:11, featured:true,
    sizes:{ "14":0, "14.5":2, "15":0, "15.5":3, "16":4, "16.5":3, "17":5 },
    specs:{ fabric:"Cotton Twill", fit:"Regular Fit", pattern:"Check", collar:"Spread Collar", cuff:"French Cuff (cufflinks required)", care:"Dry clean recommended", origin:"Made in Pakistan" } },
  { id:"signature-white", name:"The Signature White", price:4200, badge:{label:"New", type:"new"},
    category:"stripe", rating:5, reviewCount:31, featured:true,
    sizes:{ "14":3, "14.5":4, "15":4, "15.5":5, "16":6, "16.5":5, "17":4 },
    specs:{ fabric:"100% Cotton Poplin", fit:"Regular Fit", pattern:"Stripe", collar:"Spread Collar", cuff:"Button Cuff", care:"Machine wash cold, hang dry, warm iron", origin:"Made in Pakistan" } },
];

// Renders one product card. Reads everything — name, price, category, stock —
// live from the PRODUCTS array above, so editing a product here updates it
// everywhere it appears on the site (homepage, shop grid) automatically.
// Generates a stable, customer-facing product code from the product's own id —
// so it never shifts even if you reorder or add/remove products later.
// Override any product by adding an explicit "sku" field if you want full control.
function getSKU(p){
  if (p.sku) return p.sku;
  const parts = p.id.split("-").map(part => part.slice(0, 3).toUpperCase());
  return "DSZ-" + parts.join("-");
}

// Per-size variant code, for tracking stock at the size level — e.g. a 15"
// Ivory Spread is DSZ-IVO-SPR-150, a 14.5" is DSZ-IVO-SPR-145. Stable and
// automatic: no numbering to keep track of as you add products or sizes.
function getVariantSKU(p, size){
  const sizeCode = String(Math.round(parseFloat(size) * 10));
  return `${getSKU(p)}-${sizeCode}`;
}

function productCardHTML(p, linkable){
  if (linkable === undefined) linkable = true;
  const badgeHtml = p.badge ? `<span class="p-badge ${p.badge.type}">${p.badge.label}</span>` : '';
  const wasHtml = p.was ? `<span class="was">${p.was.toLocaleString()}</span>` : '';
  const sizesInStock = Object.keys(p.sizes).filter(s => p.sizes[s] > 0);
  const rating = p.rating || 0;
  const wishHtml = linkable ? `<button type="button" class="wish-btn" data-wishlist-id="${p.id}" onclick="event.preventDefault();event.stopPropagation();toggleWishlist('${p.id}');" aria-label="Save to wishlist"><svg viewBox="0 0 24 24"><path d="M20.8 4.6a5 5 0 0 0-7 0L12 6.3l-1.8-1.7a5 5 0 0 0-7 7L12 20.3l8.8-8.7a5 5 0 0 0 0-7z"/></svg></button>` : '';
  const inner = `
      ${badgeHtml}
      ${wishHtml}
      <div class="photo-frame"><img data-base="images/products/${p.id}-1" alt="${p.name}" class="real-photo"><svg class="shirt-mark" viewBox="0 0 100 120" style="width:34%"><path d="M25 15 40 5 50 12 60 5 75 15 75 25 60 20 60 110 40 110 40 20 25 25Z"/></svg><span class="ph-label">800×1000</span></div>
      <div class="p-name">${p.name}</div>
      <div class="p-price">PKR ${p.price.toLocaleString()}${wasHtml}</div>
      <div class="p-rating"><span class="stars">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</span> (${p.reviewCount || 0})</div>`;
  const attrs = `data-category="${p.category || ''}" data-sizes="${sizesInStock.join(',')}" data-name="${p.name.toLowerCase()}"`;
  return linkable
    ? `<a class="p-card" ${attrs} href="product.html?id=${p.id}">${inner}\n      </a>`
    : `<div class="p-card" ${attrs}>${inner}\n      </div>`;
}

// Regular Fit size chart (inches) — from your official RGF chart.
// Note: 14" and 14.5" rows are estimated by extending the pattern of your
// 15"–18.5" chart backward, since your original chart started at 15".
// Please double-check these two rows before launch.
const SIZE_CHART = [
  { size:"14",   shoulder:17,   chest:19.5, waist:19.5, sleeves:23,   length:28.5 },
  { size:"14.5", shoulder:17.5, chest:20.5, waist:20.5, sleeves:23.5, length:29   },
  { size:"15",   shoulder:18,   chest:21,   waist:21,   sleeves:24,   length:29.5 },
  { size:"15.5", shoulder:18.5, chest:22,   waist:22,   sleeves:24.5, length:30   },
  { size:"16",   shoulder:19,   chest:22.5, waist:22.5, sleeves:25,   length:31   },
  { size:"16.5", shoulder:19.5, chest:23.5, waist:23.5, sleeves:25.5, length:31.5 },
  { size:"17",   shoulder:20,   chest:24.5, waist:24.5, sleeves:26,   length:32   },
];
