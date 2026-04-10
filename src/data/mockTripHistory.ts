import {Place} from './mockPlaces';
import {Driver} from './mockDriver';
import {RideOption} from './mockRideOptions';

export interface CompletedTrip {
  id: string;
  destination: Place;
  driver: Driver;
  rideOption: RideOption;
  fare: string;
  duration: string;
  date: Date;
  rating: number;
  compliments: string[];
}

const oneDay = 24 * 60 * 60 * 1000;
const now = Date.now();

// Three seeded past trips so Activity isn't empty on first open
export const seededTripHistory: CompletedTrip[] = [
  {
    id: 'past-1',
    destination: {
      id: 'h1',
      name: 'JFK Airport - Terminal 4',
      address: 'Jamaica, NY 11430',
      latitude: 40.6413,
      longitude: -73.7781,
    },
    driver: {
      id: 'd-past-1',
      name: 'Maya',
      rating: 4.88,
      totalTrips: 1942,
      carMake: 'Tesla',
      carModel: 'Model 3',
      carColor: 'Black',
      licensePlate: 'K92-TRN',
      avatarUrl: 'https://i.pravatar.cc/150?img=47',
    },
    rideOption: {
      id: 'uberxl',
      name: 'UberXL',
      description: 'Affordable rides for groups up to 6',
      eta: 5,
      price: '$48.70',
      capacity: 6,
      imageUrl:
        'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/UberXL_v1.png',
    },
    fare: '$48.70',
    duration: '38 min',
    date: new Date(now - 2 * oneDay),
    rating: 5,
    compliments: ['Expert driving', 'Clean vehicle'],
  },
  {
    id: 'past-2',
    destination: {
      id: 'h2',
      name: 'Whole Foods Market',
      address: '10 Columbus Cir, New York, NY',
      latitude: 40.7685,
      longitude: -73.9826,
    },
    driver: {
      id: 'd-past-2',
      name: 'Darius',
      rating: 4.95,
      totalTrips: 3120,
      carMake: 'Honda',
      carModel: 'Accord',
      carColor: 'Silver',
      licensePlate: 'NY7-482',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
    rideOption: {
      id: 'uberx',
      name: 'UberX',
      description: 'Affordable, everyday rides',
      eta: 3,
      price: '$9.12',
      capacity: 4,
      imageUrl:
        'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/UberX_v1.png',
    },
    fare: '$9.12',
    duration: '11 min',
    date: new Date(now - 5 * oneDay),
    rating: 5,
    compliments: ['Good conversation'],
  },
  {
    id: 'past-3',
    destination: {
      id: 'h3',
      name: 'Madison Square Garden',
      address: '4 Pennsylvania Plaza, New York, NY',
      latitude: 40.7505,
      longitude: -73.9934,
    },
    driver: {
      id: 'd-past-3',
      name: 'Priya',
      rating: 4.91,
      totalTrips: 877,
      carMake: 'Toyota',
      carModel: 'Prius',
      carColor: 'White',
      licensePlate: 'G44-118',
      avatarUrl: 'https://i.pravatar.cc/150?img=31',
    },
    rideOption: {
      id: 'comfort',
      name: 'Comfort',
      description: 'Newer cars with extra legroom',
      eta: 4,
      price: '$16.44',
      capacity: 4,
      imageUrl:
        'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/Select_v1.png',
    },
    fare: '$16.44',
    duration: '18 min',
    date: new Date(now - 9 * oneDay),
    rating: 4,
    compliments: [],
  },
];

export function formatTripDate(date: Date): string {
  const diffDays = Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) {return 'Today';}
  if (diffDays === 1) {return 'Yesterday';}
  if (diffDays < 7) {return `${diffDays} days ago`;}
  return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
}
