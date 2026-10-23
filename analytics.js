/* Customer-page analytics. No form values, order references or cart fragments. */
(() => {
  const id = 'G-HRBENWFBSE';
  if (window.__dsAnalytics || location.pathname.startsWith('/admin/')) return;
  window.__dsAnalytics = true;
  const cleanURL = value => {
    try {
      const u = new URL(value); const q = new URLSearchParams();
      if (/\/product(?:\.html)?$/.test(u.pathname)) {
        const product = u.searchParams.get('id');
        if (product && /^[a-zA-Z0-9_-]{1,80}$/.test(product)) q.set('id', product);
      }
      u.search = q.toString(); u.hash = ''; return u.href;
    } catch { return ''; }
  };
  const start = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', id, {
      page_location: cleanURL(location.href),
      page_referrer: cleanURL(document.referrer),
      page_title: document.title,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(tag);
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, {once:true});
})();
