import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Truck,
  Heart,
  Check,
  MapPin,
  Feather,
} from 'lucide-react';
import { formatINR } from '../../utils/offers';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    siteConfig,
    setIsCartOpen,
    cart,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState<string>('rose-pink');
  const [quantity, setQuantity] = useState(1);
  const [isAddedToast, setIsAddedToast] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedFinish(product?.defaultFinish || 'rose-pink');
    setQuantity(1);
    setIsAddedToast(false);
    setPincodeStatus(null);
  }, [product?.id, product?.defaultFinish]);

  if (!isOpen || !product) return null;

  const isWishlisted = isInWishlist(product.id);
  const quantityInCart = cart
    .filter((item) => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);
  const availableStock = Math.max(0, product.stockCount - quantityInCart);
  const isOutOfStock = !product.inStock || availableStock === 0;
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAdd = () => {
    if (!addToCart(product, selectedFinish, quantity)) return;
    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
      setIsCartOpen(true);
      onClose();
    }, 800);
  };

  const handleWhatsAppDirect = () => {
    const text = `Namaste Charmzy! I want to order this aesthetic piece:
🛍️ *${product.title}*
• Finish: ${selectedFinish}
• Quantity: ${quantity}
• Total Price: ${formatINR(product.price * quantity)}
• Handpicked & Dispatched from Noida

Please confirm order details!`;
    const url = `https://wa.me/91${siteConfig.store.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput || pincodeInput.trim().length !== 6) {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    setPincodeStatus(
      `We currently offer Pan-India delivery. Exact serviceability and delivery timing for PIN ${pincodeInput.trim()} will be confirmed by our team before dispatch.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-pink-200 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden text-zinc-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-zinc-600 hover:text-zinc-900 transition cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images & 3D Launcher */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col justify-between bg-gradient-to-b from-pink-50/60 to-white border-b md:border-b-0 md:border-r border-pink-200">
          <div className="space-y-3">
            {/* Main Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-pink-50 border border-pink-200 shadow-sm group">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Featherlight Comfort Badge */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-pink-300 text-pink-700 text-xs font-bold backdrop-blur-md shadow-xs">
                <Feather className="w-3.5 h-3.5 text-pink-500" />
                <span>Feather-light Wear</span>
              </div>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-500 border border-rose-300'
                    : 'bg-white/80 text-zinc-500 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-pink-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-pink-50 border border-pink-100 text-[11px] text-pink-900 flex items-center gap-2">
            <Feather className="w-4 h-4 text-pink-600 shrink-0" />
            <span>Tested for all-day comfort. Dispatched with love from Charmzy Studio, Noida!</span>
          </div>
        </div>

        {/* Right Side: Details, Pricing & Actions */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between space-y-4 bg-white">
          <div className="space-y-3.5">
            {/* Category & Rating */}
            <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs uppercase font-bold text-pink-600 tracking-wider">
              {product.category.replace('-', ' ')}
            </span>
            <span className={product.inStock && product.stockCount > 0 ? 'text-xs text-emerald-700' : 'text-xs text-rose-700'}>
              {product.inStock && product.stockCount > 0 ? 'In stock' : 'Currently unavailable'}
            </span>
            </div>

            {/* Title */}
            <h1 className="font-outfit text-xl sm:text-2xl font-black text-zinc-900 leading-tight">
              {product.title}
            </h1>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 py-2 border-y border-pink-100">
              <span className="text-2xl sm:text-3xl font-black font-outfit text-pink-700">
                {formatINR(product.price)}
              </span>
              <span className="text-sm line-through text-zinc-400">
                {formatINR(product.mrp)}
              </span>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                {discountPercent}% OFF
              </span>
            </div>

            {/* Active Offers Callout */}
            {(siteConfig.offers.b2g1Active || siteConfig.offers.b6g4Active) && <div className="p-3 rounded-2xl bg-pink-50 border border-pink-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-pink-800 font-bold">
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span>Current store offers:</span>
              </div>
              {!product.isOfferEligible && <p className="text-zinc-700 text-[11px]">This piece is not eligible for the current promotions.</p>}
              {product.isOfferEligible && siteConfig.offers.b2g1Active && <p className="text-zinc-700 text-[11px]">
                • <strong>Buy 2 Get 1 FREE:</strong> Add any 3 eligible pieces; the lowest-priced piece is free.
              </p>}
              {product.isOfferEligible && siteConfig.offers.b6g4Active && <p className="text-zinc-700 text-[11px]">
                • <strong>Buy 6 Get 4 FREE:</strong> Add 10 eligible pieces and get 4 free.
              </p>}
            </div>}

            {/* Description */}
            <p className="text-xs text-zinc-600 leading-relaxed">
              {product.description}
            </p>

            {/* Finish Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-800">Choose Shade / Finish:</label>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { id: 'rose-pink', label: 'Blush Pink Tone' },
                  { id: 'silver-tone', label: 'Classic Silver Tone' },
                  { id: 'golden-tone', label: 'Warm Golden Tone' },
                  { id: 'oxidised', label: 'Antique Oxidised' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFinish(f.id)}
                    className={`px-3 py-1.5 rounded-full text-xs transition cursor-pointer ${
                      selectedFinish === f.id
                        ? 'bg-pink-600 text-white font-bold shadow-xs'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-pink-50 border border-zinc-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-800">Quantity:</span>
              <div className="flex items-center border border-pink-200 rounded-xl overflow-hidden bg-pink-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-zinc-700 hover:bg-pink-100 cursor-pointer font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-zinc-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                  disabled={quantity >= availableStock}
                  className="px-3 py-1 text-zinc-700 hover:bg-pink-100 cursor-pointer font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Specifications Details */}
            <div className="border-t border-pink-100 pt-3 space-y-1 text-xs">
              <h4 className="font-bold text-pink-700 text-[11px] uppercase tracking-wider mb-1">
                Product details:
              </h4>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                <span className="text-zinc-500">Material Core:</span>
                <span className="text-zinc-800 font-medium">{product.specifications.material}</span>

                <span className="text-zinc-500">Finish:</span>
                <span className="text-zinc-800 font-medium">{product.specifications.finish}</span>

                <span className="text-zinc-500">Stones / Inlay:</span>
                <span className="text-zinc-800 font-medium">{product.specifications.stones}</span>

                <span className="text-zinc-500">Weight Comfort:</span>
                <span className="text-zinc-800 font-medium">{product.specifications.weight}</span>

                <span className="text-zinc-500">Closure:</span>
                <span className="text-zinc-800 font-medium">{product.specifications.closure}</span>

                <span className="text-zinc-500">Dispatch:</span>
                <span className="text-pink-600 font-semibold">{product.specifications.origin}</span>
              </div>
            </div>

            {/* Pincode Checker */}
            <div className="border-t border-pink-100 pt-3 space-y-1.5">
              <label className="text-xs font-bold text-zinc-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-pink-600" />
                <span>Check Delivery Timeline to Your Pincode:</span>
              </label>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  aria-label="Delivery PIN code"
                  placeholder="Enter 6-digit PIN"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  className="w-36 px-3 py-1.5 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-pink-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-pink-100 text-pink-800 hover:bg-pink-200 transition cursor-pointer"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className="text-[11px] text-pink-700 font-medium mt-1">
                  {pincodeStatus}
                </p>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-3 border-t border-pink-100 space-y-2">
            <button
              onClick={handleAdd}
              disabled={isOutOfStock || quantity > availableStock}
              className="w-full py-3 px-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md hover:brightness-105 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddedToast ? (
                <>
                  <Check className="w-4 h-4" /> Added to Bag!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> {isOutOfStock ? 'Out of stock' : 'Add to Bag'}
                </>
              )}
            </button>

            <button
              onClick={handleWhatsAppDirect}
              className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Direct Order via WhatsApp ({siteConfig.store.whatsappNumber})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
