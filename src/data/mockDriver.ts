export interface Driver {
  id: string;
  name: string;
  rating: number;
  totalTrips: number;
  carMake: string;
  carModel: string;
  carColor: string;
  licensePlate: string;
  avatarUrl: string;
}

export const mockDriver: Driver = {
  id: 'd1',
  name: 'Kofi',
  rating: 4.92,
  totalTrips: 2847,
  carMake: 'Toyota',
  carModel: 'Camry',
  carColor: 'White',
  licensePlate: '8HVN-392',
  avatarUrl: 'https://i.pravatar.cc/150?img=68',
};
