/**
 * ============================================================
 *  DE-SHAZEB — CENTRAL PRODUCT DATABASE
 *  products.js  |  Edit ONLY this file to update products
 * ============================================================
 *
 *  HOW TO MARK A PRODUCT ON SALE:
 *    onSale    : true
 *    oldPrice  : 2000   ← original price
 *    price     : 1600   ← sale price
 *    badge     : 'Sale −20%'
 *
 *  FEATURED ON HOMEPAGE (index.html):
 *    featured  : true   → appears in Best Sellers or Sale row
 *
 *  BADGE VALUES:
 *    badge: 'Best Seller'  → gold
 *    badge: 'New'          → teal
 *    badge: 'Sale −20%'    → red  (set text manually to match %)
 *    badge: null           → no badge
 *
 *  CATEGORY:  'formal' | 'party' | 'casual' | 'sale formal' | 'sale party'
 *
 *  STOCK: set collar size qty to 0 = out of stock for that size
 * ============================================================
 */

var PRODUCTS = [
  {
    id        : 'Signature-Striped-Formal-Shirt',
    cat       : 'formal',
    name      : 'Signature Striped Formal Shirt',
    fabric    : 'Egyptian Cotton · Oxford',
    price     : 1200,
    oldPrice  : null,
    onSale    : false,
    badge     : 'Best Seller',
    badgeClass: 'b-best',
    featured  : true,
    
  // ── MAIN image — shows on homepage, shop, and product page ──
  img : 'https://i.ibb.co/b5S0XNZ4/Gemini-Generated-Image-s5ae6rs5ae6rs5ae.png',

  // ── EXTRA images — show as clickable thumbnails on product page only ──
  images : [
    'https://i.ibb.co/b5S0XNZ4/Gemini-Generated-Image-s5ae6rs5ae6rs5ae.png',   // thumbnail 1 — front
    'https://i.ibb.co/nsgx9BZK/Gemini-Generated-Image-kx5dmwkx5dmwkx5d.png',    // thumbnail 2 — Side
    'https://i.ibb.co/h1R7RDGp/Gemini-Generated-Image-eekqxheekqxheekq.png',  // thumbnail 3 — collar closeup
  ],
    
    stock     : { '14':0, '14.5':3, '15':5, '15.5':4, '16':2, '16.5':3, '17':1, '17.5':0 }
  },
  {
    id        : 'Premium-Textured-Casual',
    cat       : 'sale casual',
    name      : 'Premium Textured Casual Long Sleeve Button-Down Shirt',
    fabric    : 'Cotton-Poly · vertical stripe pattern',
    price     : 2125,
    oldPrice  : 2500,
    onSale    : true,
    badge     : 'Sale \u221215%',
    badgeClass: 'b-sale',
    featured  : true,
    
  // ── MAIN image — shows on homepage, shop, and product page ──
  img : 'https://i.ibb.co/YBcBmWtf/Gemini-Generated-Image-qydmumqydmumqydm.png',

  // ── EXTRA images — show as clickable thumbnails on product page only ──
  images : [
    'https://i.ibb.co/YBcBmWtf/Gemini-Generated-Image-qydmumqydmumqydm.png',   // thumbnail 1 — front
    'https://i.ibb.co/TxPrKsQC/Gemini-Generated-Image-1nd3vf1nd3vf1nd3.png',    // thumbnail 2 — Side
    'https://i.ibb.co/N6GR7Q00/Gemini-Generated-Image-p2cpzhp2cpzhp2cp.png',  // thumbnail 3 — collar closeup
    'https://i.ibb.co/6RpyFrc2/Gemini-Generated-Image-skv25tskv25tskv2.png',    // thumbnail 4 — cuff detail
  ],
    
    stock     : { '14':0, '14.5':2, '15':2, '15.5':4, '16':0, '16.5':0, '17':0, '17.5':0 }
  },
  {
    id        : 'Classic-Gingham-Check',
    cat       : 'formal',
    name      : 'Classic Gingham Check Cotton Shirt',
    fabric    : 'Cotton-Poly · Twill',
    price     : 1650,
    oldPrice  : null,
    onSale    : false,
    badge     : 'New',
    badgeClass: 'b-new',
    featured  : true,
    
  // ── MAIN image — shows on homepage, shop, and product page ──
  img : 'https://i.ibb.co/5xshTqq3/Gemini-Generated-Image-749g8749g8749g87.png',

  // ── EXTRA images — show as clickable thumbnails on product page only ──
  images : [
    'https://i.ibb.co/5xshTqq3/Gemini-Generated-Image-749g8749g8749g87.png',   // thumbnail 1 — front
    'https://i.ibb.co/Gv0xqxN8/Gemini-Generated-Image-a0bixxa0bixxa0bi.png',    // thumbnail 2 — Side
    'https://i.ibb.co/0jt56kC7/Gemini-Generated-Image-x165tsx165tsx165.png',  // thumbnail 3 — collar closeup
    'https://i.ibb.co/j983Z6nW/Gemini-Generated-Image-5xe9rb5xe9rb5xe9.png',    // thumbnail 4 — cuff detail
  ],
    
    stock     : { '14':2, '14.5':4, '15':6, '15.5':3, '16':0, '16.5':2, '17':1, '17.5':0 }
  },
  {
    id        : 'Black-Vertical-Striped',
    cat       : 'formal',
    name      : 'Black Premium Vertical Striped Formal Shirt',
    fabric    : 'Premium Cotton · Satin',
    price     : 1600,
    oldPrice  : null,
    onSale    : false,
    badge     : null,
    badgeClass: '',
    featured  : false,
    img       : 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600',
       
  // ── MAIN image — shows on homepage, shop, and product page ──
  img : 'https://i.ibb.co/7dKVqGN2/Gemini-Generated-Image-ef1cxsef1cxsef1c.png',

  // ── EXTRA images — show as clickable thumbnails on product page only ──
  images : [
    'https://i.ibb.co/7dKVqGN2/Gemini-Generated-Image-ef1cxsef1cxsef1c.png',   // thumbnail 1 — front
    'https://i.ibb.co/whdt3fn2/Gemini-Generated-Image-ah0gbwah0gbwah0g.png',    // thumbnail 2 — Side
    'hhttps://i.ibb.co/Jw7HXwd7/Gemini-Generated-Image-va64ykva64ykva64.png',  // thumbnail 3 — collar closeup
    'https://i.ibb.co/kgc2fx1T/Gemini-Generated-Image-o3lfuxo3lfuxo3lf.png',    // thumbnail 4 — cuff detail
  ],
     stock     : { '14':0, '14.5':3, '15':5, '15.5':5, '16':4, '16.5':2, '17':0, '17.5':0 }
  },
  {
    id        : 'Plaid-Formal-Shirt',
    cat       : 'formal',
    name      : 'Classic Navy & White Plaid Formal Shirt',
    fabric    : '100% Cotton · Poplin',
    price     : 1750,
    oldPrice  : null,
    onSale    : false,
    badge     : null,
    badgeClass: '',
    featured  : false,
      
  // ── MAIN image — shows on homepage, shop, and product page ──
  img : 'https://i.ibb.co/TMdP1rPT/Gemini-Generated-Image-n0ctxn0ctxn0ctxn.png',

  // ── EXTRA images — show as clickable thumbnails on product page only ──
  images : [
    'https://i.ibb.co/TMdP1rPT/Gemini-Generated-Image-n0ctxn0ctxn0ctxn.png',   // thumbnail 1 — front
    'https://i.ibb.co/jPJXc7JT/Gemini-Generated-Image-d7t0rud7t0rud7t0.png',    // thumbnail 2 — Side
    'https://i.ibb.co/B28yHjhW/Gemini-Generated-Image-hf7qb3hf7qb3hf7q.png',  // thumbnail 3 — collar closeup
    'https://i.ibb.co/398sx1XC/Gemini-Generated-Image-cuibjhcuibjhcuib.png',    // thumbnail 4 — cuff detail
    'https://i.ibb.co/SDJdwSmx/Gemini-Generated-Image-3j7yfy3j7yfy3j7y.png',    // thumbnail 4 — cuff detail
  ],

    stock     : { '14':3, '14.5':5, '15':8, '15.5':7, '16':4, '16.5':3, '17':2, '17.5':1 }
  },
  {
    id        : 'black-formal',
    cat       : 'formal',
    name      : 'Black Formal Shirt',
    fabric    : 'Egyptian Cotton · Twill',
    price     : 1500,
    oldPrice  : null,
    onSale    : false,
    badge     : 'Best Seller',
    badgeClass: 'b-best',
    featured  : true,
    img       : 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600',
    stock     : { '14':2, '14.5':4, '15':6, '15.5':5, '16':3, '16.5':2, '17':0, '17.5':0 }
  },
  {
    id        : 'Pink-Geometric-Weave',
    cat       : 'sale formal',
    name      : 'Pink Geometric Weave Shirt',
    fabric    : '100% Cotton · Plain',
    price     : 980,
    oldPrice  : 1200,
    onSale    : true,
    badge     : 'Sale \u221218%',
    badgeClass: 'b-sale',
    featured  : true,
          
  // ── MAIN image — shows on homepage, shop, and product page ──
  img : 'https://i.ibb.co/pvLb6LDz/Gemini-Generated-Image-jn3rhkjn3rhkjn3r.png?w=600',

  // ── EXTRA images — show as clickable thumbnails on product page only ──
  images : [
    'https://i.ibb.co/pvLb6LDz/Gemini-Generated-Image-jn3rhkjn3rhkjn3r.png?w=600',   // thumbnail 1 — front
    'https://i.ibb.co/NdTXLydk/Gemini-Generated-Image-apo02qapo02qapo0.png',    // thumbnail 2 — Side
    'https://i.ibb.co/zVvTzvBp/Gemini-Generated-Image-wk6ns9wk6ns9wk6n.png',  // thumbnail 3 — collar closeup
    'https://i.ibb.co/ynstr7w2/Gemini-Generated-Image-1d4r2w1d4r2w1d4r.png',    // thumbnail 4 — cuff detail
  ],
    stock     : { '14':1, '14.5':1, '15':0, '15.5':0, '16':0, '16.5':0, '17':0, '17.5':0 }
  },
  {
    id        : 'beige-linen',
    cat       : 'formal',
    name      : 'Beige Linen Shirt',
    fabric    : 'Italian Linen · Plain',
    price     : 1300,
    oldPrice  : null,
    onSale    : false,
    badge     : 'New',
    badgeClass: 'b-new',
    featured  : false,
    img       : 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=600',
    stock     : { '14':3, '14.5':3, '15':4, '15.5':4, '16':3, '16.5':3, '17':2, '17.5':2 }
  },
  {
    id        : 'Olive-Vertical-Stripe',
    cat       : 'Casual',
    name      : 'Olive Vertical Stripe Shirt',
    fabric    : 'Cotton-Poly · Plain Weave',
    price     : 1800,
    oldPrice  : null,
    onSale    : false,
    badge     : null,
    badgeClass: '',
    featured  : false,
   
  // ── MAIN image — shows on homepage, shop, and product page ──
  img : 'https://i.ibb.co/BVY6gXDw/Gemini-Generated-Image-8m3hyi8m3hyi8m3h.png',

  // ── EXTRA images — show as clickable thumbnails on product page only ──
  images : [
    'https://i.ibb.co/BVY6gXDw/Gemini-Generated-Image-8m3hyi8m3hyi8m3h.png',   // thumbnail 1 — front
    'https://i.ibb.co/fYgbRFK2/Gemini-Generated-Image-a39og6a39og6a39o.png',    // thumbnail 2 — Side
    'https://i.ibb.co/j9dhCsJc/Gemini-Generated-Image-n1z8b2n1z8b2n1z8.png',  // thumbnail 3 — collar closeup
    'https://i.ibb.co/N6QjR593/Gemini-Generated-Image-ie7u1wie7u1wie7u.png',    // thumbnail 4 — cuff detail
  ],

    stock     : { '14':0, '14.5':0, '15':2, '15.5':3, '16':3, '16.5':1, '17':0, '17.5':0 }
  },
  {
    id        : 'grey-textured',
    cat       : 'sale formal',
    name      : 'Grey Textured Shirt',
    fabric    : 'Cotton-Poly · Dobby',
    price     : 1250,
    oldPrice  : 1500,
    onSale    : true,
    badge     : 'Sale \u221217%',
    badgeClass: 'b-sale',
    featured  : false,
    img       : 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600',
    stock     : { '14':0, '14.5':2, '15':2, '15.5':0, '16':0, '16.5':0, '17':0, '17.5':0 }
  },
  {
    id        : 'Light-Blue-Dobby-Dot',
    cat       : 'formal',
    name      : 'Light Blue Dobby Dot Shirt',
    fabric    : 'Cotton-Silk · Satin',
    price     : 2000,
    oldPrice  : null,
    onSale    : false,
    badge     : 'New',
    badgeClass: 'b-new',
    featured  : false,

  // ── MAIN image — shows on homepage, shop, and product page ──
  img : 'https://i.ibb.co/JFc6M3xH/Gemini-Generated-Image-nz5yznz5yznz5yzn-Copy.png',

  // ── EXTRA images — show as clickable thumbnails on product page only ──
  images : [
    'https://i.ibb.co/JFc6M3xH/Gemini-Generated-Image-nz5yznz5yznz5yzn-Copy.png',   // thumbnail 1 — front
    'https://i.ibb.co/7xkN4YsV/Gemini-Generated-Image-j013psj013psj013.png',    // thumbnail 2 — back
    'https://i.ibb.co/gMNdV323/Gemini-Generated-Image-7bo0cx7bo0cx7bo0.png',  // thumbnail 3 — collar closeup
    'https://i.ibb.co/RTmyRYH6/Gemini-Generated-Image-hezb29hezb29hezb.png',    // thumbnail 4 — cuff detail
  ],
    stock     : { '14':2, '14.5':3, '15':4, '15.5':3, '16':2, '16.5':1, '17':1, '17.5':0 }
  },
  {
  id        : 'black-formal Plain',
  cat       : 'formal',
  name      : 'Black Formal Plain Shirt',
  fabric    : 'Egyptian Cotton · Twill',
  price     : 1500,
  oldPrice  : null,
  onSale    : false,
  badge     : 'Best Seller',
  badgeClass: 'b-best',
  featured  : true,

  // ── MAIN image — shows on homepage, shop, and product page ──
  img : 'https://i.ibb.co/BKS6TQZT/Gemini-Generated-Image-5zc7mq5zc7mq5zc7.png',

  // ── EXTRA images — show as clickable thumbnails on product page only ──
  images : [
    'https://i.ibb.co/qFVtyPmh/Gemini-Generated-Image-6ggaok6ggaok6gga.png',   // thumbnail 1 — front
    'https://i.ibb.co/def456/black-formal-back.jpg',    // thumbnail 2 — back
    'https://i.ibb.co/ghi789/black-formal-collar.jpg',  // thumbnail 3 — collar closeup
    'https://i.ibb.co/jkl012/black-formal-cuff.jpg',    // thumbnail 4 — cuff detail
  ],

  stock : { '14':2, '14.5':4, '15':6, '15.5':5, '16':3, '16.5':2, '17':0, '17.5':0 }
  },
    {
    id        : 'dark-green',
    cat       : 'casual',
    name      : 'Dark Green Casual Shirt',
    fabric    : '100% Cotton · Plain',
    price     : 1100,
    oldPrice  : null,
    onSale    : false,
    badge     : null,
    badgeClass: '',
    featured  : false,
    img       : 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600',
    stock     : { '14':3, '14.5':4, '15':4, '15.5':4, '16':2, '16.5':2, '17':1, '17.5':1 }
  }
];

/* ============================================================
 *  HELPERS — used by index.html and shop.html
 * ============================================================ */

var SIZES = ['14','14.5','15','15.5','16','16.5','17','17.5'];

function totalStock(p) {
  return Object.keys(p.stock).reduce(function(a,k){ return a + p.stock[k]; }, 0);
}

function stockLabel(p) {
  var total = totalStock(p);
  if (total === 0) return { text:'Out of Stock', cls:'stock-out' };
  if (total <= 5)  return { text:'Only '+total+' left', cls:'stock-low' };
  return { text:'In Stock', cls:'stock-in' };
}

function availableSizes(p) {
  return SIZES.filter(function(s){ return p.stock[s] > 0; });
}
