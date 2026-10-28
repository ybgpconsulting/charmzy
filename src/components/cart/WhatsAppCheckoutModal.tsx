import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { generateWhatsAppOrderUrl, CustomerOrderDetails } from '../../utils/whatsapp';
import { formatINR } from '../../utils/offers';
import {
  X,
  MessageCircle,
  Truck,
  CheckCircle,
  Sparkles,
  User,
  Phone,
  Heart,
} from 'lucide-react';

const INDIAN_STATES = [
  'Uttar Pradesh',
  'Delhi NCR',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Gujarat',
  'Rajasthan',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'West Bengal',
  'Telangana',
  'Kerala',
  'Bihar',
  'Assam',
  'Odisha',
  'Jharkhand',
  'Uttarakhand',
  'Himachal Pradesh',
  'Goa',
  'Jammu & Kashmir',
  'Other State / UT',
];

export const WhatsAppCheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    clearCart,
    offerBreakdown,
    subtotal,
    itemsTotal,
    siteConfig,
    recordOrderInquiry,
  } = useStore();

  const [form, setForm] = useState<CustomerOrderDetails>({
    name: '',
    phone: '',
    address: '',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{ id: string; url: string } | null>(null);
  const [formError, setFormError] = useState('');

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneDigits = form.phone.replace(/\D/g, '');
    const validPhone = phoneDigits.length === 10
      ? /^[6-9]\d{9}$/.test(phoneDigits)
      : phoneDigits.length === 12 && phoneDigits.startsWith('91') && /^[6-9]\d{9}$/.test(phoneDigits.slice(2));
    if (!form.name.trim() || !validPhone || !form.address.trim() || !/^[1-9]\d{5}$/.test(form.pincode)) {
      setFormError('Enter your name, a valid 10-digit Indian WhatsApp number, full address, and 6-digit PIN code.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const { orderId, url } = generateWhatsAppOrderUrl({
      whatsappNumber: siteConfig.store.whatsappNumber,
      orderDetails: form,
      cartItems: cart,
      offerBreakdown,
      subtotal,
    });

    setSuccessOrder({ id: orderId, url });
    const whatsappWindow = window.open(url, '_blank');
    if (!whatsappWindow) {
      setFormError('Your WhatsApp message is ready. If a new tab did not open, use the button below.');
      setIsSubmitting(false);
      return;
    }
    whatsappWindow.opener = null;

    recordOrderInquiry({
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName: form.name,
      customerPhone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      notes: form.notes,
      items: cart.flatMap((item) => {
        const freeQuantity = offerBreakdown.itemsDiscounted.filter(
          (discounted) =>
            discounted.productId === item.productId &&
            discounted.selectedFinish === item.selectedFinish
        ).length;
        const paidQuantity = item.quantity - freeQuantity;
        return [
          ...(paidQuantity > 0
            ? [{
                title: item.product.title,
                quantity: paidQuantity,
                finish: item.selectedFinish,
                price: item.product.price,
                isFree: false,
              }]
            : []),
          ...(freeQuantity > 0
            ? [{
                title: item.product.title,
                quantity: freeQuantity,
                finish: item.selectedFinish,
                price: item.product.price,
                isFree: true,
              }]
            : []),
        ];
      }),
      subtotal,
      offerSavings: offerBreakdown.totalOfferSavings,
      offerApplied: offerBreakdown.appliedOffer,
      status: 'Drafted',
    });

    clearCart();
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-white border border-pink-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-800">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between bg-pink-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-outfit text-base sm:text-lg font-bold text-zinc-900">
                Order via WhatsApp
              </h2>
              <p className="text-[11px] text-pink-600 font-medium">Charmzy Official: +91 {siteConfig.store.whatsappNumber}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setSuccessOrder(null);
            }}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full bg-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {successOrder ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-outfit text-xl font-bold text-zinc-900">
                  WhatsApp order message ready
                </h3>
                <p className="text-xs text-zinc-600 mt-1">
                  Order Reference: <strong className="text-pink-600">#{successOrder.id}</strong>
                </p>
                <p className="text-xs text-zinc-500 max-w-md mx-auto mt-2">
                  Your order details are ready in WhatsApp. Review the message and tap Send to contact the store. Your order is confirmed only after the store replies.
                </p>
                {formError && <p role="alert" className="text-xs text-rose-700 mt-2">{formError}</p>}
              </div>

              <a
                href={successOrder.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Chat Now</span>
              </a>

              <p className="text-[11px] text-zinc-400 italic">
                Our Noida team confirms your delivery date and payment method promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Offer recap card */}
              <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 text-xs flex items-center justify-between">
                <div>
                  <p className="text-zinc-600">Items in Bag: <span className="font-bold text-zinc-900">{cart.reduce((s, i) => s + i.quantity, 0)} pcs</span></p>
                  {offerBreakdown.freeItemsCount > 0 && (
                    <p className="text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      {offerBreakdown.freeItemsCount} Item(s) FREE ({offerBreakdown.appliedOffer})
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-500">Items total (shipping excluded):</span>
                  <p className="font-outfit text-base font-black text-pink-700">
                    {formatINR(itemsTotal)}
                  </p>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-pink-700 uppercase tracking-wider">
                  1. Shipping & College/Hostel Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ananya Sen"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={14}
                        placeholder="e.g. 9876543210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^\d+]/g, '') })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    Complete Street / Hostel Address & Room No *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Hostel / House No, Street name, Landmark"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      inputMode="numeric"
                      pattern="[1-9][0-9]{5}"
                      autoComplete="postal-code"
                      placeholder="e.g. 201301"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Noida / Pune"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      State *
                    </label>
                    <select
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-2 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-pink-500"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    Special Request (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pack each piece in separate cute pink pouches for gifting"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Delivery notice */}
              <div className="p-3 rounded-2xl bg-pink-50 border border-pink-100 text-[11px] text-zinc-700 flex items-start gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-zinc-900">Dispatched from Noida Hub:</p>
                  <p className="text-zinc-500">
                    Courier shipping is calculated after we confirm your delivery area and courier partner. The final total will be shared before order confirmation.
                  </p>
                </div>
              </div>

              {/* Submit CTA */}
              {formError && (
                <p role="alert" className="text-xs font-medium text-rose-700" aria-live="assertive">
                  {formError}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:brightness-105 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Order Inquiry via WhatsApp</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
