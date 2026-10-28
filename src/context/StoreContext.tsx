import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, Category, CartItem, SiteConfig, OrderInquiry, OfferBreakdown } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SITE_CONFIG } from '../data/initialData';
import { calculateOffers } from '../utils/offers';
import confetti from 'canvas-confetti';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  siteConfig: SiteConfig;
  cart: CartItem[];
  wishlist: string[];
  orders: OrderInquiry[];
  offerBreakdown: OfferBreakdown;
  subtotal: number;
  itemsTotal: number;

  // Navigation & Modals
  activeTab: 'home' | 'shop' | 'offers' | 'wishlist' | 'gallery3d' | 'about';
  setActiveTab: (tab: 'home' | 'shop' | 'offers' | 'wishlist' | 'gallery3d' | 'about') => void;
  active3DProduct: Product | null;
  open3DViewer: (product: Product) => void;
  close3DViewer: () => void;
  selectedProductDetails: Product | null;
  openProductDetails: (product: Product) => void;
  closeProductDetails: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest';
  setSortBy: (s: 'featured' | 'price-low' | 'price-high' | 'newest') => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  filterOfferEligibleOnly: boolean;
  setFilterOfferEligibleOnly: (f: boolean) => void;

  // Cart operations
  addToCart: (product: Product, finish?: string, quantity?: number) => boolean;
  updateQuantity: (productId: string, finish: string, delta: number) => void;
  removeFromCart: (productId: string, finish: string) => void;
  clearCart: () => void;

  // Wishlist operations
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Admin & Config operations
  updateSiteConfig: (config: SiteConfig) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  recordOrderInquiry: (inquiry: OrderInquiry) => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'charmzy_products_v1',
  CATEGORIES: 'charmzy_categories_v1',
  CONFIG: 'charmzy_site_config_v1',
  CART: 'charmzy_cart_v1',
  WISHLIST: 'charmzy_wishlist_v1',
  ORDERS: 'charmzy_orders_v1',
};

