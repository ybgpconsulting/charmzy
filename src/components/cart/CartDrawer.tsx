import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShoppingBag,
  Sparkles,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Gift,
  Truck,
  Heart,
} from 'lucide-react';
import { formatINR } from '../../utils/offers';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    offerBreakdown,
    subtotal,
    itemsTotal,
    siteConfig,
    setIsCheckoutOpen,
    setActiveTab,
  } = useStore();

  if (!isCartOpen) return null;

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const freeItemsMap: Record<string, number> = {};
  offerBreakdown.itemsDiscounted.forEach((d) => {
    const key = `${d.productId}-${d.selectedFinish}`;
    freeItemsMap[key] = (freeItemsMap[key] || 0) + 1;
  });

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Background click to dismiss */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Slide-in Panel */}
      <div className="relative w-full max-w-md h-full bg-white border-l border-pink-200 shadow-2xl flex flex-col justify-between overflow-hidden text-zinc-800">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between bg-pink-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-pink-600" />
            <h2 className="font-outfit text-lg font-bold text-zinc-900">Your Shopping Bag</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-200 text-pink-800 font-bold">
              {totalCartCount} items
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-pink-100 transition cursor-pointer"
            aria-label="Close Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Offer Progress Banner */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-900 mb-1.5">
            <Gift className="w-4 h-4 text-pink-600 shrink-0" />
            <span>{offerBreakdown.nextTierMessage}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-pink-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, offerBreakdown.progressPercent)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1.5">
            <span>{siteConfig.offers.b2g1Active ? 'Buy 2 Get 1 Free (3 pcs)' : ''}</span>
            <span>{siteConfig.offers.b6g4Active ? 'Buy 6 Get 4 Free (10 pcs)' : ''}</span>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 custom-scrollbar bg-white">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center mx-auto text-pink-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="font-outfit text-base font-bold text-zinc-900">Your Bag is Empty</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                  Add 3 cute items and your 3rd item is automatically 100% Free!
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveTab('shop');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-pink-500 text-white hover:bg-pink-600 transition shadow-sm cursor-pointer"
              >
                Shop Earrings Starting from ₹100
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => {
                const freeCountForThisItem =
                  freeItemsMap[`${item.productId}-${item.selectedFinish}`] || 0;
                const productQuantity = cart
                  .filter((cartItem) => cartItem.productId === item.productId)
                  .reduce((sum, cartItem) => sum + cartItem.quantity, 0);
                return (
                  <div
                    key={`${item.productId}-${item.selectedFinish}`}
                    className="p-3 rounded-2xl bg-pink-50/50 border border-pink-200 flex gap-3 relative group"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-white shrink-0 border border-pink-200">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-outfit text-xs sm:text-sm font-bold text-zinc-900 truncate">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.productId, item.selectedFinish)}
                            className="p-1 text-zinc-400 hover:text-rose-500 transition cursor-pointer"
                            title="Remove"
                            aria-label={`Remove ${item.product.title} (${item.selectedFinish})`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-pink-700 capitalize mt-0.5 font-medium">
                          Finish: {item.selectedFinish.replace('-', ' ')}
                        </p>
                      </div>

                      {/* Free Item Indicator */}
                      {freeCountForThisItem > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md w-fit">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>{freeCountForThisItem} item(s) FREE via Offer!</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-pink-700">
                            {formatINR(item.product.price)}
                          </span>
                          <span className="text-[10px] line-through text-zinc-400">
                            {formatINR(item.product.mrp)}
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-pink-200 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.productId, item.selectedFinish, -1)}
                            className="px-2 py-0.5 text-xs text-zinc-700 hover:bg-pink-50 cursor-pointer font-bold"
                            aria-label={`Decrease ${item.product.title} quantity`}
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-bold text-zinc-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.selectedFinish, 1)}
                            disabled={!item.product.inStock || productQuantity >= item.product.stockCount}
                            aria-label={`Increase ${item.product.title} quantity`}
                            className="px-2 py-0.5 text-xs text-zinc-700 hover:bg-pink-50 cursor-pointer font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end pt-1">
                <button
                  onClick={clearCart}
                  className="text-[10px] text-zinc-400 hover:text-rose-600 transition cursor-pointer"
                >
                  Clear Bag
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer Billing & WhatsApp Order Button */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-pink-200 bg-pink-50/70 space-y-3">
            {/* Bill Summary */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Items Subtotal ({totalCartCount} pcs):</span>
                <span className="text-zinc-900 font-semibold">{formatINR(subtotal)}</span>
              </div>

              {offerBreakdown.totalOfferSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Offer Savings ({offerBreakdown.appliedOffer === 'B6G4' ? 'Buy 6 Get 4' : 'Buy 2 Get 1'}):
                  </span>
                  <span>- {formatINR(offerBreakdown.totalOfferSavings)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-zinc-500" />
                  Courier shipping:
                </span>
                <span className="text-right text-[10px] font-semibold text-zinc-600">Calculated after address &amp; courier selection</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-black text-zinc-900 pt-2 border-t border-pink-200">
                <span>Items total (shipping excluded):</span>
                <span className="text-pink-700 font-outfit text-lg">
                  {formatINR(itemsTotal)}
                </span>
              </div>
            </div>

            {/* Primary Order via WhatsApp Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 px-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:brightness-105 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Order via WhatsApp ({siteConfig.store.whatsappNumber})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a href="/cart" onClick={() => setIsCartOpen(false)} className="block text-center text-xs font-semibold text-pink-700 hover:text-pink-900">
              View full bag
            </a>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
              <span>Order and payment details confirmed with the Noida team</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
