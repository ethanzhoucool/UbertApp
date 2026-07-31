import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UbertButton} from '../../components/common/UbertButton';
import {RootStackParamList} from '../../navigation/types';
import {useTrip, CartLineItem} from '../../store/TripContext';
import {useColors, ColorPalette} from '../../theme';

const EATS_GREEN = '#06C167';
const META_GRAY = '#6B6B6B';
const FILL_GRAY = '#F6F6F6';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'DeliveryCart'>;
};

const SERVICE_FEE = 2.49;
const TAX_RATE = 0.0875;
const TIP_OPTIONS = [1, 2, 3, 5];

export function DeliveryCartScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {state, dispatch} = useTrip();
  const [tip, setTip] = useState<number>(2);
  const [scheduleLater, setScheduleLater] = useState(false);

  useEffect(() => {
    console.log('[Ubert] DeliveryCartScreen mounted');
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
  const total = subtotal + deliveryFee + SERVICE_FEE + tip + tax;

  const handleStep = (lineId: string, delta: number) => {
    dispatch({type: 'CHANGE_CART_QTY', payload: {lineId, delta}});
  };

  const empty = state.cart.length === 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Custom header */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBubble}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon name="close" size={20} color={Colors.black} />
        </TouchableOpacity>
        <View style={{flex: 1, marginLeft: 12}}>
          <Text style={styles.headerTitle}>Your cart</Text>
          {state.cartRestaurant && (
            <Text style={styles.headerSub} numberOfLines={1}>
              {state.cartRestaurant.name}
            </Text>
          )}
        </View>
        {!empty && (
          <TouchableOpacity
            onPress={() =>
              state.cartRestaurant
                ? navigation.navigate('RestaurantDetail', {
                    restaurantId: state.cartRestaurant.id,
                  })
                : navigation.navigate('DeliveryBrowse')
            }
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
            <Text style={styles.addItemsLink}>Add items</Text>
          </TouchableOpacity>
        )}
      </View>

      {empty ? (
        <View style={styles.empty}>
          <Icon name="shopping-bag" size={56} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>
            Browse restaurants to start an order.
          </Text>
          <View style={{height: 16}} />
          <UbertButton
            title="Browse restaurants"
            onPress={() => navigation.navigate('DeliveryBrowse')}
            variant="outline"
          />
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{paddingBottom: insets.bottom + 140}}
            showsVerticalScrollIndicator={false}>
            {state.cart.map(line => (
              <CartRow
                key={line.id}
                line={line}
                onIncrement={() => handleStep(line.id, 1)}
                onDecrement={() => handleStep(line.id, -1)}
              />
            ))}

            {/* Tip card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Add a tip</Text>
              <Text style={styles.cardSub}>
                100% of the tip goes to your courier.
              </Text>
              <View style={styles.tipRow}>
                {TIP_OPTIONS.map(amt => {
                  const active = tip === amt;
                  return (
                    <TouchableOpacity
                      key={amt}
                      style={[styles.tipChip, active && styles.tipChipActive]}
                      onPress={() => setTip(amt)}
                      activeOpacity={0.7}>
                      <Text
                        style={[
                          styles.tipChipText,
                          active && styles.tipChipTextActive,
                        ]}>
                        ${amt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  style={[styles.tipChip, tip === 0 && styles.tipChipActive]}
                  onPress={() => setTip(0)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.tipChipText,
                      tip === 0 && styles.tipChipTextActive,
                    ]}>
                    Other
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Promo */}
            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={styles.rowIcon}>
                <Icon name="local-offer" size={18} color={Colors.black} />
              </View>
              <Text style={styles.rowLabel}>Add promo code</Text>
              <Icon name="chevron-right" size={22} color={META_GRAY} />
            </TouchableOpacity>

            {/* Schedule toggle */}
            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Icon name="schedule" size={18} color={Colors.black} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.rowLabel}>Schedule for later</Text>
                <Text style={styles.rowSub}>Choose a delivery time</Text>
              </View>
              <Switch
                value={scheduleLater}
                onValueChange={setScheduleLater}
                trackColor={{false: '#E5E7EB', true: EATS_GREEN}}
                thumbColor={Colors.white}
                ios_backgroundColor="#E5E7EB"
              />
            </View>

            {/* Order summary */}
            <View style={styles.summary}>
              <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <SummaryRow
                label="Delivery Fee"
                value={`$${deliveryFee.toFixed(2)}`}
              />
              <SummaryRow
                label="Service Fee"
                value={`$${SERVICE_FEE.toFixed(2)}`}
              />
              <SummaryRow label="Tip" value={`$${tip.toFixed(2)}`} />
              <SummaryRow
                label="Taxes & Other Fees"
                value={`$${tax.toFixed(2)}`}
              />
              <View style={styles.summaryDivider} />
              <SummaryRow
                label="Total"
                value={`$${total.toFixed(2)}`}
                bold
              />
            </View>
          </ScrollView>

          <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
            <TouchableOpacity
              style={styles.checkoutBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('DeliveryCheckout')}>
              <Text style={styles.checkoutText}>Go to checkout</Text>
              <Text style={styles.checkoutPrice}>${total.toFixed(2)}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

function CartRow({
  line,
  onIncrement,
  onDecrement,
}: {
  line: CartLineItem;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.cartRow}>
      <View
        style={[
          styles.itemThumb,
          {backgroundColor: line.item.thumbColor ?? '#E5E7EB'},
        ]}>
        {line.item.imageUri && (
          <Image
            source={{uri: line.item.imageUri}}
            style={styles.itemThumbImage}
            resizeMode="cover"
          />
        )}
      </View>
      <View style={{flex: 1, marginLeft: 12}}>
        <Text style={styles.itemName} numberOfLines={1}>
          {line.item.name}
        </Text>
        <Text style={styles.itemModifier} numberOfLines={1}>
          {line.item.description}
        </Text>
        <Text style={styles.itemPrice}>
          ${(line.item.price * line.quantity).toFixed(2)}
        </Text>
      </View>
      <View style={styles.stepper}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={onDecrement}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon
            name={line.quantity === 1 ? 'delete-outline' : 'remove'}
            size={16}
            color={Colors.black}
          />
        </TouchableOpacity>
        <Text style={styles.qty}>{line.quantity}</Text>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={onIncrement}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="add" size={16} color={Colors.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SummaryRow({
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
    <View style={styles.summaryRow}>
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
    headerTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: Colors.black,
      letterSpacing: -0.2,
    },
    headerSub: {
      fontSize: 13,
      color: META_GRAY,
      marginTop: 1,
      fontWeight: '500',
    },
    addItemsLink: {
      fontSize: 14,
      color: EATS_GREEN,
      fontWeight: '700',
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: Colors.black,
      marginTop: 16,
    },
    emptySub: {
      fontSize: 14,
      color: META_GRAY,
      marginTop: 6,
      textAlign: 'center',
    },
    cartRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.borderSubtle,
    },
    itemThumb: {
      width: 56,
      height: 56,
      borderRadius: 10,
      overflow: 'hidden',
    },
    itemThumbImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    itemName: {fontSize: 15, fontWeight: '700', color: Colors.black},
    itemModifier: {
      fontSize: 12,
      color: META_GRAY,
      marginTop: 2,
    },
    itemPrice: {
      fontSize: 14,
      color: Colors.black,
      fontWeight: '600',
      marginTop: 4,
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: FILL_GRAY,
      borderRadius: 18,
      paddingHorizontal: 4,
      paddingVertical: 4,
      gap: 6,
    },
    stepBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qty: {
      minWidth: 14,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '700',
      color: Colors.black,
    },
    card: {
      marginHorizontal: 16,
      marginTop: 16,
      padding: 16,
      borderRadius: 14,
      backgroundColor: FILL_GRAY,
    },
    cardTitle: {fontSize: 16, fontWeight: '800', color: Colors.black},
    cardSub: {fontSize: 12, color: META_GRAY, marginTop: 4},
    tipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 12,
      gap: 8,
    },
    tipChip: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    tipChipActive: {
      backgroundColor: Colors.black,
      borderColor: Colors.black,
    },
    tipChipText: {
      fontSize: 13,
      fontWeight: '700',
      color: Colors.black,
    },
    tipChipTextActive: {color: Colors.white},
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.borderSubtle,
      marginTop: 16,
      gap: 12,
    },
    rowIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: FILL_GRAY,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowLabel: {flex: 1, fontSize: 15, fontWeight: '600', color: Colors.black},
    rowSub: {fontSize: 12, color: META_GRAY, marginTop: 2},
    summary: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 24,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 5,
    },
    summaryLabel: {fontSize: 14, color: META_GRAY, fontWeight: '500'},
    summaryValue: {fontSize: 14, color: Colors.black, fontWeight: '500'},
    boldLabel: {fontSize: 17, fontWeight: '800', color: Colors.black},
    boldValue: {fontSize: 17, fontWeight: '800', color: Colors.black},
    summaryDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: '#E5E7EB',
      marginVertical: 10,
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
    checkoutBtn: {
      backgroundColor: EATS_GREEN,
      borderRadius: 28,
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 22,
    },
    checkoutText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '800',
    },
    checkoutPrice: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '800',
    },
  });
