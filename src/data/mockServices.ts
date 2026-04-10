export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string; // MaterialIcons name
  available: boolean;
}

export const services: Service[] = [
  {
    id: 'ride',
    name: 'Ride',
    description: 'Go anywhere, anytime',
    icon: 'directions-car',
    available: true,
  },
  {
    id: 'reserve',
    name: 'Reserve',
    description: 'Book up to 90 days ahead',
    icon: 'event-available',
    available: false,
  },
  {
    id: 'package',
    name: 'Package',
    description: 'Send a package across town',
    icon: 'inventory-2',
    available: false,
  },
  {
    id: 'rent',
    name: 'Rent',
    description: 'Car rentals by the hour or day',
    icon: 'vpn-key',
    available: false,
  },
  {
    id: 'shuttle',
    name: 'Shuttle',
    description: 'Shared rides to major venues',
    icon: 'airport-shuttle',
    available: false,
  },
  {
    id: 'teens',
    name: 'Teen',
    description: 'Rides for ages 13–17',
    icon: 'child-care',
    available: false,
  },
  {
    id: 'green',
    name: 'Green',
    description: 'Electric or hybrid cars only',
    icon: 'eco',
    available: false,
  },
  {
    id: 'pet',
    name: 'Pet',
    description: 'Travel with your furry friend',
    icon: 'pets',
    available: false,
  },
  {
    id: 'group',
    name: 'Group Ride',
    description: 'Save with a shared ride',
    icon: 'groups',
    available: false,
  },
];
