export interface RideOption {
  id: string;
  name: string;
  description: string;
  eta: number;
  price: string;
  priceRange?: string;
  capacity: number;
  multiplier?: string;
  icon: string;
}

export const rideOptions: RideOption[] = [
  {
    id: 'uberx',
    name: 'UberX',
    description: 'Affordable, everyday rides',
    eta: 3,
    price: '$12.43',
    capacity: 4,
    icon: 'car',
  },
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'Newer cars with extra legroom',
    eta: 4,
    price: '$15.82',
    capacity: 4,
    icon: 'car-sport',
  },
  {
    id: 'uberxl',
    name: 'UberXL',
    description: 'Affordable rides for groups up to 6',
    eta: 5,
    price: '$18.24',
    capacity: 6,
    icon: 'car-estate',
  },
  {
    id: 'black',
    name: 'Black',
    description: 'Premium rides in luxury cars',
    eta: 6,
    price: '$32.10',
    capacity: 4,
    multiplier: '1.2x',
    icon: 'car-side',
  },
];
