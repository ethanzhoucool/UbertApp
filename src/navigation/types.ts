import {Place} from '../data/mockPlaces';
import {RideOption} from '../data/mockRideOptions';
import {Driver} from '../data/mockDriver';
import {RentalCar} from '../data/mockCars';

export type PackageSize = 'envelope' | 'small' | 'medium' | 'large';

export interface PackageDraft {
  size: PackageSize;
  description: string;
  senderName?: string;
  senderPhone?: string;
  senderAddress?: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientAddress?: string;
}

export interface ReserveDraft {
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  rideOption?: RideOption;
}

export interface RentDraft {
  car: RentalCar;
  pickupDate: string;
  returnDate: string;
}

export type RootStackParamList = {
  Splash: undefined;
  Home: {toast?: string} | undefined;
  Search: undefined;
  RideSelection: {destination: Place};
  FindingDriver: {rideOption: RideOption};
  DriverMatched: {driver: Driver; rideOption: RideOption};
  TripInProgress: {driver: Driver};
  TripComplete: {driver: Driver; fare: string; duration: string};

  // Delivery
  DeliveryBrowse: undefined;
  RestaurantDetail: {restaurantId: string};
  DeliveryCart: undefined;
  DeliveryCheckout: undefined;
  DeliveryTracking: undefined;

  // Package
  PackageDetails: undefined;
  PackageSender: {draft: PackageDraft};
  PackageRecipient: {draft: PackageDraft};
  PackageConfirm: {draft: PackageDraft};

  // Reserve
  ReserveSchedule: undefined;
  ReserveRideType: {draft: ReserveDraft};
  ReserveConfirm: {draft: ReserveDraft};

  // Rent
  RentBrowseCars: undefined;
  RentDetails: {carId: string};
  RentConfirm: {draft: RentDraft};

  // Account
  EditProfile: undefined;
  Settings: undefined;
  NotificationsSettings: undefined;
  PrivacySettings: undefined;
  LanguageSettings: undefined;
  Help: undefined;
  HelpContact: undefined;
  Promotions: undefined;

  // Payment
  AddPaymentMethod: undefined;
  Wallet: undefined;

  // Delivery item detail
  RestaurantItemDetail: {restaurantId: string; itemId: string};

  // Package tracking
  PackageTracking: {draft: PackageDraft};

  // Generic coming-soon placeholder
  ComingSoon: {title: string; description: string; icon: string};

  // Shops
  ShopsBrowse: undefined;
  StoreDetail: {storeId: string};
  Aisles: {storeId: string};
  ProductDetail: {storeId: string; productId: string};
  ShopsCart: undefined;

  // Safety
  SafetyHub: undefined;
  RideCheck: undefined;
  TrustedContacts: undefined;
  PinVerification: undefined;
  ShareTripSafety: undefined;

  // Uber One
  UberOneLanding: undefined;
  UberOneBenefits: undefined;
  UberOnePayment: undefined;
  UberOneSuccess: undefined;

  // Saved places
  SavedPlaces: undefined;
  AddSavedPlace: undefined;
  EditSavedPlace: {placeId: string};

  // Activity (full-screen)
  ActivityScreen: undefined;
  TripDetail: {tripId: string};

  // Help AI chat
  HelpAiChat: undefined;

  // Airline picker
  AirlinePicker: undefined;

  // Trip receipt
  TripReceipt: {driver: Driver; fare: string; duration: string};

  // Privacy checkup
  PrivacyCheckup: undefined;
};
