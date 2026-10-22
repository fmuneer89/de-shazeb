import baseline from '../catalog-base.mjs';
import {publicProduct} from '../product-settings.mjs';
export async function onRequestGet({env}){
 try{
  const rows=env.INVENTORY_DB?(await env.INVENTORY_DB.prepare('SELECT product_id,price_rupees,settings_json FROM inv_product_settings').all()).results:[];
  const products=baseline.map(p=>publicProduct(p,rows.find(r=>r.product_id===p.id))).filter(Boolean);
  return new Response('window.DE_SHAHZAIB_PRODUCTS = '+JSON.stringify(products).replace(/</g,'\\u003c')+';\n',{headers:{'Content-Type':'application/javascript;charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 }catch(error){console.error(JSON.stringify({event:'catalogue_read_failed',message:String(error.message).slice(0,150)}));return new Response('throw new Error("The catalogue is temporarily unavailable. Please refresh.");',{status:503,headers:{'Content-Type':'application/javascript','Cache-Control':'no-store'}})}
}
