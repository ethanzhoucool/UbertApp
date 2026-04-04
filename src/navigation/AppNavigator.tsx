import React from 'react';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import {RootStackParamList} from './types';
import {SplashScreen} from '../screens/SplashScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {SearchScreen} from '../screens/SearchScreen';
import {RideSelectionScreen} from '../screens/RideSelectionScreen';
import {FindingDriverScreen} from '../screens/FindingDriverScreen';
import {DriverMatchedScreen} from '../screens/DriverMatchedScreen';
import {TripInProgressScreen} from '../screens/TripInProgressScreen';
import {TripCompleteScreen} from '../screens/TripCompleteScreen';

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen name="RideSelection" component={RideSelectionScreen} />
      <Stack.Screen
        name="FindingDriver"
        component={FindingDriverScreen}
        options={{
          gestureEnabled: false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <Stack.Screen
        name="DriverMatched"
        component={DriverMatchedScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="TripInProgress"
        component={TripInProgressScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="TripComplete"
        component={TripCompleteScreen}
        options={{gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
}
