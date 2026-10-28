import type { Product } from '../types';

export const SEO_ORIGIN = 'https://charmzy.in';

export interface PageSeo {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  image: string;
  type: 'website' | 'product';
}

const routeMetadata: Record<string, Pick<PageSeo, 'title' | 'description'>> = {
  '/': {
    title: 'Aesthetic Earrings & Jhumkas from ₹100 | CHARMZY',
    description: 'Shop aesthetic jhumkas, oxidised earrings, Korean-inspired bows and pearl styles from Charmzy Jewellery in Noida. Styles from ₹100, current offers and WhatsApp order inquiries across India.',
  },
  '/shop': {
    title: 'Shop Earrings & Jhumkas | CHARMZY JEWELLERY',
    description: 'Explore Charmzy Jewellery earrings, jhumkas, Korean-inspired bow drops, pearl styles and more. Browse the collection and check current offers.',
  },
  '/offers': {
    title: 'Jewellery Offers: Buy 2 Get 1 Free | CHARMZY',
    description: 'Explore current Charmzy Jewellery offers, including Buy 2 Get 1 Free and Buy 6 Get 4 Free on eligible pieces. Offer details are confirmed with your order inquiry.',
  },
  '/about': {
    title: 'About Charmzy Jewellery | Noida',
    description: 'Discover Charmzy Jewellery, a Noida-based curator of aesthetic jhumkis, everyday earrings, Korean-inspired styles and festive accessories.',
  },
  '/contact': {
    title: 'Contact Charmzy Jewellery | WhatsApp Support',
    description: 'Contact Charmzy Jewellery on WhatsApp for product questions, delivery estimates, order inquiries and customer support.',
  },
  '/shipping': {
    title: 'Shipping & Delivery Information | CHARMZY',
    description: 'Review Charmzy Jewellery dispatch locations, delivery estimates, courier charges and serviceability before placing an order inquiry.',
  },
  '/returns': {
    title: 'Returns, Exchanges & Refunds | CHARMZY',
    description: 'Read Charmzy Jewellery return, exchange and refund information, and contact the team to confirm eligibility before ordering.',
  },
  '/faq': {
    title: 'Jewellery Shopping FAQs | CHARMZY JEWELLERY',
    description: 'Find answers about Charmzy Jewellery products, current offers, WhatsApp order inquiries, delivery estimates and customer support.',
  },
  '/privacy': {
    title: 'Privacy Notice | CHARMZY JEWELLERY',
    description: 'Learn how Charmzy Jewellery storefront data is stored in your browser and how WhatsApp is used for order inquiries.',
  },
  '/terms': {
    title: 'Terms of Use | CHARMZY JEWELLERY',
    description: 'Read the terms for using the Charmzy Jewellery catalog, checking product availability and submitting WhatsApp order inquiries.',
  },
  '/cart': {
    title: 'Your Shopping Bag | CHARMZY JEWELLERY',
    description: 'Review your selected Charmzy Jewellery pieces and eligible offers before preparing an order inquiry.',
  },
  '/wishlist': {
    title: 'Saved Jewellery | CHARMZY JEWELLERY',
    description: 'View jewellery pieces saved in this browser and continue exploring the Charmzy collection.',
  },
};

const toAbsoluteUrl = (path: string) => new URL(path, SEO_ORIGIN).toString();

export function getPageSeo(path: string, product?: Product): PageSeo {
  if (product) {
    const conciseTitle = product.title.length > 46
      ? `${product.title.slice(0, 43).trimEnd()}…`
      : product.title;
    return {
      title: `${conciseTitle} | CHARMZY`,
      description: product.description.length > 160
        ? `${product.description.slice(0, 157).trimEnd()}…`
        : product.description,
      canonical: toAbsoluteUrl(`/products/${encodeURIComponent(product.slug)}`),
      robots: 'index, follow, max-image-preview:large',
      image: product.images[0]?.startsWith('http')
        ? product.images[0]
        : toAbsoluteUrl(product.images[0] || '/og-image.png'),
      type: 'product',
    };
  }

  const metadata = routeMetadata[path];
  const isPrivatePage = ['/cart', '/wishlist'].includes(path);
  return {
    title: metadata?.title || 'Page not found | CHARMZY JEWELLERY',
    description: metadata?.description || 'Explore aesthetic earrings and jhumkas from CHARMZY JEWELLERY.',
    canonical: toAbsoluteUrl(path === '/' ? '/' : path),
    robots: metadata && !isPrivatePage
      ? 'index, follow, max-image-preview:large'
      : 'noindex, nofollow',
    image: toAbsoluteUrl('/og-image.png'),
    type: 'website',
  };
}

export function getProductStructuredData(product: Product): Record<string, unknown> {
  const page = getPageSeo(`/products/${product.slug}`, product);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.map((image) => image.startsWith('http') ? image : toAbsoluteUrl(image)),
    sku: product.id,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'CHARMZY JEWELLERY',
    },
    offers: {
      '@type': 'Offer',
      url: page.canonical,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.inStock && product.stockCount > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}
