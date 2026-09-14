// À incrémenter (v1 -> v2 -> ...) à chaque mise à jour de index.html,
// sinon les visiteurs continueront de recevoir l'ancienne version en cache.
const CACHE_VERSION = 'v1';

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (self.workbox) {
  workbox.core.setCacheNameDetails({ prefix: 'editeur-texte', suffix: CACHE_VERSION });
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Précache l'appli (une seule page autonome) pour qu'elle s'ouvre hors ligne
  // après une première visite en ligne.
  workbox.precaching.precacheAndRoute([
    { url: './', revision: CACHE_VERSION },
    { url: './index.html', revision: CACHE_VERSION },
    { url: './manifest.json', revision: CACHE_VERSION },
    { url: './icon.svg', revision: CACHE_VERSION }
  ]);

  // Toute navigation vers le site retombe sur la page précachée si le réseau échoue.
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'editeur-texte-pages-' + CACHE_VERSION
    })
  );
} else {
  // Si le CDN Workbox est inaccessible (ex: tout premier chargement hors ligne),
  // on n'empêche pas la page de fonctionner — elle a simplement déjà été chargée par le navigateur.
  console.warn('Workbox n’a pas pu être chargé — le cache hors ligne ne sera pas actif pour cette session.');
}
