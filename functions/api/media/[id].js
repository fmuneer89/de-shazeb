export async function onRequestGet({env,params}){
 if(!/^[a-f0-9]{64}$/.test(params.id||''))return new Response('Not found',{status:404});
 try{const row=await env.INVENTORY_DB.prepare('SELECT mime,data_base64 FROM inv_media WHERE id=?').bind(params.id).first();if(!row)return new Response('Not found',{status:404});const data=Uint8Array.from(atob(row.data_base64),c=>c.charCodeAt(0));return new Response(data,{headers:{'Content-Type':row.mime,'Cache-Control':'public,max-age=31536000,immutable','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'",'Access-Control-Allow-Origin':'*'}})}catch{return new Response('Image unavailable',{status:503,headers:{'Cache-Control':'no-store'}})}
}
