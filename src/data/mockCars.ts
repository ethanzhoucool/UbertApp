export type RentalClassification =
  | 'Economy'
  | 'Compact'
  | 'Standard'
  | 'SUV'
  | 'Premium'
  | 'Luxury'
  | 'Van';

export interface RentalCar {
  id: string;
  make: string;
  model: string;
  hourlyRate: number;
  dailyRate: number;
  imageColor: string;
  transmission: 'Automatic' | 'Manual';
  seats: number;
  description: string;
  // New polish fields (backward-compatible additions)
  heroColor: string;
  partnerName: string;
  partnerColor: string;
  classification: RentalClassification;
  unlimitedMiles: boolean;
  totalPrice: number;
  bags: number;
  doors: number;
  year: number;
  // Real-photo polish fields
  photoUris: string[];
  partnerLogoUri: string;
}

const unsplash = (id: string): string =>
  `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop&q=70`;

// Maps a rental classification to a MaterialIcons vehicle glyph. Shared by the
// browse and details screens so every car shows a guaranteed-correct branded
// visual instead of a (possibly mismatched) remote photo.
export function vehicleGlyph(classification: RentalClassification): string {
  switch (classification) {
    case 'Van':
      return 'airport-shuttle';
    case 'Standard':
      return 'local-shipping';
    default:
      return 'directions-car';
  }
}

export const PARTNER_LOGOS: Record<string, string> = {
  Hertz:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Hertz_Car_Rental_logo.svg/200px-Hertz_Car_Rental_logo.svg.png',
  Avis:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Avis_logo_2012.svg/200px-Avis_logo_2012.svg.png',
  Budget:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Budget_logo_2018.svg/200px-Budget_logo_2018.svg.png',
  Sixt:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sixt_Logo.svg/200px-Sixt_Logo.svg.png',
  Thrifty:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Thrifty_Car_Rental_logo.svg/200px-Thrifty_Car_Rental_logo.svg.png',
};

export const rentalCars: RentalCar[] = [
  {
    id: 'c1',
    make: 'Toyota',
    model: 'Corolla',
    hourlyRate: 11,
    dailyRate: 48,
    imageColor: '#5B5B5B',
    transmission: 'Automatic',
    seats: 5,
    description: 'Compact sedan, great on gas',
    heroColor: '#D8DCE2',
    partnerName: 'Hertz',
    partnerColor: '#FFD400',
    classification: 'Economy',
    unlimitedMiles: true,
    totalPrice: 336,
    bags: 2,
    doors: 4,
    year: 2025,
    photoUris: [
      unsplash('1549399542-7e3f8b79c341'),
      unsplash('1503376780353-7e6692767b70'),
      unsplash('1492144534655-ae79c964c9d7'),
    ],
    partnerLogoUri: PARTNER_LOGOS.Hertz,
  },
  {
    id: 'c2',
    make: 'Honda',
    model: 'CR-V',
    hourlyRate: 14,
    dailyRate: 72,
    imageColor: '#274060',
    transmission: 'Automatic',
    seats: 5,
    description: 'Compact SUV with AWD',
    heroColor: '#BFC9D6',
    partnerName: 'Avis',
    partnerColor: '#D4002A',
    classification: 'SUV',
    unlimitedMiles: true,
    totalPrice: 504,
    bags: 3,
    doors: 5,
    year: 2025,
    photoUris: [
      unsplash('1552519507-da3b142c6e3d'),
      unsplash('1583121274602-3e2820c69888'),
      unsplash('1606220945770-b5b6c2c55bf1'),
    ],
    partnerLogoUri: PARTNER_LOGOS.Avis,
  },
  {
    id: 'c3',
    make: 'Tesla',
    model: 'Model 3',
    hourlyRate: 19,
    dailyRate: 119,
    imageColor: '#222831',
    transmission: 'Automatic',
    seats: 5,
    description: 'Electric sedan, Autopilot included',
    heroColor: '#1A1A1A',
    partnerName: 'Sixt',
    partnerColor: '#F26522',
    classification: 'Premium',
    unlimitedMiles: false,
    totalPrice: 833,
    bags: 2,
    doors: 4,
    year: 2024,
    photoUris: [
      unsplash('1560958089-b8a1929cea89'),
      unsplash('1593941707882-a5bba14938c7'),
      unsplash('1611016186353-9af58c69a533'),
    ],
    partnerLogoUri: PARTNER_LOGOS.Sixt,
  },
  {
    id: 'c4',
    make: 'Ford',
    model: 'F-150',
    hourlyRate: 18,
    dailyRate: 89,
    imageColor: '#1F2933',
    transmission: 'Automatic',
    seats: 5,
    description: 'Full-size pickup truck',
    heroColor: '#3C4858',
    partnerName: 'Budget',
    partnerColor: '#0033A0',
    classification: 'Standard',
    unlimitedMiles: true,
    totalPrice: 623,
    bags: 4,
    doors: 4,
    year: 2024,
    photoUris: [
      unsplash('1606664515524-ed2f786a0bd6'),
      unsplash('1485463611174-f302f6a5c1c9'),
      unsplash('1545503831-1f63ed2fc14a'),
    ],
    partnerLogoUri: PARTNER_LOGOS.Budget,
  },
  {
    id: 'c5',
    make: 'Chrysler',
    model: 'Pacifica',
    hourlyRate: 17,
    dailyRate: 95,
    imageColor: '#404E4D',
    transmission: 'Automatic',
    seats: 7,
    description: 'Minivan with sliding doors',
    heroColor: '#7A8A8A',
    partnerName: 'Thrifty',
    partnerColor: '#00744F',
    classification: 'Van',
    unlimitedMiles: true,
    totalPrice: 665,
    bags: 5,
    doors: 4,
    year: 2025,
    photoUris: [
      unsplash('1601362840469-51e4d8d58785'),
      unsplash('1583267746897-2cf66319ef97'),
      unsplash('1564473185935-58113cba1e80'),
    ],
    partnerLogoUri: PARTNER_LOGOS.Thrifty,
  },
  {
    id: 'c6',
    make: 'BMW',
    model: 'M2',
    hourlyRate: 32,
    dailyRate: 199,
    imageColor: '#3A3F47',
    transmission: 'Manual',
    seats: 4,
    description: 'Sport coupe, 6-speed manual',
    heroColor: '#0F1115',
    partnerName: 'Sixt',
    partnerColor: '#F26522',
    classification: 'Luxury',
    unlimitedMiles: false,
    totalPrice: 1393,
    bags: 2,
    doors: 2,
    year: 2025,
    photoUris: [
      unsplash('1503376780353-7e6692767b70'),
      unsplash('1556800572-1b8aedf82db5'),
      unsplash('1605559424843-9e4c228bf1c2'),
    ],
    partnerLogoUri: PARTNER_LOGOS.Sixt,
  },
  {
    id: 'c7',
    make: 'Nissan',
    model: 'Versa',
    hourlyRate: 9,
    dailyRate: 39,
    imageColor: '#6F7F8A',
    transmission: 'Automatic',
    seats: 5,
    description: 'Budget-friendly subcompact',
    heroColor: '#C4CCD3',
    partnerName: 'Hertz',
    partnerColor: '#FFD400',
    classification: 'Compact',
    unlimitedMiles: true,
    totalPrice: 273,
    bags: 2,
    doors: 4,
    year: 2024,
    photoUris: [
      unsplash('1494976388531-d1058494cdd8'),
      unsplash('1503376780353-7e6692767b70'),
      unsplash('1581540222194-0def2dda95b8'),
    ],
    partnerLogoUri: PARTNER_LOGOS.Hertz,
  },
];
