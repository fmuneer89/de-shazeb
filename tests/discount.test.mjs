import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {discountedPrice,publicProduct} from '../product-settings.mjs';
import baseline from '../catalog-base.mjs';
import {onRequestGet} from '../functions/products.js.js';
for(const [regular,pct,want] of [[2000,10,1800],[1999,10,1799],[2000,12.5,1750],[1999,0,1999],[1000,99,10],[1,99,1]])assert.equal(discountedPrice(regular,pct),want);
const base=baseline[0],row={product_id:base.id,price_rupees:2000,settings_json:JSON.stringify({...base,discount_percent:10,notes:'PRIVATE',cost:1234})};
const response=await onRequestGet({env:{INVENTORY_DB:{prepare(sql){return {async all(){return {results:sql.includes('FROM inv_variants')?base.sizes.map(collar=>({product_id:base.id,collar})):[{...row,id:base.id,name:base.name,colour:base.colour,category:base.category}]}}}}}}});
assert.equal(response.status,200);const publicJS=await response.text();assert(!publicJS.includes('PRIVATE'));assert(!publicJS.includes('"cost"'));
const browser={window:{}};vm.runInNewContext(publicJS,browser);const products=browser.window.DE_SHAHZAIB_PRODUCTS;assert.equal(products[0].price,1800);assert.equal(products[0].regular_price,2000);const ordinary=publicProduct(baseline[1]);products.push(ordinary);assert.equal(ordinary.price,baseline[1].price);
for(const file of ['index.html','shop.html']){
 const html=readFileSync(new URL('../'+file,import.meta.url),'utf8'),core=html.match(/<script id="storeCoreData">([\s\S]*?)<\/script>/)[1],context={module:{exports:{}}};vm.runInNewContext(core,context);const C=context.module.exports,catalog=C.validateCatalog(products),p=catalog[0];
 assert.equal(p.price,1800);assert.equal(p.regular_price,2000);assert.equal(p.discount_percent,10);assert.equal(C.validateCatalog(catalog)[0].price,1800,'Validation never discounts twice');
 const cart=C.add(catalog,[],p.id,p.sizes[0],2);assert.equal(C.totals(catalog,cart).subtotal,3600,'Bag uses sale price');assert.match(C.priceMarkup(p),/<del/);assert.match(C.priceMarkup(p),/10% OFF/);assert(!C.priceMarkup(catalog[1]).includes('<del'));
 assert(html.includes("C.money(p.price*l.quantity);"),'WhatsApp request uses effective line total');
}
const page=readFileSync(new URL('../product.html',import.meta.url),'utf8'),helper=page.match(/const priceMarkup=p=>[^\n]+/)[0],ctx={money:n=>'PKR '+n};vm.runInNewContext(helper+';globalThis.result=priceMarkup;',ctx);assert.match(ctx.result(products[0]),/2000<\/del>/);assert.match(ctx.result(products[0]),/1800<\/span>/);assert(!ctx.result(products[1]).includes('OFF'));
assert.equal(publicProduct(base,{...row,settings_json:JSON.stringify({...base,discount_percent:0})}).price,2000);
console.log('PASS: whole-PKR rounding, fractional discounts, public catalogue, both storefronts, bag totals, WhatsApp totals and sale display.');
