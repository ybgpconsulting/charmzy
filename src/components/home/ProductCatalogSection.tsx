import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { Sparkles, SlidersHorizontal, RotateCcw, Search, Heart } from 'lucide-react';

export const ProductCatalogSection: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    filterOfferEligibleOnly,
    setFilterOfferEligibleOnly,
  } = useStore();

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase();
          const category = categories.find((item) => item.slug === p.category);
          const searchableText = [
            p.title,
            p.description,
            p.category,
            category?.name || '',
            category?.description || '',
            ...p.tags,
          ].join(' ').toLowerCase();
          const normalizedQuery = query
            .replace(/\bjhumkis\b/g, 'jhumka')
            .replace(/\bbows\b/g, 'bow')
            .replace(/\bhuggies\b/g, 'huggie');
          if (!normalizedQuery.split(/\s+/).every((word) => searchableText.includes(word))) {
            return false;
          }
        }

        if (p.price < priceRange[0] || p.price > priceRange[1]) {
          return false;
        }

        if (filterOfferEligibleOnly && !p.isOfferEligible) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') {
          return Number(b.tags.includes('New Drop')) - Number(a.tags.includes('New Drop'));
        }
        return 0;
      });
  }, [products, categories, selectedCategory, searchQuery, priceRange, filterOfferEligibleOnly, sortBy]);

  const maximumProductPrice = Math.max(100, ...products.map((product) => product.price));

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange([0, 5000]);
    setFilterOfferEligibleOnly(false);
    setSortBy('featured');
  };

  return (
    <section id="catalog-section" className="py-12 sm:py-16 bg-[#fff5f7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold mb-2">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>Aesthetic College & Campus Drops</span>
            </div>
            <h2 className="font-outfit text-2xl sm:text-4xl font-black text-zinc-900">
              Curated <span className="text-pink-gradient">Collections</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1">
              Showing {filteredProducts.length} cute pieces • Dispatched from Noida with Buy 2 Get 1 FREE
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto min-w-0">
            <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(event) => {
                const value = event.currentTarget.value;
                if (value === 'featured' || value === 'price-low' || value === 'price-high' || value === 'newest') {
                  setSortBy(value);
                }
              }}
              className="min-w-0 flex-1 md:flex-none max-w-full bg-white border border-pink-200 text-xs text-zinc-800 py-1.5 px-3 rounded-xl focus:outline-none focus:border-pink-500 shadow-2xs font-medium cursor-pointer"
            >
              <option value="featured">Featured College Drops</option>
              <option value="price-low">Price: Low to High (Budget Steals)</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">New drops</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                : 'bg-white text-zinc-700 hover:bg-pink-100 border border-pink-200'
            }`}
          >
            All Drops ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.slug).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                    : 'bg-white text-zinc-700 hover:bg-pink-100 border border-pink-200'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategory === cat.slug ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Filters Bar */}
        <div className="p-3.5 rounded-2xl bg-white border border-pink-200 mb-8 flex flex-wrap items-center justify-between gap-4 text-xs shadow-2xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-zinc-700">
              <SlidersHorizontal className="w-4 h-4 text-pink-600" />
              <span className="font-semibold">Max Price: ₹{Math.min(priceRange[1], maximumProductPrice)}</span>
              <input
                type="range"
                min={0}
                max={maximumProductPrice}
                step={25}
                value={Math.min(maximumProductPrice, priceRange[1])}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="accent-pink-500 cursor-pointer w-28 sm:w-36"
              />
            </div>

            <label className="flex items-center gap-2 text-zinc-700 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={filterOfferEligibleOnly}
                onChange={(e) => setFilterOfferEligibleOnly(e.target.checked)}
                className="rounded accent-pink-500"
              />
              <span>Buy 2 Get 1 / Buy 6 Get 4 Eligible Only</span>
            </label>
          </div>

          {(selectedCategory !== 'all' || searchQuery || priceRange[1] < maximumProductPrice || filterOfferEligibleOnly) && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-pink-600 font-bold hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-pink-200 space-y-3 shadow-sm">
            <Search className="w-10 h-10 text-pink-300 mx-auto" />
            <h3 className="font-outfit text-lg font-bold text-zinc-800">No pieces match your filters</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try adjusting your price range or search terms to explore our affordable jhumkis & studs.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-pink-500 text-white hover:bg-pink-600 transition cursor-pointer"
            >
              Show All Drops
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
