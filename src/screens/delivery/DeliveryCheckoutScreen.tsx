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
import {RootStackParamList} from '../../navigation/types';
import {useTrip} from '../../store/TripContext';
import {recentPlaces} from '../../data/mockPlaces';
import {useColors, ColorPalette} from '../../theme';

const EATS_GREEN = '#06C167';
const META_GRAY = '#6B6B6B';
const FILL_GRAY = '#F6F6F6';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'DeliveryCheckout'>;
};

const SERVICE_FEE = 2.49;
const TAX_RATE = 0.0875;
const TIP_DEFAULT = 2;

export function DeliveryCheckoutScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {state} = useTrip();
  const [address, setAddress] = useState(recentPlaces[0]);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    console.log('[Ubert] DeliveryCheckoutScreen mounted');
  }, []);

  const subtotal = useMemo(
    () =>
      state.cart.reduce(
        (sum, line) => sum + line.item.price * line.quantity,
        0,
      ),
    [state.cart],
  );

  const deliveryFee = state.cartRestaurant?.deliveryFee ?? 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + deliveryFee + SERVICE_FEE + TIP_DEFAULT + tax;

  const etaText = state.cartRestaurant?.etaMaxMinutes
    ? `${state.cartRestaurant.etaMinutes}–${state.cartRestaurant.etaMaxMinutes} min`
    : state.cartRestaurant
      ? `${state.cartRestaurant.etaMinutes} min`
      : '15–25 min';

  const cardLabel = state.paymentMethod.label ?? 'Visa';
  const cardDetail = state.paymentMethod.detail ?? '•••• 4242';

  const handlePlaceOrder = () => {
    navigation.replace('DeliveryTracking');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBubble}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon name="arrow-back" size={20} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.iconBubblePlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}>
        {/* Delivery details with map snippet */}
        <SectionLabel text="Delivery details" />
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={() =>
            setAddress(
              address.id === recentPlaces[0].id
                ? recentPlaces[1]
                : recentPlaces[0],
            )
          }>
          <View style={styles.mapThumb}>
            <Icon name="place" size={20} color="#fff" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.rowLabel}>{address.address}</Text>
            <Text style={styles.rowSub}>Leave at door</Text>
          </View>
          <Icon name="chevron-right" size={22} color={META_GRAY} />
        </TouchableOpacity>

        {/* Courier instructions */}
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
          <View style={styles.rowIcon}>
            <Icon name="edit" size={18} color={Colors.black} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.rowLabel}>Add delivery instructions</Text>
            <Text style={styles.rowSub}>Add a note for your courier</Text>
          </View>
          <Icon name="chevron-right" size={22} color={META_GRAY} />
        </TouchableOpacity>

        {/* Time */}
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
          <View style={styles.rowIcon}>
            <Icon name="schedule" size={18} color={Colors.black} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.rowLabel}>Deliver now · {etaText}</Text>
            <Text style={styles.rowSub}>Schedule</Text>
          </View>
          <Icon name="chevron-right" size={22} color={META_GRAY} />
        </TouchableOpacity>

        {/* Payment */}
        <SectionLabel text="Payment" />
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
          <View style={styles.cardChip}>
            <Icon name="credit-card" size={16} color={Colors.white} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.rowLabel}>{cardLabel}</Text>
            <Text style={styles.rowSub}>{cardDetail}</Text>
          </View>
          <Text style={styles.changeLink}>Change</Text>
        </TouchableOpacity>

        {/* Promotions */}
        <SectionLabel text="Promotions" />
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
          <View style={styles.rowIcon}>
            <Icon name="local-offer" size={18} color={Colors.black} />
          </View>
          <Text style={[styles.rowLabel, {flex: 1}]}>Add promo code</Text>
          <Icon name="chevron-right" size={22} color={META_GRAY} />
        </TouchableOpacity>

        {/* Order summary */}
        <SectionLabel text="Order summary" />
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={() => setSummaryOpen(o => !o)}>
          <View style={styles.rowIcon}>
            <Icon name="receipt-long" size={18} color={Colors.black} />
          </View>
          <Text style={[styles.rowLabel, {flex: 1}]}>
            {state.cart.length} item{state.cart.length === 1 ? '' : 's'} · $
            {subtotal.toFixed(2)}
          </Text>
          <Icon
            name={summaryOpen ? 'expand-less' : 'expand-more'}
            size={22}
            color={META_GRAY}
          />
        </TouchableOpacity>

        {summaryOpen && (
          <View style={styles.summaryDetails}>
            {state.cart.map(line => (
              <View key={line.id} style={styles.summaryItem}>
                <Text style={styles.summaryItemQty}>{line.quantity}×</Text>
                <Text style={styles.summaryItemName}>{line.item.name}</Text>
                <Text style={styles.summaryItemPrice}>
                  ${(line.item.price * line.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.totalsBlock}>
              <SummaryLine label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <SummaryLine
                label="Delivery Fee"
                value={`$${deliveryFee.toFixed(2)}`}
              />
              <SummaryLine
                label="Service Fee"
                value={`$${SERVICE_FEE.toFixed(2)}`}
              />
              <SummaryLine label="Tip" value={`$${TIP_DEFAULT.toFixed(2)}`} />
              <SummaryLine
                label="Taxes & Other Fees"
                value={`$${tax.toFixed(2)}`}
              />
              <View style={styles.divider} />
              <SummaryLine label="Total" value={`$${total.toFixed(2)}`} bold />
            </View>
          </View>
        )}

        <Text style={styles.disclaimer}>
          Fees apply. Delivery and service fees support couriers and platform
          operations. By placing this order, you agree to our terms.
        </Text>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <TouchableOpacity
          style={styles.placeBtn}
          activeOpacity={0.85}
          onPress={handlePlaceOrder}>
          <Text style={styles.placeText}>Place order</Text>
          <Text style={styles.placePrice}>${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SectionLabel({text}: {text: string}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return <Text style={styles.sectionLabel}>{text}</Text>;
}

function SummaryLine({
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
    <View style={styles.summaryLine}>
      <Text style={[styles.summaryLabel, bold && styles.boldLabel]}>
        {label}
      </Text>
      <Text style={[styles.summaryValue, bold && styles.boldValue]}>
        {value}
      </Text>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.borderSubtle,
    },
    iconBubble: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: FILL_GRAY,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBubblePlaceholder: {width: 36, height: 36},
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '800',
      color: Colors.black,
      marginHorizontal: 12,
    },
    sectionLabel: {
      marginHorizontal: 16,
      marginTop: 22,
      marginBottom: 6,
      fontSize: 13,
      fontWeight: '800',
      color: META_GRAY,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: Colors.white,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.borderSubtle,
      gap: 12,
    },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: FILL_GRAY,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapThumb: {
      width: 48,
      height: 48,
      borderRadius: 10,
      backgroundColor: '#C7E0F4',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardChip: {
      width: 36,
      height: 24,
      borderRadius: 4,
      backgroundColor: '#1A1F36',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowLabel: {fontSize: 15, fontWeight: '600', color: Colors.black},
    rowSub: {fontSize: 13, color: META_GRAY, marginTop: 2},
    changeLink: {
      fontSize: 14,
      color: EATS_GREEN,
      fontWeight: '700',
    },
    summaryDetails: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 6,
    },
    summaryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
    },
    summaryItemQty: {
      width: 28,
      fontSize: 14,
      fontWeight: '700',
      color: Colors.black,
    },
    summaryItemName: {flex: 1, fontSize: 14, color: Colors.black},
    summaryItemPrice: {fontSize: 14, color: Colors.black, fontWeight: '500'},
    totalsBlock: {
      paddingTop: 10,
    },
    summaryLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    summaryLabel: {fontSize: 14, color: META_GRAY, fontWeight: '500'},
    summaryValue: {fontSize: 14, color: Colors.black, fontWeight: '500'},
    boldLabel: {fontSize: 16, fontWeight: '800', color: Colors.black},
    boldValue: {fontSize: 16, fontWeight: '800', color: Colors.black},
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: '#E5E7EB',
      marginVertical: 8,
    },
    disclaimer: {
      fontSize: 11,
      color: META_GRAY,
      paddingHorizontal: 16,
      marginTop: 16,
      lineHeight: 16,
    },
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
    placeBtn: {
      backgroundColor: EATS_GREEN,
      borderRadius: 28,
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 22,
    },
    placeText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '800',
    },
    placePrice: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '800',
    },
  });
