import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {UbertButton} from '../../components/common/UbertButton';
import {RootStackParamList} from '../../navigation/types';
import {vehicleGlyph} from '../../data/mockCars';
import {useColors, ColorPalette, Colors} from '../../theme';

function pickPartnerTextColor(bg: string): string {
  return bg === '#FFD400' ? Colors.black : Colors.white;
}

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'RentConfirm'>;
  route: RouteProp<RootStackParamList, 'RentConfirm'>;
};

type ProtectionKey = 'basic' | 'standard' | 'premium';

interface ProtectionOption {
  key: ProtectionKey;
  title: string;
  desc: string;
  perDay: number;
  bar: string;
  icon: string;
}

const PROTECTIONS: ProtectionOption[] = [
  {
    key: 'basic',
    title: 'Basic',
    desc: 'Included · Liability only',
    perDay: 0,
    bar: '#9CA3AF',
    icon: 'shield',
  },
  {
    key: 'standard',
    title: 'Standard',
    desc: '+$14.99/day · Damage waiver included',
    perDay: 14.99,
    bar: '#3B82F6',
    icon: 'shield',
  },
  {
    key: 'premium',
    title: 'Premium',
    desc: '+$24.99/day · Full coverage + roadside',
    perDay: 24.99,
    bar: '#8B5CF6',
    icon: 'security',
  },
];

interface AddOn {
  key: string;
  label: string;
  perDay: number;
}

const ADDONS: AddOn[] = [
  {key: 'driver', label: 'Additional driver', perDay: 13},
  {key: 'gps', label: 'GPS navigation', perDay: 9.99},
  {key: 'child', label: 'Child seat', perDay: 11},
  {key: 'ski', label: 'Ski rack', perDay: 15},
];

