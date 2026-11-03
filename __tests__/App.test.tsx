/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// The splash screen and stack transitions schedule timers/animations;
// fake timers keep them from firing after the test environment is torn down.
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('renders the splash screen, then the home screen', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  expect(renderer!.root.findAllByProps({children: 'UBERT'}).length).toBeGreaterThan(0);

  // Splash holds for 2s, fades out, then replaces itself with Home.
  await ReactTestRenderer.act(() => {
    jest.advanceTimersByTime(3000);
  });
  expect(
    renderer!.root.findAllByProps({children: 'Where to?'}).length,
  ).toBeGreaterThan(0);
  await ReactTestRenderer.act(() => {
    renderer!.unmount();
  });
});
