import {
  initialState,
  tripReducer,
  TripAction,
  TripState,
} from '../src/store/TripContext';
import {restaurants} from '../src/data/mockRestaurants';
import {suggestedPlaces} from '../src/data/mockPlaces';
import {rideOptions} from '../src/data/mockRideOptions';
import {mockDriver} from '../src/data/mockDriver';
import {paymentMethods} from '../src/data/mockPayments';

const run = (actions: TripAction[], from: TripState = initialState) =>
  actions.reduce(tripReducer, from);

const [joes, other] = restaurants;
const [margherita, slice] = joes.menu[0].items;
const otherItem = other.menu[0].items[0];

const add = (restaurant = joes, item = margherita): TripAction => ({
  type: 'ADD_CART_ITEM',
  payload: {restaurant, item},
});

describe('ride state', () => {
  test('sets destination, ride and driver', () => {
    const state = run([
      {type: 'SET_DESTINATION', payload: suggestedPlaces[0]},
      {type: 'SET_RIDE', payload: rideOptions[1]},
      {type: 'SET_DRIVER', payload: mockDriver},
    ]);
    expect(state.destination).toBe(suggestedPlaces[0]);
    expect(state.selectedRide).toBe(rideOptions[1]);
    expect(state.driver).toBe(mockDriver);
  });

  test('COMPLETE_TRIP puts the newest trip first', () => {
    const trip = {
      ...initialState.history[0],
      id: 'trip-new',
    };
    const state = run([{type: 'COMPLETE_TRIP', payload: trip}]);
    expect(state.history).toHaveLength(initialState.history.length + 1);
    expect(state.history[0]).toBe(trip);
    expect(state.history.slice(1)).toEqual(initialState.history);
  });

  test('RESET clears the ride but keeps history, payment and schedule', () => {
    const when = new Date(2026, 0, 1, 8, 0);
    const newCard = {...paymentMethods[0], id: 'card-new', detail: '•••• 1111'};
    const trip = {...initialState.history[0], id: 'trip-new'};
    const state = run([
      {type: 'SET_DESTINATION', payload: suggestedPlaces[0]},
      {type: 'SET_RIDE', payload: rideOptions[1]},
      {type: 'SET_DRIVER', payload: mockDriver},
      {type: 'SET_PAYMENT', payload: paymentMethods[2]},
      {type: 'SET_SCHEDULE', payload: when},
      {type: 'ADD_PAYMENT', payload: newCard},
      {type: 'COMPLETE_TRIP', payload: trip},
      {type: 'RESET'},
    ]);
    expect(state.destination).toBeNull();
    expect(state.selectedRide).toBeNull();
    expect(state.driver).toBeNull();
    expect(state.origin).toBe(initialState.origin);
    expect(state.history[0]).toBe(trip);
    expect(state.paymentMethod).toBe(paymentMethods[2]);
    expect(state.scheduledTime).toBe(when);
    expect(state.savedPayments).toContain(newCard);
  });
});

describe('payments', () => {
  test('ADD_PAYMENT appends without changing the active method', () => {
    const card = {...paymentMethods[0], id: 'card-new'};
    const state = run([{type: 'ADD_PAYMENT', payload: card}]);
    expect(state.savedPayments).toEqual([...initialState.savedPayments, card]);
    expect(state.paymentMethod).toBe(initialState.paymentMethod);
  });
});

describe('delivery cart', () => {
  test('starts empty', () => {
    expect(initialState.cart).toEqual([]);
    expect(initialState.cartRestaurant).toBeNull();
  });

  test('adding an item sets the restaurant and a quantity of 1', () => {
    const state = run([add()]);
    expect(state.cartRestaurant).toBe(joes);
    expect(state.cart).toHaveLength(1);
    expect(state.cart[0]).toMatchObject({item: margherita, quantity: 1});
  });

  test('adding the same item again bumps its quantity', () => {
    const state = run([add(), add()]);
    expect(state.cart).toHaveLength(1);
    expect(state.cart[0].quantity).toBe(2);
  });

  test('different items from the same restaurant get their own lines', () => {
    const state = run([add(joes, margherita), add(joes, slice)]);
    expect(state.cart.map(l => l.item.id)).toEqual([margherita.id, slice.id]);
    expect(new Set(state.cart.map(l => l.id)).size).toBe(2);
  });

  test('adding from another restaurant starts a new cart there', () => {
    const state = run([add(joes, margherita), add(joes, slice), add(other, otherItem)]);
    expect(state.cartRestaurant).toBe(other);
    expect(state.cart).toHaveLength(1);
    expect(state.cart[0]).toMatchObject({item: otherItem, quantity: 1});
  });

  test('CHANGE_CART_QTY steps a line up and down', () => {
    const start = run([add()]);
    const lineId = start.cart[0].id;
    const up = run([{type: 'CHANGE_CART_QTY', payload: {lineId, delta: 2}}], start);
    expect(up.cart[0].quantity).toBe(3);
    const down = run([{type: 'CHANGE_CART_QTY', payload: {lineId, delta: -1}}], up);
    expect(down.cart[0].quantity).toBe(2);
  });

  test('stepping a line to zero removes it; an empty cart drops the restaurant', () => {
    const start = run([add(joes, margherita), add(joes, slice)]);
    const [first, second] = start.cart;

    const oneLeft = run(
      [{type: 'CHANGE_CART_QTY', payload: {lineId: first.id, delta: -1}}],
      start,
    );
    expect(oneLeft.cart.map(l => l.id)).toEqual([second.id]);
    expect(oneLeft.cartRestaurant).toBe(joes);

    const empty = run(
      [{type: 'CHANGE_CART_QTY', payload: {lineId: second.id, delta: -1}}],
      oneLeft,
    );
    expect(empty.cart).toEqual([]);
    expect(empty.cartRestaurant).toBeNull();
  });

  test('CLEAR_CART empties the cart and restaurant', () => {
    const state = run([add(), {type: 'CLEAR_CART'}]);
    expect(state.cart).toEqual([]);
    expect(state.cartRestaurant).toBeNull();
  });

  test('does not mutate the previous state', () => {
    const start = run([add()]);
    const snapshot = JSON.stringify(start);
    run([add(), add(joes, slice), {type: 'CLEAR_CART'}], start);
    expect(JSON.stringify(start)).toBe(snapshot);
  });
});
