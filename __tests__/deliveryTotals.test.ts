import {findRestaurant} from '../src/data/mockRestaurants';
import type {CartLineItem} from '../src/store/TripContext';
import {
  DEFAULT_DELIVERY_TIP,
  deliveryTotals,
} from '../src/utils/deliveryTotals';

const joes = findRestaurant('r1')!;
const margherita = joes.menu[0].items.find(i => i.name === 'Classic Margherita')!;
const slice = joes.menu[0].items.find(i => i.name === 'Pepperoni Slice')!;

const line = (item: typeof margherita, quantity: number): CartLineItem => ({
  id: `${joes.id}-${item.id}`,
  item,
  quantity,
});

test('one Classic Margherita from Joe’s Pizza with the default tip', () => {
  const totals = deliveryTotals([line(margherita, 1)], joes.deliveryFee, DEFAULT_DELIVERY_TIP);
  expect(totals.subtotal).toBe(14.5);
  expect(totals.deliveryFee).toBe(0.99);
  expect(totals.serviceFee).toBe(2.49);
  expect(totals.tip).toBe(2);
  expect(totals.tax.toFixed(2)).toBe('1.27');
  expect(totals.total.toFixed(2)).toBe('21.25');
});

test('subtotal multiplies price by quantity across lines', () => {
  const totals = deliveryTotals(
    [line(margherita, 2), line(slice, 3)],
    joes.deliveryFee,
    DEFAULT_DELIVERY_TIP,
  );
  expect(totals.subtotal).toBeCloseTo(14.5 * 2 + 4.5 * 3, 10);
});

test.each([0, 1, 3, 5])('a $%i tip is reflected in the total', tip => {
  const base = deliveryTotals([line(margherita, 1)], joes.deliveryFee, 0);
  const withTip = deliveryTotals([line(margherita, 1)], joes.deliveryFee, tip);
  expect(withTip.tip).toBe(tip);
  expect(withTip.total - base.total).toBeCloseTo(tip, 10);
});

test('an empty cart only carries fees and tip', () => {
  const totals = deliveryTotals([], 0, DEFAULT_DELIVERY_TIP);
  expect(totals.subtotal).toBe(0);
  expect(totals.tax).toBe(0);
  expect(totals.total).toBeCloseTo(2.49 + 2, 10);
});
