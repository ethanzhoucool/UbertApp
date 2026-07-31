import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {UbertButton} from '../../components/common/UbertButton';
import {RootStackParamList} from '../../navigation/types';
import {rentalCars, vehicleGlyph} from '../../data/mockCars';
import {useColors, ColorPalette, Colors} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'RentDetails'>;
  route: RouteProp<RootStackParamList, 'RentDetails'>;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const HERO_HEIGHT = 280;

export function RentDetailsScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const car = useMemo(
    () => rentalCars.find(c => c.id === route.params.carId),
    [route.params.carId],
  );
  const [policyOpen, setPolicyOpen] = useState(false);

  useEffect(() => {
    console.log('[Ubert] RentDetailsScreen mounted');
  }, []);

  if (!car) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Car details" onBack={() => navigation.goBack()} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Car not found.</Text>
        </View>
      </View>
    );
  }

  const handleNext = () => {
    navigation.navigate('RentConfirm', {
      draft: {
        car,
        pickupDate: 'Fri, May 22 · 10:00 AM',
        returnDate: 'Fri, May 29 · 10:00 AM',
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title="Car details"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}>
        {/* Hero — branded glyph (guaranteed-correct visual) */}
        <View style={[styles.heroPage, {backgroundColor: car.heroColor}]}>
          <Icon
            name={vehicleGlyph(car.classification)}
            size={120}
            color="rgba(255,255,255,0.92)"
          />
        </View>

        {/* Title + subtitle */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>
            {car.make} {car.model} or similar
          </Text>
          <Text style={styles.subtitle}>{car.classification}</Text>
        </View>

        {/* Partner row */}
        <TouchableOpacity activeOpacity={0.7} style={styles.partnerRow}>
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
          <Text style={styles.partnerText}>Provided by {car.partnerName}</Text>
          <Icon name="chevron-right" size={20} color={Colors.gray500} />
        </TouchableOpacity>

        {/* Badges */}
        <View style={styles.badgesRow}>
          {car.unlimitedMiles ? (
            <Badge
              icon="all-inclusive"
              label="Unlimited miles"
              color="#05944F"
              bg="#E6F4EA"
            />
          ) : null}
          <Badge
            icon="check-circle"
            label="Free cancellation"
            color="#0033A0"
            bg="#E8EEF9"
          />
        </View>

        {/* Specs grid */}
        <Text style={styles.sectionLabel}>About this car</Text>
        <View style={styles.grid}>
          <SpecCell icon="people" label={`${car.seats} seats`} />
          <SpecCell icon="work" label={`${car.bags} bags`} />
          <SpecCell icon="meeting-room" label={`${car.doors} doors`} />
          <SpecCell icon="settings" label={car.transmission} />
          <SpecCell icon="ac-unit" label="Air conditioning" />
          <SpecCell icon="event" label={`${car.year} model`} />
        </View>

        {/* Pickup location block */}
        <Text style={styles.sectionLabel}>Pick-up location</Text>
        <View style={styles.locCard}>
          <View style={styles.locTextBlock}>
            <Text style={styles.locName}>
              {car.partnerName} — SFO Rental Counter
            </Text>
            <Text style={styles.locAddress}>
              780 N McDonnell Rd, San Francisco, CA 94128
            </Text>
            <View style={styles.locHoursRow}>
              <Icon name="schedule" size={13} color={Colors.gray700} />
              <Text style={styles.locHours}>Open today · 5:00 AM – 12:00 AM</Text>
            </View>
          </View>
          <View style={styles.locMap}>
            {/* Fake static-map lines */}
            <View style={styles.locMapLineH1} />
            <View style={styles.locMapLineH2} />
            <View style={styles.locMapLineV1} />
            <View style={styles.locMapPin}>
              <Icon name="place" size={18} color={Colors.white} />
            </View>
          </View>
        </View>

        {/* Cancellation policy */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.policyHeader}
          onPress={() => setPolicyOpen(o => !o)}>
          <Text style={styles.policyTitle}>Cancellation policy</Text>
          <Icon
            name={policyOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={22}
            color={Colors.black}
          />
        </TouchableOpacity>
        {policyOpen ? (
          <View style={styles.policyBody}>
            <Text style={styles.policyText}>
              Free cancellation up to 24 hours before pick-up. Cancellations
              within 24 hours are subject to a one-day rental charge. No-shows
              are non-refundable.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky footer */}
      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerDaily}>${car.dailyRate} / day</Text>
          <Text style={styles.footerTotal}>${car.totalPrice} total</Text>
        </View>
        <View style={styles.footerCta}>
          <UbertButton title="Continue" onPress={handleNext} />
        </View>
      </View>
    </View>
  );
}

function pickPartnerTextColor(bg: string): string {
  // Light yellow (Hertz) needs dark text; everything else white.
  if (bg.toUpperCase() === '#FFD400') {
    return '#000000';
  }
  return '#FFFFFF';
}

function SpecCell({icon, label}: {icon: string; label: string}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.specCell}>
      <Icon name={icon} size={18} color={Colors.black} />
      <Text style={styles.specCellText}>{label}</Text>
    </View>
  );
}

function Badge({
  icon,
  label,
  color,
  bg,
}: {
  icon: string;
  label: string;
  color: string;
  bg: string;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={[styles.badge, {backgroundColor: bg, borderColor: color}]}>
      <Icon name={icon} size={14} color={color} />
      <Text style={[styles.badgeText, {color}]}>{label}</Text>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  heroPage: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#D8DCE2',
  },

  titleBlock: {paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4},
  title: {fontSize: 22, fontWeight: '800', color: Colors.black, letterSpacing: -0.3},
  subtitle: {fontSize: 14, color: Colors.gray700, marginTop: 4},

  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  partnerBadge: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerBadgeText: {fontSize: 13, fontWeight: '800', letterSpacing: 0.2},
  partnerText: {flex: 1, fontSize: 14, color: Colors.black, marginLeft: 4},

  badgesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  badgeText: {fontSize: 12, fontWeight: '700', marginLeft: 4},

  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
  },
  grid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specCell: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  specCellText: {fontSize: 14, color: Colors.black, marginLeft: 8},

  locCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  locTextBlock: {
    flex: 1,
    padding: 12,
  },
  locName: {fontSize: 14, fontWeight: '800', color: Colors.black},
  locAddress: {fontSize: 13, color: Colors.gray700, marginTop: 4},
  locHoursRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4},
  locHours: {fontSize: 12, color: Colors.gray700, marginLeft: 4},
  locMap: {
    width: 96,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  locMapLineH1: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '30%',
    height: 2,
    backgroundColor: '#CFD3DA',
  },
  locMapLineH2: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '22%',
    height: 1,
    backgroundColor: '#CFD3DA',
  },
  locMapLineV1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '55%',
    width: 2,
    backgroundColor: '#CFD3DA',
  },
  locMapPin: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  policyTitle: {fontSize: 15, fontWeight: '800', color: Colors.black},
  policyBody: {
    marginHorizontal: 16,
    paddingBottom: 12,
  },
  policyText: {fontSize: 13, color: Colors.gray700, lineHeight: 18},

  empty: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  emptyText: {fontSize: 14, color: Colors.gray500},

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: Colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  footerPrice: {flex: 1},
  footerDaily: {fontSize: 16, fontWeight: '800', color: Colors.black, letterSpacing: -0.2},
  footerTotal: {fontSize: 12, color: Colors.gray700, marginTop: 2},
  footerCta: {width: 160},
});
