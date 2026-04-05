export interface RideOption {
  id: string;
  name: string;
  description: string;
  eta: number;
  price: string;
  priceRange?: string;
  capacity: number;
  multiplier?: string;
  imageUrl: string;
}

export const rideOptions: RideOption[] = [
  {
    id: 'uberx',
    name: 'UberX',
    description: 'Affordable, everyday rides',
    eta: 3,
    price: '$12.43',
    capacity: 4,
    imageUrl:
      'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/UberX_v1.png',
  },
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'Newer cars with extra legroom',
    eta: 4,
    price: '$15.82',
    capacity: 4,
    imageUrl:
      'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/UberComfort_v1.png',
  },
  {
    id: 'uberxl',
    name: 'UberXL',
    description: 'Affordable rides for groups up to 6',
    eta: 5,
    price: '$18.24',
    capacity: 6,
    imageUrl:
      'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/UberXL_v1.png',
  },
  {
    id: 'black',
    name: 'Black',
    description: 'Premium rides in luxury cars',
    eta: 6,
    price: '$32.10',
    capacity: 4,
    multiplier: '1.2x',
    imageUrl:
      'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/Black_v1.png',
  },
];