const unavailableImageUrl = 'https://images.unsplash.com/photo-1611591475847-f705b63007eb';
const replacementImageUrl = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908';
const migrateImageUrl = (url: string) => url.replace(unavailableImageUrl, replacementImageUrl);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage with safe fallbacks
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved
        ? (JSON.parse(saved) as Product[]).map(product => ({
          ...product,
          images: product.images.map(migrateImageUrl),
        }))
        : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved
        ? (JSON.parse(saved) as Category[]).map(category => ({
          ...category,
          image: migrateImageUrl(category.image),
        }))
        : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (!saved) return INITIAL_SITE_CONFIG;

      const config: SiteConfig = JSON.parse(saved);
      if (/charmzy hub,\s*sector\s*62,\s*noida,\s*gautam buddha nagar/i.test(config.store.atelierAddress)) {
        config.store.atelierAddress = INITIAL_SITE_CONFIG.store.atelierAddress;
      } else {
        config.store.atelierAddress = config.store.atelierAddress
          .replace(/,?\s*(?:sector|sec\.?)\s*62,?/gi, '')
          .replace(/,\s*,/g, ',')
          .replace(/^,|,$/g, '')
          .trim();
      }
      if (/shipping (?:is )?shown in your bag|courier shipping is quoted/i.test(config.hero.announcementText)) {
        config.hero.announcementText = INITIAL_SITE_CONFIG.hero.announcementText;
      }
      if (/sale ending soon|flash sale ending soon/i.test(
        `${config.hero.announcementText} ${config.hero.badge}`
      )) {
        config.hero.announcementText = INITIAL_SITE_CONFIG.hero.announcementText;
        config.hero.badge = INITIAL_SITE_CONFIG.hero.badge;
      }
      return config;
    } catch {
      return INITIAL_SITE_CONFIG;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<OrderInquiry[]>(() => {
    return [];
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'offers' | 'wishlist' | 'gallery3d' | 'about'>(() => {
    const path = window.location.pathname;
    if (path === '/shop') return 'shop';
    if (path === '/offers') return 'offers';
    if (path === '/wishlist') return 'wishlist';
    if (path === '/about') return 'about';
    return 'home';
  });
  const [active3DProduct, setActive3DProduct] = useState<Product | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [filterOfferEligibleOnly, setFilterOfferEligibleOnly] = useState<boolean>(false);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(siteConfig));
    } catch (e) {
      console.warn('Failed to save siteConfig to localStorage', e);
    }
  }, [siteConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Compute Offer Breakdown & Financials
  const offerBreakdown = useMemo(() => {
    return calculateOffers(cart, siteConfig.offers);
  }, [cart, siteConfig.offers]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const itemsTotal = useMemo(
    () => Math.max(0, subtotal - offerBreakdown.totalOfferSavings),
    [subtotal, offerBreakdown.totalOfferSavings]
  );

  // Trigger celebration confetti when a free item is unlocked
  const previousFreeCountRef = React.useRef(offerBreakdown.freeItemsCount);
  useEffect(() => {
    if (offerBreakdown.freeItemsCount > previousFreeCountRef.current) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#d4af37', '#ffd700', '#f3e5ab', '#ffffff', '#e5a391'],
        });
      } catch {
        // ignore if confetti blocked
      }
    }
    previousFreeCountRef.current = offerBreakdown.freeItemsCount;
  }, [offerBreakdown.freeItemsCount]);

  // Cart operations
  const addToCart = useCallback((product: Product, finish?: string, quantity: number = 1) => {
    const selectedFinish = finish || product.defaultFinish || 'antique-gold';
    const quantityInCart = cart
      .filter((item) => item.productId === product.id)
      .reduce((sum, item) => sum + item.quantity, 0);
    if (!product.inStock || quantity <= 0 || quantityInCart + quantity > product.stockCount) {
      return false;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedFinish === selectedFinish
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prev, { productId: product.id, product, quantity, selectedFinish }];
      }
    });
    return true;
  }, [cart]);

  const updateQuantity = useCallback((productId: string, finish: string, delta: number) => {
    setCart((prev) => {
      const target = prev.find(
        (item) => item.productId === productId && item.selectedFinish === finish
      );
      if (!target) return prev;

      const otherQuantity = prev
        .filter((item) => item.productId === productId && item.selectedFinish !== finish)
        .reduce((sum, item) => sum + item.quantity, 0);
      const maximumQuantity = target.product.inStock
        ? Math.max(0, target.product.stockCount - otherQuantity)
        : target.quantity;
      const newQuantity = Math.min(maximumQuantity, target.quantity + delta);

      return prev
        .map((item) => {
          if (item.productId === productId && item.selectedFinish === finish) {
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  }, []);

  const removeFromCart = useCallback((productId: string, finish: string) => {
    setCart((prev) => prev.filter(
      (item) => item.productId !== productId || item.selectedFinish !== finish
    ));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Wishlist
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  // Modals
  const open3DViewer = useCallback((product: Product) => {
    setActive3DProduct(product);
  }, []);

  const close3DViewer = useCallback(() => {
    setActive3DProduct(null);
  }, []);

  const openProductDetails = useCallback((product: Product) => {
    setSelectedProductDetails(product);
  }, []);

  const closeProductDetails = useCallback(() => {
    setSelectedProductDetails(null);
  }, []);

  // Admin Actions
  const updateSiteConfig = useCallback((newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [product, ...prev]);
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const addCategory = useCallback((category: Category) => {
    setCategories((prev) => [...prev, category]);
  }, []);

  const updateCategory = useCallback((category: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  }, []);

  const recordOrderInquiry = useCallback((inquiry: OrderInquiry) => {
    setOrders((prev) => [inquiry, ...prev]);
  }, []);

  const resetToDefaults = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setSiteConfig(INITIAL_SITE_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        siteConfig,
        cart,
        wishlist,
        orders,
        offerBreakdown,
        subtotal,
        itemsTotal,
        activeTab,
        setActiveTab,
        active3DProduct,
        open3DViewer,
        close3DViewer,
        selectedProductDetails,
        openProductDetails,
        closeProductDetails,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        priceRange,
        setPriceRange,
        filterOfferEligibleOnly,
        setFilterOfferEligibleOnly,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        updateSiteConfig,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        recordOrderInquiry,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
