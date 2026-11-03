import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {products, Product} from '../src/data/mockProducts';
import {
  addToShopsCart,
  cartSubtotal,
  clearShopsCart,
  getShopsCart,
  updateLineQty,
  useShopsCart,
} from '../src/store/shopsCart';

const [bananas, avocado] = products;
const otherStoreProduct: Product = {...products[2], id: 'p-other', storeId: 'other-store'};

beforeEach(() => {
  clearShopsCart();
});

test('adding a product records its store and quantity', () => {
  addToShopsCart(bananas, 3);
  const {lines, storeId} = getShopsCart();
  expect(storeId).toBe(bananas.storeId);
  expect(lines).toEqual([{product: bananas, quantity: 3, replacement: 'substitute'}]);
});

test('adding the same product again adds to its quantity and updates the replacement', () => {
  addToShopsCart(bananas, 1);
  addToShopsCart(bananas, 2, 'refund');
  const {lines} = getShopsCart();
  expect(lines).toHaveLength(1);
  expect(lines[0]).toMatchObject({quantity: 3, replacement: 'refund'});
});

test('a product from a different store replaces the cart', () => {
  addToShopsCart(bananas, 1);
  addToShopsCart(avocado, 1);
  addToShopsCart(otherStoreProduct, 2);
  const {lines, storeId} = getShopsCart();
  expect(storeId).toBe('other-store');
  expect(lines.map(l => l.product.id)).toEqual(['p-other']);
});

test('updateLineQty removes lines that reach zero and clears the store when empty', () => {
  addToShopsCart(bananas, 1);
  addToShopsCart(avocado, 2);

  updateLineQty(avocado.id, -1);
  expect(getShopsCart().lines.map(l => [l.product.id, l.quantity])).toEqual([
    [bananas.id, 1],
    [avocado.id, 1],
  ]);

  updateLineQty(bananas.id, -1);
  expect(getShopsCart().lines.map(l => l.product.id)).toEqual([avocado.id]);
  expect(getShopsCart().storeId).toBe(avocado.storeId);

  updateLineQty(avocado.id, -1);
  expect(getShopsCart()).toEqual({lines: [], storeId: null});
});

test('cartSubtotal sums price times quantity', () => {
  addToShopsCart(bananas, 3);
  addToShopsCart(avocado, 2);
  expect(cartSubtotal(getShopsCart().lines)).toBeCloseTo(
    bananas.price * 3 + avocado.price * 2,
    10,
  );
  expect(cartSubtotal([])).toBe(0);
});

test('useShopsCart re-renders subscribers on every change and unsubscribes on unmount', async () => {
  const seen: number[] = [];
  function Probe() {
    const {lines} = useShopsCart();
    seen.push(lines.reduce((n, l) => n + l.quantity, 0));
    return null;
  }

  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<Probe />);
  });
  await ReactTestRenderer.act(() => addToShopsCart(bananas, 2));
  await ReactTestRenderer.act(() => updateLineQty(bananas.id, 1));
  await ReactTestRenderer.act(() => clearShopsCart());
  expect(seen[seen.length - 1]).toBe(0);
  expect(seen).toEqual(expect.arrayContaining([0, 2, 3]));

  await ReactTestRenderer.act(() => renderer!.unmount());
  const rendersAtUnmount = seen.length;
  await ReactTestRenderer.act(() => addToShopsCart(bananas, 1));
  expect(seen).toHaveLength(rendersAtUnmount);
});
