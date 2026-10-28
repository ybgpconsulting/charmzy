import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, Compass, Tag, Heart, ShoppingBag } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, cart, wishlist, setIsCartOpen, offerBreakdown } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-pink-200 backdrop-blur-xl px-2 py-1.5 safe-area-pb shadow-[0_-5px_20px_rgba(244,114,182,0.18)]">
      <div className="grid grid-cols-5 items-center justify-items-center text-center">
        {/* Home */}
        <a href="/"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            activeTab === 'home' ? 'text-pink-600 font-bold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </a>

        {/* Shop */}
        <a href="/shop"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            activeTab === 'shop' ? 'text-pink-600 font-bold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Shop</span>
        </a>

        {/* Offers */}
        <a href="/offers"
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            activeTab === 'offers' ? 'text-pink-600 font-bold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <div className="relative">
            <Tag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <span className="text-[10px] mt-0.5">Offers</span>
        </a>

        {/* Wishlist */}
        <a href="/wishlist"
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            activeTab === 'wishlist' ? 'text-pink-600 font-bold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Saved</span>
        </a>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-2 rounded-xl text-zinc-600 hover:text-pink-600 transition"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-pink-600" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5 text-zinc-700">
            {offerBreakdown.freeItemsCount > 0 ? (
              <span className="text-emerald-600 font-bold">+{offerBreakdown.freeItemsCount} Free!</span>
            ) : (
              'Bag'
            )}
          </span>
        </button>
      </div>
    </div>
  );
};
