export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  avatarSeed: string;
  shareTrips: boolean;
}

export const seedTrustedContacts: TrustedContact[] = [
  {
    id: 'tc1',
    name: 'Maya Patel',
    phone: '+1 (415) 555-0182',
    avatarSeed: 'maya',
    shareTrips: true,
  },
  {
    id: 'tc2',
    name: 'James Liu',
    phone: '+1 (415) 555-0199',
    avatarSeed: 'james',
    shareTrips: false,
  },
  {
    id: 'tc3',
    name: 'Sofia Reyes',
    phone: '+1 (646) 555-0144',
    avatarSeed: 'sofia',
    shareTrips: true,
  },
];

export function avatarUrl(seed: string) {
  return `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}&backgroundColor=fcd34d&radius=50`;
}
