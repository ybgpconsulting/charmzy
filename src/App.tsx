/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { HeroSection } from './components/home/HeroSection';
import { SaleUrgencySection } from './components/home/SaleUrgencySection';
import { ProductCatalogSection } from './components/home/ProductCatalogSection';
import { FeaturedProductsSection } from './components/home/FeaturedProductsSection';
import { HowToOrderSection } from './components/home/HowToOrderSection';
import { WishlistView } from './components/home/WishlistView';
import { Footer } from './components/common/Footer';
import { ProductDetailsModal } from './components/product/ProductDetailsModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { WhatsAppCheckoutModal } from './components/cart/WhatsAppCheckoutModal';
import { AdminRoute } from './components/admin/AdminRoute';
import { MobileBottomNav } from './components/pwa/MobileBottomNav';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { PWAInstallPrompt } from './components/pwa/PWAInstallPrompt';
import { CartPage, ProductPage, StoreInformationPage } from './components/pages/StorePages';
import { getPageSeo, getProductStructuredData } from './utils/seo';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    products,
    setSelectedCategory,
    setSearchQuery,
    selectedProductDetails,
    closeProductDetails,
  } = useStore();
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  let productSlug = '';
  if (path.startsWith('/products/')) {
    try {
      productSlug = decodeURIComponent(path.slice('/products/'.length));
    } catch {
      productSlug = '';
    }
  }
  const product = products.find((item) => item.slug === productSlug);

  React.useEffect(() => {
    if (path === '/shop') {
      setSelectedCategory(new URLSearchParams(window.location.search).get('category') || 'all');
      setSearchQuery(new URLSearchParams(window.location.search).get('search') || '');
    }

    const seo = getPageSeo(path, product);
    document.title = seo.title;
    document.querySelector<HTMLMetaElement>('[data-seo="description"]')?.setAttribute('content', seo.description);
    document.querySelector<HTMLMetaElement>('[data-seo="robots"]')?.setAttribute('content', seo.robots);
    const canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonicalTag) canonicalTag.href = seo.canonical;
    document.querySelector<HTMLMetaElement>('[data-seo="og-type"]')?.setAttribute('content', seo.type);
    document.querySelector<HTMLMetaElement>('[data-seo="og-url"]')?.setAttribute('content', seo.canonical);
    document.querySelector<HTMLMetaElement>('[data-seo="og-title"]')?.setAttribute('content', seo.title);
    document.querySelector<HTMLMetaElement>('[data-seo="og-description"]')?.setAttribute('content', seo.description);
    document.querySelector<HTMLMetaElement>('[data-seo="og-image"]')?.setAttribute('content', seo.image);
    document.querySelector<HTMLMetaElement>('[data-seo="og-image-alt"]')?.setAttribute('content', product?.title || 'CHARMZY JEWELLERY aesthetic earrings and jhumkas');
    document.querySelector<HTMLMetaElement>('[data-seo="twitter-title"]')?.setAttribute('content', seo.title);
    document.querySelector<HTMLMetaElement>('[data-seo="twitter-description"]')?.setAttribute('content', seo.description);
    document.querySelector<HTMLMetaElement>('[data-seo="twitter-image"]')?.setAttribute('content', seo.image);
    document.querySelector<HTMLMetaElement>('[data-seo="twitter-image-alt"]')?.setAttribute('content', product?.title || 'CHARMZY JEWELLERY aesthetic earrings and jhumkas');

    document.getElementById('product-jsonld')?.remove();
    if (product) {
      const structuredData = document.createElement('script');
      structuredData.id = 'product-jsonld';
      structuredData.type = 'application/ld+json';
      structuredData.textContent = JSON.stringify(getProductStructuredData(product));
      document.head.append(structuredData);
    }
  }, [path, product, setSelectedCategory, setSearchQuery]);

  const isInformationalPage = path !== '/' && !['/shop', '/offers', '/wishlist', '/cart'].includes(path) && !productSlug;

  return (
    <div className="min-h-screen flex flex-col text-[#3b1828] font-sans-body relative pb-16 md:pb-0">
      {/* Offline Status Indicator (PWA) */}
      <OfflineIndicator />
      <PWAInstallPrompt />

      {/* Header with Announcements */}
      <Header />

      {/* Main View Port */}
      <main className="flex-1">
        {productSlug ? (
          product ? <ProductPage product={product} /> : <StoreInformationPage path="/not-found" />
        ) : isInformationalPage ? (
          <StoreInformationPage path={path} />
        ) : path === '/cart' ? (
          <CartPage />
        ) : path === '/wishlist' || (path === '/' && activeTab === 'wishlist') ? (
          <WishlistView />
        ) : path === '/shop' ? (
          <ProductCatalogSection />
        ) : path === '/offers' ? (
          <SaleUrgencySection />
        ) : (
          <>
            <HeroSection />
            <FeaturedProductsSection />
            <HowToOrderSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile App Bottom Bar */}
      <MobileBottomNav />

      {/* Product Details & Specifications Modal */}
      <ProductDetailsModal
        product={selectedProductDetails}
        isOpen={!!selectedProductDetails}
        onClose={closeProductDetails}
      />

      {/* Sliding Cart Drawer with Offer Calculation */}
      <CartDrawer />

      {/* WhatsApp Checkout & Customer Details Modal */}
      <WhatsAppCheckoutModal />

    </div>
  );
};

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return (
    <StoreProvider>
      {path === '/admin' ? <AdminRoute /> : <MainLayout />}
    </StoreProvider>
  );
}
