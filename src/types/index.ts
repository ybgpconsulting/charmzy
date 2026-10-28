export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number; // Selling price in INR (e.g. ₹149, ₹199, ₹249, ₹299)
  mrp: number; // Maximum Retail Price in INR (e.g. ₹399, ₹499)
  category: string;
  tags: (
    | 'Bestseller'
    | 'Trending'
    | 'College Favorite'
    | 'Office Chic'
    | 'Festive Cute'
    | 'Under ₹199'
    | 'Budget Steal'
    | 'New Drop'
  )[];
  images: string[];
  rating: number;
  reviewsCount: number;
  description: string;
  specifications: {
    material: string; // e.g. "Lightweight Fashion Alloy", "Resin & Beads"
    finish: string; // e.g. "Silver-Tone / Oxidised", "Rose Pink Enamel"
    stones: string; // e.g. "Faux Pearls & Glass Beads"
    weight: string; // e.g. "8g - 14g (Super light for all-day classes & office)"
    closure: string; // e.g. "Push back with soft rubber stopper"
    dimensions: string;
    origin: string; // "Curated & Dispatched from Noida, UP"
  };
  inStock: boolean;
  stockCount: number;
  isOfferEligible: boolean;
  model3DType: 'royal-jhumka' | 'chandbali' | 'polki-drop' | 'temple-bell' | 'bridal-drop';
  defaultFinish: 'rose-pink' | 'silver-tone' | 'golden-tone' | 'oxidised';
  isComingSoon?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  badge?: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedFinish: string;
}

export interface OfferBreakdown {
  appliedOffer: 'NONE' | 'B2G1' | 'B6G4';
  totalItemsCount: number;
  freeItemsCount: number;
  paidItemsCount: number;
  itemsDiscounted: {
    productId: string;
    selectedFinish: string;
    title: string;
    originalPrice: number;
    discountAmount: number;
  }[];
  totalOfferSavings: number;
  nextTierMessage: string;
  itemsNeededForNextOffer: number;
  progressPercent: number;
}

export interface OrderInquiry {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
  items: {
    title: string;
    quantity: number;
    finish: string;
    price: number;
    isFree: boolean;
  }[];
  subtotal: number;
  offerSavings: number;
  offerApplied: string;
  status: 'Drafted' | 'Inquiry Sent' | 'Confirmed' | 'Shipped' | 'Delivered';
}

export interface SiteConfig {
  hero: {
    badge: string;
    headlinePrefix: string;
    headlineHighlight: string;
    subheadline: string;
    announcementText: string;
    announcementActive: boolean;
  };
  store: {
    name: string;
    domain: string;
    whatsappNumber: string; // "9718270270"
    atelierAddress: string;
    city: string;
    state: string;
    pincode: string;
    ncrDeliveryDays: string;
    panIndiaDeliveryDays: string;
  };
  offers: {
    b2g1Active: boolean;
    b6g4Active: boolean;
    b2g1Label: string;
    b6g4Label: string;
  };
  comingSoon: {
    active: boolean;
    title: string;
    subtitle: string;
    launchDate: string;
    featuredImage: string;
  };
}
