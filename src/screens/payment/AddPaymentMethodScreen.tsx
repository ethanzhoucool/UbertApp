import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {useTrip} from '../../store/TripContext';
import {PaymentMethod} from '../../data/mockPayments';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'AddPaymentMethod'>;
};

type TypeKey = 'card' | 'paypal' | 'apple-pay' | 'venmo' | 'gift';

type TypeTile = {
  key: TypeKey;
  label: string;
  icon?: string;
  imageUri?: string;
};

const TYPE_TILES: TypeTile[] = [
  {key: 'card', icon: 'credit-card', label: 'Credit or debit card'},
  {
    key: 'paypal',
    label: 'PayPal',
    imageUri:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Paypal_2014_logo.png/200px-Paypal_2014_logo.png',
  },
  {
    key: 'apple-pay',
    label: 'Apple Pay',
    imageUri:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/200px-Apple_Pay_logo.svg.png',
  },
  {
    key: 'venmo',
    label: 'Venmo',
    imageUri:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Venmo_logo.svg/200px-Venmo_logo.svg.png',
  },
  {key: 'gift', icon: 'card-giftcard', label: 'Uber gift card'},
];

const BRAND_LOGOS: Record<'visa' | 'mastercard' | 'amex', string> = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png',
  mastercard:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png',
  amex: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/200px-American_Express_logo.svg.png',
};

