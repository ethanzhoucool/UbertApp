import React, {useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MapBackground} from '../../components/common/MapBackground';
import {RootStackParamList} from '../../navigation/types';
import {useTrip} from '../../store/TripContext';
import {formatTripDate} from '../../data/mockTripHistory';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TripDetail'>;
  route: RouteProp<RootStackParamList, 'TripDetail'>;
};

export function TripDetailScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {state} = useTrip();
  const trip = state.history.find(t => t.id === route.params.tripId);

  useEffect(() => {
    console.log('[Ubert] TripDetailScreen mounted', route.params.tripId);
  }, [route.params.tripId]);

  if (!trip) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerBar, {paddingTop: insets.top + 6}]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon name="arrow-back" size={22} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip</Text>
          <View style={{width: 36}} />
        </View>
        <Text style={{padding: 20, color: '#6B6B6B'}}>Trip not found.</Text>
      </View>
    );
  }

  // Reasonable fare breakdown derived from the total.
  const totalNumber = parseFloat(trip.fare.replace(/[^0-9.]/g, '')) || 0;
  const base = +(totalNumber * 0.45).toFixed(2);
  const distance = +(totalNumber * 0.32).toFixed(2);
  const time = +(totalNumber * 0.13).toFixed(2);
  const fees = +(totalNumber * 0.1).toFixed(2);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 24}}
        showsVerticalScrollIndicator={false}>
        {/* Full-bleed map thumbnail */}
        <View style={styles.mapWrap}>
          <MapBackground
            showPickup
            showDropoff
            showPolyline
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.mapBackBtn, {top: insets.top + 8}]}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon name="arrow-back" size={22} color={Colors.black} />
          </TouchableOpacity>
          <View style={[styles.mapTitleWrap, {top: insets.top + 14}]}>
            <Text style={styles.mapTitle}>Trip</Text>
          </View>
        </View>

        <View style={styles.heading}>
          <Text style={styles.date}>{formatTripDate(trip.date)}</Text>
          <Text style={styles.dest}>{trip.destination.name}</Text>
        </View>

        {/* Driver card */}
        <View style={styles.card}>
          <View style={styles.driverRow}>
            <Image
              source={{uri: trip.driver.avatarUrl}}
              style={styles.avatar}
            />
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.driverName}>{trip.driver.name}</Text>
              <Text style={styles.driverCar}>
                {trip.driver.carColor} {trip.driver.carModel} ·{' '}
                {trip.driver.licensePlate}
              </Text>
            </View>
            <View style={styles.ratingBadge}>
              <Icon name="star" size={13} color={Colors.starYellow} />
              <Text style={styles.ratingText}>
                {trip.driver.rating.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Pickup / dropoff card */}
        <View style={styles.card}>
          <View style={styles.routeRow}>
            <View style={[styles.dot, {backgroundColor: '#06C167'}]} />
            <View style={{flex: 1}}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeAddr}>{state.origin.address}</Text>
            </View>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <View style={[styles.dot, {backgroundColor: Colors.black}]} />
            <View style={{flex: 1}}>
              <Text style={styles.routeLabel}>Dropoff</Text>
              <Text style={styles.routeAddr}>{trip.destination.address}</Text>
            </View>
          </View>
        </View>

        {/* Fare breakdown */}
        <Text style={styles.sectionLabel}>FARE BREAKDOWN</Text>
        <View style={styles.card}>
          <Row label="Base fare" value={`$${base.toFixed(2)}`} />
          <Row label="Distance" value={`$${distance.toFixed(2)}`} />
          <Row label="Time" value={`$${time.toFixed(2)}`} />
          <Row label="Booking & fees" value={`$${fees.toFixed(2)}`} />
          <View style={styles.fareDivider} />
          <Row label="Total" value={trip.fare} bold />
        </View>

        {/* Help link */}
        <TouchableOpacity
          style={styles.helpRow}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Help')}>
          <Icon name="help-outline" size={22} color={Colors.black} />
          <Text style={styles.helpText}>Help with this trip</Text>
          <Icon name="chevron-right" size={20} color="#6B6B6B" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.rowLabel,
          bold && {fontWeight: '800', color: Colors.black, fontSize: 15},
        ]}>
        {label}
      </Text>
      <Text
        style={[
          styles.rowValue,
          bold && {fontSize: 18, fontWeight: '800'},
        ]}>
        {value}
      </Text>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    headerTitle: {flex: 1, fontSize: 17, fontWeight: '700', color: Colors.black, textAlign: 'center'},
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapWrap: {
      width: '100%',
      height: 220,
      backgroundColor: '#E8E9ED',
      overflow: 'hidden',
    },
    mapBackBtn: {
      position: 'absolute',
      left: 16,
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 3,
      shadowOffset: {width: 0, height: 1},
    },
    mapTitleWrap: {
      position: 'absolute',
      left: 64,
      right: 64,
      alignItems: 'center',
    },
    mapTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: Colors.black,
      backgroundColor: Colors.white,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      overflow: 'hidden',
    },
    heading: {paddingHorizontal: 16, paddingTop: 18},
    date: {fontSize: 13, color: '#6B6B6B', fontWeight: '600'},
    dest: {
      fontSize: 26,
      fontWeight: '800',
      color: Colors.black,
      marginTop: 4,
      letterSpacing: -0.4,
    },
    card: {
      marginHorizontal: 16,
      marginTop: 14,
      padding: 16,
      backgroundColor: '#F6F6F6',
      borderRadius: 14,
    },
    driverRow: {flexDirection: 'row', alignItems: 'center'},
    avatar: {width: 52, height: 52, borderRadius: 26, backgroundColor: '#E5E7EB'},
    driverName: {fontSize: 16, fontWeight: '700', color: Colors.black},
    driverCar: {fontSize: 13, color: '#6B6B6B', marginTop: 2},
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.white,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      gap: 4,
    },
    ratingText: {fontSize: 13, fontWeight: '700', color: Colors.black},
    routeRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 12},
    dot: {width: 10, height: 10, borderRadius: 5, marginTop: 4},
    routeLabel: {fontSize: 12, color: '#6B6B6B', fontWeight: '600'},
    routeAddr: {fontSize: 15, color: Colors.black, marginTop: 2},
    routeLine: {
      width: 2,
      height: 18,
      backgroundColor: '#C0C0C0',
      marginLeft: 4,
      marginVertical: 6,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginHorizontal: 16,
      marginTop: 22,
      marginBottom: 4,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    rowLabel: {fontSize: 14, color: '#444'},
    rowValue: {fontSize: 14, color: Colors.black, fontWeight: '600'},
    fareDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: '#D0D0D0',
      marginVertical: 6,
    },
    helpRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 18,
      paddingHorizontal: 14,
      paddingVertical: 14,
      backgroundColor: Colors.surfaceMuted,
      borderRadius: 12,
      gap: 12,
    },
    helpText: {flex: 1, fontSize: 15, fontWeight: '700', color: Colors.black},
  });
