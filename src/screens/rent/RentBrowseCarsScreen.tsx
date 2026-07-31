import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {PressScale} from '../../components/common/PressScale';
import {RootStackParamList} from '../../navigation/types';
import {
  rentalCars,
  RentalCar,
  RentalClassification,
  vehicleGlyph,
} from '../../data/mockCars';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'RentBrowseCars'>;
};

type ChipValue = 'All' | RentalClassification;

const FILTER_CHIPS: ChipValue[] = [
  'All',
  'Economy',
  'Compact',
  'Standard',
  'SUV',
  'Premium',
  'Luxury',
  'Van',
];

export function RentBrowseCarsScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [activeChip, setActiveChip] = useState<ChipValue>('All');

  useEffect(() => {
    console.log('[Ubert] RentBrowseCarsScreen mounted');
  }, []);

  const filteredCars = useMemo(() => {
    if (activeChip === 'All') {
      return rentalCars;
    }
    return rentalCars.filter(c => c.classification === activeChip);
  }, [activeChip]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Rent a car" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 24}}
        showsVerticalScrollIndicator={false}>
        {/* Trip summary card */}
        <TouchableOpacity activeOpacity={0.85} style={styles.tripCard}>
          <View style={styles.tripHeaderRow}>
            <View style={styles.tripPin}>
              <Icon name="place" size={16} color={Colors.white} />
            </View>
            <View style={styles.tripLocBlock}>
              <Text style={styles.tripLocLabel}>Pickup location</Text>
              <Text style={styles.tripLocValue} numberOfLines={1}>
                SFO Rental Car Center
              </Text>
            </View>
            <Text style={styles.tripEdit}>Edit</Text>
          </View>
          <View style={styles.tripDivider} />
          <View style={styles.tripDtRow}>
            <View style={styles.tripDtCol}>
              <Text style={styles.tripDtLabel}>Pick-up</Text>
              <Text style={styles.tripDtValue}>Fri, May 22 · 10:00 AM</Text>
            </View>
            <View style={styles.tripDtSep} />
            <View style={styles.tripDtCol}>
              <Text style={styles.tripDtLabel}>Drop-off</Text>
              <Text style={styles.tripDtValue}>Fri, May 29 · 10:00 AM</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Filter chip rail */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRail}>
          {FILTER_CHIPS.map(chip => {
            const active = chip === activeChip;
            return (
              <TouchableOpacity
                key={chip}
                activeOpacity={0.8}
                onPress={() => setActiveChip(chip)}
                style={[styles.chip, active && styles.chipActive]}>
                <Text
                  style={[
                    styles.chipText,
                    active && styles.chipTextActive,
                  ]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sort + filters row */}
        <View style={styles.sortRow}>
          <TouchableOpacity activeOpacity={0.7} style={styles.sortLeft}>
            <Text style={styles.sortText}>Sort: Recommended</Text>
            <Icon name="keyboard-arrow-down" size={18} color={Colors.black} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.filtersBtn}>
            <Icon name="tune" size={16} color={Colors.black} />
            <Text style={styles.filtersText}>Filters</Text>
          </TouchableOpacity>
        </View>

        {filteredCars.map(car => (
          <CarCard
            key={car.id}
            car={car}
            onPress={() =>
              navigation.navigate('RentDetails', {carId: car.id})
            }
          />
        ))}

        {filteredCars.length === 0 ? (
          <Text style={styles.empty}>No cars in this class. Try another filter.</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

function CarCard({car, onPress}: {car: RentalCar; onPress: () => void}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <PressScale style={styles.card} onPress={onPress}>
      <View style={[styles.hero, {backgroundColor: car.heroColor}]}>
        <Icon
          name={vehicleGlyph(car.classification)}
          size={72}
          color="rgba(255,255,255,0.92)"
        />
        {car.unlimitedMiles ? (
          <View style={styles.milesBadge}>
            <Text style={styles.milesBadgeText}>Unlimited miles</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <View style={{flex: 1, paddingRight: 12}}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {car.make} {car.model} or similar
            </Text>
            <Text style={styles.cardClass}>{car.classification}</Text>
          </View>
          <View style={styles.priceCol}>
            <Text style={styles.priceMain}>${car.dailyRate}</Text>
            <Text style={styles.pricePer}>/ day</Text>
            <Text style={styles.priceTotal}>${car.totalPrice} total</Text>
          </View>
        </View>

        <View style={styles.specRow}>
          <View style={styles.specChunk}>
            <Icon name="person" size={14} color={Colors.gray700} />
            <Text style={styles.specChunkText}>{car.seats}</Text>
          </View>
          <Text style={styles.specDot}>·</Text>
          <View style={styles.specChunk}>
            <Icon name="luggage" size={14} color={Colors.gray700} />
            <Text style={styles.specChunkText}>{car.bags}</Text>
          </View>
          <Text style={styles.specDot}>·</Text>
          <View style={styles.specChunk}>
            <Icon name="meeting-room" size={14} color={Colors.gray700} />
            <Text style={styles.specChunkText}>{car.doors}</Text>
          </View>
          <Text style={styles.specDot}>·</Text>
          <View style={styles.specChunk}>
            <Icon name="settings" size={14} color={Colors.gray700} />
            <Text style={styles.specChunkText}>Auto</Text>
          </View>
          <Text style={styles.specDot}>·</Text>
          <View style={styles.specChunk}>
            <Icon name="ac-unit" size={14} color={Colors.gray700} />
            <Text style={styles.specChunkText}>A/C</Text>
          </View>
        </View>

        <View style={styles.partnerRow}>
          <View
            style={[
              styles.partnerBadge,
              {backgroundColor: car.partnerColor},
            ]}>
            <Text
              style={[
                styles.partnerBadgeText,
                {color: pickPartnerTextColor(car.partnerColor)},
              ]}>
              {car.partnerName}
            </Text>
          </View>
        </View>
      </View>
    </PressScale>
  );
}

function pickPartnerTextColor(bg: string): string {
  // Light yellow (Hertz) needs dark text; everything else white.
  if (bg.toUpperCase() === '#FFD400') {
    return '#000000';
  }
  return '#FFFFFF';
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},

  tripCard: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  tripHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripPin: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripLocBlock: {flex: 1, marginLeft: 10},
  tripLocLabel: {fontSize: 11, color: Colors.gray700},
  tripLocValue: {fontSize: 15, fontWeight: '700', color: Colors.black, marginTop: 1},
  tripEdit: {fontSize: 13, fontWeight: '700', color: Colors.black},
  tripDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#DDD',
    marginVertical: 10,
  },
  tripDtRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripDtCol: {flex: 1},
  tripDtSep: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: '#DDD',
    marginHorizontal: 10,
  },
  tripDtLabel: {fontSize: 11, color: Colors.gray700, fontWeight: '600'},
  tripDtValue: {fontSize: 13, fontWeight: '700', color: Colors.black, marginTop: 2},

  chipRail: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray300,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  chipText: {fontSize: 13, color: Colors.black, fontWeight: '600'},
  chipTextActive: {color: Colors.white},

  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  sortLeft: {flexDirection: 'row', alignItems: 'center'},
  sortText: {fontSize: 14, fontWeight: '700', color: Colors.black},
  filtersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray300,
    gap: 6,
  },
  filtersText: {fontSize: 13, fontWeight: '700', color: Colors.black, marginLeft: 4},

  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  hero: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#D8DCE2',
  },
  milesBadge: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#E6F4EA',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#05944F',
  },
  milesBadgeText: {fontSize: 11, fontWeight: '700', color: '#05944F'},
  cardBody: {paddingHorizontal: 14, paddingVertical: 12},
  cardTopRow: {flexDirection: 'row', alignItems: 'flex-start'},
  cardTitle: {fontSize: 16, fontWeight: '800', color: Colors.black, letterSpacing: -0.2},
  cardClass: {fontSize: 12, color: Colors.gray700, marginTop: 2},
  priceCol: {alignItems: 'flex-end'},
  priceMain: {fontSize: 22, fontWeight: '800', color: Colors.black, letterSpacing: -0.4},
  pricePer: {fontSize: 11, color: Colors.gray700, marginTop: -2},
  priceTotal: {fontSize: 12, color: Colors.gray700, marginTop: 3},
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  specChunk: {flexDirection: 'row', alignItems: 'center', gap: 4},
  specChunkText: {fontSize: 12, color: Colors.gray700, marginLeft: 4},
  specDot: {fontSize: 12, color: Colors.gray500, marginHorizontal: 6},
  partnerRow: {flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8},
  partnerBadge: {
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerBadgeText: {fontSize: 12, fontWeight: '800', letterSpacing: 0.2},

  empty: {
    textAlign: 'center',
    color: Colors.gray500,
    fontSize: 13,
    marginTop: 24,
  },
});
