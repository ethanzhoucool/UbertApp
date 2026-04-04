import React, {useEffect} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {UbertText} from '../components/common/UbertText';
import {UbertButton} from '../components/common/UbertButton';
import {PulsingDot} from '../components/common/PulsingDot';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {mockDriver} from '../data/mockDriver';
import {Colors, Spacing} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'FindingDriver'>;
  route: RouteProp<RootStackParamList, 'FindingDriver'>;
};

export function FindingDriverScreen({navigation, route}: Props) {
  const {dispatch} = useTrip();
  const {rideOption} = route.params;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({type: 'SET_DRIVER', payload: mockDriver});
      navigation.replace('DriverMatched', {
        driver: mockDriver,
        rideOption,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, dispatch, rideOption]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <UbertText variant="title" color={Colors.white} style={{marginBottom: 32}}>
          Finding your driver...
        </UbertText>

        <View style={styles.dotsRow}>
          <PulsingDot delay={0} size={12} />
          <PulsingDot delay={150} size={12} />
          <PulsingDot delay={300} size={12} />
        </View>

        <UbertText
          variant="hero"
          color={Colors.white}
          style={{marginTop: 48, opacity: 0.3}}>
          UBERT
        </UbertText>
      </View>

      <View style={styles.bottomCard}>
        <UbertText variant="caption" style={{marginBottom: Spacing.md}}>
          Looking for a nearby {rideOption.name} driver...
        </UbertText>
        <UbertButton
          title="Cancel"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bottomCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.xl,
    paddingBottom: 40,
    alignItems: 'center',
  },
});
