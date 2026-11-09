// Public storefront metadata. No tracking or private dashboard data.
(()=>{
 const base='https://www.de-shahzaib.com',path=location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
 const meta=(key,value,property=false)=>{let n=document.head.querySelector('meta['+(property?'property':'name')+'="'+key+'"]');if(!n){n=document.createElement('meta');n.setAttribute(property?'property':'name',key);document.head.appendChild(n)}n.content=value};
 const ld=(id,data)=>{let n=document.getElementById(id);if(!n){n=document.createElement('script');n.id=id;n.type='application/ld+json';document.head.appendChild(n)}n.textContent=JSON.stringify(data)};
 let url=base+(path==='/'?'/':path),image;
 if(path==='/product'){
  const id=new URLSearchParams(location.search).get('id'),p=(window.DE_SHAHZAIB_PRODUCTS||[]).find(p=>String(p.id)===id);
  if(!p){meta('robots','noindex, follow');return}
  url=base+'/product?id='+encodeURIComponent(p.id);image=new URL(p.image,base+'/').href;
  document.title=p.name+' | De-Shahzaib';meta('description',p.description||p.name);
  const sizes=p.sizes||[],unavailable=p.unavailable_sizes||[];
  const available=sizes.some(s=>!unavailable.includes(s)&&(!p.stock_by_size||Number(p.stock_by_size[s])>0));
  const product={'@context':'https://schema.org','@type':'Product',name:p.name,description:p.description,image:(p.images?.length?p.images:[p.image]).map(x=>new URL(x,base+'/').href),brand:{'@type':'Brand',name:'De-Shahzaib'},color:p.colour,category:p.category,url};
  if(p.sku)product.sku=p.sku;
  if(Number.isFinite(Number(p.price))&&Number(p.price)>0)product.offers={'@type':'Offer',url,price:String(p.price),priceCurrency:'PKR',availability:'https://schema.org/'+(available?'InStock':'OutOfStock'),itemCondition:'https://schema.org/NewCondition',seller:{'@type':'Organization',name:'De-Shahzaib'}};
  ld('product-seo',product);
  ld('breadcrumb-seo',{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:base+'/'},{'@type':'ListItem',position:2,name:'Shop',item:base+'/shop'},{'@type':'ListItem',position:3,name:p.name,item:url}]});
 }
 let canonical=document.head.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical)}canonical.href=url;
 meta('og:type',path==='/product'?'product':'website',true);meta('og:site_name','De-Shahzaib',true);meta('og:title',document.title,true);meta('og:description',document.querySelector('meta[name="description"]')?.content||'',true);meta('og:url',url,true);meta('twitter:card',image?'summary_large_image':'summary');if(image)meta('og:image',image,true);
 if(path==='/')ld('brand-seo',{'@context':'https://schema.org','@type':'Organization',name:'De-Shahzaib',url:base+'/',logo:base+'/assets/logo-gold.svg',email:'hello@de-shahzaib.com',telephone:'+923120251679',sameAs:['https://www.instagram.com/de.shahzaib','https://www.facebook.com/profile.php?id=61592245136692']});
})();
