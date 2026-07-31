import React, {useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {
  useShopsCart,
  updateLineQty,
  cartSubtotal,
  clearShopsCart,
} from '../../store/shopsCart';
import {getStoreById} from '../../data/mockStores';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ShopsCart'>;
};

export function ShopsCartScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const cart = useShopsCart();
  const store = cart.storeId ? getStoreById(cart.storeId) : null;

  useEffect(() => {
    console.log('[Ubert] ShopsCartScreen mounted');
  }, []);

  const subtotal = cartSubtotal(cart.lines);
  const deliveryFee = 2.99;
  const serviceFee = +(subtotal * 0.05).toFixed(2);
  const total = subtotal + deliveryFee + serviceFee;

  const handlePlace = () => {
    clearShopsCart();
    Alert.alert(
      'Order placed',
      "Your shopper will start picking your items shortly.",
      [
        {
          text: 'OK',
          onPress: () =>
            navigation.reset({index: 0, routes: [{name: 'Home'}]}),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title={store ? `Checkout · ${store.name}` : 'Your cart'}
        onBack={() => navigation.goBack()}
      />

      {cart.lines.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Icon name="shopping-basket" size={56} color="#D0D0D0" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>
            Browse stores to start adding items.
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{paddingBottom: 220}}
            showsVerticalScrollIndicator={false}>
            {store && (
              <View style={styles.storeCard}>
                <Image
                  source={{uri: store.imageUrl}}
                  style={styles.storeThumb}
                />
                <View style={{flex: 1, marginLeft: 12}}>
                  <Text style={styles.storeName}>{store.name}</Text>
                  <Text style={styles.storeMeta}>
                    Delivery in {store.etaMinutes} min · {store.deliveryFee}
                  </Text>
                </View>
              </View>
            )}

            <Text style={styles.sectionLabel}>ITEMS</Text>
            <View style={styles.itemsCard}>
              {cart.lines.map((line, i) => (
                <View
                  key={line.product.id}
                  style={[
                    styles.lineRow,
                    i < cart.lines.length - 1 && styles.lineDivider,
                  ]}>
                  <Image
                    source={{uri: line.product.imageUrl}}
                    style={styles.lineImg}
                  />
                  <View style={{flex: 1, marginLeft: 12}}>
                    <Text style={styles.lineName} numberOfLines={2}>
                      {line.product.name}
                    </Text>
                    <Text style={styles.lineUnit}>{line.product.unit}</Text>
                    <Text style={styles.linePrice}>
                      ${(line.product.price * line.quantity).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.stepper}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => updateLineQty(line.product.id, -1)}>
                      <Icon
                        name={line.quantity === 1 ? 'delete-outline' : 'remove'}
                        size={18}
                        color={Colors.black}
                      />
                    </TouchableOpacity>
                    <Text style={styles.stepValue}>{line.quantity}</Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => updateLineQty(line.product.id, 1)}>
                      <Icon name="add" size={18} color={Colors.black} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.sectionLabel}>ORDER SUMMARY</Text>
            <View style={styles.summaryCard}>
              <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <SummaryRow
                label="Delivery fee"
                value={`$${deliveryFee.toFixed(2)}`}
              />
              <SummaryRow
                label="Service fee"
                value={`$${serviceFee.toFixed(2)}`}
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
              style={styles.placeBtn}
              onPress={handlePlace}
              activeOpacity={0.85}>
              <Text style={styles.placeBtnText}>
                Place order · ${total.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
      <Text
        style={[
          styles.summaryLabel,
          bold && {color: Colors.black, fontWeight: '800'},
        ]}>
        {label}
      </Text>
      <Text
        style={[
          styles.summaryValue,
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
    emptyWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    },
    emptyTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: Colors.black,
      marginTop: 18,
    },
    emptySub: {
      fontSize: 14,
      color: '#6B6B6B',
      marginTop: 6,
      textAlign: 'center',
    },
    storeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 16,
      padding: 12,
      borderRadius: 14,
      backgroundColor: '#F6F6F6',
    },
    storeThumb: {
      width: 52,
      height: 52,
      borderRadius: 10,
      backgroundColor: '#E5E7EB',
    },
    storeName: {fontSize: 15, fontWeight: '700', color: Colors.black},
    storeMeta: {fontSize: 13, color: '#6B6B6B', marginTop: 2},
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginHorizontal: 16,
      marginTop: 22,
      marginBottom: 8,
    },
    itemsCard: {
      marginHorizontal: 16,
      backgroundColor: Colors.white,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#E5E7EB',
    },
    lineRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    lineDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    lineImg: {
      width: 64,
      height: 64,
      borderRadius: 10,
      backgroundColor: '#F6F6F6',
    },
    lineName: {fontSize: 15, fontWeight: '600', color: Colors.black},
    lineUnit: {fontSize: 12, color: '#6B6B6B', marginTop: 2},
    linePrice: {
      fontSize: 14,
      fontWeight: '700',
      color: Colors.black,
      marginTop: 4,
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 18,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingHorizontal: 4,
    },
    stepBtn: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepValue: {
      fontWeight: '700',
      color: Colors.black,
      minWidth: 18,
      textAlign: 'center',
    },
    summaryCard: {
      marginHorizontal: 16,
      backgroundColor: '#F6F6F6',
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    summaryLabel: {fontSize: 14, color: '#6B6B6B'},
    summaryValue: {fontSize: 14, color: Colors.black, fontWeight: '600'},
    summaryDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: '#D0D0D0',
      marginVertical: 6,
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
      backgroundColor: '#06C167',
      borderRadius: 30,
      paddingVertical: 16,
      alignItems: 'center',
    },
    placeBtnText: {
      color: Colors.white,
      fontWeight: '800',
      fontSize: 16,
      letterSpacing: 0.2,
    },
  });
