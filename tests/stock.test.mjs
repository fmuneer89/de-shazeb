import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {onRequestGet} from '../catalog-response.mjs';
const variants=[{product_id:'19',collar:'15',quantity:2},{product_id:'19',collar:'17',quantity:0},{product_id:'19',collar:'16',quantity:null}];
const response=await onRequestGet({env:{INVENTORY_DB:{prepare(sql){return {async all(){return {results:sql.includes('FROM inv_variants')?variants:[{id:'19',name:'Pink shirt',colour:'Pink',category:'Plain',price_rupees:1999,settings_json:JSON.stringify({sizes:['15','16','17'],image:'assets/shirt.webp',cost:1200,notes:'PRIVATE'})}]}}}}}}});
const context={window:{}};vm.runInNewContext(await response.text(),context);const products=context.window.DE_SHAHZAIB_PRODUCTS,p=products[0];
assert.deepEqual(Array.from(p.sizes),['15','17','16']);assert.deepEqual(Array.from(p.unavailable_sizes),['17']);assert(!JSON.stringify(p).includes('PRIVATE'));assert(!('quantity' in p));
for(const file of ['index.html','shop.html']){
 const html=readFileSync(new URL('../'+file,import.meta.url),'utf8'),ctx={module:{exports:{}}};vm.runInNewContext(html.match(/<script id="storeCoreData">([\s\S]*?)<\/script>/)[1],ctx);const C=ctx.module.exports,catalog=C.validateCatalog(products);
 assert.throws(()=>C.add(catalog,[],'19','17'),/out of stock/);
 assert.equal(C.add(catalog,[],'19','15').length,1);
 assert.equal(C.add(catalog,[],'19','16').length,1,'Uncounted is not treated as zero');
 assert.equal(C.cleanCart(catalog,[{id:'19',size:'17',quantity:1}]).length,0,'Existing unavailable bag line removed');
 assert(html.includes("p.sizes.includes(s)&&!(p.unavailable_sizes||[]).includes(s)?'':'disabled'"));
}
console.log('PASS: zero-stock collars remain listed, unavailable sizes reach both storefronts, bag additions blocked, stale bag lines removed, uncounted stock distinguished, private data excluded.');
