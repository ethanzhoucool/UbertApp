// Mock products for the Shops store-detail flow.

const U = (id: string, w = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=70`;

export interface Product {
  id: string;
  storeId: string;
  aisleId: string;
  name: string;
  unit: string;
  price: number;
  imageUrl: string;
}

export const products: Product[] = [
  // Popular / produce
  {
    id: 'p-bananas',
    storeId: 'wholefoods',
    aisleId: 'produce',
    name: 'Organic Bananas',
    unit: 'per lb',
    price: 0.69,
    imageUrl: U('1571771894821-ce9b6c11b08e'),
  },
  {
    id: 'p-avocado',
    storeId: 'wholefoods',
    aisleId: 'produce',
    name: 'Hass Avocado',
    unit: 'each',
    price: 1.99,
    imageUrl: U('1601039641847-7857b994d704'),
  },
  {
    id: 'p-strawberries',
    storeId: 'wholefoods',
    aisleId: 'produce',
    name: 'Strawberries',
    unit: '1 lb pack',
    price: 4.99,
    imageUrl: U('1518635017498-87f514b751ba'),
  },
  {
    id: 'p-bread',
    storeId: 'wholefoods',
    aisleId: 'bakery',
    name: 'Sourdough Loaf',
    unit: '24 oz',
    price: 5.49,
    imageUrl: U('1509440159596-0249088772ff'),
  },
  {
    id: 'p-croissant',
    storeId: 'wholefoods',
    aisleId: 'bakery',
    name: 'Butter Croissant',
    unit: 'each',
    price: 2.99,
    imageUrl: U('1555507036-ab1f4038808a'),
  },
  {
    id: 'p-milk',
    storeId: 'wholefoods',
    aisleId: 'dairy',
    name: 'Organic Whole Milk',
    unit: '1 gal',
    price: 6.49,
    imageUrl: U('1563636619-e9143da7973b'),
  },
  {
    id: 'p-eggs',
    storeId: 'wholefoods',
    aisleId: 'dairy',
    name: 'Free-Range Eggs',
    unit: 'dozen',
    price: 7.99,
    imageUrl: U('1582722872445-44dc5f7e3c8f'),
  },
  {
    id: 'p-yogurt',
    storeId: 'wholefoods',
    aisleId: 'dairy',
    name: 'Greek Yogurt',
    unit: '32 oz',
    price: 5.99,
    imageUrl: U('1488477181946-6428a0291777'),
  },
  {
    id: 'p-icecream',
    storeId: 'wholefoods',
    aisleId: 'frozen',
    name: "Ben & Jerry's Phish Food",
    unit: '16 oz',
    price: 5.99,
    imageUrl: U('1497034825429-c343d7c6a68f'),
  },
  {
    id: 'p-pizza',
    storeId: 'wholefoods',
    aisleId: 'frozen',
    name: 'Frozen Margherita Pizza',
    unit: '12 in',
    price: 7.49,
    imageUrl: U('1513104890138-7c749659a591'),
  },
  {
    id: 'p-chicken',
    storeId: 'wholefoods',
    aisleId: 'meat',
    name: 'Boneless Chicken Breast',
    unit: 'per lb',
    price: 8.99,
    imageUrl: U('1604503468506-a8da13d82791'),
  },
  {
    id: 'p-salmon',
    storeId: 'wholefoods',
    aisleId: 'meat',
    name: 'Atlantic Salmon Fillet',
    unit: 'per lb',
    price: 14.99,
    imageUrl: U('1574781330855-d0db8cc6a79c'),
  },
  {
    id: 'p-pasta',
    storeId: 'wholefoods',
    aisleId: 'pantry',
    name: 'Spaghetti Pasta',
    unit: '16 oz',
    price: 1.99,
    imageUrl: U('1551462147-37485acea307'),
  },
  {
    id: 'p-oil',
    storeId: 'wholefoods',
    aisleId: 'pantry',
    name: 'Extra Virgin Olive Oil',
    unit: '500 mL',
    price: 12.99,
    imageUrl: U('1474979266404-7eaacbcd87c5'),
  },
  {
    id: 'p-cola',
    storeId: 'wholefoods',
    aisleId: 'beverages',
    name: 'Coca-Cola',
    unit: '12 pack',
    price: 6.99,
    imageUrl: U('1554866585-cd94860890b7'),
  },
  {
    id: 'p-sparkling',
    storeId: 'wholefoods',
    aisleId: 'beverages',
    name: 'Sparkling Water',
    unit: '8 pack',
    price: 4.99,
    imageUrl: U('1564725075388-cc5d49a6ba0e'),
  },
  {
    id: 'p-chips',
    storeId: 'wholefoods',
    aisleId: 'snacks',
    name: 'Tortilla Chips',
    unit: '13 oz',
    price: 3.49,
    imageUrl: U('1613919113640-25732ec5e61f'),
  },
  {
    id: 'p-chocolate',
    storeId: 'wholefoods',
    aisleId: 'snacks',
    name: 'Dark Chocolate Bar',
    unit: '3.5 oz',
    price: 3.99,
    imageUrl: U('1511381939415-e44015466834'),
  },
];

export function productsForStore(storeId: string): Product[] {
  // For the demo every store shows the Whole Foods catalog.
  return products.map(p => ({...p, storeId}));
}

export function productsInAisle(storeId: string, aisleId: string): Product[] {
  if (aisleId === 'popular') {
    return productsForStore(storeId).slice(0, 8);
  }
  return productsForStore(storeId).filter(p => p.aisleId === aisleId);
}

export type ReplacementPreference = 'substitute' | 'contact' | 'refund';
