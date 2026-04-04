export interface Place {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const currentLocation: Place = {
  id: 'current',
  name: 'Current Location',
  address: '350 5th Ave, New York, NY',
  latitude: 40.7484,
  longitude: -73.9857,
};

export const recentPlaces: Place[] = [
  {
    id: 'r1',
    name: 'Home',
    address: '123 W 72nd St, New York, NY',
    latitude: 40.7769,
    longitude: -73.9813,
  },
  {
    id: 'r2',
    name: 'Work',
    address: '1 World Trade Center, New York, NY',
    latitude: 40.7127,
    longitude: -74.0134,
  },
  {
    id: 'r3',
    name: "Joe's Coffee",
    address: '514 Columbus Ave, New York, NY',
    latitude: 40.7831,
    longitude: -73.9712,
  },
  {
    id: 'r4',
    name: 'Central Park',
    address: 'Central Park, New York, NY',
    latitude: 40.7829,
    longitude: -73.9654,
  },
  {
    id: 'r5',
    name: 'LaGuardia Airport',
    address: 'LaGuardia Airport, Queens, NY',
    latitude: 40.7769,
    longitude: -73.874,
  },
];

export const suggestedPlaces: Place[] = [
  {
    id: 's1',
    name: 'Times Square',
    address: 'Manhattan, NY 10036',
    latitude: 40.758,
    longitude: -73.9855,
  },
  {
    id: 's2',
    name: 'Grand Central Terminal',
    address: '89 E 42nd St, New York, NY',
    latitude: 40.7527,
    longitude: -73.9772,
  },
  {
    id: 's3',
    name: 'Brooklyn Bridge',
    address: 'Brooklyn Bridge, New York, NY',
    latitude: 40.7061,
    longitude: -73.9969,
  },
  {
    id: 's4',
    name: 'Penn Station',
    address: '234 W 31st St, New York, NY',
    latitude: 40.7506,
    longitude: -73.9935,
  },
  {
    id: 's5',
    name: 'Madison Square Garden',
    address: '4 Pennsylvania Plaza, New York, NY',
    latitude: 40.7505,
    longitude: -73.9934,
  },
  {
    id: 's6',
    name: 'Chelsea Market',
    address: '75 9th Ave, New York, NY',
    latitude: 40.7424,
    longitude: -74.0061,
  },
  {
    id: 's7',
    name: 'Union Square',
    address: 'Union Square, New York, NY',
    latitude: 40.7359,
    longitude: -73.9911,
  },
  {
    id: 's8',
    name: 'Flatiron Building',
    address: '175 5th Ave, New York, NY',
    latitude: 40.7411,
    longitude: -73.9897,
  },
];
