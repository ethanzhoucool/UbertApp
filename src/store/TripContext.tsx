import React, {createContext, useContext, useReducer, ReactNode} from 'react';
import {Place, currentLocation} from '../data/mockPlaces';
import {RideOption} from '../data/mockRideOptions';
import {Driver} from '../data/mockDriver';

interface TripState {
  origin: Place;
  destination: Place | null;
  selectedRide: RideOption | null;
  driver: Driver | null;
}

type TripAction =
  | {type: 'SET_DESTINATION'; payload: Place}
  | {type: 'SET_RIDE'; payload: RideOption}
  | {type: 'SET_DRIVER'; payload: Driver}
  | {type: 'RESET'};

const initialState: TripState = {
  origin: currentLocation,
  destination: null,
  selectedRide: null,
  driver: null,
};

function tripReducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case 'SET_DESTINATION':
      return {...state, destination: action.payload};
    case 'SET_RIDE':
      return {...state, selectedRide: action.payload};
    case 'SET_DRIVER':
      return {...state, driver: action.payload};
    case 'RESET':
      return initialState;
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
