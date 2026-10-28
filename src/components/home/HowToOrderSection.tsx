import React from 'react';
import { ArrowRight, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react';

const orderSteps = [
  {
    number: '01',
    title: 'Find your favorites',
    description: 'Explore the collection and add the pieces you love to your bag.',
    icon: ShoppingBag,
  },
  {
    number: '02',
    title: 'Review your offers',
    description: 'Eligible Buy 2 Get 1 and Buy 6 Get 4 offers are calculated in your bag.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Confirm on WhatsApp',
    description: 'Send your order inquiry. Your order is confirmed when our team replies.',
    icon: MessageCircle,
  },
];

export const HowToOrderSection: React.FC = () => (
  <section aria-labelledby="how-to-order-title" className="bg-[#fff7f7] py-10 sm:py-14">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-9">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b315f] sm:text-xs">
          A little lovely, made simple
        </p>
        <h2 id="how-to-order-title" className="mt-2 font-outfit text-2xl font-semibold tracking-tight text-[#261820] sm:text-3xl">
          Your Charmzy order in three steps
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#75636b]">
          From your first favorite to a confirmed order, here’s how shopping with us works.
        </p>
      </div>

      <ol className="grid gap-3 md:grid-cols-3 md:gap-4">
        {orderSteps.map(({ number, title, description, icon: Icon }) => (
          <li key={number} className="relative rounded-2xl border border-[#f0dce2] bg-white/90 p-5 shadow-[0_8px_24px_rgba(80,24,49,0.05)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#fbedf2] text-[#a91f5c]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-serif-chic text-lg italic text-[#bd9a68]" aria-hidden="true">{number}</span>
            </div>
            <h3 className="mt-4 font-outfit text-base font-semibold text-[#261820]">{title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-[#75636b]">{description}</p>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex justify-center">
        <a
          href="/shop"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#a91f5c] px-6 text-sm font-bold text-white shadow-[0_8px_24px_rgba(169,31,92,0.18)] transition hover:bg-[#871849] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#871849]"
        >
          Start exploring <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
);
