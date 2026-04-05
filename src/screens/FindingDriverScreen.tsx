import React, {useEffect} from 'react';
import {View, StyleSheet, StatusBar, Text, Image} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UbertButton} from '../components/common/UbertButton';
import {PulsingDot} from '../components/common/PulsingDot';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {mockDriver} from '../data/mockDriver';
import {Colors} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'FindingDriver'>;
  route: RouteProp<RootStackParamList, 'FindingDriver'>;
};

export function FindingDriverScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
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

      <View style={styles.center}>
        {/* Animated ring */}
        <View style={styles.ring}>
          <View style={styles.ringInner}>
            <Image
              source={{uri: rideOption.imageUrl}}
              style={styles.carImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <Text style={styles.heading}>Finding your driver</Text>
        <Text style={styles.sub}>
          Looking for a nearby {rideOption.name} driver...
        </Text>

        <View style={styles.dots}>
          <PulsingDot delay={0} size={10} />
          <PulsingDot delay={150} size={10} />
          <PulsingDot delay={300} size={10} />
        </View>
      </View>

      <View style={[styles.bottom, {paddingBottom: insets.bottom + 16}]}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Ride type</Text>
            <Text style={styles.infoValue}>{rideOption.name}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Estimated fare</Text>
            <Text style={styles.infoValue}>{rideOption.price}</Text>
          </View>
        </View>
        <View style={{marginTop: 16}}>
          <UbertButton
            title="Cancel"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={{borderColor: 'rgba(255,255,255,0.3)'}}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  ringInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carImage: {
    width: 48,
    height: 32,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  sub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 6,
  },
  dots: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  bottom: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 3,
  },
  infoDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
