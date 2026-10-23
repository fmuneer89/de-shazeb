import baseline from './catalog-base.mjs';
import {publicProduct} from './product-settings.mjs';
export async function onRequestGet({env}){
 try{
  let products;
  if(!env.INVENTORY_DB)products=baseline.map(p=>publicProduct(p));
  else {
   const {results:rows}=await env.INVENTORY_DB.prepare('SELECT p.id,p.name,p.colour,p.category,s.price_rupees,s.settings_json FROM inv_products p JOIN inv_product_settings s ON s.product_id=p.id WHERE p.active=1 ORDER BY p.rowid').all();
   const {results:variants}=await env.INVENTORY_DB.prepare('SELECT product_id,collar,quantity FROM inv_variants ORDER BY CAST(collar AS REAL)').all();
   products=rows.map(row=>{const old=baseline.find(p=>p.id===row.id)||{},settings=JSON.parse(row.settings_json),sizes=variants.filter(v=>v.product_id===row.id&&(!settings.sizes||settings.sizes.includes(v.collar))).map(v=>v.collar);return publicProduct({...old,id:row.id,name:row.name,colour:row.colour,category:row.category,sizes,stock_by_size:Object.fromEntries(variants.filter(v=>v.product_id===row.id).map(v=>[v.collar,v.quantity])),unavailable_sizes:variants.filter(v=>v.product_id===row.id&&(v.quantity===null||v.quantity<=0)).map(v=>v.collar)},row)}).filter(Boolean);
  }
  return new Response('window.DE_SHAHZAIB_PRODUCTS = '+JSON.stringify(products).replace(/</g,'\\u003c')+';\n',{headers:{'Content-Type':'application/javascript;charset=utf-8','Cache-Control':'no-store, max-age=0','Access-Control-Allow-Origin':'*','X-Content-Type-Options':'nosniff'}});
 }catch(error){console.error(JSON.stringify({event:'catalogue_read_failed',message:String(error.message).slice(0,150)}));return new Response('throw new Error("The catalogue is temporarily unavailable. Please refresh.");',{status:503,headers:{'Content-Type':'application/javascript','Cache-Control':'no-store'}})}
}
