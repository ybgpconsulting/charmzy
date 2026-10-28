import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Clock, Bell, Check, Heart } from 'lucide-react';

export const ComingSoonSection: React.FC = () => {
  const { siteConfig } = useStore();
  const [phone, setPhone] = useState('');
  const [notified, setNotified] = useState(false);

  if (!siteConfig.comingSoon.active) return null;

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setNotified(true);
    const text = `Namaste Charmzy! Please ping me (+91 ${phone}) when your upcoming "${siteConfig.comingSoon.title}" launches!`;
    const url = `https://wa.me/91${siteConfig.store.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-14 sm:py-20 bg-[#fff0f5] border-t border-pink-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-pink-300 bg-gradient-to-r from-pink-50 via-white to-pink-50 p-6 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Next College Drop • {siteConfig.comingSoon.launchDate}</span>
              </div>

              <div>
                <h2 className="font-outfit text-2xl sm:text-4xl font-black text-zinc-900 leading-tight">
                  {siteConfig.comingSoon.title}
                </h2>
                <p className="font-serif-chic italic text-base sm:text-lg text-pink-600 mt-1">
                  Budget-Friendly & Super Cute Drops Starting from ₹100
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-lg">
                {siteConfig.comingSoon.subtitle} Handpicked specifically for college fests, farewells, casual campus wear & office parties.
              </p>

              {/* VIP Notify Form */}
              <div className="pt-2">
                {notified ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>You're on the VIP list! We will notify you on WhatsApp before public launch.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2 max-w-md">
                    <input
                      type="tel"
                      required
                      placeholder="Enter WhatsApp Number for Early Drop Alert"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="px-4 py-3 rounded-2xl bg-white border border-pink-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500 flex-1 shadow-2xs"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105 text-white transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Notify Me on WhatsApp</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Showcase Image (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-pink-200 shadow-md bg-pink-50">
                <img
                  src={siteConfig.comingSoon.featuredImage}
                  alt={siteConfig.comingSoon.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
