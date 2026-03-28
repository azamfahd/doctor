const CACHE_NAME = 'smart-sage-v4';
const ASSETS = [
  'index.html',
  'index.tsx',
  'App.tsx',
  'manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  // استراتيجية Network First لضمان الحصول على أحدث ملفات وتجنب الـ 404 المخزن
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});