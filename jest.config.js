module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  // Several React Native libraries ship untranspiled ESM/TS; let Babel handle them.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-.*)/)',
  ],
};
