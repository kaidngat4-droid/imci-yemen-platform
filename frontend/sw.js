const CACHE_NAME = 'imci-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.min.css',
    '/images/yemen-eagle.png',
    '/images/favicon.png',
    'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800;900&display=swap'
];

const DYNAMIC_CACHE = 'imci-dynamic-v2';

// تثبيت: تخزين الملفات الثابتة
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// تفعيل: حذف الـ Cache القديم
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME && key !== DYNAMIC_CACHE)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// جلب: استراتيجية Cache First مع تحديث في الخلفية
self.addEventListener('fetch', e => {
    const { request } = e;
    const url = new URL(request.url);
    
    // استراتيجية مختلفة حسب نوع الطلب
    if (request.method !== 'GET') return;
    
    // الملفات الثابتة: Cache First
    if (STATIC_ASSETS.includes(url.pathname) || url.pathname.match(/\.(css|js|png|jpg|gif|ico|woff2)$/)) {
        e.respondWith(
            caches.match(request).then(cached => {
                const fetchPromise = fetch(request).then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    }
                    return networkResponse;
                }).catch(() => cached);
                
                return cached || fetchPromise;
            })
        );
        return;
    }
    
    // الصفحات HTML: Network First مع fallback
    if (request.headers.get('accept').includes('text/html')) {
        e.respondWith(
            fetch(request).then(response => {
                const clone = response.clone();
                caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, clone));
                return response;
            }).catch(() => {
                return caches.match(request).then(cached => {
                    return cached || caches.match('/offline.html');
                });
            })
        );
        return;
    }
    
    // الباقي: Stale While Revalidate
    e.respondWith(
        caches.match(request).then(cached => {
            const fetchPromise = fetch(request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    const clone = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, clone));
                }
                return networkResponse;
            }).catch(() => cached);
            
            return cached || fetchPromise;
        })
    );
});
