import React, {useEffect, useMemo} from 'react';
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
import {UbertButton} from '../../components/common/UbertButton';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';
import {RESERVE_CAR_PHOTOS} from './ReserveRideTypeScreen';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ReserveConfirm'>;
  route: RouteProp<RootStackParamList, 'ReserveConfirm'>;
};

const GOLD = '#C8A24B';
const FIELD_FILL = '#F6F6F6';
const PREMIUM_IDS = new Set(['premier', 'black', 'black-suv']);

export function ReserveConfirmScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {draft} = route.params;

  useEffect(() => {
    console.log('[Ubert] ReserveConfirmScreen mounted');
  }, []);

  const ride = draft.rideOption;
  const isPremium = useMemo(
    () => (ride ? PREMIUM_IDS.has(ride.id) : false),
    [ride],
  );

  const fare = ride?.price ?? '$42.18';
  const rideName = ride?.name ?? 'UberX';
  const capacity = ride?.capacity ?? 4;
  const vehiclePhoto =
    (ride && RESERVE_CAR_PHOTOS[ride.id]) ?? RESERVE_CAR_PHOTOS.uberx;
  const waitCopy = isPremium
    ? 'Driver waits up to 15 minutes'
    : 'Driver waits up to 5 minutes';

  const dividerStyle = [
    styles.divider,
    isPremium && {backgroundColor: GOLD, opacity: 0.6},
  ];

  const handleConfirm = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home', params: {toast: 'Ride reserved'}}],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Custom header with X close on right */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <View style={{width: 36}} />
        <Text style={styles.headerTitle} numberOfLines={1}>
          Review and reserve
        </Text>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon name="close" size={22} color={Colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 130}}
        showsVerticalScrollIndicator={false}>
        {/* Trip card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircle}>
              <Icon name="event" size={20} color={Colors.black} />
            </View>
            <Text style={styles.cardHeaderText}>
              {draft.date} · {draft.time}
            </Text>
          </View>

          <View style={dividerStyle} />

          {/* Pickup / dropoff with connector */}
          <View style={styles.tripRoute}>
            <View style={styles.connectorCol}>
              <View style={styles.greenDot} />
              <View style={styles.connectorLine} />
              <View style={styles.redSquare} />
            </View>
            <View style={{flex: 1}}>
              <View style={styles.routeSlot}>
                <Text style={styles.routeLabel}>Pickup</Text>
                <Text style={styles.routeValue} numberOfLines={1}>
                  {draft.pickup}
                </Text>
              </View>
              <View style={[styles.routeSlot, {marginTop: 14}]}>
                <Text style={styles.routeLabel}>Dropoff</Text>
                <Text style={styles.routeValue} numberOfLines={1}>
                  {draft.dropoff}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Vehicle card */}
        <View style={styles.card}>
          <View style={styles.vehicleRow}>
            <Image
              source={{uri: vehiclePhoto}}
              style={[
                styles.vehicleThumb,
                isPremium && {borderColor: GOLD, borderWidth: 1},
              ]}
              resizeMode="cover"
            />
            <View style={{flex: 1, marginLeft: 14}}>
              <Text style={styles.vehicleName}>{rideName}</Text>
              <View style={styles.capacityRow}>
                <Icon name="person" size={14} color={Colors.gray700} />
                <Text style={styles.capacityText}>{capacity}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Fare card */}
        <View style={styles.card}>
          <View style={styles.fareRow}>
            <View style={{flex: 1}}>
              <Text style={styles.fareLabel}>Upfront price</Text>
              <Text style={styles.fareValue}>{fare}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.fareLink}>See breakdown</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wait time callout */}
        <View
          style={[
            styles.callout,
            isPremium && {borderColor: GOLD, borderWidth: 1},
          ]}>
          <Icon name="schedule" size={18} color={Colors.black} />
          <Text style={styles.calloutText}>{waitCopy}</Text>
        </View>

        {/* Cancellation policy */}
        <View style={styles.infoRow}>
          <Icon
            name="info-outline"
            size={18}
            color={Colors.gray700}
            style={{marginTop: 1}}
          />
          <Text style={styles.infoText}>
            Free cancellation up to 60 minutes before pickup.{' '}
            <Text style={styles.infoLink}>See terms.</Text>
          </Text>
        </View>

        {/* Payment + Promo rows */}
        <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
          <Icon name="credit-card" size={20} color={Colors.black} />
          <Text style={styles.optionLabel}>Visa</Text>
          <Text style={styles.optionValue}>•••• 4242</Text>
          <Icon name="chevron-right" size={20} color={Colors.gray500} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
          <Icon name="local-offer" size={20} color={Colors.black} />
          <Text style={styles.optionLabel}>Promo code</Text>
          <Text style={styles.optionValuePlaceholder}>Add</Text>
          <Icon name="chevron-right" size={20} color={Colors.gray500} />
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <UbertButton
          title="Reserve"
          onPress={handleConfirm}
          style={
            isPremium
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderSubtle,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: FIELD_FILL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Card
  card: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 12,
    backgroundColor: FIELD_FILL,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.black,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D8D8D8',
    marginVertical: 14,
  },

  // Trip route block
  tripRoute: {flexDirection: 'row'},
  connectorCol: {
    width: 20,
    alignItems: 'center',
    paddingTop: 6,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#D8D8D8',
    marginVertical: 4,
  },
  redSquare: {
    width: 10,
    height: 10,
    backgroundColor: Colors.error,
    marginBottom: 6,
  },
  routeSlot: {paddingLeft: 8},
  routeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  routeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginTop: 2,
  },

  // Vehicle card
  vehicleRow: {flexDirection: 'row', alignItems: 'center'},
  vehicleThumb: {
    width: 64,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  capacityText: {
    fontSize: 13,
    color: Colors.gray700,
    marginLeft: 4,
  },

  // Fare card
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.gray700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fareValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.black,
    marginTop: 4,
  },
  fareLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.black,
    textDecorationLine: 'underline',
  },

  // Callout (wait time)
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    gap: 10,
  },
  calloutText: {
    flex: 1,
    fontSize: 13,
    color: Colors.black,
    fontWeight: '600',
  },

  // Info row (cancellation)
  infoRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: Colors.gray700,
    lineHeight: 17,
  },
  infoLink: {
    color: Colors.black,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // Option rows (payment, promo)
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: FIELD_FILL,
    gap: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  optionValue: {
    fontSize: 13,
    color: Colors.gray700,
    fontWeight: '500',
  },
  optionValuePlaceholder: {
    fontSize: 13,
    color: Colors.gray500,
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
});
