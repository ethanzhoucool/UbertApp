export interface Airline {
  id: string;
  name: string;
  iata: string;
  terminal: string;
  logoColor: string;
  // Optional real airline logo URL (Wikipedia commons) — used by polished
  // AirlinePickerScreen. Backwards-compatible (existing rows fall back to
  // IATA-on-color tile if undefined).
  logoUrl?: string;
}

export const airlines: Airline[] = [
  {
    id: 'aa',
    name: 'American Airlines',
    iata: 'AA',
    terminal: 'T8',
    logoColor: '#0078D2',
  },
  {
    id: 'dl',
    name: 'Delta Air Lines',
    iata: 'DL',
    terminal: 'T4',
    logoColor: '#E01933',
  },
  {
    id: 'ua',
    name: 'United Airlines',
    iata: 'UA',
    terminal: 'T7',
    logoColor: '#003B7A',
  },
  {
    id: 'b6',
    name: 'JetBlue Airways',
    iata: 'B6',
    terminal: 'T5',
    logoColor: '#003876',
  },
  {
    id: 'as',
    name: 'Alaska Airlines',
    iata: 'AS',
    terminal: 'T7',
    logoColor: '#01426A',
  },
  {
    id: 'wn',
    name: 'Southwest Airlines',
    iata: 'WN',
    terminal: 'T1',
    logoColor: '#304CB2',
  },
  {id: 'f9', name: 'Frontier Airlines', iata: 'F9', terminal: 'T1', logoColor: '#00A65A'},
  {id: 'nk', name: 'Spirit Airlines', iata: 'NK', terminal: 'T1', logoColor: '#FFEB00'},
  {id: 'ba', name: 'British Airways', iata: 'BA', terminal: 'T7', logoColor: '#075AAA'},
  {id: 'lh', name: 'Lufthansa', iata: 'LH', terminal: 'T1', logoColor: '#0E4F7E'},
];
