/* Virtuous Vogue service worker: offline-first for the app shell, saved
   Style Passport pages and magazine stories; network-first for everything
   else so bookings and payments are never served stale. */
const VERSION = "vv-v1";
const SHELL = ["/", "/offline", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

const isStaticAsset = (url) => url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/assets/") || url.pathname.startsWith("/icons/");
const isReadLater = (url) => url.pathname.startsWith("/magazine/") || url.pathname.startsWith("/account") || url.pathname.startsWith("/fr/magazine/") || url.pathname.startsWith("/fr/account");
const neverCache = (url) => url.pathname.startsWith("/api/") || url.pathname.startsWith("/book") || url.pathname.startsWith("/admin") || url.pathname.startsWith("/auth");

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || neverCache(url)) return;

  if (isStaticAsset(url)) {
    event.respondWith(caches.open(VERSION).then(async (c) => (await c.match(req)) || fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; })));
    return;
  }
  if (isReadLater(url) || req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => { if (res.ok && isReadLater(url)) caches.open(VERSION).then((c) => c.put(req, res.clone())); return res; })
        .catch(async () => (await caches.match(req)) || (req.mode === "navigate" ? caches.match("/offline") : Response.error())),
    );
  }
});
