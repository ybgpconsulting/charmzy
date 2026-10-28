import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteConfig } = useStore();

  return (
    <footer className="border-t border-pink-200/80 bg-gradient-to-b from-white via-white to-pink-50/70 pb-4 pt-7 text-xs text-zinc-600 md:pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <a href="/" className="flex items-center justify-center lg:justify-start" aria-label="CHARMZY JEWELLERY home">
            <img
              src="/brand/charmzy-jewellery-horizontal.svg"
              alt="CHARMZY JEWELLERY logo"
              width={1800}
              height={600}
              className="h-16 w-auto object-contain"
              loading="lazy"
            />
          </a>

          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-4 gap-1 rounded-2xl border border-pink-100 bg-white/80 p-2 shadow-sm sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-1 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none"
          >
            {[
              { href: '/wishlist', label: 'Saved' },
              { href: '/faq', label: 'FAQ' },
              { href: '/about', label: 'About' },
              { href: '/shipping', label: 'Shipping' },
              { href: '/returns', label: 'Returns' },
              { href: '/privacy', label: 'Privacy' },
              { href: '/terms', label: 'Terms' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="flex min-h-11 items-center justify-center rounded-lg px-1.5 text-center font-medium transition hover:bg-pink-50 hover:text-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 sm:px-2 sm:py-2"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 sm:mx-auto sm:w-full sm:max-w-sm lg:mx-0">
            <div>
              <p className="font-semibold text-zinc-800">Need help?</p>
              <p className="mt-0.5 text-[11px] text-zinc-500">Chat with our team on WhatsApp</p>
            </div>
            <a
              href={`https://wa.me/91${siteConfig.store.whatsappNumber}?text=${encodeURIComponent(
                'Namaste Charmzy! I have a question regarding an order.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 font-bold text-white transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="mt-3 flex justify-center border-t border-pink-100 pt-3 sm:justify-end">
          <a
            href="https://ybgp.in"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Designed and developed by YBGP"
            className="inline-flex items-center gap-2 rounded-lg text-[11px] text-zinc-500 transition hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
          >
            <span>Designed &amp; Developed by</span>
            <img src="/ybgp%20logo.png" alt="YBGP" className="h-6 w-auto object-contain" loading="lazy" />
          </a>
        </div>
      </div>
    </footer>
  );
};