export function RentConfirmScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {draft} = route.params;

  const [protection, setProtection] = useState<ProtectionKey>('standard');
  const [addons, setAddons] = useState<Record<string, boolean>>({
    gps: true,
  });
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    console.log('[Ubert] RentConfirmScreen mounted');
  }, []);

  // Rough: 7 days, mirroring the trip-summary card on the browse screen.
  const days = 7;

  const totals = useMemo(() => {
    const baseRate = draft.car.dailyRate * days;
    const protOpt = PROTECTIONS.find(p => p.key === protection)!;
    const protectionCost = protOpt.perDay * days;
    const addonCost = ADDONS.reduce(
      (sum, a) => (addons[a.key] ? sum + a.perDay * days : sum),
      0,
    );
    const taxes = (baseRate + protectionCost + addonCost) * 0.115;
    const total = baseRate + protectionCost + addonCost + taxes;
    return {baseRate, protectionCost, addonCost, taxes, total};
  }, [draft, protection, addons]);

  const handleReserve = () => {
    if (!agreed) {
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{name: 'Home', params: {toast: 'Rental confirmed'}}],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Confirm rental" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 140}}
        showsVerticalScrollIndicator={false}>
        {/* Trip details */}
        <SectionTitle text="Trip details" />
        <View style={styles.section}>
          <View style={styles.tripRow}>
            <View style={styles.tripDot} />
            <View style={styles.tripBody}>
              <Text style={styles.tripLabel}>Pick-up</Text>
              <Text style={styles.tripValue}>
                {draft.car.partnerName} — SFO Rental Counter
              </Text>
              <View style={styles.tripSubRow}>
                <Icon name="event" size={13} color={Colors.gray700} />
                <Text style={styles.tripSub}>{draft.pickupDate}</Text>
              </View>
            </View>
          </View>
          <View style={styles.tripConnector} />
          <View style={styles.tripRow}>
            <View style={[styles.tripDot, styles.tripDotEnd]} />
            <View style={styles.tripBody}>
              <Text style={styles.tripLabel}>Return</Text>
              <Text style={styles.tripValue}>
                {draft.car.partnerName} — SFO Rental Counter
              </Text>
              <View style={styles.tripSubRow}>
                <Icon name="event" size={13} color={Colors.gray700} />
                <Text style={styles.tripSub}>{draft.returnDate}</Text>
              </View>
            </View>
          </View>
          <View style={styles.vehicleRow}>
            <View
              style={[
                styles.vehicleThumb,
                {backgroundColor: draft.car.heroColor},
              ]}>
              <Icon
                name={vehicleGlyph(draft.car.classification)}
                size={28}
                color="rgba(255,255,255,0.92)"
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.vehicleName}>
                {draft.car.make} {draft.car.model} or similar
              </Text>
              <View style={styles.vehicleSubRow}>
                <View
                  style={[
                    styles.partnerLogoChip,
                    {backgroundColor: draft.car.partnerColor},
                  ]}>
                  <Text
                    style={[
                      styles.partnerLogoText,
                      {color: pickPartnerTextColor(draft.car.partnerColor)},
                    ]}>
                    {draft.car.partnerName}
                  </Text>
                </View>
                <Text style={styles.vehicleClass}>{draft.car.classification}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Protection */}
        <SectionTitle text="Protection" />
        <View style={styles.section}>
          {PROTECTIONS.map(p => {
            const selected = protection === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                activeOpacity={0.85}
                onPress={() => setProtection(p.key)}
                style={[
                  styles.protCard,
                  selected && styles.protCardSelected,
                ]}>
                <View style={[styles.protBar, {backgroundColor: p.bar}]} />
                <View style={[styles.protIcon, {backgroundColor: p.bar}]}>
                  <Icon name={p.icon} size={18} color={Colors.white} />
                </View>
                <View style={styles.protBody}>
                  <Text style={styles.protTitle}>{p.title}</Text>
                  <Text style={styles.protDesc}>{p.desc}</Text>
                </View>
                {selected ? (
                  <Icon
                    name="check-circle"
                    size={24}
                    color={Colors.black}
                  />
                ) : (
                  <View style={styles.radio} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add-ons */}
        <SectionTitle text="Add-ons" />
        <View style={styles.section}>
          {ADDONS.map(a => (
            <View key={a.key} style={styles.addonRow}>
              <View style={{flex: 1}}>
                <Text style={styles.addonLabel}>
                  {a.label}{' '}
                  <Text style={styles.addonPrice}>+${a.perDay}/day</Text>
                </Text>
              </View>
              <Switch
                value={!!addons[a.key]}
                onValueChange={v =>
                  setAddons(prev => ({...prev, [a.key]: v}))
                }
                trackColor={{false: '#E5E7EB', true: Colors.black}}
                thumbColor={Colors.white}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          ))}
        </View>

        {/* Driver details */}
        <SectionTitle text="Driver details" />
        <View style={styles.section}>
          <InfoRow icon="person" label="Full name" value="Ethan Zhou" />
          <InfoRow icon="email" label="Email" value="ethan.st.zhou@gmail.com" />
          <InfoRow icon="phone" label="Phone" value="+1 (415) 555-0142" />
          <InfoRow
            icon="badge"
            label="Driver's license"
            value="CA · D1234567"
          />
        </View>

        {/* Payment */}
        <SectionTitle text="Payment" />
        <View style={styles.section}>
          <View style={styles.payRow}>
            <View style={styles.payIcon}>
              <Icon name="credit-card" size={20} color={Colors.black} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.payName}>Visa •••• 4821</Text>
              <Text style={styles.paySub}>Default · Uber Wallet</Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.gray500} />
          </View>
        </View>

        {/* Price details */}
        <SectionTitle text="Price details" />
        <View style={styles.section}>
          <PriceRow
            label={`Base rate (${days} days × $${draft.car.dailyRate})`}
            value={totals.baseRate}
          />
          <PriceRow
            label="Protection"
            value={totals.protectionCost}
          />
          <PriceRow label="Add-ons" value={totals.addonCost} />
          <PriceRow label="Taxes & fees" value={totals.taxes} />
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${totals.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Terms checkbox */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.termsRow}
          onPress={() => setAgreed(v => !v)}>
          <View
            style={[
              styles.checkbox,
              agreed && styles.checkboxOn,
            ]}>
            {agreed ? (
              <Icon name="check" size={14} color={Colors.white} />
            ) : null}
          </View>
          <Text style={styles.termsText}>
            I agree to the terms and conditions
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <UbertButton
          title="Reserve"
          onPress={handleReserve}
          disabled={!agreed}
        />
      </View>
    </View>
  );
}

