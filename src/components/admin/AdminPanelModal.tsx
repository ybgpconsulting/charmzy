import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Category, SiteConfig } from '../../types';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Layers,
  Tag,
  Clock,
  Phone,
  CheckCircle,
  Download,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react';
import { formatINR } from '../../utils/offers';

export const AdminPanelModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    categories,
    siteConfig,
    orders,
    updateSiteConfig,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    resetToDefaults,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'hero' | 'products' | 'categories' | 'offers' | 'comingSoon' | 'orders' | 'store'
  >('hero');

  // Hero section form state
  const [heroForm, setHeroForm] = useState(siteConfig.hero);
  const [storeForm, setStoreForm] = useState(siteConfig.store);
  const [offersForm, setOffersForm] = useState(siteConfig.offers);
  const [comingSoonForm, setComingSoonForm] = useState(siteConfig.comingSoon);

  // New product form state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    title: '',
    price: 179,
    mrp: 399,
    category: 'cute-jhumkis',
    tags: ['College Favorite'],
    images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'],
    rating: 4.9,
    reviewsCount: 15,
    description: '',
    specifications: {
      material: 'Fashion Alloy Core',
      finish: 'Silver-Tone / Pastel Enamel',
      stones: 'Faux Seed Pearls & Beads',
      weight: '10g pair (Featherlight)',
      closure: 'Stud back with silicone stopper',
      dimensions: 'Length 4.5 cm',
      origin: 'Curated & Quality-Checked in Noida, UP',
    },
    inStock: true,
    stockCount: 50,
    isOfferEligible: true,
    model3DType: 'royal-jhumka',
    defaultFinish: 'rose-pink',
  });

  // Category form state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const adminTabs: { id: typeof activeTab; label: string; icon: LucideIcon }[] = [
    { id: 'hero', label: 'Hero & Announcements', icon: Sparkles },
    { id: 'products', label: `Products (${products.length})`, icon: ShoppingBag },
    { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
    { id: 'offers', label: 'Offers & Rules', icon: Tag },
    { id: 'comingSoon', label: 'Coming Soon Drop', icon: Clock },
    { id: 'orders', label: `WhatsApp Inquiries (${orders.length})`, icon: Phone },
    { id: 'store', label: 'Store & WhatsApp', icon: ShieldAlert },
  ];

  if (!isAdminOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig({ ...siteConfig, hero: heroForm });
    showToast('Hero Section & Announcements updated!');
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig({ ...siteConfig, store: storeForm });
    showToast('Store & WhatsApp settings updated!');
  };

  const handleSaveOffers = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig({ ...siteConfig, offers: offersForm });
    showToast('Special offers updated!');
  };

  const handleSaveComingSoon = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig({ ...siteConfig, comingSoon: comingSoonForm });
    showToast('Coming Soon drop updated!');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) return;

    if (editingProductId) {
      updateProduct({
        ...(products.find((p) => p.id === editingProductId) as Product),
        ...productForm,
        id: editingProductId,
      } as Product);
      showToast('Product updated successfully!');
      setEditingProductId(null);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title: productForm.title || 'Untitled Royal Piece',
        slug: (productForm.title || 'piece').toLowerCase().replace(/\s+/g, '-'),
        price: Number(productForm.price),
        mrp: Number(productForm.mrp || productForm.price * 2),
        category: productForm.category || 'cute-jhumkis',
        tags: productForm.tags || ['New Drop'],
        images: productForm.images?.length ? productForm.images : ['https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'],
        rating: 4.9,
        reviewsCount: 1,
        description: productForm.description || 'Artisan handcrafted in Noida.',
        specifications: productForm.specifications || {
          material: 'Fashion Alloy Core',
          finish: 'Silver-Tone / Pastel Enamel',
          stones: 'Faux Seed Pearls & Beads',
          weight: '10g pair',
          closure: 'Push post',
          dimensions: 'Length 4.5 cm',
          origin: 'Curated & Quality-Checked in Noida, UP',
        },
        inStock: productForm.inStock ?? true,
        stockCount: productForm.stockCount || 50,
        isOfferEligible: productForm.isOfferEligible ?? true,
        model3DType: productForm.model3DType || 'royal-jhumka',
        defaultFinish: productForm.defaultFinish || 'rose-pink',
      };
      addProduct(newProd);
      showToast('New jewelry piece added!');
      setIsAddingProduct(false);
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: categoryForm.name,
      slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
      description: categoryForm.description || '',
      image: categoryForm.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      badge: categoryForm.badge,
    };
    addCategory(newCat);
    showToast('New category created!');
    setIsAddingCategory(false);
  };

  const exportOrdersCSV = () => {
    if (orders.length === 0) {
      alert('No orders to export yet.');
      return;
    }
    const headers = 'Order ID,Date,Customer Name,Phone,City,State,Pincode,Items Total (Shipping Excluded),Offer\n';
    const rows = orders
      .map(
        (o) =>
          `"${o.id}","${o.createdAt}","${o.customerName}","${o.customerPhone}","${o.city}","${o.state}","${o.pincode}","${Math.max(0, o.subtotal - o.offerSavings)}","${o.offerApplied}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `charmzy-orders-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[820px] bg-[#120e18] border border-[#d4af37]/40 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#181220]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#fbf8f2]">
                Charmzy Atelier • Store Admin Panel
              </h2>
              <p className="text-[11px] text-[#d4af37]">Manage Hero, Products, Categories, Offers & WhatsApp Inquiries</p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="absolute top-18 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 bg-[#140e1b] border-b border-white/10 overflow-x-auto no-scrollbar text-xs font-medium">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#d4af37] text-[#0d0a0f] font-bold shadow'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar bg-[#100c16]">
          {/* TAB 1: HERO & ANNOUNCEMENTS */}
          {activeTab === 'hero' && (
            <form onSubmit={handleSaveHero} className="space-y-4 max-w-2xl">
              <h3 className="font-cinzel text-base font-bold text-[#fbf8f2] border-b border-white/10 pb-2">
                Hero Section & Header Announcements
              </h3>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-xs font-semibold text-white">Top Announcement Ticker Bar</p>
                  <p className="text-[11px] text-zinc-400">Show celebratory festive announcements at top of page</p>
                </div>
                <input
                  type="checkbox"
                  checked={heroForm.announcementActive}
                  onChange={(e) => setHeroForm({ ...heroForm, announcementActive: e.target.checked })}
                  className="rounded accent-[#d4af37] w-4 h-4 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Announcement Ticker Text
                </label>
                <input
                  type="text"
                  value={heroForm.announcementText}
                  onChange={(e) => setHeroForm({ ...heroForm, announcementText: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Hero Atelier Badge
                </label>
                <input
                  type="text"
                  value={heroForm.badge}
                  onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Headline Prefix
                  </label>
                  <input
                    type="text"
                    value={heroForm.headlinePrefix}
                    onChange={(e) => setHeroForm({ ...heroForm, headlinePrefix: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Headline Gold Highlight
                  </label>
                  <input
                    type="text"
                    value={heroForm.headlineHighlight}
                    onChange={(e) => setHeroForm({ ...heroForm, headlineHighlight: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Sub-headline Description
                </label>
                <textarea
                  rows={3}
                  value={heroForm.subheadline}
                  onChange={(e) => setHeroForm({ ...heroForm, subheadline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#d4af37] text-[#0d0a0f] hover:bg-[#edd077] transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Changes</span>
              </button>
            </form>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-[#fbf8f2]">Product Catalog Management</h3>
                  <p className="text-xs text-zinc-400">Add, edit, modify pricing, stock and 3D attributes</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProductId(null);
                    setIsAddingProduct(!isAddingProduct);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#d4af37] text-[#0d0a0f] hover:bg-[#ebd07a] transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingProduct ? 'Cancel' : 'Add New Product'}</span>
                </button>
              </div>

              {/* Add / Edit Form */}
              {(isAddingProduct || editingProductId) && (
                <form onSubmit={handleSaveProduct} className="p-4 sm:p-5 rounded-2xl bg-[#171120] border border-[#d4af37]/35 space-y-4">
                  <h4 className="font-semibold text-xs text-[#d4af37] uppercase tracking-wider">
                    {editingProductId ? 'Edit Product Details' : 'Create New Jewelry Product'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-300 mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        value={productForm.title || ''}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-300 mb-1">Category *</label>
                      <select
                        value={productForm.category || 'jhumkas'}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug} className="bg-[#120e18]">
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-300 mb-1">Selling Price (₹) *</label>
                      <input
                        type="number"
                        required
                        value={productForm.price || ''}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-300 mb-1">MRP Price (₹)</label>
                      <input
                        type="number"
                        value={productForm.mrp || ''}
                        onChange={(e) => setProductForm({ ...productForm, mrp: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-300 mb-1">Stock Count</label>
                      <input
                        type="number"
                        value={productForm.stockCount || ''}
                        onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-300 mb-1">Primary Image URL</label>
                    <input
                      type="url"
                      value={productForm.images?.[0] || ''}
                      onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={productForm.description || ''}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.inStock ?? true}
                        onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                        className="rounded accent-[#d4af37]"
                      />
                      <span>In Stock</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.isOfferEligible ?? true}
                        onChange={(e) => setProductForm({ ...productForm, isOfferEligible: e.target.checked })}
                        className="rounded accent-[#d4af37]"
                      />
                      <span>Eligible for B2G1 & B6G4 Offers</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#d4af37] text-[#0d0a0f] hover:bg-[#edd077] transition cursor-pointer"
                    >
                      {editingProductId ? 'Update Piece' : 'Add to Catalog'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProductId(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-medium bg-white/10 text-zinc-300 hover:bg-white/20 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Product Table */}
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#150f1e]">
                <div className="divide-y divide-white/5">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-white/5 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                        />
                        <div className="min-w-0">
                          <p className="font-cinzel text-xs sm:text-sm font-semibold text-[#fbf8f2] truncate">
                            {p.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                            <span className="text-[#d4af37] uppercase">{p.category}</span>
                            <span>•</span>
                            <span>{formatINR(p.price)}</span>
                            <span>•</span>
                            <span className={p.inStock ? 'text-emerald-400' : 'text-rose-400'}>
                              {p.inStock ? `${p.stockCount} in stock` : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setEditingProductId(p.id);
                            setProductForm(p);
                            setIsAddingProduct(false);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-[#d4af37] rounded-lg hover:bg-white/5 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${p.title}"?`)) {
                              deleteProduct(p.id);
                              showToast('Product deleted');
                            }
                          }}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-[#fbf8f2]">Category Management</h3>
                  <p className="text-xs text-zinc-400">Organize Jhumkas, Chandbalis, Chokers and Bangles</p>
                </div>
                <button
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#d4af37] text-[#0d0a0f] hover:bg-[#ebd07a] transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingCategory ? 'Cancel' : 'Add Category'}</span>
                </button>
              </div>

              {isAddingCategory && (
                <form onSubmit={handleSaveCategory} className="p-4 rounded-2xl bg-[#171120] border border-[#d4af37]/35 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-300 mb-1">Category Name *</label>
                      <input
                        type="text"
                        required
                        value={categoryForm.name || ''}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/40 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-300 mb-1">Slug URL</label>
                      <input
                        type="text"
                        value={categoryForm.slug || ''}
                        onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/40 border border-white/15 text-white"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#d4af37] text-[#0d0a0f]"
                  >
                    Save Category
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-2xl bg-[#161020] border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-cinzel text-sm font-semibold text-[#fbf8f2]">{cat.name}</h4>
                      <p className="text-[11px] text-zinc-400">Slug: {cat.slug}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                          showToast('Category deleted');
                        }
                      }}
                      className="p-1.5 text-zinc-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OFFERS & RULES */}
          {activeTab === 'offers' && (
            <form onSubmit={handleSaveOffers} className="space-y-4 max-w-xl">
              <h3 className="font-cinzel text-base font-bold text-[#fbf8f2] border-b border-white/10 pb-2">
                Exclusive Store Promotional Offers
              </h3>

              <div className="p-4 rounded-2xl bg-[#171220] border border-[#d4af37]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Buy 2 Get 1 FREE (B2G1)</h4>
                    <p className="text-[11px] text-zinc-400">Customer adds 3 pieces, lowest 1 is free</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={offersForm.b2g1Active}
                    onChange={(e) => setOffersForm({ ...offersForm, b2g1Active: e.target.checked })}
                    className="accent-[#d4af37] w-4 h-4"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#171220] border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Buy 6 Get 4 FREE (B6G4)</h4>
                    <p className="text-[11px] text-zinc-400">Customer adds 10 pieces, lowest 4 are free</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={offersForm.b6g4Active}
                    onChange={(e) => setOffersForm({ ...offersForm, b6g4Active: e.target.checked })}
                    className="accent-rose-500 w-4 h-4"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#d4af37] text-[#0d0a0f] hover:bg-[#edd077] transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Offers</span>
              </button>
            </form>
          )}

          {/* TAB 5: COMING SOON DROP */}
          {activeTab === 'comingSoon' && (
            <form onSubmit={handleSaveComingSoon} className="space-y-4 max-w-xl">
              <h3 className="font-cinzel text-base font-bold text-[#fbf8f2] border-b border-white/10 pb-2">
                Upcoming Collection Launch / Coming Soon
              </h3>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-xs font-semibold text-white">Enable Coming Soon Section</p>
                  <p className="text-[11px] text-zinc-400">Show exclusive teaser for next drop</p>
                </div>
                <input
                  type="checkbox"
                  checked={comingSoonForm.active}
                  onChange={(e) => setComingSoonForm({ ...comingSoonForm, active: e.target.checked })}
                  className="rounded accent-[#d4af37] w-4 h-4"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Collection Title</label>
                <input
                  type="text"
                  value={comingSoonForm.title}
                  onChange={(e) => setComingSoonForm({ ...comingSoonForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Launch Date / Month</label>
                <input
                  type="text"
                  value={comingSoonForm.launchDate}
                  onChange={(e) => setComingSoonForm({ ...comingSoonForm, launchDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={comingSoonForm.subtitle}
                  onChange={(e) => setComingSoonForm({ ...comingSoonForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/20 text-white"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#d4af37] text-[#0d0a0f]"
              >
                <Save className="w-4 h-4" />
                <span>Save Drop Info</span>
              </button>
            </form>
          )}

          {/* TAB 6: WHATSAPP INQUIRIES LOG */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-[#fbf8f2]">
                    WhatsApp Inquiries & Orders Log ({orders.length})
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Track all customer orders dispatched to WhatsApp 9718270270
                  </p>
                </div>
                {orders.length > 0 && (
                  <button
                    onClick={exportOrdersCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No WhatsApp orders created yet. Once customers click "Confirm & Send Order via WhatsApp", they appear here automatically.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-[#16111f] border border-white/10 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#d4af37]">#{ord.id}</span>
                        <span className="text-[11px] text-zinc-400">
                          {new Date(ord.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-zinc-300">
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Customer:</span>
                          <span className="font-semibold">{ord.customerName}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Phone:</span>
                          <span>{ord.customerPhone}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Location:</span>
                          <span>{ord.city}, {ord.state} ({ord.pincode})</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Items Total (shipping excluded):</span>
                          <span className="font-bold text-emerald-400">{formatINR(Math.max(0, ord.subtotal - ord.offerSavings))}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400">
                          Items: {ord.items.map((i) => `${i.title} (${i.finish}) x${i.quantity}`).join(', ')}
                        </span>
                        <a
                          href={`https://wa.me/91${siteConfig.store.whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Phone className="w-3 h-3" /> Chat on WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: STORE SETTINGS */}
          {activeTab === 'store' && (
            <form onSubmit={handleSaveStore} className="space-y-4 max-w-xl">
              <h3 className="font-cinzel text-base font-bold text-[#fbf8f2] border-b border-white/10 pb-2">
                Store Location, WhatsApp & Delivery Configuration
              </h3>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  WhatsApp Orders Number (Default: 9718270270)
                </label>
                <input
                  type="text"
                  required
                  value={storeForm.whatsappNumber}
                  onChange={(e) => setStoreForm({ ...storeForm, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/20 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Atelier Physical Address in Noida
                </label>
                <input
                  type="text"
                  value={storeForm.atelierAddress}
                  onChange={(e) => setStoreForm({ ...storeForm, atelierAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Delivery-time shipping estimate
                  </label>
                  <p className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-xs text-zinc-300">
                    Confirmed after the delivery area and courier partner are selected.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#d4af37] text-[#0d0a0f] hover:bg-[#edd077] transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Store Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset store content to default demo catalogue?')) {
                      resetToDefaults();
                      showToast('Store reset to defaults');
                    }
                  }}
                  className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-rose-400 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
