import React, {useEffect} from 'react';
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
import {RootStackParamList} from '../../navigation/types';
import {useTrip} from '../../store/TripContext';
import {PaymentMethod} from '../../data/mockPayments';
import {Colors} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Wallet'>;
};

function methodIcon(type: PaymentMethod['type']): string {
  if (type === 'cash') {
    return 'attach-money';
  }
  if (type === 'apple-pay') {
    return 'phone-iphone';
  }
  return 'credit-card';
}

export function WalletScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();
  const {state, dispatch} = useTrip();

  useEffect(() => {
    console.log('[Ubert] WalletScreen mounted');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Wallet" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 40}}
        showsVerticalScrollIndicator={false}>
        {/* Uber Cash card */}
        <View style={styles.cashCard}>
          <View style={styles.cashHeader}>
            <Icon
              name="account-balance-wallet"
              size={18}
              color={Colors.white}
            />
            <Text style={styles.cashTitle}>Uber Cash</Text>
          </View>
          <Text style={styles.cashAmount}>$24.50</Text>
          <Text style={styles.cashSub}>Available balance</Text>
        </View>

        <Text style={styles.sectionTitle}>Payment methods</Text>
        <View style={styles.card}>
          {state.savedPayments.map((method, i) => {
            const selected = state.paymentMethod.id === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.row,
                  i < state.savedPayments.length - 1 && styles.rowDivider,
                ]}
                activeOpacity={0.7}
                onPress={() => dispatch({type: 'SET_PAYMENT', payload: method})}>
                <View style={[styles.iconWrap, {backgroundColor: method.iconBg}]}>
                  <Icon
                    name={methodIcon(method.type)}
                    size={18}
                    color={Colors.white}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.label}>{method.label}</Text>
                  <Text style={styles.sub}>{method.detail}</Text>
                </View>
                {selected ? (
                  <Icon name="check-circle" size={22} color={Colors.black} />
                ) : (
                  <View style={styles.radio} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.addRow}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AddPaymentMethod')}>
          <View style={styles.addIcon}>
            <Icon name="add" size={20} color={Colors.black} />
          </View>
          <Text style={styles.addText}>Add payment method</Text>
          <Icon name="chevron-right" size={20} color={Colors.gray500} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Membership</Text>
        <TouchableOpacity
          style={[styles.card, styles.promoRow]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('UberOneLanding')}>
          <View style={styles.promoIcon}>
            <Icon name="workspace-premium" size={20} color={Colors.white} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.label}>Join Uber One</Text>
            <Text style={styles.sub}>Save on rides and delivery</Text>
          </View>
          <Icon name="chevron-right" size={20} color={Colors.gray500} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  cashCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: Colors.black,
    padding: 18,
  },
  cashHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  cashTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  cashAmount: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 12,
    letterSpacing: -0.5,
  },
  cashSub: {color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2},
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 14,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ECECEC',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {fontSize: 15, fontWeight: '700', color: Colors.black},
  sub: {fontSize: 12, color: Colors.gray500, marginTop: 2},
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.gray300,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.white,
    gap: 14,
  },
  addIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {flex: 1, fontSize: 15, fontWeight: '700', color: Colors.black},
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 14,
  },
  promoIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#1F2933',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
