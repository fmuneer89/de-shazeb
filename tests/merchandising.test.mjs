import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {defaultFeatured,merchandisingFlags,validateSettings,publicProduct} from '../product-settings.mjs';
import baseline from '../catalog-base.mjs';
assert(defaultFeatured('20'));assert(!defaultFeatured('custom-shirt'));
assert.deepEqual(merchandisingFlags({featured:false,is_new:false,ribbon:'New'},'20'),{featured:false,is_new:false});
assert.equal(merchandisingFlags({ribbon:'New'},'19').is_new,true);
const draft={...baseline[0],cost:null,published:true,sales_enabled:true,purchase_enabled:true,weight:null,volume:null,delivery_days:null,featured:true,is_new:true};
const row=validateSettings(draft),product=publicProduct(baseline[0],{...row,settings_json:JSON.stringify(row.settings)});
assert.equal(product.featured,true);assert.equal(product.is_new,true);
const cleared=validateSettings({...draft,featured:false,is_new:false});assert.equal(publicProduct(baseline[0],{...cleared,settings_json:JSON.stringify(cleared.settings)}).featured,false);
for(const key of ['featured','is_new'])assert.throws(()=>validateSettings({...draft,[key]:'yes'}));
const code=readFileSync(new URL('../merchandising.js',import.meta.url),'utf8');
const elements=Object.fromEntries(['featuredCollection','featuredGrid','featuredPrevious','featuredNext','featuredStatus'].map(id=>[id,{hidden:true,innerHTML:'',textContent:''}]));
const products=Array.from({length:6},(_,i)=>({...product,id:String(i),name:'Shirt '+i,featured:true}));
const ctx={window:{DE_SHAHZAIB_PRODUCTS:products,addEventListener(){}},document:{getElementById:id=>elements[id]},matchMedia:()=>({matches:false})};vm.runInNewContext(code,ctx);
const helper=ctx.window.DSMerchandising;
assert.match(helper.badgeMarkup({...product,price:1500,regular_price:2000,discount_percent:25}),/ribbon-sale/);
assert(!helper.badgeMarkup({...product,price:1500,regular_price:2000,discount_percent:25}).includes('ribbon-new'));
assert.match(helper.badgeMarkup({...product,price:2000,regular_price:2000}),/ribbon-new/);
assert.equal(helper.badgeMarkup({...product,is_new:false,price:2000,regular_price:2000}),'');
assert.equal(helper.featuredProducts([{...product,featured:false},product,{...product,published:false}]).length,1);
assert.equal((elements.featuredGrid.innerHTML.match(/<article /g)||[]).length,4,'Four cards in the desktop view');assert.equal(elements.featuredStatus.textContent,'1–4 of 6');
elements.featuredNext.onclick();assert.equal((elements.featuredGrid.innerHTML.match(/<article /g)||[]).length,2);assert.equal(elements.featuredStatus.textContent,'5–6 of 6');elements.featuredNext.onclick();assert.equal(elements.featuredStatus.textContent,'1–4 of 6');elements.featuredPrevious.onclick();assert.equal(elements.featuredStatus.textContent,'5–6 of 6');
for(const file of ['index.html','shop.html']){const html=readFileSync(new URL('../'+file,import.meta.url),'utf8'),core=html.match(/<script id="storeCoreData">([\s\S]*?)<\/script>/)[1],ctx={module:{exports:{}}};vm.runInNewContext(core,ctx);const C=ctx.module.exports;
 for(const [subtotal,free] of [[3999,false],[4000,false],[4001,true]]){const p=C.validateCatalog([{...baseline[0],price:subtotal,featured:true,is_new:true}]);assert.equal(p[0].is_new,true);assert.equal(C.totals(p,[{id:p[0].id,size:p[0].sizes[0],quantity:1}]).freeDelivery,free);}
}
console.log('PASS: saved merchandising flags, defaults and overrides, strict validation, sale/new priority, featured filtering, four-card paging and strict delivery threshold.');
