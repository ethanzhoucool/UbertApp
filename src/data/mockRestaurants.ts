export type RestaurantBadge =
  | 'free-delivery'
  | 'top-eats'
  | 'bogo'
  | 'offers'
  | null;

// Unsplash helper — stable hotlink URL format with size & quality params.
const U = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=70`;

// Curated food photo IDs (Unsplash).
const IMG = {
  pizzaHero: '1513104890138-7c749659a591',
  sushiHero: '1579584425555-c3ce17fd4351',
  burgerHero: '1568901346375-23c9450c58cd',
  bowlHero: '1546069901-ba9599a7e63c',
  asianHero: '1569718212165-3a8278d5f624',
  tacosHero: '1565299585323-38d6b0865b47',
  saladHero: '1505253716362-afaea1d3d1af',
  dessertHero: '1499636136210-6f4ee915583e',
  // Menu items
  pizzaSlice: '1604382354936-07c5d9983bd3',
  sushiRoll: '1617196034796-73dfa7b1fd56',
  cheeseburger: '1568901346375-23c9450c58cd',
  fries: '1573080496219-bb080dd4f877',
  saladBowl: '1551248429-40975aa4de74',
  padThai: '1559314809-0d155014e29e',
  taco: '1565299624946-b28f40a0ae38',
  donut: '1551024506-0bccd828d307',
  pho: '1582878826629-29b7ad1cdc43',
  smoothieBowl: '1490474418585-ba9bad8fd0ea',
};

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  thumbColor?: string;
  imageUri?: string;
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  etaMinutes: number;
  etaMaxMinutes?: number;
  rating: number;
  ratingCount?: string;
  imageColor: string;
  heroColor?: string;
  heroUri?: string;
  deliveryFee: number;
  badge?: RestaurantBadge;
  badgeLabel?: string;
  topEats?: boolean;
  priceTier?: string;
  hours?: string;
  cuisineTags?: string;
  menu: MenuSection[];
}

export const cuisines = [
  {id: 'pizza', label: 'Pizza', icon: 'local-pizza'},
  {id: 'sushi', label: 'Sushi', icon: 'set-meal'},
  {id: 'burgers', label: 'Burgers', icon: 'lunch-dining'},
  {id: 'healthy', label: 'Healthy', icon: 'spa'},
  {id: 'asian', label: 'Asian', icon: 'ramen-dining'},
];

// Eats-style horizontal category strip (icon + label).
export const eatsCategories = [
  {id: 'offers', label: 'Offers', icon: 'local-offer', color: '#FDE68A'},
  {id: 'grocery', label: 'Grocery', icon: 'local-grocery-store', color: '#BBF7D0'},
  {id: 'convenience', label: 'Convenience', icon: 'storefront', color: '#FED7AA'},
  {id: 'alcohol', label: 'Alcohol', icon: 'local-bar', color: '#FECACA'},
  {id: 'fastest', label: 'Fastest', icon: 'bolt', color: '#FEF3C7'},
  {id: 'topeats', label: 'Top Eats', icon: 'star', color: '#DBEAFE'},
];

export const restaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Joe’s Pizza',
    cuisine: 'Pizza • Italian',
    cuisineTags: '$$ • Pizza • Italian',
    etaMinutes: 15,
    etaMaxMinutes: 25,
    rating: 4.7,
    ratingCount: '1,200+',
    imageColor: '#F2B441',
    heroColor: '#F2B441',
    heroUri: U(IMG.pizzaHero),
    deliveryFee: 0.99,
    badge: 'top-eats',
    badgeLabel: 'Top Eats',
    topEats: true,
    priceTier: '$$',
    hours: 'Open until 10:00 PM',
    menu: [
      {
        id: 'popular',
        title: 'Popular',
        items: [
          {id: 'p1', name: 'Classic Margherita', price: 14.5, description: 'Fresh mozzarella, basil, tomato sauce', thumbColor: '#F2B441', imageUri: U(IMG.pizzaHero, 400)},
          {id: 'p2', name: 'Pepperoni Slice', price: 4.5, description: 'House slice with spicy pepperoni', thumbColor: '#D97706', imageUri: U(IMG.pizzaSlice, 400)},
        ],
      },
      {
        id: 'mains',
        title: 'Mains',
        items: [
          {id: 'm1', name: 'Funghi Pizza', price: 16.0, description: 'Mushroom, truffle oil, mozzarella', thumbColor: '#92400E', imageUri: U(IMG.pizzaSlice, 400)},
          {id: 'm2', name: 'Quattro Formaggi', price: 17.5, description: 'Four-cheese white pizza', thumbColor: '#FDE68A', imageUri: U(IMG.pizzaHero, 400)},
        ],
      },
      {
        id: 'sides',
        title: 'Sides',
        items: [
          {id: 's1', name: 'Garlic Knots', price: 5.0, description: 'Six fresh-baked knots with garlic butter', thumbColor: '#FACC15', imageUri: U(IMG.fries, 400)},
          {id: 's2', name: 'Caesar Salad', price: 8.5, description: 'Romaine, parmesan, croutons', thumbColor: '#86EFAC', imageUri: U(IMG.saladBowl, 400)},
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        items: [
          {id: 'd1', name: 'San Pellegrino', price: 3.5, description: 'Sparkling mineral water', thumbColor: '#A7F3D0', imageUri: U(IMG.smoothieBowl, 400)},
          {id: 'd2', name: 'Italian Soda', price: 4.0, description: 'Choose blood orange or lemon', thumbColor: '#FCA5A5', imageUri: U(IMG.smoothieBowl, 400)},
        ],
      },
      {
        id: 'desserts',
        title: 'Desserts',
        items: [
          {id: 'ds1', name: 'Tiramisu', price: 6.5, description: 'Espresso-soaked ladyfingers, mascarpone', thumbColor: '#78350F', imageUri: U(IMG.dessertHero, 400)},
        ],
      },
    ],
  },
  {
    id: 'r2',
    name: 'Sakura Sushi',
    cuisine: 'Sushi • Japanese',
    cuisineTags: '$$$ • Sushi • Japanese',
    etaMinutes: 20,
    etaMaxMinutes: 30,
    rating: 4.8,
    ratingCount: '900+',
    imageColor: '#E94B6A',
    heroColor: '#E94B6A',
    heroUri: U(IMG.sushiHero),
    deliveryFee: 2.49,
    badge: 'free-delivery',
    badgeLabel: '$0 Delivery Fee',
    topEats: true,
    priceTier: '$$$',
    hours: 'Open until 11:00 PM',
    menu: [
      {
        id: 'popular',
        title: 'Popular',
        items: [
          {id: 'p1', name: 'Spicy Tuna Roll', price: 12.0, description: 'Tuna, sriracha, scallion', thumbColor: '#E94B6A', imageUri: U(IMG.sushiRoll, 400)},
          {id: 'p2', name: 'Salmon Nigiri (4 pc)', price: 11.0, description: 'Wild-caught Atlantic salmon', thumbColor: '#FB7185', imageUri: U(IMG.sushiHero, 400)},
        ],
      },
      {
        id: 'mains',
        title: 'Rolls',
        items: [
          {id: 'm1', name: 'Dragon Roll', price: 16.5, description: 'Eel, avocado, cucumber, eel sauce', thumbColor: '#16A34A', imageUri: U(IMG.sushiRoll, 400)},
          {id: 'm2', name: 'Rainbow Roll', price: 17.0, description: 'Assorted fresh fish over California roll', thumbColor: '#F472B6', imageUri: U(IMG.sushiHero, 400)},
        ],
      },
      {
        id: 'sides',
        title: 'Sides',
        items: [
          {id: 's1', name: 'Edamame', price: 5.5, description: 'Steamed soybeans with sea salt', thumbColor: '#65A30D', imageUri: U(IMG.bowlHero, 400)},
          {id: 's2', name: 'Miso Soup', price: 4.0, description: 'Traditional white miso', thumbColor: '#CA8A04', imageUri: U(IMG.pho, 400)},
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        items: [
          {id: 'd1', name: 'Green Tea', price: 3.0, description: 'Hot or iced', thumbColor: '#86EFAC', imageUri: U(IMG.smoothieBowl, 400)},
          {id: 'd2', name: 'Ramune', price: 4.5, description: 'Japanese marble soda', thumbColor: '#67E8F9', imageUri: U(IMG.smoothieBowl, 400)},
        ],
      },
      {
        id: 'desserts',
        title: 'Desserts',
        items: [
          {id: 'ds1', name: 'Mochi Trio', price: 6.0, description: 'Mango, matcha, red bean', thumbColor: '#FBCFE8', imageUri: U(IMG.dessertHero, 400)},
        ],
      },
    ],
  },
  {
    id: 'r3',
    name: 'Burger Lab',
    cuisine: 'Burgers • American',
    cuisineTags: '$$ • American • Burgers',
    etaMinutes: 15,
    etaMaxMinutes: 25,
    rating: 4.5,
    ratingCount: '500+',
    imageColor: '#8B5E3C',
    heroColor: '#8B5E3C',
    heroUri: U(IMG.burgerHero),
    deliveryFee: 1.49,
    badge: 'bogo',
    badgeLabel: 'Buy 1, Get 1 Free',
    topEats: false,
    priceTier: '$$',
    hours: 'Open until 12:00 AM',
    menu: [
      {
        id: 'popular',
        title: 'Popular',
        items: [
          {id: 'p1', name: 'Lab Classic', price: 11.0, description: 'Beef patty, lettuce, tomato, special sauce', thumbColor: '#8B5E3C', imageUri: U(IMG.cheeseburger, 400)},
          {id: 'p2', name: 'Double Smash', price: 13.5, description: 'Two patties, American cheese, pickles', thumbColor: '#A16207', imageUri: U(IMG.burgerHero, 400)},
        ],
      },
      {
        id: 'mains',
        title: 'Burgers',
        items: [
          {id: 'm1', name: 'Bacon Cheddar', price: 14.0, description: 'Thick-cut bacon, sharp cheddar', thumbColor: '#7C2D12', imageUri: U(IMG.cheeseburger, 400)},
          {id: 'm2', name: 'Spicy Habanero', price: 13.0, description: 'Pepperjack, habanero relish', thumbColor: '#DC2626', imageUri: U(IMG.burgerHero, 400)},
        ],
      },
      {
        id: 'sides',
        title: 'Sides',
        items: [
          {id: 's1', name: 'Crinkle Fries', price: 4.5, description: 'Crispy crinkle-cut potatoes', thumbColor: '#F59E0B', imageUri: U(IMG.fries, 400)},
          {id: 's2', name: 'Onion Rings', price: 5.5, description: 'Beer-battered', thumbColor: '#FBBF24', imageUri: U(IMG.fries, 400)},
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        items: [
          {id: 'd1', name: 'Chocolate Shake', price: 6.0, description: 'Hand-spun with vanilla ice cream', thumbColor: '#451A03', imageUri: U(IMG.smoothieBowl, 400)},
          {id: 'd2', name: 'Fountain Soda', price: 2.5, description: 'Free refills in-store', thumbColor: '#737373', imageUri: U(IMG.smoothieBowl, 400)},
        ],
      },
      {
        id: 'desserts',
        title: 'Desserts',
        items: [
          {id: 'ds1', name: 'Brownie Sundae', price: 7.0, description: 'Warm brownie, vanilla ice cream', thumbColor: '#1C1917', imageUri: U(IMG.dessertHero, 400)},
        ],
      },
    ],
  },
  {
    id: 'r4',
    name: 'Greenleaf',
    cuisine: 'Healthy • Salads',
    cuisineTags: '$$ • Healthy • Salads',
    etaMinutes: 10,
    etaMaxMinutes: 20,
    rating: 4.6,
    ratingCount: '750+',
    imageColor: '#5BAE6A',
    heroColor: '#5BAE6A',
    heroUri: U(IMG.bowlHero),
    deliveryFee: 1.99,
    badge: 'free-delivery',
    badgeLabel: '$0 Delivery Fee',
    topEats: false,
    priceTier: '$$',
    hours: 'Open until 9:00 PM',
    menu: [
      {
        id: 'popular',
        title: 'Popular',
        items: [
          {id: 'p1', name: 'Harvest Bowl', price: 12.5, description: 'Wild rice, roasted veggies, tahini', thumbColor: '#5BAE6A', imageUri: U(IMG.bowlHero, 400)},
          {id: 'p2', name: 'Kale Caesar', price: 11.0, description: 'Lacinato kale, parmesan, lemon', thumbColor: '#86EFAC', imageUri: U(IMG.saladBowl, 400)},
        ],
      },
      {
        id: 'mains',
        title: 'Bowls',
        items: [
          {id: 'm1', name: 'Poke Bowl', price: 14.5, description: 'Ahi tuna, edamame, avocado, rice', thumbColor: '#0E7490', imageUri: U(IMG.bowlHero, 400)},
          {id: 'm2', name: 'Buddha Bowl', price: 13.0, description: 'Quinoa, sweet potato, chickpeas', thumbColor: '#A16207', imageUri: U(IMG.saladBowl, 400)},
        ],
      },
      {
        id: 'sides',
        title: 'Sides',
        items: [
          {id: 's1', name: 'Avocado Toast', price: 7.0, description: 'Multigrain, lemon, chili flakes', thumbColor: '#84CC16', imageUri: U(IMG.saladHero, 400)},
          {id: 's2', name: 'Fruit Cup', price: 5.0, description: 'Seasonal fruit medley', thumbColor: '#F472B6', imageUri: U(IMG.smoothieBowl, 400)},
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        items: [
          {id: 'd1', name: 'Cold-Pressed Juice', price: 6.5, description: 'Green, ginger, or beet', thumbColor: '#22C55E', imageUri: U(IMG.smoothieBowl, 400)},
          {id: 'd2', name: 'Kombucha', price: 5.0, description: 'Rotating flavor', thumbColor: '#FDBA74', imageUri: U(IMG.smoothieBowl, 400)},
        ],
      },
      {
        id: 'desserts',
        title: 'Desserts',
        items: [
          {id: 'ds1', name: 'Chia Pudding', price: 5.5, description: 'Coconut milk, berries', thumbColor: '#EDE9FE', imageUri: U(IMG.dessertHero, 400)},
        ],
      },
    ],
  },
  {
    id: 'r5',
    name: 'Wok & Roll',
    cuisine: 'Asian • Chinese',
    cuisineTags: '$$ • Asian • Chinese',
    etaMinutes: 25,
    etaMaxMinutes: 35,
    rating: 4.4,
    ratingCount: '600+',
    imageColor: '#C0392B',
    heroColor: '#C0392B',
    heroUri: U(IMG.asianHero),
    deliveryFee: 1.99,
    badge: 'offers',
    badgeLabel: '20% off',
    topEats: false,
    priceTier: '$$',
    hours: 'Open until 10:30 PM',
    menu: [
      {
        id: 'popular',
        title: 'Popular',
        items: [
          {id: 'p1', name: 'General Tso’s Chicken', price: 13.5, description: 'Crispy chicken, sweet-spicy glaze', thumbColor: '#C0392B', imageUri: U(IMG.padThai, 400)},
          {id: 'p2', name: 'Beef Lo Mein', price: 12.5, description: 'Egg noodles, beef, mixed vegetables', thumbColor: '#92400E', imageUri: U(IMG.asianHero, 400)},
        ],
      },
      {
        id: 'mains',
        title: 'Mains',
        items: [
          {id: 'm1', name: 'Kung Pao Shrimp', price: 15.0, description: 'Peanuts, dried chilies, scallion', thumbColor: '#B91C1C', imageUri: U(IMG.padThai, 400)},
          {id: 'm2', name: 'Mapo Tofu', price: 11.5, description: 'Silken tofu, Sichuan peppercorn', thumbColor: '#7C2D12', imageUri: U(IMG.asianHero, 400)},
        ],
      },
      {
        id: 'sides',
        title: 'Sides',
        items: [
          {id: 's1', name: 'Pork Dumplings (6)', price: 7.0, description: 'Pan-fried, served with vinegar', thumbColor: '#FACC15', imageUri: U(IMG.pho, 400)},
          {id: 's2', name: 'Vegetable Spring Rolls', price: 5.5, description: 'Crispy, served with sweet chili', thumbColor: '#65A30D', imageUri: U(IMG.padThai, 400)},
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        items: [
          {id: 'd1', name: 'Bubble Tea', price: 5.5, description: 'Classic milk tea with tapioca', thumbColor: '#78350F', imageUri: U(IMG.smoothieBowl, 400)},
          {id: 'd2', name: 'Jasmine Tea', price: 2.5, description: 'Hot pot', thumbColor: '#FDE68A', imageUri: U(IMG.smoothieBowl, 400)},
        ],
      },
      {
        id: 'desserts',
        title: 'Desserts',
        items: [
          {id: 'ds1', name: 'Sesame Balls', price: 4.5, description: 'Fried glutinous rice, red bean', thumbColor: '#A16207', imageUri: U(IMG.donut, 400)},
        ],
      },
    ],
  },
  {
    id: 'r6',
    name: 'El Taco Loco',
    cuisine: 'Mexican • Tacos',
    cuisineTags: '$ • Mexican • Tacos',
    etaMinutes: 15,
    etaMaxMinutes: 25,
    rating: 4.6,
    ratingCount: '1,500+',
    imageColor: '#F25C05',
    heroColor: '#F25C05',
    heroUri: U(IMG.tacosHero),
    deliveryFee: 1.49,
    badge: 'top-eats',
    badgeLabel: 'Top Eats',
    topEats: true,
    priceTier: '$',
    hours: 'Open until 2:00 AM',
    menu: [
      {
        id: 'popular',
        title: 'Popular',
        items: [
          {id: 'p1', name: 'Carnitas Taco', price: 4.5, description: 'Slow-cooked pork, cilantro, onion', thumbColor: '#F25C05', imageUri: U(IMG.taco, 400)},
          {id: 'p2', name: 'Al Pastor Taco', price: 4.5, description: 'Marinated pork, pineapple', thumbColor: '#EA580C', imageUri: U(IMG.tacosHero, 400)},
        ],
      },
      {
        id: 'mains',
        title: 'Mains',
        items: [
          {id: 'm1', name: 'Burrito Bowl', price: 12.0, description: 'Choice of protein, rice, beans, salsa', thumbColor: '#A16207', imageUri: U(IMG.bowlHero, 400)},
          {id: 'm2', name: 'Quesadilla Suprema', price: 11.5, description: 'Cheese, chicken, peppers', thumbColor: '#FACC15', imageUri: U(IMG.taco, 400)},
        ],
      },
      {
        id: 'sides',
        title: 'Sides',
        items: [
          {id: 's1', name: 'Chips & Guac', price: 6.0, description: 'House-made guacamole', thumbColor: '#65A30D', imageUri: U(IMG.fries, 400)},
          {id: 's2', name: 'Elote', price: 5.5, description: 'Mexican street corn, cotija, lime', thumbColor: '#FBBF24', imageUri: U(IMG.tacosHero, 400)},
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        items: [
          {id: 'd1', name: 'Horchata', price: 4.0, description: 'Rice milk, cinnamon, vanilla', thumbColor: '#FAF0CA', imageUri: U(IMG.smoothieBowl, 400)},
          {id: 'd2', name: 'Jarritos', price: 3.5, description: 'Mexican fruit soda', thumbColor: '#F87171', imageUri: U(IMG.smoothieBowl, 400)},
        ],
      },
      {
        id: 'desserts',
        title: 'Desserts',
        items: [
          {id: 'ds1', name: 'Churros (3)', price: 5.0, description: 'Cinnamon sugar, chocolate dip', thumbColor: '#78350F', imageUri: U(IMG.donut, 400)},
        ],
      },
    ],
  },
  {
    id: 'r7',
    name: 'Bagel Boss',
    cuisine: 'Breakfast • Bagels',
    cuisineTags: '$ • Breakfast • Bagels',
    etaMinutes: 10,
    etaMaxMinutes: 20,
    rating: 4.5,
    ratingCount: '400+',
    imageColor: '#E8B978',
    heroColor: '#E8B978',
    heroUri: U(IMG.saladHero),
    deliveryFee: 0.99,
    badge: 'free-delivery',
    badgeLabel: '$0 Delivery Fee',
    topEats: false,
    priceTier: '$',
    hours: 'Open until 3:00 PM',
    menu: [
      {
        id: 'popular',
        title: 'Popular',
        items: [
          {id: 'p1', name: 'Bacon Egg & Cheese', price: 6.5, description: 'On an everything bagel', thumbColor: '#E8B978', imageUri: U(IMG.cheeseburger, 400)},
          {id: 'p2', name: 'Lox & Cream Cheese', price: 11.0, description: 'Smoked salmon, capers, red onion', thumbColor: '#FB7185', imageUri: U(IMG.sushiHero, 400)},
        ],
      },
      {
        id: 'mains',
        title: 'Sandwiches',
        items: [
          {id: 'm1', name: 'Avocado Toast Bagel', price: 8.0, description: 'Smashed avocado, chili flakes', thumbColor: '#84CC16', imageUri: U(IMG.saladHero, 400)},
          {id: 'm2', name: 'Turkey Club', price: 9.5, description: 'Turkey, bacon, lettuce, tomato', thumbColor: '#A16207', imageUri: U(IMG.cheeseburger, 400)},
        ],
      },
      {
        id: 'sides',
        title: 'Sides',
        items: [
          {id: 's1', name: 'Hash Brown', price: 3.5, description: 'Crispy potato patty', thumbColor: '#F59E0B', imageUri: U(IMG.fries, 400)},
          {id: 's2', name: 'Fruit Cup', price: 4.5, description: 'Fresh seasonal fruit', thumbColor: '#F472B6', imageUri: U(IMG.smoothieBowl, 400)},
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        items: [
          {id: 'd1', name: 'Drip Coffee', price: 2.5, description: 'House blend', thumbColor: '#451A03', imageUri: U(IMG.smoothieBowl, 400)},
          {id: 'd2', name: 'Iced Latte', price: 5.0, description: 'Double espresso, cold milk', thumbColor: '#A8A29E', imageUri: U(IMG.smoothieBowl, 400)},
        ],
      },
      {
        id: 'desserts',
        title: 'Desserts',
        items: [
          {id: 'ds1', name: 'Black & White Cookie', price: 3.5, description: 'Classic NY cookie', thumbColor: '#F5F5F4', imageUri: U(IMG.donut, 400)},
        ],
      },
    ],
  },
  {
    id: 'r8',
    name: 'Curry House',
    cuisine: 'Indian • Curries',
    cuisineTags: '$$ • Indian • Curries',
    etaMinutes: 25,
    etaMaxMinutes: 40,
    rating: 4.7,
    ratingCount: '950+',
    imageColor: '#D97706',
    heroColor: '#D97706',
    heroUri: U(IMG.dessertHero),
    deliveryFee: 2.49,
    badge: 'top-eats',
    badgeLabel: 'Top Eats',
    topEats: true,
    priceTier: '$$',
    hours: 'Open until 11:00 PM',
    menu: [
      {
        id: 'popular',
        title: 'Popular',
        items: [
          {id: 'p1', name: 'Chicken Tikka Masala', price: 15.5, description: 'Creamy tomato curry, basmati rice', thumbColor: '#D97706', imageUri: U(IMG.padThai, 400)},
          {id: 'p2', name: 'Garlic Naan', price: 3.5, description: 'Tandoor-baked flatbread', thumbColor: '#FDE68A', imageUri: U(IMG.pizzaSlice, 400)},
        ],
      },
      {
        id: 'mains',
        title: 'Mains',
        items: [
          {id: 'm1', name: 'Lamb Vindaloo', price: 16.5, description: 'Spicy curry from Goa', thumbColor: '#B91C1C', imageUri: U(IMG.padThai, 400)},
          {id: 'm2', name: 'Paneer Butter Masala', price: 14.0, description: 'Indian cheese in tomato gravy', thumbColor: '#EA580C', imageUri: U(IMG.padThai, 400)},
        ],
      },
      {
        id: 'sides',
        title: 'Sides',
        items: [
          {id: 's1', name: 'Samosa (2)', price: 5.5, description: 'Spiced potato, peas, mint chutney', thumbColor: '#FBBF24', imageUri: U(IMG.fries, 400)},
          {id: 's2', name: 'Raita', price: 3.5, description: 'Cucumber yogurt', thumbColor: '#F1F5F9', imageUri: U(IMG.smoothieBowl, 400)},
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        items: [
          {id: 'd1', name: 'Mango Lassi', price: 4.5, description: 'Yogurt drink with mango', thumbColor: '#FACC15', imageUri: U(IMG.smoothieBowl, 400)},
          {id: 'd2', name: 'Masala Chai', price: 3.0, description: 'Spiced black tea', thumbColor: '#92400E', imageUri: U(IMG.smoothieBowl, 400)},
        ],
      },
      {
        id: 'desserts',
        title: 'Desserts',
        items: [
          {id: 'ds1', name: 'Gulab Jamun', price: 4.5, description: 'Milk dumplings, rose syrup', thumbColor: '#7C2D12', imageUri: U(IMG.dessertHero, 400)},
        ],
      },
    ],
  },
];

export function findRestaurant(id: string): Restaurant | undefined {
  return restaurants.find(r => r.id === id);
}
