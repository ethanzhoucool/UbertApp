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
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {UbertButton} from '../../components/common/UbertButton';
import {PackageSize, RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'PackageConfirm'>;
  route: RouteProp<RootStackParamList, 'PackageConfirm'>;
};

const SIZE_LABELS: Record<PackageSize, string> = {
  envelope: 'Envelope',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

const SIZE_FARE: Record<PackageSize, number> = {
  envelope: 9.99,
  small: 14.99,
  medium: 22.5,
  large: 32.0,
};

export function PackageConfirmScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {draft} = route.params;
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    console.log('[Ubert] PackageConfirmScreen mounted');
  }, []);

  const fare = useMemo(() => SIZE_FARE[draft.size], [draft.size]);

  const truncate = (s: string | undefined, n = 32) => {
    if (!s) return '—';
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
  };

  const handleSend = () => {
    if (!confirmed) return;
    navigation.navigate('PackageTracking', {draft});
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title="Review and send"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{paddingBottom: insets.bottom + 140}}
        showsVerticalScrollIndicator={false}>
        {/* Map preview */}
        <View style={styles.mapCard}>
          <View style={styles.mapStreetH1} />
          <View style={styles.mapStreetH2} />
          <View style={styles.mapStreetV1} />
          <View style={styles.mapStreetV2} />
          <View style={styles.mapPolyline} />
          <View style={[styles.mapPin, styles.mapPinFrom]}>
            <View style={styles.mapPinFromInner} />
          </View>
          <View style={[styles.mapPin, styles.mapPinTo]} />
        </View>

        <Text style={styles.heading}>Review and send</Text>

        {/* Summary card */}
        <View style={styles.card}>
          <SummaryRow
            label="Package"
            primary={SIZE_LABELS[draft.size]}
            secondary={draft.description || 'No description'}
          />
          <View style={styles.divider} />
          <SummaryRow
            label="From"
            primary={draft.senderName ?? '—'}
            secondary={truncate(draft.senderAddress)}
          />
          <View style={styles.divider} />
          <SummaryRow
            label="To"
            primary={draft.recipientName ?? '—'}
            secondary={truncate(draft.recipientAddress)}
          />
        </View>

        {/* Fare + ETA */}
        <View style={[styles.card, {marginTop: 12}]}>
          <View style={styles.fareRow}>
            <View style={styles.fareIcon}>
              <Icon name="local-shipping" size={22} color={Colors.black} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.fareValue}>${fare.toFixed(2)} estimated</Text>
              <Text style={styles.fareSub}>20–30 min</Text>
            </View>
          </View>
        </View>

        {/* Payment method */}
        <TouchableOpacity
          style={[styles.card, styles.paymentRow]}
          activeOpacity={0.7}>
          <View style={styles.paymentIcon}>
            <Icon name="payment" size={22} color={Colors.black} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.paymentLabel}>Payment</Text>
            <Text style={styles.paymentValue}>Visa •••• 4242</Text>
          </View>
          <Icon name="chevron-right" size={22} color={Colors.gray500} />
        </TouchableOpacity>

        {/* Terms confirmation */}
        <View style={[styles.card, styles.termsCard]}>
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setConfirmed(c => !c)}
            activeOpacity={0.7}>
            <View
              style={[
                styles.checkbox,
                confirmed && styles.checkboxChecked,
              ]}>
              {confirmed && (
                <Icon name="check" size={16} color={Colors.white} />
              )}
            </View>
            <Text style={styles.termsLabel}>
              I confirm my package does not contain alcohol, medication,
              recreational drugs, weapons, money or gift cards, fragile items,
              or other prohibited items.
            </Text>
          </TouchableOpacity>
          <Text style={styles.termsFootnote}>
            Uber does not maintain insurance for packages. See full terms.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <UbertButton
          title="Send package"
          onPress={handleSend}
          disabled={!confirmed}
        />
      </View>
    </View>
  );
}

function SummaryRow({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: string;
  secondary: string;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <View style={{flex: 1}}>
        <Text style={styles.summaryPrimary}>{primary}</Text>
        <Text style={styles.summarySecondary} numberOfLines={1}>
          {secondary}
        </Text>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  scroll: {flex: 1},

  // Map placeholder
  mapCard: {
    marginHorizontal: 16,
    marginTop: 12,
    height: 140,
    borderRadius: 14,
    backgroundColor: '#E6EBE9',
    overflow: 'hidden',
  },
  mapStreetH1: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 40,
    height: 6,
    backgroundColor: '#FFFFFF',
  },
  mapStreetH2: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    height: 4,
    backgroundColor: '#FFFFFF',
  },
  mapStreetV1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '30%',
    width: 5,
    backgroundColor: '#FFFFFF',
  },
  mapStreetV2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '70%',
    width: 5,
    backgroundColor: '#FFFFFF',
  },
  mapPolyline: {
    position: 'absolute',
    left: '32%',
    right: '28%',
    top: 60,
    height: 3,
    backgroundColor: Colors.black,
    transform: [{rotate: '-8deg'}],
  },
  mapPin: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinFrom: {
    left: '28%',
    top: 52,
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.black,
  },
  mapPinFromInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.black,
  },
  mapPinTo: {
    right: '24%',
    top: 70,
    backgroundColor: Colors.black,
    width: 14,
    height: 14,
    borderRadius: 0,
  },

  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.black,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: -0.4,
  },

  card: {
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
  },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  summaryLabel: {
    width: 72,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray700,
    marginTop: 2,
  },
  summaryPrimary: {fontSize: 15, fontWeight: '700', color: Colors.black},
  summarySecondary: {fontSize: 13, color: Colors.gray700, marginTop: 2},
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderSubtle,
    marginLeft: 14,
  },

  // Fare
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  fareIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  fareValue: {fontSize: 16, fontWeight: '800', color: Colors.black},
  fareSub: {fontSize: 13, color: Colors.gray700, marginTop: 2},

  // Payment
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 12,
  },
  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  paymentLabel: {fontSize: 12, color: Colors.gray700, fontWeight: '600'},
  paymentValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.black,
    marginTop: 2,
  },

  // Terms
  termsCard: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  termsRow: {flexDirection: 'row', alignItems: 'flex-start'},
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.gray500,
    marginRight: 12,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxChecked: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  termsLabel: {
    flex: 1,
    fontSize: 13,
    color: Colors.black,
    lineHeight: 18,
  },
  termsFootnote: {
    marginTop: 10,
    marginLeft: 34,
    fontSize: 12,
    color: Colors.gray700,
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
});
