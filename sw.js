// 缓存名称（每次大改版+1，避免用户看到旧界面）
const CACHE_NAME = 'smartprofits-stock-v11';

// 本地资源：必须每次都能拿到最新版本，否则 HTML 更新了、JS 还是旧的会直接报错白屏
const LOCAL_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/boot.js',
  '/js/ui.js',
  '/js/firebase-config.js',
  '/js/app.js',
  '/stock.png',
  '/manifest.json'
];

// 第三方 CDN：版本号固定在 URL 里，可以安全地 cache-first
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js'
];

// 安装：预缓存并立即接管
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(LOCAL_ASSETS.concat(CDN_ASSETS)).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// 激活：清理旧版本缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.map(n => (n === CACHE_NAME ? null : caches.delete(n)))))
      .then(() => self.clients.claim())
  );
});

// 本地资源：network-first（保证改版立刻生效），失败回退缓存（离线可用）
function networkFirst(req, fallbackUrl) {
  return fetch(req, { cache: 'no-store' })
    .then(res => {
      if (res && res.status === 200) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
      }
      return res;
    })
    .catch(() => caches.match(req).then(hit => hit || (fallbackUrl ? caches.match(fallbackUrl) : undefined)));
}

// 拦截请求
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // 页面导航 + 本地静态资源：network-first
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(networkFirst(req, '/index.html'));
    return;
  }

  if (sameOrigin) {
    event.respondWith(networkFirst(req));
    return;
  }

  // 第三方 CDN：版本固定在 URL，cache-first + 后台回填
  event.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req)
        .then(res => {
          if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => undefined);
    })
  );
});
