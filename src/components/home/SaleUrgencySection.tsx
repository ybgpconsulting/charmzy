import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Flame, Gift, ShoppingBag, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { formatINR } from '../../utils/offers';

export const SaleUrgencySection: React.FC = () => {
  const { cart, offerBreakdown, siteConfig, setIsCartOpen, setActiveTab } = useStore();
  const eligibleItemCount = cart.reduce(
    (sum, item) => sum + (item.product.isOfferEligible ? item.quantity : 0),
    0
  );

  return (
    <section id="sale-urgency-section" className="py-10 sm:py-14 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border-b border-pink-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Current offer summary */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                Current store offers
              </div>
              <h2 className="font-outfit text-base sm:text-xl font-black">
                Trendy Jhumkas & Earrings Starting from ₹100 Only!
              </h2>
              <p className="text-xs text-pink-100">
                Offers apply automatically to eligible pieces in your bag.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-black/20 px-4 py-2.5 rounded-2xl border border-white/20 shrink-0 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-200" />
            Discount shown in your bag
          </div>
        </div>

        {/* Two Grand Offer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Buy 2 Get 1 FREE */}
          {siteConfig.offers.b2g1Active && <div className="rounded-3xl bg-white border border-pink-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-pink-100 text-xs font-bold text-pink-700 uppercase">
                  Mix &amp; match offer
                </span>
                <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Eligible items
                </span>
              </div>

              <div>
                <h3 className="font-outfit text-2xl font-black text-zinc-900">
                  BUY 2 <span className="text-pink-600">GET 1 FREE</span>
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-pink-700 mt-0.5">
                  Add 3 eligible pieces; the lowest-priced piece is FREE.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-zinc-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Mix and match offer-eligible pieces from the catalog</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Mix & match different models starting from ₹100</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-pink-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-500">Cart status:</span>
                <p className="text-xs font-bold text-pink-700">
                  {eligibleItemCount >= 3 ? `${offerBreakdown.freeItemsCount} free piece(s) unlocked!` : `${eligibleItemCount}/3 eligible pieces in bag`}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('shop');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white transition shadow-sm cursor-pointer"
              >
                <span>Shop from ₹100</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          }

          {/* Card 2: Buy 6 Get 4 FREE */}
          {siteConfig.offers.b6g4Active && <div className="rounded-3xl bg-white border border-rose-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-rose-100 text-xs font-bold text-rose-700 uppercase">
                  College & Hostel Gang Box
                </span>
                <span className="text-xs text-rose-600 font-bold">Mix &amp; match</span>
              </div>

              <div>
                <h3 className="font-outfit text-2xl font-black text-zinc-900">
                  BUY 6 <span className="text-rose-600">GET 4 FREE</span>
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-rose-700 mt-0.5">
                  Add 10 eligible pieces — pay for 6 and get 4 FREE.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-zinc-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Pool with college roomies or office besties to save 40%</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Dispatched promptly from Noida</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-rose-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-500">Cart status:</span>
                <p className="text-xs font-bold text-rose-700">
                  {eligibleItemCount >= 10 ? `${offerBreakdown.freeItemsCount} free piece(s) unlocked!` : `${eligibleItemCount}/10 eligible pieces in bag`}
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
          }
        </div>

        {/* Live Cart Nudge Bar */}
        <div className="mt-6 rounded-2xl bg-white border border-pink-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-9 h-9 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-pink-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">
                {offerBreakdown.nextTierMessage}
              </p>
              {offerBreakdown.totalOfferSavings > 0 ? (
                <p className="text-xs text-emerald-600 font-bold">
                  🎉 Free Items Savings: {formatINR(offerBreakdown.totalOfferSavings)} ({offerBreakdown.freeItemsCount} Free Piece{offerBreakdown.freeItemsCount > 1 ? 's' : ''})
                </p>
              ) : (
                <p className="text-[11px] text-zinc-500">
                  Mix and match earrings starting from ₹100. Discounts automatically apply in bag!
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:brightness-105 transition shadow-sm cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Bag & Offers</span>
          </button>
        </div>
      </div>
    </section>
  );
};
