import React, { useState } from 'react';
import { Product } from '../../types';
import { JewelryScene } from './JewelryScene';
import { X, Sparkles, ShoppingBag, MessageCircle, Truck, Check, Heart, Feather } from 'lucide-react';
import { formatINR } from '../../utils/offers';

interface ProductViewer3DModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, finish: string) => void;
  onDirectWhatsApp: (product: Product, finish: string) => void;
}

export const ProductViewer3DModal: React.FC<ProductViewer3DModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onDirectWhatsApp,
}) => {
  const [selectedFinish] = useState<string>('Handcrafted Festive Multi');
  const [isAddedToast, setIsAddedToast] = useState(false);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedFinish);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 2000);
  };

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[780px] bg-white border border-pink-200 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden text-zinc-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-zinc-600 hover:text-zinc-900 transition cursor-pointer"
          aria-label="Close 3D View"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: 3D Scene Viewport */}
        <div className="relative w-full md:w-3/5 h-[50vh] md:h-full bg-gradient-to-b from-[#fff0f5] via-[#fff5f7] to-[#fce7f3] border-b md:border-b-0 md:border-r border-pink-200 flex items-center justify-center overflow-hidden">
          <JewelryScene
            compact={false}
            showControls={true}
            className="w-full h-full"
          />

          {/* 3D Badge */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-pink-300 text-xs font-bold text-pink-700 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" /> 3D Digital Twin Viewer
            </span>
          </div>
        </div>

        {/* Right Side: Product Details & Actions */}
        <div className="w-full md:w-2/5 h-[42vh] md:h-full flex flex-col justify-between p-5 sm:p-6 overflow-y-auto custom-scrollbar bg-white">
          <div className="space-y-3.5">
            {/* Category & Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold tracking-wider uppercase text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full">
                {product.category.replace('-', ' ')}
              </span>
              {product.tags.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Title */}
            <div>
              <h2 className="font-outfit text-xl sm:text-2xl font-black text-zinc-900 leading-snug">
                {product.title}
              </h2>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 border-y border-pink-100 py-2.5">
              <span className="text-2xl font-black text-pink-700 font-outfit">
                {formatINR(product.price)}
              </span>
              <span className="text-sm line-through text-zinc-400">
                {formatINR(product.mrp)}
              </span>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                {discountPercent}% OFF
              </span>
            </div>

            {/* Offer Callout */}
            <div className="p-3 rounded-2xl bg-pink-50 border border-pink-200 text-xs">
              <div className="flex items-center gap-1.5 text-pink-700 font-bold">
                <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                <span>Eligible for Campus Saver Offers:</span>
              </div>
              <ul className="text-[11px] text-zinc-600 mt-1 space-y-0.5 list-disc list-inside">
                <li><strong className="text-zinc-900">Buy 2 Get 1 FREE:</strong> Add any 3 pieces to bag</li>
                <li><strong className="text-zinc-900">Buy 6 Get 4 FREE:</strong> Add 10 items, get 4 free!</li>
              </ul>
            </div>

            {/* Key Specs */}
            <div className="space-y-1.5 text-xs text-zinc-700">
              <div className="flex justify-between py-1 border-b border-pink-50">
                <span className="text-zinc-500">Material Core:</span>
                <span className="font-medium text-right text-zinc-900">{product.specifications.material}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-pink-50">
                <span className="text-zinc-500">Weight:</span>
                <span className="font-medium text-zinc-900">{product.specifications.weight}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-pink-50">
                <span className="text-zinc-500">Dispatch Location:</span>
                <span className="font-medium text-pink-600">{product.specifications.origin}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-700 pt-1">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-pink-50/70 border border-pink-100">
                <Feather className="w-4 h-4 text-pink-600" />
                <span>Featherlight</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-pink-50/70 border border-pink-100">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Pan-India Air</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-3 border-t border-pink-100 space-y-2">
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md hover:brightness-105 active:scale-[0.98] transition cursor-pointer"
            >
              {isAddedToast ? (
                <>
                  <Check className="w-4 h-4" /> Added to Bag!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Bag (Buy 2 Get 1 Eligible)
                </>
              )}
            </button>

            <button
              onClick={() => onDirectWhatsApp(product, selectedFinish)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-semibold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-[0.98] transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Direct Order via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
