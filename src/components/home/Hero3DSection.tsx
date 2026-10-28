import React from 'react';
import { JewelryScene } from '../3d/JewelryScene';
import { ArrowDown } from 'lucide-react';

export const Hero3DSection: React.FC = () => {
  const scrollToCatalog = () => {
    const el = document.getElementById('sale-urgency-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-[94vh] sm:h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#fff0f5] via-[#fff5f7] to-[#fce7f3] border-b border-pink-200">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-pink-300/40 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rose-200/50 blur-3xl" />
      </div>

      {/*
        FIRST FRAME: 100% PURE 3D JHUMKA DESIGN — NOT A SINGLE WORD OF TEXT!
        Directly displays the 3D modeled festive mirror & crystal jhumka from user's attached photo.
      */}
      <div className="relative w-full flex-1 flex items-center justify-center z-10">
        <JewelryScene
          compact={false}
          showControls={false}
          className="w-full h-full"
        />
      </div>

      {/* Minimal Pure Visual Chevron at bottom to guide scroll down */}
      <div className="pb-4 pt-1 text-center relative z-20 flex flex-col items-center">
        <button
          onClick={scrollToCatalog}
          className="p-2.5 rounded-full bg-white/70 hover:bg-white text-pink-500 hover:text-pink-700 shadow-sm transition cursor-pointer"
          aria-label="Scroll down"
        >
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
