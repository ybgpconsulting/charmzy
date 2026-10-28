import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const FeaturedProductsSection: React.FC = () => {
  const { products } = useStore();
  const featuredProducts = useMemo(
    () => products
      .filter(product => product.inStock && product.stockCount > 0)
      .sort((a, b) => {
        const score = (product: typeof a) =>
          Number(product.tags.includes('Bestseller')) * 2 +
          Number(product.tags.includes('Trending'));
        return score(b) - score(a);
      })
      .slice(0, 4),
    [products],
  );

  return (
    <section aria-labelledby="featured-products-title" className="home-featured-surface bg-[#fffaf9] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b315f] sm:text-xs">Handpicked for you</p>
            <h2 id="featured-products-title" className="mt-1 font-outfit text-2xl font-semibold tracking-tight text-[#261820] sm:text-3xl">
              Find your new favorite
            </h2>
            <p className="mt-1 text-xs text-[#75636b] sm:text-sm">A few standout styles to start your Charmzy edit.</p>
          </div>
          <a
            href="/shop"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-xs font-bold text-[#9b2459] transition hover:text-[#671338] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#871849] sm:text-sm"
          >
            Shop all <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <p className="rounded-2xl border border-pink-100 bg-white p-6 text-center text-sm text-zinc-600">
            New styles are coming soon. Browse the full collection for available pieces.
          </p>
        )}
      </div>
    </section>
  );
};