function SectionTitle({text}: {text: string}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return <Text style={styles.sectionTitle}>{text}</Text>;
}

function PriceRow({label, value}: {label: string; value: number}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>{label}</Text>
      <Text style={styles.priceValue}>${value.toFixed(2)}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Icon name={icon} size={18} color={Colors.black} />
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      <Icon name="chevron-right" size={20} color={Colors.gray500} />
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},

  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },

  // Trip details
  tripRow: {flexDirection: 'row', paddingHorizontal: 14, paddingTop: 12},
  tripDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.black,
    marginTop: 6,
    marginRight: 12,
  },
  tripDotEnd: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  tripBody: {flex: 1},
  tripLabel: {fontSize: 11, color: Colors.gray700, fontWeight: '700'},
  tripValue: {fontSize: 14, fontWeight: '700', color: Colors.black, marginTop: 2},
  tripSubRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4},
  tripSub: {fontSize: 13, color: Colors.gray700, marginLeft: 4},
  tripConnector: {
    width: 2,
    height: 14,
    backgroundColor: '#D1D5DB',
    marginLeft: 14 + 4,
    marginVertical: 4,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEE',
    marginTop: 8,
    gap: 12,
  },
  vehicleThumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#D8DCE2',
  },
  vehicleThumbImg: {width: '100%', height: '100%'},
  vehicleThumbBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleName: {fontSize: 14, fontWeight: '800', color: Colors.black},
  vehicleSubRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8},
  vehicleClass: {fontSize: 12, color: Colors.gray700, marginLeft: 8},
  partnerLogoChip: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  partnerLogoText: {fontSize: 11, fontWeight: '800', letterSpacing: 0.2},

  // Protection cards
  protCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingRight: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  protCardSelected: {
    backgroundColor: '#FAFAFA',
  },
  protBar: {
    width: 4,
    height: 36,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    marginRight: 12,
  },
  protIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  protBody: {flex: 1},
  protTitle: {fontSize: 15, fontWeight: '800', color: Colors.black},
  protDesc: {fontSize: 12, color: Colors.gray700, marginTop: 2},
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {borderColor: Colors.black},
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.black,
  },

  // Add-ons
  addonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  addonLabel: {fontSize: 14, color: Colors.black, fontWeight: '600'},
  addonPrice: {color: Colors.gray700, fontWeight: '600'},

  // Driver info
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    gap: 12,
  },
  infoIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  infoLabel: {fontSize: 11, color: Colors.gray700, fontWeight: '700'},
  infoValue: {fontSize: 14, color: Colors.black, fontWeight: '600', marginTop: 2},

  // Payment
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  payIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  payName: {fontSize: 15, fontWeight: '800', color: Colors.black},
  paySub: {fontSize: 12, color: Colors.gray700, marginTop: 2},

  // Price details
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  priceLabel: {fontSize: 13, color: Colors.gray700, flex: 1, marginRight: 12},
  priceValue: {fontSize: 13, color: Colors.black, fontWeight: '700'},
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 14,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  totalLabel: {fontSize: 16, fontWeight: '800', color: Colors.black},
  totalValue: {fontSize: 18, fontWeight: '800', color: Colors.black},

  // Terms
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxOn: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  termsText: {fontSize: 14, color: Colors.black, flex: 1},

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
