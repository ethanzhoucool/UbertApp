/* eslint-env jest */
// Native-module mocks so components can render under Jest (no device).
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-worklets', () =>
  require('react-native-worklets/src/mock'),
);

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

// react-native-maps needs its native TurboModule; render plain Views instead.
jest.mock('react-native-maps', () => {
  const React = require('react');
  const {View} = require('react-native');
  const MapView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      fitToCoordinates: jest.fn(),
      animateToRegion: jest.fn(),
    }));
    return React.createElement(View, props, props.children);
  });
  const Marker = props => React.createElement(View, props, props.children);
  const Polyline = props => React.createElement(View, props);
  return {
    __esModule: true,
    default: MapView,
    Marker,
    Polyline,
    PROVIDER_DEFAULT: null,
    PROVIDER_GOOGLE: 'google',
  };
});
