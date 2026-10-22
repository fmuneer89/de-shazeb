import {validateSettings,withProductIdentifiers} from '../../../product-settings.mjs';
import baseline from '../../../catalog-base.mjs';
const enc=new TextEncoder();
const json=(data,status=200,extra={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra}});
const fail=(message,status=400)=>Object.assign(new Error(message),{status});
const integer=(x,min=0,max=1000000)=>Number.isInteger(x)&&x>=min&&x<=max;
async function body(request,maxBytes=65536){
  if(!request.headers.get('content-type')?.includes('application/json'))throw fail('Use JSON requests.',415);
  const reader=request.body?.getReader();if(!reader)throw fail('Request body required.');let size=0,parts=[];
  for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>maxBytes){await reader.cancel();throw fail('Request too large.',413);}parts.push(value);}
  const bytes=new Uint8Array(size);let at=0;for(const p of parts){bytes.set(p,at);at+=p.length;}try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw fail('Invalid JSON.');}
}
async function key(secret){return crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
function hex(buffer){return [...new Uint8Array(buffer)].map(x=>x.toString(16).padStart(2,'0')).join('');}
function unhex(s){if(!/^[0-9a-f]{64}$/.test(s))return new Uint8Array();return Uint8Array.from(s.match(/../g),x=>parseInt(x,16));}
async function signature(secret,value){return hex(await crypto.subtle.sign('HMAC',await key(secret),enc.encode(value)));}
async function validSession(request,secret){
  const value=(request.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('ds_inventory='))?.slice(13);
  if(!value||value.length>250)return false;const [expires,nonce,sig]=value.split('.');if(!/^\d+$/.test(expires)||!/^[-a-f0-9]{36}$/.test(nonce||'')||Number(expires)<Date.now()||Number(expires)>Date.now()+43200000)return false;
  return crypto.subtle.verify('HMAC',await key(secret),unhex(sig||''),enc.encode(expires+'.'+nonce));
}
function cookie(v,age){return `ds_inventory=${v}; Path=/api/inventory; Max-Age=${age}; Secure; HttpOnly; SameSite=Strict`;}
export async function onRequest({request,env,params}){
  try{
    const url=new URL(request.url),path=Array.isArray(params.path)?params.path.join('/'):String(params.path||'');
    if(!env.INVENTORY_DB)return json({error:'Inventory database is not configured.'},503);
    if(!env.INVENTORY_ADMIN_PASSWORD||env.INVENTORY_ADMIN_PASSWORD.length<16)return json({error:'Admin setup required: add INVENTORY_ADMIN_PASSWORD as a Cloudflare encrypted secret (at least 16 characters), then redeploy.',setupRequired:true},503);
    if(request.method==='POST'&&request.headers.get('origin')!==url.origin)throw fail('This request must come from your inventory dashboard.',403);
    if(!['GET','POST'].includes(request.method))return json({error:'Method not allowed.'},405,{'Allow':'GET, POST'});
    const db=env.INVENTORY_DB,secret=env.INVENTORY_ADMIN_PASSWORD;
    if(path==='login'&&request.method==='POST'){
      const input=await body(request);if(typeof input.password!=='string'||input.password.length>256)throw fail('Invalid login.',401);
      const ip=request.headers.get('CF-Connecting-IP')||'unknown',bucket=Math.floor(Date.now()/900000);
      const limitKey=bucket+':'+await signature(secret,ip);
      const limit=await db.prepare('INSERT INTO inv_login_limits(key,attempts) VALUES (?,1) ON CONFLICT(key) DO UPDATE SET attempts=attempts+1 RETURNING attempts').bind(limitKey).first();
      if(limit.attempts>10)throw fail('Too many attempts. Try again in 15 minutes.',429);
      const expected=await crypto.subtle.digest('SHA-256',enc.encode(secret)),provided=await crypto.subtle.digest('SHA-256',enc.encode(input.password));
      if(!crypto.subtle.timingSafeEqual(expected,provided))throw fail('Incorrect password.',401);
      const value=(Date.now()+43200000)+'.'+crypto.randomUUID();const token=value+'.'+await signature(secret,value);
      await db.prepare('DELETE FROM inv_login_limits WHERE CAST(substr(key,1,instr(key,\':\')-1) AS INTEGER) < ?').bind(bucket-4).run();
      return json({ok:true},200,{'Set-Cookie':cookie(token,43200)});
    }
    if(!await validSession(request,secret))throw fail('Please log in.',401);
    if(path==='session'&&request.method==='GET')return json({ok:true});
    if(path==='logout'&&request.method==='POST')return json({ok:true},200,{'Set-Cookie':cookie('',0)});
    if(path==='catalog'&&request.method==='GET'){
      const {results}=await db.prepare(`SELECT v.*,COALESCE(json_extract(s.settings_json,'$.name'),p.name) AS name,COALESCE(json_extract(s.settings_json,'$.colour'),p.colour) AS colour,COALESCE(json_extract(s.settings_json,'$.category'),p.category) AS category,p.active FROM inv_variants v JOIN inv_products p ON p.id=v.product_id LEFT JOIN inv_product_settings s ON s.product_id=p.id ORDER BY name,CAST(v.collar AS REAL)`).all();return json({variants:results});
    }
    if(path==='products'&&request.method==='GET'){
      const {results}=await db.prepare('SELECT p.*,s.version AS settings_version,s.cost_paisa,s.price_rupees,s.settings_json,s.updated_at FROM inv_products p LEFT JOIN inv_product_settings s ON s.product_id=p.id ORDER BY p.name').all();
      return json({products:results.map(p=>({...p,settings:p.settings_json?JSON.parse(p.settings_json):{...(baseline.find(b=>b.id===p.id)||{}),name:p.name,colour:p.colour,category:p.category},settings_json:undefined}))});
    }
    if(path==='photo-upload'&&request.method==='POST'){
      const d=await body(request,700000),match=typeof d.data==='string'&&d.data.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/);if(!match)throw fail('Choose a JPEG, PNG or WebP photo.');
      let bytes;try{bytes=Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0))}catch{throw fail('Invalid image.');}
      if(bytes.length<12||bytes.length>500000)throw fail('Optimized photos must be below 500 KB.');
      const mime=match[1],head=String.fromCharCode(...bytes.slice(0,12));if(!(mime==='image/jpeg'&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255||mime==='image/png'&&bytes[0]===137&&head.slice(1,4)==='PNG'&&bytes[4]===13&&bytes[5]===10||mime==='image/webp'&&head.startsWith('RIFF')&&head.slice(8,12)==='WEBP'))throw fail('Photo format does not match its contents.');
      const id=hex(await crypto.subtle.digest('SHA-256',bytes));await db.prepare('INSERT OR IGNORE INTO inv_media(id,mime,data_base64) VALUES (?,?,?)').bind(id,mime,match[2]).run();return json({url:'https://de-shazeb.pages.dev/api/media/'+id});
    }
    if(path==='product-create'&&request.method==='POST'){
      let d=await body(request);
      let value;try{d=withProductIdentifiers(d);value=validateSettings(d)}catch(e){throw fail(e.message)}if(!value.settings.sizes)throw fail('Choose the collar sizes to offer.');
      const encoded=JSON.stringify(value.settings),old=await db.prepare('SELECT * FROM inv_product_settings WHERE product_id=?').bind(d.product_id).first();if(old){if(old.price_rupees===value.price_rupees&&old.cost_paisa===value.cost_paisa&&old.settings_json===encoded)return json({ok:true,replayed:true,product_id:d.product_id});throw fail('This product reference already exists. Refresh and try again.',409);}
      const p=value.settings;await db.batch([
        db.prepare('INSERT INTO inv_products(id,name,colour,category) VALUES (?,?,?,?)').bind(d.product_id,p.name,p.colour,p.category),
        db.prepare('INSERT INTO inv_product_settings(product_id,cost_paisa,price_rupees,settings_json) VALUES (?,?,?,?)').bind(d.product_id,value.cost_paisa,value.price_rupees,encoded),
        ...p.sizes.map(size=>db.prepare('INSERT INTO inv_variants(id,product_id,collar) VALUES (?,?,?)').bind(d.product_id+':'+size,d.product_id,size))
      ]);return json({ok:true,product_id:d.product_id});
    }
    if(path==='product-save'&&request.method==='POST'){
      const d=await body(request);if(typeof d.product_id!=='string'||!integer(d.version))throw fail('Invalid product reference.');
      let value;try{value=validateSettings(d)}catch(e){throw fail(e.message)}
      const p=await db.prepare('SELECT * FROM inv_products WHERE id=?').bind(d.product_id).first();if(!p)throw fail('Product not found.',404);
      // A single optimistic update plus an audit trigger avoids partial metadata and price writes.
      const r=await db.prepare("UPDATE inv_product_settings SET cost_paisa=?,price_rupees=?,settings_json=?,version=version+1,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE product_id=? AND version=?").bind(value.cost_paisa,value.price_rupees,JSON.stringify(value.settings),d.product_id,d.version).run();
      if(!r.meta.changes)throw fail('This product changed in another session. Close this form, refresh and open it again.',409);
      return json({ok:true});
    }
    if(path==='movements'&&request.method==='GET'){
      const variant=url.searchParams.get('variant')||'',raw=url.searchParams.get('before')||'',before=raw||'9999';
      const {results}=await db.prepare('SELECT m.*,v.collar,p.name FROM inv_movements m JOIN inv_variants v ON v.id=m.variant_id JOIN inv_products p ON p.id=v.product_id WHERE (?=\'\' OR m.variant_id=?) AND m.rowid < ? ORDER BY m.rowid DESC LIMIT 501').bind(variant,variant,Number(url.searchParams.get('cursor'))||Number.MAX_SAFE_INTEGER).all();
      return json({movements:results.slice(0,500),truncated:results.length>500});
    }
    if(path==='adjust'&&request.method==='POST'){
      const d=await body(request);if(!/^[a-f0-9-]{36}$/.test(d.id||'')||typeof d.variant!=='string'||!integer(d.version)||!integer(d.amount)||!['opening','receive','issue','correction'].includes(d.kind)||typeof d.note!=='string'||d.note.trim().length<3||d.note.length>300)throw fail('Provide a valid quantity and a reason or reference (3–300 characters).');
      if(['receive','issue'].includes(d.kind)&&d.amount===0)throw fail('Quantity must be at least 1.');
      const old=await db.prepare('SELECT * FROM inv_movements WHERE id=?').bind(d.id).first();if(old){if(old.variant_id!==d.variant||old.kind!==d.kind||old.amount!==d.amount||old.note!==d.note.trim())throw fail('Duplicate reference conflicts with an earlier change.',409);return json({ok:true,replayed:true});}
      const v=await db.prepare('SELECT * FROM inv_variants WHERE id=?').bind(d.variant).first();if(!v)throw fail('Size not found.',404);if(v.version!==d.version)throw fail('Stock changed in another session. Refresh and try again.',409);
      if(d.kind==='opening'&&v.quantity!==null)throw fail('Opening stock is already recorded. Use Correction instead.');
      if(d.kind!=='opening'&&v.quantity===null)throw fail('Record opening stock first.');
      const after=['opening','correction'].includes(d.kind)?d.amount:d.kind==='receive'?v.quantity+d.amount:v.quantity-d.amount;if(!integer(after))throw fail('Insufficient stock or quantity exceeds limit.');
      const result=await db.prepare('INSERT INTO inv_movements(id,variant_id,kind,amount,before_qty,after_qty,note) SELECT ?,id,?,?,quantity,?,? FROM inv_variants WHERE id=? AND version=?').bind(d.id,d.kind,d.amount,after,d.note.trim(),d.variant,d.version).run();
      if(!result.meta.changes)throw fail('Stock changed in another session. Refresh and try again.',409);return json({ok:true,quantity:after});
    }
    if(path==='threshold'&&request.method==='POST'){
      const d=await body(request);if(typeof d.variant!=='string'||!integer(d.value)||!integer(d.version))throw fail('Invalid low-stock threshold.');
      const r=await db.prepare('UPDATE inv_variants SET low_stock=?,version=version+1 WHERE id=? AND version=?').bind(d.value,d.variant,d.version).run();if(!r.meta.changes)throw fail('Stock changed. Refresh and try again.',409);return json({ok:true});
    }
    if(path==='sync'&&request.method==='POST'){
      const d=await body(request);if(!Array.isArray(d.products)||!d.products.length||d.products.length>200)throw fail('Provide 1–200 products.');let queries=[];
      for(const p of d.products){if(typeof p.id!=='string'||!p.id||p.id.length>100||typeof p.name!=='string'||!p.name.trim()||p.name.length>150||!Array.isArray(p.sizes)||!p.sizes.length||p.sizes.length>20)throw fail('Invalid product.');
        queries.push(db.prepare('INSERT INTO inv_products(id,name,colour,category) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,colour=excluded.colour,category=excluded.category').bind(p.id,p.name.trim(),String(p.colour||'').slice(0,80),String(p.category||'Plain').slice(0,50)));
        const b=baseline.find(x=>x.id===p.id);if(b)queries.push(db.prepare('INSERT OR IGNORE INTO inv_product_settings(product_id,price_rupees,settings_json) VALUES (?,?,?)').bind(p.id,b.price,JSON.stringify({...b,published:true,sales_enabled:true,purchase_enabled:true})));
        for(const s of p.sizes){if(!/^\d{2}(\.5)?$/.test(String(s))||Number(s)<12||Number(s)>24)throw fail('Collar sizes must be 12–24 inches in half-inch increments.');queries.push(db.prepare('INSERT OR IGNORE INTO inv_variants(id,product_id,collar) VALUES (?,?,?)').bind(p.id+':'+s,p.id,String(s)));}
      }
      if(queries.length>900)throw fail('Too many sizes. Sync a smaller catalogue.');await db.batch(queries);return json({ok:true});
    }
    return json({error:'Not found.'},404);
  }catch(error){if(error.status)return json({error:error.message},error.status);console.error(JSON.stringify({event:'inventory_error',message:String(error.message).slice(0,150)}));return json({error:'Inventory service could not complete the request. Refresh and try again.'},500);}
}
