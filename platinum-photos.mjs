// Background-only derivatives; originals remain unchanged in the dashboard. New uploads pass through.
const photos={
  "assets/blue-micro-dobby-cotton-shirt.webp": "assets/platinum-blue-micro-dobby-cotton-shirt.webp",
  "assets/blue-white-striped-shirt.webp": "assets/platinum-blue-white-striped-shirt.webp",
  "https://de-shazeb.pages.dev/api/media/311971ed9efacb58511421feb9963093468efa0472ccf1a722015e7403d4c797": "assets/platinum-executive-detail.webp",
  "https://de-shazeb.pages.dev/api/media/a21ce3a6ba8f68e95c8c258a9ccf9bbb3240e3a788e6411533e5b2f156750534": "assets/platinum-executive-front.webp",
  "assets/light-blue-dobby-shirt.webp": "assets/platinum-light-blue-dobby-shirt.webp",
  "assets/light-blue-textured-shirt.webp": "assets/platinum-light-blue-textured-shirt.webp",
  "assets/micro-dot-dobby-shirt.webp": "assets/platinum-micro-dot-dobby-shirt.webp",
  "assets/pink-classic-formal-cotton-shirt.webp": "assets/platinum-pink-classic-formal-cotton-shirt.webp",
  "https://de-shazeb.pages.dev/api/media/4f102401598d0b7eba2c94c570d7349d09b632c53bfa2ba56dca6a9a36c266e2": "assets/platinum-pink-detail2.webp",
  "https://de-shazeb.pages.dev/api/media/ec2c1b44178a868a347b5f901fcaadb16141ed7ef382fc4880530ee127d7815a": "assets/platinum-slate-detail1.webp",
  "https://de-shazeb.pages.dev/api/media/20d36cdb0747a52c421f4955214a16a629b4878260d93eaa34abf3f6ee0b785b": "assets/platinum-slate-detail2.webp",
  "https://de-shazeb.pages.dev/api/media/1d107d8e35c8d8413dfb0afa0c1689004d521454aeeb38997f31c91923a71779": "assets/platinum-slate-front.webp"
};
export function platinumPhotos(product){if(!product)return product;const photo=url=>photos[url]||url;return {...product,image:photo(product.image),images:product.images?.map(photo)};}
