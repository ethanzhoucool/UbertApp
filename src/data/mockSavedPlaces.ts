export interface SavedPlace {
  id: string;
  label: string; // "Home", "Work", "Gym"
  address: string;
  icon: string; // MaterialIcons name
}

export const seedSavedPlaces: SavedPlace[] = [
  {
    id: 'sp-home',
    label: 'Home',
    address: '123 W 72nd St, New York, NY',
    icon: 'home',
  },
  {
    id: 'sp-work',
    label: 'Work',
    address: '1 World Trade Center, New York, NY',
    icon: 'work',
  },
];

export const placeIconOptions: {value: string; label: string}[] = [
  {value: 'home', label: 'Home'},
  {value: 'work', label: 'Work'},
  {value: 'fitness-center', label: 'Gym'},
  {value: 'school', label: 'School'},
  {value: 'favorite', label: 'Loved one'},
  {value: 'local-cafe', label: 'Cafe'},
  {value: 'place', label: 'Other'},
];
