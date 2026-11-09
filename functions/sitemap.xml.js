import {onRequestGet as catalogue} from '../catalog-response.mjs';
const base='https://www.de-shahzaib.com';
const xml=s=>String(s).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
export async function onRequestGet(context){
 const response=await catalogue(context);
 if(!response.ok)return new Response('Catalogue temporarily unavailable',{status:503,headers:{'Cache-Control':'no-store','Retry-After':'300'}});
 const text=await response.text();
 const match=text.match(/^window\.DE_SHAHZAIB_PRODUCTS = ([\s\S]*);\s*$/);
 if(!match)return new Response('Catalogue format unavailable',{status:503,headers:{'Cache-Control':'no-store'}});
 const products=JSON.parse(match[1]);
 const urls=['/','/shop','/story','/terms',...products.map(p=>'/product?id='+encodeURIComponent(p.id))];
 return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[...new Set(urls)].map(path=>'<url><loc>'+xml(base+path)+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=300','X-Content-Type-Options':'nosniff'}});
}
