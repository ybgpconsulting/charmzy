import React from 'react';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroSection: React.FC = () => {
  const { siteConfig, categories } = useStore();
  const activeOfferLabels: string[] = [];
  if (siteConfig.offers.b2g1Active) activeOfferLabels.push('Buy 2, Get 1 Free');
  if (siteConfig.offers.b6g4Active) activeOfferLabels.push('Buy 6, Get 4 Free');

  return (
    <section className="home-hero-surface relative isolate overflow-hidden border-b border-[#e7c9a0] bg-[#fff7f7]">
      <div className="pointer-events-none absolute -right-32 -top-36 h-[28rem] w-[28rem] rounded-full bg-[#f7dce6]/70 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-48 left-[-8rem] h-[26rem] w-[26rem] rounded-full border border-[#d6b77d]/35" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:px-8 lg:py-14">
        <div className="relative z-10 order-2 space-y-5 text-center sm:space-y-6 lg:order-1 lg:text-left">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8e2858] sm:text-xs">
            <span className="h-px w-7 bg-[#b99657]" aria-hidden="true" />
            <Sparkles className="h-3.5 w-3.5 text-[#b99657]" aria-hidden="true" />
            <span>{siteConfig.hero.badge}</span>
          </div>

          <h1 className="mx-auto max-w-2xl font-outfit text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.045em] text-[#21151b] sm:text-5xl lg:mx-0 lg:text-[4.25rem]">
            {siteConfig.hero.headlinePrefix}
            <span className="mt-1 block font-serif-chic font-medium italic tracking-[-0.035em] text-[#b62869] sm:mt-2">
              {siteConfig.hero.headlineHighlight}
            </span>
          </h1>

          <p className="mx-auto max-w-lg text-sm leading-6 text-[#66535d] sm:text-base sm:leading-7 lg:mx-0">
            {siteConfig.hero.subheadline}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row lg:justify-start">
            <a
              href="/shop"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#a91f5c] px-7 text-sm font-bold text-white shadow-[0_8px_24px_rgba(169,31,92,0.2)] transition hover:bg-[#871849] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#871849] sm:w-auto"
            >
              Explore the collection <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            {activeOfferLabels.length > 0 && (
              <a
                href="/offers"
                className="inline-flex min-h-12 w-full items-center justify-center gap-1 rounded-full border border-[#d9c49c] bg-white/70 px-6 text-sm font-semibold text-[#4e3240] transition hover:border-[#a91f5c] hover:text-[#921b50] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#871849] sm:w-auto"
              >
                See current offers <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>

          {activeOfferLabels.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 lg:justify-start" aria-label="Current offers">
              {activeOfferLabels.map((label) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-[#e8d8ba] bg-white/80 px-3 py-1.5 text-[11px] font-bold text-[#5b3447]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c42a70]" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          )}

          {categories.length > 0 && (
            <nav aria-label="Shop jewelry categories" className="flex flex-wrap items-center justify-center gap-2 border-t border-[#e8d8dc] pt-4 lg:justify-start">
              <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#806d75]">Explore</span>
              {categories.slice(0, 4).map((category) => (
                <a
                  key={category.id}
                  href={`/shop?category=${encodeURIComponent(category.slug)}`}
                  className="rounded-full px-2 py-1 text-xs font-medium text-[#514149] transition hover:bg-white hover:text-[#a91f5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#871849]"
                >
                  {category.name}
                </a>
              ))}
            </nav>
          )}
        </div>

        <div className="relative order-1 mx-auto w-full max-w-[34rem] lg:order-2">
          <div className="absolute -inset-3 rounded-[2rem] border border-[#d4b87d]/60 sm:-inset-4" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[1.6rem] bg-[#f2dce2] shadow-[0_24px_70px_rgba(72,34,52,0.18)] sm:rounded-[2rem]">
            <img
              src="/assets/aistudio/ADB8DB56-C4BF-4641-A572-5DBAE9409152_48d78b7f.jpg"
              alt="Colorful handcrafted mirror-work jhumka earrings"
              width={1200}
              height={900}
              className="aspect-[1.22/1] w-full object-cover sm:aspect-[1.25/1] lg:aspect-[0.98/1]"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#28111d]/55 via-transparent to-[#28111d]/5" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-white sm:p-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffe2ae]">The Charmzy edit</p>
                <p className="mt-1 font-serif-chic text-xl italic sm:text-2xl">A little lovely, every day.</p>
              </div>
              <span className="mb-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/10 backdrop-blur-sm sm:flex" aria-hidden="true">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>
          </div>
          <div className="absolute -bottom-3 right-3 rounded-full border border-[#e7d7bb] bg-[#fffaf4] px-4 py-2 text-xs font-bold text-[#4d2d3d] shadow-lg sm:-bottom-4 sm:right-6 sm:px-5 sm:py-2.5">
            Thoughtful finds from ₹100
          </div>
        </div>
      </div>
    </section>
  );
};
