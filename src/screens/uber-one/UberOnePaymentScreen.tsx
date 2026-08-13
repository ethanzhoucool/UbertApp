import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'UberOnePayment'>;
};

const PLANS: {
  id: 'monthly' | 'annual';
  title: string;
  price: string;
  meta?: string;
}[] = [
  {id: 'monthly', title: 'Monthly', price: '$9.99/mo'},
  {id: 'annual', title: 'Annual', price: '$99.99/yr', meta: 'Best value · Save 17%'},
];

const PAYMENT_OPTIONS = [
  {id: 'visa-4242', label: 'Visa', last4: '4242', icon: 'credit-card'},
  {id: 'amex-1009', label: 'Amex', last4: '1009', icon: 'credit-card'},
  {id: 'apple-pay', label: 'Apple Pay', last4: '', icon: 'phone-iphone'},
];

export function UberOnePaymentScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [payment, setPayment] = useState('visa-4242');
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    console.log('[Ubert] UberOnePaymentScreen mounted');
  }, []);

  const selected = PAYMENT_OPTIONS.find(p => p.id === payment) ?? PAYMENT_OPTIONS[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title="Confirm Uber One"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 140}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>CHOOSE A PLAN</Text>
        <View style={styles.group}>
          {PLANS.map((p, i) => {
            const active = plan === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.planRow,
                  i < PLANS.length - 1 && styles.rowDivider,
                ]}
                activeOpacity={0.7}
                onPress={() => setPlan(p.id)}>
                <View style={[styles.radio, active && styles.radioOn]}>
                  {active && <View style={styles.radioDot} />}
                </View>
                <View style={{flex: 1, marginLeft: 12}}>
                  <Text style={styles.planTitle}>{p.title}</Text>
                  {p.meta && <Text style={styles.planMeta}>{p.meta}</Text>}
                </View>
                <Text style={styles.planPrice}>{p.price}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>
        <View style={styles.payCard}>
          <View style={styles.payIcon}>
            <Icon name={selected.icon} size={22} color={Colors.black} />
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={styles.payLabel}>
              {selected.last4
                ? `${selected.label} •••• ${selected.last4}`
                : selected.label}
            </Text>
            <Text style={styles.paySub}>
              {selected.last4 ? 'Default card' : 'Tap to confirm via Face ID'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changeBtn}
            activeOpacity={0.7}
            onPress={() => setPickerOpen(o => !o)}>
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
        </View>

        {pickerOpen && (
          <View style={styles.pickerGroup}>
            {PAYMENT_OPTIONS.map((p, i) => {
              const active = payment === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.pickerRow,
                    i < PAYMENT_OPTIONS.length - 1 && styles.rowDivider,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    setPayment(p.id);
                    setPickerOpen(false);
                  }}>
                  <Icon name={p.icon} size={20} color={Colors.black} />
                  <Text style={styles.pickerLabel}>
                    {p.last4 ? `${p.label} •••• ${p.last4}` : p.label}
                  </Text>
                  {active && (
                    <Icon name="check" size={18} color={Colors.black} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.legalCard}>
          <Icon name="info-outline" size={20} color={Colors.black} />
          <Text style={styles.legalText}>
            Your first month is free. After that, you'll be charged{' '}
            {plan === 'monthly' ? '$9.99/mo' : '$99.99/yr'} on the same date
            each {plan === 'monthly' ? 'month' : 'year'} until you cancel.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <TouchableOpacity
          style={styles.confirmBtn}
          activeOpacity={0.85}
          onPress={() => {
            Alert.alert(
              'Subscription started',
              'Welcome to Uber One. Your free trial is now active.',
              [{text: 'OK', onPress: () => navigation.replace('UberOneSuccess')}],
            );
          }}>
          <Text style={styles.confirmBtnText}>Confirm subscription</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginHorizontal: 16,
      marginTop: 18,
      marginBottom: 8,
    },
    group: {
      marginHorizontal: 16,
      backgroundColor: Colors.white,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#E5E7EB',
      overflow: 'hidden',
    },
    planRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 16,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: '#C0C0C0',
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOn: {borderColor: Colors.black},
    radioDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: Colors.black,
    },
    planTitle: {fontSize: 16, fontWeight: '700', color: Colors.black},
    planMeta: {fontSize: 12, color: '#05944F', marginTop: 2, fontWeight: '700'},
    planPrice: {fontSize: 15, fontWeight: '700', color: Colors.black},
    payCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      padding: 14,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#E5E7EB',
    },
    payIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#F6F6F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    payLabel: {fontSize: 15, fontWeight: '700', color: Colors.black},
    paySub: {fontSize: 13, color: '#6B6B6B', marginTop: 2},
    changeBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: Colors.surfaceMuted,
    },
    changeBtnText: {fontSize: 13, fontWeight: '700', color: Colors.black},
    pickerGroup: {
      marginHorizontal: 16,
      marginTop: 8,
      backgroundColor: '#F6F6F6',
      borderRadius: 12,
      overflow: 'hidden',
    },
    pickerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 12,
    },
    pickerLabel: {flex: 1, fontSize: 14, fontWeight: '600', color: Colors.black},
    legalCard: {
      flexDirection: 'row',
      margin: 16,
      padding: 14,
      backgroundColor: Colors.surfaceMuted,
      borderRadius: 12,
      gap: 12,
    },
    legalText: {flex: 1, fontSize: 13, color: '#444', lineHeight: 18},
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
    confirmBtn: {
      backgroundColor: Colors.black,
      borderRadius: 30,
      paddingVertical: 16,
      alignItems: 'center',
    },
    confirmBtnText: {color: Colors.white, fontWeight: '800', fontSize: 16, letterSpacing: 0.2},
  });
