import {fail,json,readBody,createOrder,updateOrder,getOrder} from './erp-core.mjs';
import {invoiceHTML} from './invoice-template.mjs';
import {sandboxReady,sandboxSession} from './safepay-sandbox.mjs';
export async function handleERP({request,env,path,db}){const url=new URL(request.url);
 if(path==='orders'&&request.method==='GET'){const {results:orders}=await db.prepare('SELECT id,number,customer_json,status,subtotal_paisa,shipping_paisa,version,expires_at,created_at FROM erp_orders ORDER BY created_at DESC LIMIT 201').all();const {results:stats}=await db.prepare("SELECT status,COUNT(*) AS count,SUM(subtotal_paisa+COALESCE(shipping_paisa,0)) AS total_paisa FROM erp_orders GROUP BY status").all();return json({orders:orders.slice(0,200).map(o=>({...o,customer:JSON.parse(o.customer_json),customer_json:undefined})),truncated:orders.length>200,stats,sandboxReady:sandboxReady(env)});}
 if(path==='catalog'&&request.method==='GET'){const {results}=await db.prepare("SELECT v.*,p.name,json_extract(s.settings_json,'$.name') AS display_name,s.price_rupees,COALESCE(r.quantity,0) AS reserved,MAX(0,COALESCE(v.quantity,0)-COALESCE(r.quantity,0)) AS available FROM inv_variants v JOIN inv_products p ON p.id=v.product_id JOIN inv_product_settings s ON s.product_id=p.id LEFT JOIN erp_reserved r ON r.variant_id=v.id WHERE p.active=1 ORDER BY p.name,CAST(v.collar AS REAL)").all();return json({variants:results});}
 if(path==='order'&&request.method==='GET'){const o=await getOrder(db,url.searchParams.get('id'));const {results:events}=await db.prepare('SELECT action,detail,created_at FROM erp_events WHERE order_id=? ORDER BY id').bind(o.id).all();return json({order:o,events});}
 if(path==='invoice'&&request.method==='GET'){const o=await getOrder(db,url.searchParams.get('id'));return new Response(invoiceHTML(o),{headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; script-src 'self'; base-uri 'none'; frame-ancestors 'none'"}});}
 if(path==='create'&&request.method==='POST')return json({order:await createOrder(db,await readBody(request),'dashboard')});
 if(path==='update'&&request.method==='POST')return json({order:await updateOrder(db,await readBody(request))});
 if(path==='expire'&&request.method==='POST'){const r=await db.prepare("UPDATE erp_orders SET status='expired',version=version+1 WHERE status='pending' AND expires_at<=unixepoch()").run();return json({ok:true,count:r.meta.changes});}
 if(path==='sandbox'&&request.method==='POST')return json(await sandboxSession(env,url.origin));
 if(path==='sandbox-results'&&request.method==='GET'){const {results}=await db.prepare('SELECT tracker,amount_paisa,state,created_at FROM erp_sandbox_payments ORDER BY created_at DESC LIMIT 20').all();return json({payments:results});}
 throw fail('Not found.',404);
}
