import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, Sparkles, ShoppingBag, Check, Feather } from 'lucide-react';
import { formatINR } from '../../utils/offers';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    cart,
    siteConfig,
  } = useStore();

  const [toastMessage, setToastMessage] = useState('');
  const isWishlisted = isInWishlist(product.id);
  const quantityInCart = cart
    .filter((item) => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);
  const isOutOfStock = !product.inStock || quantityInCart >= product.stockCount;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = addToCart(product, product.defaultFinish, 1);
    setToastMessage(added ? 'Added!' : 'Limit reached');
    setTimeout(() => setToastMessage(''), 1600);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <article className="group relative rounded-3xl bg-white border border-pink-200 hover:border-pink-400 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Media & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-pink-50">
        <a
          href={`/products/${product.slug}`}
          aria-label={`View ${product.title} details`}
          className="absolute inset-0 h-full w-full text-left"
        >
          <img
            src={product.images[0]}
            alt=""
            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
            loading="lazy"
          />

          <span className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

          <span className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {product.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/95 text-pink-700 border border-pink-200 backdrop-blur-sm shadow-xs"
              >
                {t}
              </span>
            ))}
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-xs">
                {discountPercent}% OFF
              </span>
            )}
          </span>

          <span className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-pink-700 text-[10px] font-bold backdrop-blur-sm shadow-xs border border-pink-200">
            <Feather className="w-3 h-3 text-pink-500" aria-hidden="true" />
            <span>{product.specifications.weight}</span>
          </span>
        </a>

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={isWishlisted}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 border border-rose-300 shadow-sm'
              : 'bg-white/80 text-zinc-500 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} aria-hidden="true" />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between space-y-2.5">
        <div className="space-y-1">
          {/* Category & Availability */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span className="uppercase tracking-wider font-bold text-pink-600">
              {product.category.replace('-', ' ')}
            </span>
            <span className={product.inStock && product.stockCount > 0 ? 'text-emerald-700' : 'text-rose-700'}>
              {product.inStock && product.stockCount > 0 ? 'Available' : 'Sold out'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-outfit text-sm sm:text-base font-bold text-zinc-900 line-clamp-1 group-hover:text-pink-600 transition-colors">
            <a href={`/products/${product.slug}`} className="text-left">
              {product.title}
            </a>
          </h3>

          <p className="text-[11px] text-zinc-500 line-clamp-1">
            {product.specifications.finish} • {product.specifications.weight}
          </p>
        </div>

        {/* Offer eligibility tag */}
        {product.isOfferEligible && (siteConfig.offers.b2g1Active || siteConfig.offers.b6g4Active) && <div className="flex items-center gap-1 text-[10px] text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200 w-fit font-medium">
          <Sparkles className="w-3 h-3 text-pink-500" />
          <span>Eligible for active offers</span>
        </div>}

        {/* Price & Add to Bag */}
        <div className="pt-2 border-t border-pink-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-outfit font-black text-base sm:text-lg text-pink-700">
                {formatINR(product.price)}
              </span>
              <span className="text-[11px] line-through text-zinc-400">
                {formatINR(product.mrp)}
              </span>
            </div>
            <span className="text-[9px] text-zinc-500 block">Noida Dispatched</span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
              toastMessage
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105 text-white active:scale-95'
            }`}
            title={isOutOfStock ? 'Out of stock or stock limit reached' : 'Add to Bag'}
          >
            {toastMessage ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">{toastMessage}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">{isOutOfStock ? 'Sold out' : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
