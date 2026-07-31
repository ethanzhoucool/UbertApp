import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {UbertButton} from '../../components/common/UbertButton';
import {RootStackParamList} from '../../navigation/types';
import {rideOptions, RideOption} from '../../data/mockRideOptions';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ReserveRideType'>;
  route: RouteProp<RootStackParamList, 'ReserveRideType'>;
};

const GOLD = '#C8A24B';
const FIELD_FILL = '#F6F6F6';

// Real Unsplash car photos keyed by reserve tier id. We override the catalog's
// imageUrl per tier locally so the row thumbnails feel like real vehicles
// instead of stylized PNG glyphs.
export const RESERVE_CAR_PHOTOS: Record<string, string> = {
  uberx:
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=160&auto=format&fit=crop&q=70',
  comfort:
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=160&auto=format&fit=crop&q=70',
  uberxl:
    'https://images.unsplash.com/photo-1583267746897-2cf66319ef97?w=160&auto=format&fit=crop&q=70',
  premier:
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=160&auto=format&fit=crop&q=70',
  black:
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=160&auto=format&fit=crop&q=70',
  'black-suv':
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=160&auto=format&fit=crop&q=70',
};

// Augment the small base catalog with Reserve-only tiers (Premier, Black SUV).
// We avoid editing the shared mockRideOptions file.
const RESERVE_OPTIONS: RideOption[] = [
  {...rideOptions.find(o => o.id === 'uberx')!, imageUrl: RESERVE_CAR_PHOTOS.uberx},
  {...rideOptions.find(o => o.id === 'comfort')!, imageUrl: RESERVE_CAR_PHOTOS.comfort},
  {...rideOptions.find(o => o.id === 'uberxl')!, imageUrl: RESERVE_CAR_PHOTOS.uberxl},
  {
    id: 'premier',
    name: 'Premier',
    description: 'Highly rated drivers, newer cars',
    eta: 6,
    price: '$24.90',
    capacity: 4,
    imageUrl: RESERVE_CAR_PHOTOS.premier,
  },
  {...rideOptions.find(o => o.id === 'black')!, imageUrl: RESERVE_CAR_PHOTOS.black},
  {
    id: 'black-suv',
    name: 'Black SUV',
    description: 'Luxury SUVs for up to 6',
    eta: 8,
    price: '$58.40',
    capacity: 6,
    imageUrl: RESERVE_CAR_PHOTOS['black-suv'],
  },
];

const PREMIUM_IDS = new Set(['premier', 'black', 'black-suv']);

function earlyArrivalCopy(timeLabel: string, isPremium: boolean) {
  const lead = isPremium ? '10 min early' : '5 min early';
  return `Pickup at ${timeLabel} · Driver arrives ${lead}`;
}

