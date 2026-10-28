import { CartItem, OfferBreakdown } from '../types';
import { formatINR } from './offers';

export interface CustomerOrderDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export function generateWhatsAppOrderUrl({
  whatsappNumber,
  orderDetails,
  cartItems,
  offerBreakdown,
  subtotal,
}: {
  whatsappNumber: string; // e.g. "9718270270"
  orderDetails: CustomerOrderDetails;
  cartItems: CartItem[];
  offerBreakdown: OfferBreakdown;
  subtotal: number;
}): { orderId: string; url: string; rawText: string } {
  // Normalize phone number (strip spaces, dashes, ensure +91)
  const cleanPhone = whatsappNumber.replace(/\D/g, '');
  const destinationNumber = cleanPhone.startsWith('91') && cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone.replace(/^0+/, '')}`;

  const orderId = `CHZ-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const lines: string[] = [
    `✨ *NEW ORDER INQUIRY — CHARMZY.IN* ✨`,
    `Order Reference: #${orderId}`,
    `Date: ${dateStr}`,
    `───────────────`,
    `👤 *CUSTOMER DETAILS:*`,
    `• Name: ${orderDetails.name}`,
    `• Phone: ${orderDetails.phone}`,
    `• Address: ${orderDetails.address}`,
    `• City / State: ${orderDetails.city}, ${orderDetails.state}`,
    `• Pincode: ${orderDetails.pincode}`,
    orderDetails.notes ? `• Special Instructions: ${orderDetails.notes}` : '',
    `───────────────`,
    `🛍️ *ORDER ITEMS (${offerBreakdown.totalItemsCount} pcs):*`,
  ].filter(Boolean);

  const freeCounts = new Map<string, number>();
  offerBreakdown.itemsDiscounted.forEach((item) => {
    const key = `${item.productId}-${item.selectedFinish}`;
    freeCounts.set(key, (freeCounts.get(key) || 0) + 1);
  });

  cartItems.forEach((item, index) => {
    const freeQuantity = freeCounts.get(`${item.productId}-${item.selectedFinish}`) || 0;
    const paidQuantity = item.quantity - freeQuantity;
    const paidTotal = item.product.price * paidQuantity;
    lines.push(
      `${index + 1}. *${item.product.title}*`,
      `   • Finish: ${item.selectedFinish}`,
      `   • Qty: ${paidQuantity} paid × ${formatINR(item.product.price)} = ${formatINR(paidTotal)}${freeQuantity > 0 ? ` + ${freeQuantity} FREE` : ''}`
    );
  });

  lines.push(`───────────────`);

  // Offers & Summary
  if (offerBreakdown.freeItemsCount > 0) {
    const offerName = offerBreakdown.appliedOffer === 'B6G4' ? 'BUY 6 GET 4 FREE' : 'BUY 2 GET 1 FREE';
    lines.push(
      `🎁 *SPECIAL OFFER APPLIED:*`,
      `• Promotion: *${offerName}*`,
      `• Free Items: *${offerBreakdown.freeItemsCount} piece(s) FREE*`,
      `• Total Discount: *- ${formatINR(offerBreakdown.totalOfferSavings)}*`,
      `───────────────`
    );
  }

  lines.push(
    `💰 *PAYMENT & BILLING BREAKDOWN:*`,
    `• Items Subtotal: ${formatINR(subtotal)}`,
    `• Courier Shipping: To be calculated after confirming the delivery area and courier partner`,
    `• Items total after offers: ${formatINR(Math.max(0, subtotal - offerBreakdown.totalOfferSavings))} (shipping not included)`,
    `───────────────`,
    `📍 *Dispatched via Express Courier from Charmzy Atelier, Noida (UP)*`,
    `Please confirm availability, courier options, shipping charge, final total, estimated delivery date, and payment instructions. Thank you! 🙏`
  );

  const rawText = lines.filter((l) => l !== '').join('\n');
  const encodedText = encodeURIComponent(rawText);
  const url = `https://wa.me/${destinationNumber}?text=${encodedText}`;

  return {
    orderId,
    url,
    rawText,
  };
}
