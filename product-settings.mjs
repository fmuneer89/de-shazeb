// Shared validation and public/private boundary. Costs and internal notes never enter the public catalogue.
export const cents=value=>{if(value===null||value==='')return null;if(typeof value!=='number'||!Number.isFinite(value)||value<0||value>10000000||Math.abs(value*100-Math.round(value*100))>0.000001)throw Error('Cost must be a positive amount with at most two decimal places, or blank.');return Math.round(value*100)};
const str=(v,max,label)=>{if(typeof v!=='string'||v.length>max)throw Error(label+' is too long or invalid.');return v.trim()};
const photo=v=>/^assets\/[A-Za-z0-9_.-]+\.(webp|png|jpe?g)$/i.test(v)||/^https:\/\/[^\s<>"']+$/i.test(v);
export function validateSettings(d){
 if(!d||typeof d!=='object')throw Error('Product settings required.');
 const name=str(d.name,100,'Name');if(!name)throw Error('Enter a product name.');
 if(!Number.isSafeInteger(d.price)||d.price<1||d.price>10000000)throw Error('Selling price must be 1–10,000,000 whole rupees.');
 if(!['Plain','Stripes','Dobby'].includes(d.category))throw Error('Choose a shop category.');
 const settings={name,category:d.category,colour:str(d.colour,50,'Colour'),description:str(d.description,800,'Description')};
 for(const k of ['published','sales_enabled','purchase_enabled']){if(typeof d[k]!=='boolean')throw Error('Invalid product status.');settings[k]=d[k]}
 for(const k of ['reference','barcode','tags','pattern','sleeve','collar_style','cuffs','pocket','ribbon'])settings[k]=str(d[k]??'',150,k);
 settings.notes=str(d.notes??'',2000,'Internal notes');
 for(const k of ['weight','volume','delivery_days']){const v=d[k];if(v!==null&&(typeof v!=='number'||!Number.isFinite(v)||v<0||v>1000000||(k==='delivery_days'&&!Number.isInteger(v))))throw Error('Enter valid nonnegative shipping details.');settings[k]=v;}
 if(!Array.isArray(d.images)||!d.images.length||d.images.length>10||d.images.some(x=>typeof x!=='string'||x.length>2048||!photo(x)))throw Error('Add 1–10 image paths or HTTPS URLs.');
 settings.images=[...new Set(d.images)];settings.image=settings.images[0];
 return {cost_paisa:cents(d.cost),price_rupees:d.price,settings};
}
export function publicProduct(base,row){
 const s=row?JSON.parse(row.settings_json):base;
 if(s.published===false||s.sales_enabled===false)return null;
 const p={id:base.id,name:s.name??base.name,price:row?.price_rupees??base.price,category:s.category??base.category,colour:s.colour??base.colour,description:s.description??base.description,sizes:base.sizes,image:s.image??base.image,images:s.images??base.images};
 // Explicit allow-list: all other settings remain private, including cost, reference and notes.
 p.details={};for(const k of ['pattern','sleeve','collar_style','cuffs','pocket','weight','delivery_days','ribbon'])if(s[k]!==undefined&&s[k]!==null&&s[k]!=='')p.details[k]=s[k];
 return p;
}
