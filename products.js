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
    img       : 'https://i.ibb.co/b5S0XNZ4/Gemini-Generated-Image-s5ae6rs5ae6rs5ae.png',
    stock     : { '14':0, '14.5':3, '15':5, '15.5':4, '16':2, '16.5':3, '17':1, '17.5':0 }
  },
  {
    id        : 'navy-executive',
    cat       : 'formal',
    name      : 'Navy Executive Shirt',
    fabric    : 'Cotton-Poly · Twill',
    price     : 1450,
    oldPrice  : null,
    onSale    : false,
    badge     : 'New',
    badgeClass: 'b-new',
    featured  : true,
    img       : 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
    stock     : { '14':2, '14.5':4, '15':6, '15.5':3, '16':0, '16.5':2, '17':1, '17.5':0 }
  },
  {
    id        : 'charcoal-business',
    cat       : 'formal',
    name      : 'Charcoal Business Shirt',
    fabric    : 'Cotton-Poly · Plain Weave',
    price     : 1350,
    oldPrice  : null,
    onSale    : false,
    badge     : null,
    badgeClass: '',
    featured  : false,
    img       : 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600',
    stock     : { '14':0, '14.5':2, '15':2, '15.5':4, '16':0, '16.5':0, '17':0, '17.5':0 }
  },
  {
    id        : 'maroon-party',
    cat       : 'party',
    name      : 'Maroon Party Wear Shirt',
    fabric    : 'Premium Cotton · Satin',
    price     : 1600,
    oldPrice  : 2000,
    onSale    : true,
    badge     : 'Sale \u221220%',
    badgeClass: 'b-sale',
    featured  : true,
    img       : 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600',
    stock     : { '14':0, '14.5':3, '15':5, '15.5':5, '16':4, '16.5':2, '17':0, '17.5':0 }
  },
  {
    id        : 'light-blue-office',
    cat       : 'formal',
    name      : 'Light Blue Office Shirt',
    fabric    : '100% Cotton · Poplin',
    price     : 1100,
    oldPrice  : null,
    onSale    : false,
    badge     : null,
    badgeClass: '',
    featured  : false,
    img       : 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600',
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
    img       : 'https://i.ibb.co/pvLb6LDz/Gemini-Generated-Image-jn3rhkjn3rhkjn3r.png?w=600',
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
    id        : 'royal-blue',
    cat       : 'party',
    name      : 'Royal Blue Ceremonial Shirt',
    fabric    : 'Cotton-Satin · Satin Weave',
    price     : 1800,
    oldPrice  : null,
    onSale    : false,
    badge     : null,
    badgeClass: '',
    featured  : false,
    img       : 'https://images.unsplash.com/photo-1566479179817-c0e5c0b45a69?w=600',
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
    featured  : true,
    img       : 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600',
    stock     : { '14':0, '14.5':2, '15':2, '15.5':0, '16':0, '16.5':0, '17':0, '17.5':0 }
  },
  {
    id        : 'ivory-wedding',
    cat       : 'party',
    name      : 'Ivory Wedding Shirt',
    fabric    : 'Cotton-Silk · Satin',
    price     : 2000,
    oldPrice  : null,
    onSale    : false,
    badge     : 'New',
    badgeClass: 'b-new',
    featured  : false,
    img       : 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
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
  img : 'https://i.ibb.co/abc123/black-formal-front.jpg',

  // ── EXTRA images — show as clickable thumbnails on product page only ──
  images : [
    'https://i.ibb.co/abc123/black-formal-front.jpg',   // thumbnail 1 — front
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
