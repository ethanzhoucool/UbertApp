import {Place} from '../data/mockPlaces';
import {RideOption} from '../data/mockRideOptions';
import {Driver} from '../data/mockDriver';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Search: undefined;
  RideSelection: {destination: Place};
  FindingDriver: {rideOption: RideOption};
  DriverMatched: {driver: Driver; rideOption: RideOption};
  TripInProgress: {driver: Driver};
  TripComplete: {driver: Driver; fare: string; duration: string};
};
