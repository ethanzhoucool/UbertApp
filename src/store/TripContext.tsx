import React, {createContext, useContext, useReducer, ReactNode} from 'react';
import {Place, currentLocation} from '../data/mockPlaces';
import {RideOption} from '../data/mockRideOptions';
import {Driver} from '../data/mockDriver';
import {PaymentMethod, defaultPaymentMethod} from '../data/mockPayments';
import {CompletedTrip, seededTripHistory} from '../data/mockTripHistory';

interface TripState {
  origin: Place;
  destination: Place | null;
  selectedRide: RideOption | null;
  driver: Driver | null;
  history: CompletedTrip[];
  paymentMethod: PaymentMethod;
  scheduledTime: Date | null;
}

type TripAction =
  | {type: 'SET_DESTINATION'; payload: Place}
  | {type: 'SET_RIDE'; payload: RideOption}
  | {type: 'SET_DRIVER'; payload: Driver}
  | {type: 'COMPLETE_TRIP'; payload: CompletedTrip}
  | {type: 'SET_PAYMENT'; payload: PaymentMethod}
  | {type: 'SET_SCHEDULE'; payload: Date | null}
  | {type: 'RESET'};

const initialState: TripState = {
  origin: currentLocation,
  destination: null,
  selectedRide: null,
  driver: null,
  history: seededTripHistory,
  paymentMethod: defaultPaymentMethod,
  scheduledTime: null,
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
    case 'RESET':
      // Preserve history, payment method, and schedule across resets
      return {
        ...initialState,
        history: state.history,
        paymentMethod: state.paymentMethod,
        scheduledTime: state.scheduledTime,
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