export function ReserveRideTypeScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {draft} = route.params;
  const [selected, setSelected] = useState<RideOption>(RESERVE_OPTIONS[0]);

  useEffect(() => {
    console.log('[Ubert] ReserveRideTypeScreen mounted');
  }, []);

  const isSelectedPremium = useMemo(
    () => PREMIUM_IDS.has(selected.id),
    [selected.id],
  );

  const handleNext = () => {
    navigation.navigate('ReserveConfirm', {
      draft: {...draft, rideOption: selected},
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Choose a ride" onBack={() => navigation.goBack()} />

      {/* Map placeholder with pickup/dropoff pins + polyline */}
      <View style={styles.mapWrap}>
        <View style={styles.mapBg} />
        <View style={styles.mapGridA} />
        <View style={styles.mapGridB} />
        <View style={styles.mapPolyline} />
        <View style={[styles.mapPin, styles.mapPinPickup]}>
          <Icon name="place" size={22} color={Colors.success} />
        </View>
        <View style={[styles.mapPin, styles.mapPinDrop]}>
          <Icon name="place" size={22} color={Colors.error} />
        </View>
        <View style={styles.mapBadge}>
          <Icon name="event" size={14} color={Colors.black} />
          <Text style={styles.mapBadgeText}>
            {draft.date} {'·'} {draft.time}
          </Text>
        </View>
      </View>

      {/* Draggable-styled bottom sheet (static) */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Choose a ride</Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingBottom: insets.bottom + 130,
          }}
          showsVerticalScrollIndicator={false}>
          {/* Upfront fare callout */}
          <View style={styles.calloutPill}>
            <Icon name="local-offer" size={14} color={Colors.black} />
            <View style={{flex: 1, marginLeft: 8}}>
              <Text style={styles.calloutTitle}>Upfront fare guarantee</Text>
              <Text style={styles.calloutSub}>Locked-in price, no surge</Text>
            </View>
          </View>

          {RESERVE_OPTIONS.map(option => {
            const active = selected.id === option.id;
            const premium = PREMIUM_IDS.has(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.85}
                onPress={() => setSelected(option)}
                style={[
                  styles.row,
                  active && styles.rowActive,
                  premium && styles.rowPremium,
                  premium && active && styles.rowPremiumActive,
                ]}>
                <Image
                  source={{uri: option.imageUrl}}
                  style={styles.carImage}
                  resizeMode="cover"
                />
                <View style={styles.rowInfo}>
                  <View style={styles.nameLine}>
                    <Text style={styles.rowName}>{option.name}</Text>
                    {premium && (
                      <Icon
                        name="star"
                        size={12}
                        color={GOLD}
                        style={{marginLeft: 6}}
                      />
                    )}
                    <View style={styles.capacityBadge}>
                      <Icon name="person" size={12} color={Colors.gray700} />
                      <Text style={styles.capacityText}>{option.capacity}</Text>
                    </View>
                  </View>
                  <Text style={styles.rowSub} numberOfLines={1}>
                    {earlyArrivalCopy(draft.time, premium)}
                  </Text>
                  {premium && <View style={styles.goldUnderline} />}
                </View>
                <Text style={styles.rowPrice}>{option.price}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sticky CTA */}
      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <Text style={styles.feeDisclosure}>
          Includes a $4 reservation fee. Free cancellation up to 60 min before
          pickup.
        </Text>
        <UbertButton
          title={`Reserve ${selected.name}`}
          onPress={handleNext}
          style={
            isSelectedPremium
              ? {borderWidth: 1, borderColor: GOLD}
              : undefined
          }
        />
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},

  // Map placeholder
  mapWrap: {
    height: 240,
    backgroundColor: '#E6EBEE',
    overflow: 'hidden',
  },
  mapBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E6EBEE',
  },
  mapGridA: {
    position: 'absolute',
    left: -20,
    right: -20,
    top: 80,
    height: 2,
    backgroundColor: '#D6DCE0',
    transform: [{rotate: '-8deg'}],
  },
  mapGridB: {
    position: 'absolute',
    left: -20,
    right: -20,
    top: 160,
    height: 2,
    backgroundColor: '#D6DCE0',
    transform: [{rotate: '5deg'}],
  },
  mapPolyline: {
    position: 'absolute',
    left: 80,
    right: 80,
    top: 100,
    height: 4,
    backgroundColor: Colors.black,
    borderRadius: 2,
    transform: [{rotate: '12deg'}],
  },
  mapPin: {
    position: 'absolute',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinPickup: {left: 62, top: 82},
  mapPinDrop: {right: 62, top: 126},
  mapBadge: {
    position: 'absolute',
    top: 14,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  mapBadgeText: {fontSize: 12, fontWeight: '700', color: Colors.black},

  // Bottom sheet
  sheet: {
    flex: 1,
    marginTop: -16,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 6,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.handleColor,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
  sheetHeader: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.black,
    letterSpacing: -0.3,
  },

  // Callout pill
  calloutPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: FIELD_FILL,
  },
  calloutTitle: {fontSize: 13, fontWeight: '700', color: Colors.black},
  calloutSub: {fontSize: 12, color: Colors.gray700, marginTop: 1},

  // Ride row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  rowActive: {
    backgroundColor: FIELD_FILL,
    borderLeftWidth: 2,
    borderLeftColor: Colors.black,
    paddingLeft: 12,
  },
  rowPremium: {
    backgroundColor: '#FAFAFA',
  },
  rowPremiumActive: {
    backgroundColor: '#F2EFE7',
    borderLeftColor: Colors.black,
  },
  carImage: {
    width: 64,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#E6EBEE',
  },
  rowInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    marginRight: 8,
  },
  nameLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowName: {fontSize: 16, fontWeight: '700', color: Colors.black},
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  capacityText: {fontSize: 12, color: Colors.gray700, marginLeft: 2},
  rowSub: {
    fontSize: 12,
    color: Colors.gray700,
    marginTop: 2,
  },
  goldUnderline: {
    marginTop: 6,
    width: 28,
    height: 2,
    backgroundColor: GOLD,
    borderRadius: 1,
  },
  rowPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.black,
  },

  // Footer
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: Colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  feeDisclosure: {
    fontSize: 11,
    color: Colors.gray700,
    textAlign: 'center',
    marginBottom: 8,
  },
});
