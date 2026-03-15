const CACHE_NAME = "health-ai-core-v2";
const CORE_ASSETS = ["/", "/styles.css", "/app.js", "/offline.html", "/doctor", "/doctor-login", "/privacy", "/terms"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
          return Promise.resolve();
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === "navigate") {
        const fallback = await caches.match("/offline.html");
        if (fallback) return fallback;
      }
      throw new Error("offline_fallback_missing");
    })
  );
});
