import React from 'react';
import { MapPin, ShieldCheck, Truck, Feather, Sparkles, Phone, CheckCircle, Package } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const NoidaHeritageSection: React.FC = () => {
  const { siteConfig } = useStore();

  return (
    <section id="noida-heritage" className="py-14 sm:py-20 bg-gradient-to-b from-[#fff5f7] via-[#fff0f5] to-[#fdf2f8] border-t border-pink-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-pink-700 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Noida Studio • Curated for Gen Z & College Besties</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-outfit text-2xl sm:text-4xl font-black text-zinc-900 leading-tight">
                Curated in Noida, <span className="text-pink-gradient">Loved Across Indian Campuses</span>
              </h2>
              <p className="font-serif-chic italic text-base sm:text-lg text-pink-600">
                "Honest pricing, super cute designs, and zero ear pain."
              </p>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              We know how frustrating it is to pay ₹800+ for fashion earrings that hurt your ears or break in two days. At Charmzy's studio in Noida (UP), we handpick the trendiest jhumkis, Korean bows, and oxidised drops directly from trusted wholesale markets. Every piece undergoes a strict 3-point check for smooth edges, secure stones, and lightweight ear comfort before getting lovingly packed and dispatched across India.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-pink-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-pink-600">
                  <Package className="w-4 h-4" />
                  <h4 className="font-bold text-xs text-zinc-900">Hand-Inspected in Noida</h4>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Located in Noida. Every single piece is checked for finish and comfortable backs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-pink-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Truck className="w-4 h-4" />
                  <h4 className="font-bold text-xs text-zinc-900">Pan-India Express Dispatch</h4>
                </div>
                <p className="text-[11px] text-zinc-500">
                  1-2 days across Delhi NCR & Noida; 3-5 days across all Indian colleges, hostels & cities.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-pink-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-pink-600">
                  <Feather className="w-4 h-4" />
                  <h4 className="font-bold text-xs text-zinc-900">Lightweight & Painless</h4>
                </div>
                <p className="text-[11px] text-zinc-500">
                  We only curate feather-light weight jewelry so you can wear them through long college lectures with ease.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-pink-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-rose-600">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="font-bold text-xs text-zinc-900">Direct WhatsApp Order Helpline</h4>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Quick support and order confirmation directly at +91 {siteConfig.store.whatsappNumber}.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-pink-200 shadow-xl bg-white p-6 space-y-5">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-pink-100">
                <img
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"
                  alt="Noida Studio Packaging"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[11px] font-bold text-white bg-pink-600/90 px-3 py-1 rounded-full backdrop-blur-sm">
                  Bubble Wrapped & Velvet Packed 🎀
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-outfit text-base font-bold text-zinc-900">
                  Transparent Delivery & Shipping
                </h3>
                <div className="space-y-2 text-xs text-zinc-600">
                  <div className="flex justify-between py-1.5 border-b border-pink-100">
                    <span className="text-zinc-500">Dispatch Location:</span>
                    <span className="font-semibold text-zinc-900">Noida, Uttar Pradesh</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-pink-100">
                    <span className="text-zinc-500">Pan-India Courier Shipping:</span>
                    <span className="font-bold text-pink-700">Calculated by delivery area &amp; courier</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-pink-100">
                    <span className="text-zinc-500">Packaging:</span>
                    <span className="font-medium text-zinc-900">Velvet Pouch + Shockproof Bubble Box</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/91${siteConfig.store.whatsappNumber}?text=${encodeURIComponent(
                    'Namaste! I would like to inquire about bulk/resell college jewelry from Charmzy.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 py-3 px-4 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Chat with Noida Team on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
