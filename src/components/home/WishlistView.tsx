import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { products, wishlist, setActiveTab } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-12 sm:py-16 min-h-[70vh] bg-[#fff5f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center gap-1.5 text-xs text-pink-600 font-bold hover:underline mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home & Jhumkas</span>
            </button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <h1 className="font-outfit text-2xl sm:text-3xl font-black text-zinc-900">
                Your Saved Pieces ({wishlistedProducts.length})
              </h1>
            </div>
            <p className="text-xs text-zinc-600 mt-1">
              Cute pieces saved for college fests and campus fits. All eligible for Buy 2 Get 1 Free!
            </p>
          </div>
        </div>

        {wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-pink-200 space-y-4 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center mx-auto text-pink-400">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-outfit text-base font-bold text-zinc-900">Your Wishlist is Empty</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Tap the heart on any cute jhumka or stud to save your favorite drops here.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('shop');
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-pink-500 text-white hover:bg-pink-600 transition shadow-sm cursor-pointer"
            >
              Explore Cute Drops
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
