import type {CartLineItem} from '../store/TripContext';

export const DELIVERY_SERVICE_FEE = 2.49;
export const DELIVERY_TAX_RATE = 0.0875;
export const DEFAULT_DELIVERY_TIP = 2;
export const DELIVERY_TIP_OPTIONS = [1, 2, 3, 5];

export interface DeliveryTotals {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  tax: number;
  total: number;
}

/**
 * Order totals for the food-delivery cart. Shared by the cart and checkout
 * screens so the "Go to checkout" and "Place order" amounts always agree.
 */
export function deliveryTotals(
  cart: CartLineItem[],
  deliveryFee: number,
  tip: number,
): DeliveryTotals {
  const subtotal = cart.reduce(
    (sum, line) => sum + line.item.price * line.quantity,
    0,
  );
  const tax = subtotal * DELIVERY_TAX_RATE;
  const total = subtotal + deliveryFee + DELIVERY_SERVICE_FEE + tip + tax;
  return {
    subtotal,
    deliveryFee,
    serviceFee: DELIVERY_SERVICE_FEE,
    tip,
    tax,
    total,
  };
}
