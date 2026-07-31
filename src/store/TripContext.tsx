import React, {createContext, useContext, useReducer, ReactNode} from 'react';
import {Place, currentLocation} from '../data/mockPlaces';
import {RideOption} from '../data/mockRideOptions';
import {Driver} from '../data/mockDriver';
import {PaymentMethod, defaultPaymentMethod, paymentMethods as seedPayments} from '../data/mockPayments';
import {CompletedTrip, seededTripHistory} from '../data/mockTripHistory';
import {MenuItem, Restaurant} from '../data/mockRestaurants';

export interface CartLineItem {
  id: string;
  item: MenuItem;
  quantity: number;
}

interface TripState {
  origin: Place;
  destination: Place | null;
  selectedRide: RideOption | null;
  driver: Driver | null;
  history: CompletedTrip[];
  paymentMethod: PaymentMethod;
  scheduledTime: Date | null;
  // Delivery cart
  cartRestaurant: Restaurant | null;
  cart: CartLineItem[];
  // Payments
  savedPayments: PaymentMethod[];
}

type TripAction =
  | {type: 'SET_DESTINATION'; payload: Place}
  | {type: 'SET_RIDE'; payload: RideOption}
  | {type: 'SET_DRIVER'; payload: Driver}
  | {type: 'COMPLETE_TRIP'; payload: CompletedTrip}
  | {type: 'SET_PAYMENT'; payload: PaymentMethod}
  | {type: 'SET_SCHEDULE'; payload: Date | null}
  | {type: 'ADD_CART_ITEM'; payload: {restaurant: Restaurant; item: MenuItem}}
  | {type: 'CHANGE_CART_QTY'; payload: {lineId: string; delta: number}}
  | {type: 'CLEAR_CART'}
  | {type: 'ADD_PAYMENT'; payload: PaymentMethod}
  | {type: 'RESET'};

const initialState: TripState = {
  origin: currentLocation,
  destination: null,
  selectedRide: null,
  driver: null,
  history: seededTripHistory,
  paymentMethod: defaultPaymentMethod,
  scheduledTime: null,
  cartRestaurant: null,
  cart: [],
  savedPayments: seedPayments,
};

function tripReducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case 'SET_DESTINATION':
      return {...state, destination: action.payload};
    case 'SET_RIDE':
      return {...state, selectedRide: action.payload};
    case 'SET_DRIVER':
      return {...state, driver: action.payload};
    case 'COMPLETE_TRIP':
      return {...state, history: [action.payload, ...state.history]};
    case 'SET_PAYMENT':
      return {...state, paymentMethod: action.payload};
    case 'SET_SCHEDULE':
      return {...state, scheduledTime: action.payload};
    case 'ADD_CART_ITEM': {
      const {restaurant, item} = action.payload;
      const switchRestaurant =
        state.cartRestaurant && state.cartRestaurant.id !== restaurant.id;
      const baseCart = switchRestaurant ? [] : state.cart;
      const existing = baseCart.find(line => line.item.id === item.id);
      const cart = existing
        ? baseCart.map(line =>
            line.item.id === item.id
              ? {...line, quantity: line.quantity + 1}
              : line,
          )
        : [
            ...baseCart,
            {
              id: `${restaurant.id}-${item.id}-${Date.now()}`,
              item,
              quantity: 1,
            },
          ];
      return {...state, cartRestaurant: restaurant, cart};
    }
    case 'CHANGE_CART_QTY': {
      const cart = state.cart
        .map(line =>
          line.id === action.payload.lineId
            ? {...line, quantity: line.quantity + action.payload.delta}
            : line,
        )
        .filter(line => line.quantity > 0);
      return {
        ...state,
        cart,
        cartRestaurant: cart.length === 0 ? null : state.cartRestaurant,
      };
    }
    case 'CLEAR_CART':
      return {...state, cart: [], cartRestaurant: null};
    case 'ADD_PAYMENT':
      return {
        ...state,
        savedPayments: [...state.savedPayments, action.payload],
      };
    case 'RESET':
      // Preserve history, payment method, and schedule across resets
      return {
        ...initialState,
        history: state.history,
        paymentMethod: state.paymentMethod,
        scheduledTime: state.scheduledTime,
        savedPayments: state.savedPayments,
      };
    default:
      return state;
  }
}

const TripContext = createContext<{
  state: TripState;
  dispatch: React.Dispatch<TripAction>;
}>({state: initialState, dispatch: () => null});

export function TripProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(tripReducer, initialState);
  return (
    <TripContext.Provider value={{state, dispatch}}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  return useContext(TripContext);
}
