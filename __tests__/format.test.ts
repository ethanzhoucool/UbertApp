import {formatTime, getArrivalTime} from '../src/utils/formatTime';
import {formatCurrency} from '../src/utils/formatCurrency';

describe('formatTime', () => {
  test.each([
    [0, 5, '12:05 AM'],
    [9, 0, '9:00 AM'],
    [11, 59, '11:59 AM'],
    [12, 0, '12:00 PM'],
    [13, 7, '1:07 PM'],
    [23, 59, '11:59 PM'],
  ])('%i:%i -> %s', (h, m, expected) => {
    expect(formatTime(new Date(2026, 4, 21, h, m))).toBe(expected);
  });
});

describe('getArrivalTime', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test('adds minutes to now, rolling over the hour and AM/PM', () => {
    jest.useFakeTimers({now: new Date(2026, 4, 21, 11, 55)});
    expect(getArrivalTime(0)).toBe('11:55 AM');
    expect(getArrivalTime(8)).toBe('12:03 PM');
    expect(getArrivalTime(65)).toBe('1:00 PM');
  });
});

describe('formatCurrency', () => {
  test.each([
    [0, '$0.00'],
    [12.43, '$12.43'],
    [5, '$5.00'],
    [1234.5, '$1234.50'],
  ])('%p -> %s', (amount, expected) => {
    expect(formatCurrency(amount)).toBe(expected);
  });
});
