import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register the service worker only for production builds.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('Charmzy PWA Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('Charmzy PWA Service Worker registration failed:', err);
      });
  });
} else if ('serviceWorker' in navigator && import.meta.env.DEV) {
  window.addEventListener('load', () => {
    Promise.all([
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.active?.scriptURL === `${window.location.origin}/sw.js`) {
          return registration.unregister();
        }
      }),
      caches.keys().then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('charmzy-cache-'))
          .map((cacheName) => caches.delete(cacheName))
      )),
    ]).catch((error: unknown) => {
      console.warn('Failed to clean up the development service worker', error);
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
