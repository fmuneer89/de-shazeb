// DE-SHAHZAIB — photo frame helper. Every frame is the same fixed size; each photo is fitted inside
// without cropping, and the empty space is filled with the photo's own background colour automatically.
(()=>{const cv=document.createElement('canvas');cv.width=cv.height=1;
function edge(img){try{const w=img.naturalWidth,h=img.naturalHeight;if(!w||!h)return null;const x=cv.getContext('2d',{willReadFrequently:true});let r=0,g=0,b=0,n=0;
for(const[sx,sy]of[[0,0],[w-8,0],[0,h-8],[w-8,h-8]]){x.clearRect(0,0,1,1);x.drawImage(img,sx,sy,8,8,0,0,1,1);const d=x.getImageData(0,0,1,1).data;r+=d[0];g+=d[1];b+=d[2];n++}
return'rgb('+(r/n|0)+','+(g/n|0)+','+(b/n|0)+')'}catch(e){return null}}
window.dsFit=(img,...t)=>{if(!img)return;const run=()=>{const c=edge(img);if(c)t.forEach(e=>e&&(e.style.background=c))};
img.complete&&img.naturalWidth?run():img.addEventListener('load',run,{once:true})};
// Preload the second dashboard photo, then swap instantly on mouse hover.
// Keep the primary photo if the preview is missing or cannot be loaded.
function preview(frame,img){
 const button=frame.querySelector('.product-image-button');
 const catalog=window.DE_SHAHZAIB_PRODUCTS||[];
 const product=catalog.find(p=>String(p.id)===button?.dataset.product);
 const primary=img.getAttribute('src');
 const second=product?.images?.find(url=>url&&url!==primary);
 if(!second)return;
 const preload=new Image();let ready=false,hovered=false,focused=false;
 const show=()=>{const src=ready&&(hovered||focused)?second:primary;if(img.getAttribute('src')!==src){img.src=src;dsFit(img,frame,button)}};
 preload.onload=()=>{ready=true;show()};preload.src=second;
 frame.addEventListener('mouseenter',()=>{hovered=matchMedia('(hover: hover) and (pointer: fine)').matches;show()});
 frame.addEventListener('mouseleave',()=>{hovered=false;show()});
 button.addEventListener('focus',()=>{focused=true;show()});
 button.addEventListener('blur',()=>{focused=false;show()});
}
const g=document.getElementById('productGrid');
if(g){const go=()=>g.querySelectorAll('.product-photo').forEach(f=>{const i=f.querySelector('img');if(i&&!i.dataset.fit){i.dataset.fit=1;dsFit(i,f,f.querySelector('.product-image-button'));preview(f,i)}});
new MutationObserver(go).observe(g,{childList:true});go()}})();
