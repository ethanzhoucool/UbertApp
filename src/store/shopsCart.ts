// Lightweight module-level shops cart store. Demo only — not persisted.
import {useEffect, useState} from 'react';
import {Product} from '../data/mockProducts';

export interface ShopsCartLine {
  product: Product;
  quantity: number;
  replacement: 'substitute' | 'contact' | 'refund';
}

type Listener = () => void;

let lines: ShopsCartLine[] = [];
let storeId: string | null = null;
const listeners: Set<Listener> = new Set();

function emit() {
  listeners.forEach(l => l());
}

export function getShopsCart() {
  return {lines, storeId};
}

export function addToShopsCart(
  product: Product,
  quantity: number,
  replacement: 'substitute' | 'contact' | 'refund' = 'substitute',
) {
  if (storeId && storeId !== product.storeId) {
    lines = [];
  }
  storeId = product.storeId;
  const existing = lines.find(l => l.product.id === product.id);
  if (existing) {
    lines = lines.map(l =>
      l.product.id === product.id
        ? {...l, quantity: l.quantity + quantity, replacement}
        : l,
    );
  } else {
    lines = [...lines, {product, quantity, replacement}];
  }
  emit();
}

export function updateLineQty(productId: string, delta: number) {
  lines = lines
    .map(l =>
      l.product.id === productId ? {...l, quantity: l.quantity + delta} : l,
    )
    .filter(l => l.quantity > 0);
  if (lines.length === 0) {
    storeId = null;
  }
  emit();
}

export function clearShopsCart() {
  lines = [];
  storeId = null;
  emit();
}

export function useShopsCart() {
  const [state, setState] = useState({lines, storeId});
  useEffect(() => {
    const listener = () => setState({lines, storeId});
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return state;
}

export function cartSubtotal(items: ShopsCartLine[]): number {
  return items.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
}
