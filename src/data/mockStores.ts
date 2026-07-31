// Mock data for the Shops vertical (grocery / convenience / pharmacy / alcohol).

export interface ShopCategory {
  id: string;
  label: string;
  icon: string; // MaterialIcons name
}

export interface Store {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  logoUrl: string;
  etaMinutes: number;
  deliveryFee: string;
  rating: number;
  tags: string[];
  // Optional brand styling — used by the polished store cards / badges.
  brand?: {
    initials: string; // e.g. "WF", "TJ", "7E"
    bg: string; // brand background hex
    fg: string; // brand foreground hex (text on bg)
  };
  // Optional minimum order copy used in StoreDetail header.
  minOrder?: string;
  // Optional category icon URL (real Unsplash imagery for chip thumbnails).
  categoryHero?: string;
}

// Unsplash hotlink helper.
const U = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=70`;

export interface ShopCategoryRich extends ShopCategory {
  imageUrl: string;
}

export const shopCategories: ShopCategoryRich[] = [
  {
    id: 'grocery',
    label: 'Grocery',
    icon: 'shopping-cart',
    imageUrl: U('1542838132-92c53300491e', 300),
  },
  {
    id: 'convenience',
    label: 'Convenience',
    icon: 'storefront',
    imageUrl: U('1601599561213-832382fd07ba', 300),
  },
  {
    id: 'alcohol',
    label: 'Alcohol',
    icon: 'liquor',
    imageUrl: U('1568213816046-0ee1c42bd559', 300),
  },
  {
    id: 'pets',
    label: 'Pets',
    icon: 'pets',
    imageUrl: U('1583337130417-3346a1be7dee', 300),
  },
  {
    id: 'home',
    label: 'Home & DIY',
    icon: 'handyman',
    imageUrl: U('1581235720704-06d3acfcb36f', 300),
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    icon: 'local-pharmacy',
    imageUrl: U('1583912267550-d6c2ac3196c0', 300),
  },
  {
    id: 'beauty',
    label: 'Beauty',
    icon: 'spa',
    imageUrl: U('1522336572468-97b06e8ef143', 300),
  },
];

export const stores: Store[] = [
  {
    id: 'wholefoods',
    name: 'Whole Foods Market',
    category: 'grocery',
    imageUrl: U('1542838132-92c53300491e'),
    logoUrl: U('1542838132-92c53300491e', 200),
    etaMinutes: 25,
    deliveryFee: '$2.99',
    rating: 4.8,
    tags: ['Organic', 'Produce'],
    brand: {initials: 'WF', bg: '#006B3F', fg: '#FFFFFF'},
    minOrder: '$15 minimum',
  },
  {
    id: 'walmart',
    name: 'Walmart',
    category: 'grocery',
    imageUrl: U('1534723452862-4c874018d66d'),
    logoUrl: U('1534723452862-4c874018d66d', 200),
    etaMinutes: 35,
    deliveryFee: '$3.99',
    rating: 4.6,
    tags: ['Everyday low', 'Groceries'],
    brand: {initials: 'W', bg: '#FFC220', fg: '#0071CE'},
    minOrder: '$10 minimum',
  },
  {
    id: 'costco',
    name: 'Costco Wholesale',
    category: 'grocery',
    imageUrl: U('1604719312566-8912e9227c6a'),
    logoUrl: U('1604719312566-8912e9227c6a', 200),
    etaMinutes: 40,
    deliveryFee: '$4.99',
    rating: 4.7,
    tags: ['Bulk', 'Members'],
    brand: {initials: 'CO', bg: '#E11900', fg: '#FFFFFF'},
    minOrder: '$35 minimum',
  },
  {
    id: 'traderjoes',
    name: "Trader Joe's",
    category: 'grocery',
    imageUrl: U('1488459716781-31db52582fe9'),
    logoUrl: U('1488459716781-31db52582fe9', 200),
    etaMinutes: 30,
    deliveryFee: '$3.49',
    rating: 4.7,
    tags: ['Snacks', 'Frozen'],
    brand: {initials: 'TJ', bg: '#B71C1C', fg: '#FFFFFF'},
    minOrder: '$15 minimum',
  },
  {
    id: '7eleven',
    name: '7-Eleven',
    category: 'convenience',
    imageUrl: U('1601599561213-832382fd07ba'),
    logoUrl: U('1601599561213-832382fd07ba', 200),
    etaMinutes: 12,
    deliveryFee: '$1.99',
    rating: 4.5,
    tags: ['Snacks', '24/7'],
    brand: {initials: '7E', bg: '#F26522', fg: '#FFFFFF'},
    minOrder: 'No minimum',
  },
  {
    id: 'cvs',
    name: 'CVS',
    category: 'convenience',
    imageUrl: U('1556742044-3c52d6e88c62'),
    logoUrl: U('1556742044-3c52d6e88c62', 200),
    etaMinutes: 15,
    deliveryFee: '$2.49',
    rating: 4.6,
    tags: ['Essentials', '24/7'],
    brand: {initials: 'CVS', bg: '#CC0000', fg: '#FFFFFF'},
    minOrder: '$10 minimum',
  },
  {
    id: 'walgreens',
    name: 'Walgreens',
    category: 'pharmacy',
    imageUrl: U('1583912267550-d6c2ac3196c0'),
    logoUrl: U('1583912267550-d6c2ac3196c0', 200),
    etaMinutes: 18,
    deliveryFee: '$2.49',
    rating: 4.6,
    tags: ['Pharmacy', 'Essentials'],
    brand: {initials: 'WG', bg: '#E1251B', fg: '#FFFFFF'},
    minOrder: '$10 minimum',
  },
  {
    id: 'totalwine',
    name: 'Total Wine & More',
    category: 'alcohol',
    imageUrl: U('1568213816046-0ee1c42bd559'),
    logoUrl: U('1568213816046-0ee1c42bd559', 200),
    etaMinutes: 22,
    deliveryFee: '$4.99',
    rating: 4.7,
    tags: ['Wine', 'Spirits'],
    brand: {initials: 'TW', bg: '#102A47', fg: '#FFFFFF'},
    minOrder: '$25 minimum',
  },
  {
    id: 'binny',
    name: "Binny's Beverage Depot",
    category: 'alcohol',
    imageUrl: U('1510812431401-41d2bd2722f3'),
    logoUrl: U('1510812431401-41d2bd2722f3', 200),
    etaMinutes: 28,
    deliveryFee: '$5.99',
    rating: 4.4,
    tags: ['Beer', 'Wine'],
    brand: {initials: 'BN', bg: '#1F1F1F', fg: '#FFD700'},
    minOrder: '$20 minimum',
  },
  {
    id: 'petco',
    name: 'Petco',
    category: 'pets',
    imageUrl: U('1583337130417-3346a1be7dee'),
    logoUrl: U('1583337130417-3346a1be7dee', 200),
    etaMinutes: 28,
    deliveryFee: '$3.99',
    rating: 4.5,
    tags: ['Pet food', 'Toys'],
    brand: {initials: 'PC', bg: '#0072CE', fg: '#FFFFFF'},
    minOrder: '$15 minimum',
  },
  {
    id: 'sephora',
    name: 'Sephora',
    category: 'beauty',
    imageUrl: U('1522336572468-97b06e8ef143'),
    logoUrl: U('1522336572468-97b06e8ef143', 200),
    etaMinutes: 32,
    deliveryFee: '$4.49',
    rating: 4.8,
    tags: ['Beauty', 'Skincare'],
    brand: {initials: 'SE', bg: '#000000', fg: '#FFFFFF'},
    minOrder: '$25 minimum',
  },
  {
    id: 'homedepot',
    name: 'The Home Depot',
    category: 'home',
    imageUrl: U('1581235720704-06d3acfcb36f'),
    logoUrl: U('1581235720704-06d3acfcb36f', 200),
    etaMinutes: 40,
    deliveryFee: '$5.99',
    rating: 4.5,
    tags: ['Tools', 'DIY'],
    brand: {initials: 'HD', bg: '#F96302', fg: '#FFFFFF'},
    minOrder: '$20 minimum',
  },
];

export interface Aisle {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
}

export const defaultAisles: Aisle[] = [
  {id: 'popular', name: 'Popular', icon: 'star', itemCount: 24},
  {id: 'produce', name: 'Produce', icon: 'eco', itemCount: 142},
  {id: 'bakery', name: 'Bakery', icon: 'bakery-dining', itemCount: 38},
  {id: 'dairy', name: 'Dairy & Eggs', icon: 'egg', itemCount: 56},
  {id: 'frozen', name: 'Frozen', icon: 'ac-unit', itemCount: 87},
  {id: 'meat', name: 'Meat & Seafood', icon: 'set-meal', itemCount: 64},
  {id: 'pantry', name: 'Pantry', icon: 'kitchen', itemCount: 211},
  {id: 'beverages', name: 'Beverages', icon: 'local-drink', itemCount: 96},
  {id: 'snacks', name: 'Snacks', icon: 'fastfood', itemCount: 128},
  {id: 'household', name: 'Household', icon: 'home', itemCount: 73},
];

export function getStoreById(id: string): Store | undefined {
  return stores.find(s => s.id === id);
}
