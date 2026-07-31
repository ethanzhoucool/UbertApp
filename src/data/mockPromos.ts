export interface Promo {
  id: string;
  code: string;
  title: string;
  description: string;
  expires: string;
  discount: string;
}

export const promos: Promo[] = [
  {
    id: 'p1',
    code: 'WELCOME10',
    title: '$10 off your next ride',
    description: 'Save $10 on your next UberX ride. New users only.',
    expires: 'Expires May 31',
    discount: '$10 off',
  },
  {
    id: 'p2',
    code: 'EATS25',
    title: '25% off delivery',
    description: 'Take 25% off your next two delivery orders, up to $15.',
    expires: 'Expires Jun 15',
    discount: '25% off',
  },
  {
    id: 'p3',
    code: 'WEEKEND5',
    title: '$5 off weekend rides',
    description: 'Valid Sat and Sun, anytime.',
    expires: 'Expires Jun 30',
    discount: '$5 off',
  },
  {
    id: 'p4',
    code: 'FREESHIP',
    title: 'Free delivery fee',
    description: 'No delivery fees on orders over $20.',
    expires: 'Expires Jul 4',
    discount: 'Free delivery',
  },
  {
    id: 'p5',
    code: 'AIRPORT15',
    title: '15% off airport trips',
    description: 'Save 15% on rides to or from major airports.',
    expires: 'Expires Aug 1',
    discount: '15% off',
  },
];
