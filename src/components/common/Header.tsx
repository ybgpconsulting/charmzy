import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ArrowRight,
  Flame,
  ShoppingBag,
  Search,
  X,
} from 'lucide-react';

const OFFER_ENDS_AT = new Date('2026-11-10T23:59:59+05:30').getTime();

export const Header: React.FC = () => {
  const {
    siteConfig,
    cart,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  useEffect(() => {
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - previousScrollY;

      if (Math.abs(scrollDifference) < 6) return;
      previousScrollY = currentScrollY;

      if (window.innerWidth >= 768 || currentScrollY <= 80 || isSearchOpen) {
        setIsHeaderHidden(false);
        return;
      }

      setIsHeaderHidden(scrollDifference > 0);
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) setIsHeaderHidden(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const intervalId = window.setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const hasActiveOffers = siteConfig.offers.b2g1Active || siteConfig.offers.b6g4Active;
  const remainingMs = Math.max(0, OFFER_ENDS_AT - currentTime);
  const isSaleLive = hasActiveOffers && remainingMs > 0;
  const remainingSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(remainingSeconds / 86_400);
  const hours = Math.floor((remainingSeconds % 86_400) / 3_600);
  const minutes = Math.floor((remainingSeconds % 3_600) / 60);
  const seconds = remainingSeconds % 60;
  const countdown = `${days > 0 ? `${days}d ` : ''}${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const mainLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/offers', label: 'Offers' },
    { href: '/contact', label: 'Contact us' },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full border-b border-pink-200/80 bg-white/95 shadow-[0_8px_30px_rgba(80,24,49,0.07)] backdrop-blur-xl transition-transform duration-300 ease-out motion-reduce:transition-none md:translate-y-0 focus-within:translate-y-0 ${isHeaderHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      {hasActiveOffers ? (
        <div className="border-b border-amber-300/50 bg-gradient-to-r from-[#3b1028] via-[#7a1648] to-[#3b1028] px-3 py-2 text-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-1.5 sm:flex-row sm:justify-center sm:gap-4 lg:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-amber-200 sm:text-[11px]">
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{isSaleLive ? 'Limited-time sale' : 'Current offers'}</span>
              </div>
              {isSaleLive && (
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-pink-100">Ends in</span>
                  <span
                    className="rounded-full border border-amber-200/60 bg-black/20 px-2.5 py-1 font-mono text-[10px] font-bold tabular-nums text-amber-100 sm:text-[11px]"
                    aria-hidden="true"
                  >
                    {countdown}
                  </span>
                  <span className="sr-only">A countdown shows the time remaining in the limited-time sale.</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-x-5">
              {siteConfig.offers.b2g1Active && (
                <a
                  href="/offers"
                  className="rounded-md px-1 py-0.5 text-[11px] font-extrabold transition hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:text-xs"
                >
                  BUY 2, GET 1 FREE
                </a>
              )}
              {siteConfig.offers.b2g1Active && siteConfig.offers.b6g4Active && (
                <span className="h-4 border-l border-white/30" aria-hidden="true" />
              )}
              {siteConfig.offers.b6g4Active && (
                <a
                  href="/offers"
                  className="rounded-md px-1 py-0.5 text-[11px] font-extrabold transition hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:text-xs"
                >
                  BUY 6, GET 4 FREE
                </a>
              )}
            </div>

            <a
              href="/offers"
              className="hidden shrink-0 items-center gap-1 rounded-full border border-amber-200/70 px-3 py-1 text-[10px] font-bold text-amber-100 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 lg:inline-flex"
            >
              Shop offers
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      ) : siteConfig.hero.announcementActive ? (
        <div className="bg-[#4a1834] px-3 py-1.5 text-center text-[11px] font-medium text-white sm:text-xs">
          <span className="mx-auto block max-w-7xl truncate">{siteConfig.hero.announcementText}</span>
        </div>
      ) : null}

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[88px] sm:px-6 lg:h-24 lg:px-8">
        <a href="/" aria-label="CHARMZY JEWELLERY home" className="flex min-w-0 flex-1 items-center md:flex-none">
          <img
            src="/brand/charmzy-jewellery-horizontal.svg"
            alt="CHARMZY JEWELLERY logo"
            width={1800}
            height={600}
            className="block h-auto w-full max-w-[240px] object-contain sm:max-w-[264px] lg:max-w-[288px]"
          />
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-0.5 md:flex lg:gap-1">
          {mainLinks.map(({ href, label }) => {
            const isCurrentPage = currentPath === href;
            return (
              <a
                key={href}
                href={href}
                aria-current={isCurrentPage ? 'page' : undefined}
                className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 lg:px-3 lg:text-sm ${
                  isCurrentPage
                    ? 'bg-pink-50 text-pink-700'
                    : 'text-zinc-600 hover:bg-pink-50 hover:text-pink-700'
                }`}
              >
                {label}
              </a>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-pink-50 hover:text-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            aria-expanded={isSearchOpen}
            aria-controls="header-search"
          >
            {isSearchOpen
              ? <X className="h-5 w-5" aria-hidden="true" />
              : <Search className="h-5 w-5" aria-hidden="true" />}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#c52a72] to-[#e23f82] text-white shadow-sm transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700 sm:w-auto sm:gap-2 sm:px-4"
            aria-label={`Open shopping bag${totalCartCount ? `, ${totalCartCount} items` : ''}`}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden text-xs font-bold sm:inline">
              Bag{totalCartCount > 0 ? ` (${totalCartCount})` : ''}
            </span>
            {totalCartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-pink-700 sm:hidden">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <nav aria-label="Mobile main navigation" className="flex items-center justify-center gap-1 border-t border-pink-100 px-2 py-1 md:hidden">
        {mainLinks.map(({ href, label }) => {
          const isCurrentPage = currentPath === href;
          return (
            <a
              key={href}
              href={href}
              aria-current={isCurrentPage ? 'page' : undefined}
              className={`flex min-h-10 items-center justify-center whitespace-nowrap rounded-lg px-2 text-[11px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 ${
                isCurrentPage
                  ? 'bg-pink-50 text-pink-700'
                  : 'text-zinc-600 hover:bg-pink-50 hover:text-pink-700'
              }`}
            >
              {label}
            </a>
          );
        })}
      </nav>

      {isSearchOpen && (
        <div id="header-search" className="border-t border-pink-100 bg-[#fff8fb] px-4 py-4 shadow-inner animate-fadeIn">
          <form
            action="/shop"
            method="get"
            className="mx-auto flex max-w-2xl items-center gap-2 rounded-xl border border-pink-200 bg-white px-3 py-2 shadow-sm"
          >
            <Search className="h-4 w-4 shrink-0 text-pink-600" aria-hidden="true" />
            <input
              type="search"
              name="search"
              placeholder="Search jewelry"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="min-h-10 rounded-lg bg-pink-600 px-4 text-xs font-bold text-white transition hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
};
