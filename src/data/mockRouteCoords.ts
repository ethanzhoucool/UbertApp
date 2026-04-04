export interface Coordinate {
  latitude: number;
  longitude: number;
}

// Route from Empire State Building area to Times Square area
export const routeCoordinates: Coordinate[] = [
  {latitude: 40.7484, longitude: -73.9857},
  {latitude: 40.7489, longitude: -73.9862},
  {latitude: 40.7495, longitude: -73.9868},
  {latitude: 40.7502, longitude: -73.9874},
  {latitude: 40.7509, longitude: -73.988},
  {latitude: 40.7516, longitude: -73.9885},
  {latitude: 40.7523, longitude: -73.9878},
  {latitude: 40.753, longitude: -73.987},
  {latitude: 40.7537, longitude: -73.9862},
  {latitude: 40.7544, longitude: -73.9855},
  {latitude: 40.7551, longitude: -73.9853},
  {latitude: 40.7558, longitude: -73.9852},
  {latitude: 40.7565, longitude: -73.9851},
  {latitude: 40.7572, longitude: -73.985},
  {latitude: 40.758, longitude: -73.9855},
];

// Driver approach path (from a nearby location heading toward pickup)
export const driverApproachCoords: Coordinate[] = [
  {latitude: 40.7445, longitude: -73.991},
  {latitude: 40.7452, longitude: -73.9902},
  {latitude: 40.746, longitude: -73.9894},
  {latitude: 40.7468, longitude: -73.9885},
  {latitude: 40.7475, longitude: -73.9872},
  {latitude: 40.748, longitude: -73.9863},
  {latitude: 40.7484, longitude: -73.9857},
];
