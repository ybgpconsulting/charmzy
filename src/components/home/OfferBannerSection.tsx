import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Gift, Flame, CheckCircle, ArrowRight, ShoppingBag, Heart } from 'lucide-react';
import { formatINR } from '../../utils/offers';

export const OfferBannerSection: React.FC = () => {
  const { cart, offerBreakdown, setIsCartOpen, setActiveTab } = useStore();

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <section id="offers-section" className="py-12 sm:py-16 bg-[#fff0f5] border-b border-pink-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 border border-pink-300 text-pink-700 text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-pink-600" />
            <span>Super Saver Deals for College & Office Girls</span>
          </div>
          <h2 className="font-outfit text-2xl sm:text-4xl font-extrabold text-zinc-900">
            Exclusive <span className="text-pink-gradient">Mix & Match Offers</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Mix & match any cute jhumkis, Korean studs, oxidised drops, or hoops. Discounts are automatically calculated in your bag!
          </p>
        </div>

        {/* Two Grand Offer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Offer 1: Buy 2 Get 1 Free */}
          <div className="relative rounded-3xl bg-white border border-pink-200 p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-pink-100 text-xs font-bold text-pink-700 uppercase tracking-wide">
                  Most Popular on Campus
                </span>
                <span className="text-xs text-zinc-400 font-medium">Auto-Applied in Bag</span>
              </div>

              <div>
                <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-zinc-900">
                  BUY 2 <span className="text-pink-600">GET 1 FREE</span>
                </h3>
                <p className="text-sm font-semibold text-pink-600 mt-1">
                  Pick any 3 pieces — your 3rd piece becomes ₹0 completely FREE!
                </p>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-zinc-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Valid on all jhumkis, studs, hoops & oxidised drops</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Average cost drops to just ~₹120-130 per piece!</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Applies to multiples (Buy 4 Get 2 Free, etc.)</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-pink-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-500">Cart status:</span>
                <p className="text-xs font-bold text-pink-700">
                  {totalCartCount >= 3 ? '✅ 1 Free Item Unlocked!' : `${totalCartCount}/3 items added`}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('shop');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white transition shadow-sm cursor-pointer"
              >
                <span>Shop Cute Drops</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Offer 2: Buy 6 Get 4 Free (Mega Girl Gang Box) */}
          <div className="relative rounded-3xl bg-white border border-rose-200 p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-xs font-bold text-rose-700 uppercase tracking-wide">
                  <Flame className="w-3.5 h-3.5 text-rose-500" /> Girl Gang & Roomies Deal
                </span>
                <span className="text-xs text-zinc-400 font-medium">Hostel / Office Sharing</span>
              </div>

              <div>
                <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-zinc-900">
                  BUY 6 <span className="text-rose-600">GET 4 FREE</span>
                </h3>
                <p className="text-sm font-semibold text-rose-600 mt-1">
                  Add 10 pieces — Pay for 6, and get 4 pieces completely FREE!
                </p>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-zinc-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Pool orders with your college besties or office friends</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Massive 40% discount automatically calculated</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Includes free express courier straight to your door</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-500">Cart status:</span>
                <p className="text-xs font-bold text-rose-700">
                  {totalCartCount >= 10 ? '🔥 4 FREE ITEMS UNLOCKED!' : `${totalCartCount}/10 items added`}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('shop');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm cursor-pointer"
              >
                <span>Grab 10-Pack</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Cart Nudge Meter Banner */}
        <div className="mt-8 rounded-2xl bg-white border border-pink-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 border border-pink-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-zinc-900">
                {offerBreakdown.nextTierMessage}
              </p>
              {offerBreakdown.totalOfferSavings > 0 ? (
                <p className="text-xs text-emerald-600 font-bold">
                  🎉 You are saving {formatINR(offerBreakdown.totalOfferSavings)} ({offerBreakdown.freeItemsCount} Free Piece{offerBreakdown.freeItemsCount > 1 ? 's' : ''})
                </p>
              ) : (
                <p className="text-[11px] text-zinc-500">
                  No coupons needed. Just add items and watch your discounts apply live!
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:brightness-105 transition shadow-sm cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Open Bag & Review Free Items</span>
          </button>
        </div>
      </div>
    </section>
  );
};
