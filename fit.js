// DE-SHAHZAIB — photo frame helper. Every frame is the same fixed size; each photo is fitted inside
// without cropping, and the empty space is filled with the photo's own background colour automatically.
(()=>{const cv=document.createElement('canvas');cv.width=cv.height=1;
function edge(img){try{const w=img.naturalWidth,h=img.naturalHeight;if(!w||!h)return null;const x=cv.getContext('2d',{willReadFrequently:true});let r=0,g=0,b=0,n=0;
for(const[sx,sy]of[[0,0],[w-8,0],[0,h-8],[w-8,h-8]]){x.clearRect(0,0,1,1);x.drawImage(img,sx,sy,8,8,0,0,1,1);const d=x.getImageData(0,0,1,1).data;r+=d[0];g+=d[1];b+=d[2];n++}
return'rgb('+(r/n|0)+','+(g/n|0)+','+(b/n|0)+')'}catch(e){return null}}
window.dsFit=(img,...t)=>{if(!img)return;const run=()=>{const c=edge(img);if(c)t.forEach(e=>e&&(e.style.background=c))};
img.complete&&img.naturalWidth?run():img.addEventListener('load',run,{once:true})};
const g=document.getElementById('productGrid');
if(g){const go=()=>g.querySelectorAll('.product-photo').forEach(f=>{const i=f.querySelector('img');if(i&&!i.dataset.fit){i.dataset.fit=1;dsFit(i,f,f.querySelector('.product-image-button'))}});
new MutationObserver(go).observe(g,{childList:true});go()}})();
