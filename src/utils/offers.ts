import { CartItem, OfferBreakdown, SiteConfig } from '../types';

/**
 * Calculates discounts based on the store's exclusive promotions:
 * - Buy 2 Get 1 Free (Add 3 items -> lowest 1 is free)
 * - Buy 6 Get 4 Free (Add 10 items -> lowest 4 are free)
 * The system automatically selects the best combination that maximizes customer savings.
 */
export function calculateOffers(
  items: CartItem[],
  activeOffers?: Pick<SiteConfig['offers'], 'b2g1Active' | 'b6g4Active'>
): OfferBreakdown {
  // Flatten items into individual unit prices for accurate lowest-price discount calculation
  const units: { productId: string; selectedFinish: string; title: string; price: number }[] = [];

  items.forEach((item) => {
    if (!item.product.isOfferEligible) return;
    for (let i = 0; i < item.quantity; i++) {
      units.push({
        productId: item.productId,
        selectedFinish: item.selectedFinish,
        title: item.product.title,
        price: item.product.price,
      });
    }
  });

  const totalCount = units.length;
  const b2g1Active = activeOffers?.b2g1Active ?? true;
  const b6g4Active = activeOffers?.b6g4Active ?? true;

  if (totalCount === 0) {
    const itemsNeededForNextOffer = b2g1Active ? 3 : b6g4Active ? 10 : 0;
    return {
      appliedOffer: 'NONE',
      totalItemsCount: 0,
      freeItemsCount: 0,
      paidItemsCount: 0,
      itemsDiscounted: [],
      totalOfferSavings: 0,
      nextTierMessage: itemsNeededForNextOffer > 0
        ? `Add ${itemsNeededForNextOffer} eligible pieces to unlock an offer.`
        : 'Promotional offers are currently unavailable.',
      itemsNeededForNextOffer,
      progressPercent: 0,
    };
  }

  if (!b2g1Active && !b6g4Active) {
    return {
      appliedOffer: 'NONE',
      totalItemsCount: totalCount,
      freeItemsCount: 0,
      paidItemsCount: totalCount,
      itemsDiscounted: [],
      totalOfferSavings: 0,
      nextTierMessage: 'Promotional offers are currently unavailable.',
      itemsNeededForNextOffer: 0,
      progressPercent: 0,
    };
  }

  // Sort ascending by price so lowest priced items become the free ones
  units.sort((a, b) => a.price - b.price);

  const calculateFreeCount = (count: number) => {
    const b6g4Sets = b6g4Active ? Math.floor(count / 10) : 0;
    const remainderAfterB6G4 = b6g4Active ? count % 10 : count;
    const b2g1Sets = b2g1Active ? Math.floor(remainderAfterB6G4 / 3) : 0;
    return b6g4Sets * 4 + b2g1Sets;
  };
  const freeItemsCount = calculateFreeCount(totalCount);

  let appliedOffer: 'NONE' | 'B2G1' | 'B6G4' = 'NONE';
  const b6g4Sets = b6g4Active ? Math.floor(totalCount / 10) : 0;
  if (b6g4Sets > 0) {
    appliedOffer = 'B6G4';
  } else if (freeItemsCount > 0) {
    appliedOffer = 'B2G1';
  }

  // The lowest `freeItemsCount` items are free (100% discount)
  const freeUnits = units.slice(0, freeItemsCount);
  const totalOfferSavings = freeUnits.reduce((acc, u) => acc + u.price, 0);

  const itemsDiscounted = freeUnits.map((u) => ({
    productId: u.productId,
    selectedFinish: u.selectedFinish,
    title: u.title,
    originalPrice: u.price,
    discountAmount: u.price,
  }));

  // Progress message towards next offer tier
  let nextFreeAt = totalCount + 1;
  while (calculateFreeCount(nextFreeAt) <= freeItemsCount) nextFreeAt += 1;
  const itemsNeededForNextOffer = nextFreeAt - totalCount;
  const progressPercent = Math.min(100, Math.round((totalCount / nextFreeAt) * 100));
  const nextOfferName = b6g4Active && nextFreeAt % 10 === 0
    ? 'Buy 6 Get 4'
    : 'Buy 2 Get 1';
  const nextTierMessage = freeItemsCount > 0
    ? `${freeItemsCount} free item(s) unlocked. Add ${itemsNeededForNextOffer} eligible piece(s) to unlock another.`
    : `Add ${itemsNeededForNextOffer} eligible piece(s) to unlock ${nextOfferName} FREE items.`;

  return {
    appliedOffer,
    totalItemsCount: totalCount,
    freeItemsCount,
    paidItemsCount: totalCount - freeItemsCount,
    itemsDiscounted,
    totalOfferSavings,
    nextTierMessage,
    itemsNeededForNextOffer,
    progressPercent,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