function brandFromDigits(num: string): 'visa' | 'mastercard' | 'amex' | null {
  const first = num.replace(/\s/g, '').charAt(0);
  if (first === '4') {
    return 'visa';
  }
  if (first === '5') {
    return 'mastercard';
  }
  if (first === '3') {
    return 'amex';
  }
  return null;
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExp(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function AddPaymentMethodScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {dispatch} = useTrip();

  const [mode, setMode] = useState<'list' | 'card'>('list');
  const [cardNumber, setCardNumber] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('Ethan Zhou');
  const [zip, setZip] = useState('');
  const [country] = useState('United States');

  useEffect(() => {
    console.log('[Ubert] AddPaymentMethodScreen mounted');
  }, []);

  const inferBrand = (
    num: string,
  ): {type: PaymentMethod['type']; label: string; bg: string} => {
    const brand = brandFromDigits(num);
    if (brand === 'visa') {
      return {type: 'visa', label: 'Visa', bg: '#1A56DB'};
    }
    if (brand === 'mastercard') {
      return {type: 'mastercard', label: 'Mastercard', bg: '#EB001B'};
    }
    if (brand === 'amex') {
      // Saved payment store doesn't yet model amex; treat as visa-like card.
      return {type: 'visa', label: 'Amex', bg: '#2E77BB'};
    }
    return {type: 'visa', label: 'Card', bg: '#000000'};
  };

  const digits = cardNumber.replace(/\s/g, '');
  const liveBrand = brandFromDigits(digits);
  const valid =
    digits.length >= 13 &&
    exp.replace('/', '').length === 4 &&
    cvv.length >= 3 &&
    name.trim().length > 0 &&
    zip.length >= 4;

  const handleAddCard = () => {
    const last4 = digits.slice(-4) || '0000';
    const brand = inferBrand(digits);
    const newMethod: PaymentMethod = {
      id: `card-${Date.now()}`,
      type: brand.type,
      label: brand.label,
      detail: `•••• ${last4}`,
      iconBg: brand.bg,
    };
    dispatch({type: 'ADD_PAYMENT', payload: newMethod});
    navigation.navigate('Home', {toast: 'Card added'});
  };

  const handleTilePress = (key: TypeKey) => {
    if (key === 'card') {
      setMode('card');
      return;
    }
    // Stub other types as a toast
    const labelMap: Record<TypeKey, string> = {
      card: 'Card',
      paypal: 'PayPal',
      'apple-pay': 'Apple Pay',
      venmo: 'Venmo',
      gift: 'Uber gift card',
    };
    navigation.navigate('Home', {toast: `${labelMap[key]} coming soon`});
  };

  if (mode === 'card') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScreenHeader title="Add card" onBack={() => setMode('list')} />

        <ScrollView
          contentContainerStyle={{paddingBottom: insets.bottom + 120}}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.fieldLabel}>CARD NUMBER</Text>
          <View style={styles.cardInputWrap}>
            <TextInput
              style={styles.cardNumberInput}
              value={cardNumber}
              onChangeText={v => setCardNumber(formatCardNumber(v))}
              keyboardType="number-pad"
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#6B6B6B"
            />
            {liveBrand && (
              <Image
                source={{uri: BRAND_LOGOS[liveBrand]}}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            )}
            <TouchableOpacity activeOpacity={0.7} style={styles.scanBtn}>
              <Icon name="photo-camera" size={20} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.twoCol}>
            <View style={{flex: 1, marginRight: 8}}>
              <Text style={styles.fieldLabel}>MM/YY</Text>
              <TextInput
                style={styles.input}
                value={exp}
                onChangeText={v => setExp(formatExp(v))}
                keyboardType="number-pad"
                placeholder="MM/YY"
                placeholderTextColor="#6B6B6B"
              />
            </View>
            <View style={{flex: 1, marginLeft: 8}}>
              <Text style={styles.fieldLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                value={cvv}
                onChangeText={v => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                keyboardType="number-pad"
                placeholder="123"
                placeholderTextColor="#6B6B6B"
                secureTextEntry
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>NAME ON CARD</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Full name"
            placeholderTextColor="#6B6B6B"
          />

          <Text style={styles.fieldLabel}>BILLING ZIP</Text>
          <TextInput
            style={styles.input}
            value={zip}
            onChangeText={v => setZip(v.replace(/\D/g, '').slice(0, 10))}
            keyboardType="number-pad"
            placeholder="10001"
            placeholderTextColor="#6B6B6B"
          />

          <Text style={styles.fieldLabel}>COUNTRY</Text>
          <TouchableOpacity style={styles.countryRow} activeOpacity={0.7}>
            <Text style={styles.countryText}>{country}</Text>
            <Icon name="chevron-right" size={20} color="#6B6B6B" />
          </TouchableOpacity>
        </ScrollView>

        <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
          <TouchableOpacity
            style={[styles.cta, !valid && styles.ctaDisabled]}
            onPress={handleAddCard}
            disabled={!valid}
            activeOpacity={0.85}>
            <Text style={[styles.ctaText, !valid && styles.ctaTextDisabled]}>
              Add card
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title="Add payment method"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 24}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.tileGroup}>
          {TYPE_TILES.map((tile, i) => (
            <TouchableOpacity
              key={tile.key}
              style={[
                styles.tile,
                i < TYPE_TILES.length - 1 && styles.tileDivider,
              ]}
              activeOpacity={0.7}
              onPress={() => handleTilePress(tile.key)}>
              <View style={styles.tileIcon}>
                {tile.imageUri ? (
                  <Image
                    source={{uri: tile.imageUri}}
                    style={styles.tileImage}
                    resizeMode="contain"
                  />
                ) : tile.icon ? (
                  <Icon name={tile.icon} size={22} color={Colors.black} />
                ) : null}
              </View>
              <Text style={styles.tileLabel}>{tile.label}</Text>
              <Icon name="chevron-right" size={20} color="#6B6B6B" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    tileGroup: {
      marginTop: 12,
      backgroundColor: Colors.white,
    },
    tile: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 18,
    },
    tileDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    tileIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#F6F6F6',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
      overflow: 'hidden',
    },
    tileImage: {
      width: 24,
      height: 24,
      backgroundColor: '#F6F6F6',
    },
    brandLogo: {
      width: 32,
      height: 20,
      marginHorizontal: 6,
      backgroundColor: '#F6F6F6',
    },
    tileLabel: {
      flex: 1,
      fontSize: 16,
      color: Colors.black,
      fontWeight: '500',
    },
    fieldLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginHorizontal: 16,
      marginTop: 18,
      marginBottom: 8,
    },
    cardInputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      paddingHorizontal: 14,
      paddingVertical: 4,
      borderRadius: 10,
      backgroundColor: '#F6F6F6',
    },
    cardNumberInput: {
      flex: 1,
      fontSize: 17,
      color: Colors.black,
      paddingVertical: 14,
      letterSpacing: 1,
    },
    scanBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    twoCol: {
      flexDirection: 'row',
      marginHorizontal: 0,
      marginTop: 4,
    },
    input: {
      marginHorizontal: 16,
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderRadius: 10,
      backgroundColor: '#F6F6F6',
      fontSize: 15,
      color: Colors.black,
    },
    countryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 16,
      paddingHorizontal: 14,
      paddingVertical: 16,
      borderRadius: 10,
      backgroundColor: '#F6F6F6',
    },
    countryText: {
      fontSize: 15,
      color: Colors.black,
      fontWeight: '500',
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
    cta: {
      backgroundColor: Colors.black,
      paddingVertical: 16,
      borderRadius: 999,
      alignItems: 'center',
    },
    ctaDisabled: {
      backgroundColor: '#E5E7EB',
    },
    ctaText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '700',
    },
    ctaTextDisabled: {
      color: '#6B6B6B',
    },
  });
