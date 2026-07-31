import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {UbertButton} from '../../components/common/UbertButton';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'PackageRecipient'>;
  route: RouteProp<RootStackParamList, 'PackageRecipient'>;
};

export function PackageRecipientScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {draft} = route.params;
  const [name, setName] = useState(draft.recipientName ?? 'Alex Johnson');
  const [phone, setPhone] = useState(
    draft.recipientPhone ?? '+1 (555) 030-4455',
  );
  const [address, setAddress] = useState(
    draft.recipientAddress ?? '1 World Trade Center, New York, NY',
  );
  const [instructions, setInstructions] = useState('');
  const [requireSignature, setRequireSignature] = useState(false);

  useEffect(() => {
    console.log('[Ubert] PackageRecipientScreen mounted');
  }, []);

  const handleNext = () => {
    navigation.navigate('PackageConfirm', {
      draft: {
        ...draft,
        recipientName: name,
        recipientPhone: phone,
        recipientAddress: address,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title="Drop-off details"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Drop-off details</Text>

        <TouchableOpacity style={styles.addressCard} activeOpacity={0.7}>
          <View style={styles.addressSquare} />
          <View style={{flex: 1}}>
            <Text style={styles.addressLabel}>Drop-off address</Text>
            <Text style={styles.addressValue} numberOfLines={1}>
              {address}
            </Text>
          </View>
          <Icon name="chevron-right" size={22} color={Colors.gray500} />
        </TouchableOpacity>

        <View style={styles.fieldCard}>
          <Field
            label="Recipient name"
            value={name}
            onChangeText={setName}
            required
          />
          <View style={styles.fieldDivider} />
          <Field
            label="Recipient phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            required
          />
        </View>

        <Text style={styles.subHeading}>Drop-off instructions</Text>
        <View style={styles.fieldCard}>
          <TextInput
            style={styles.multilineInput}
            value={instructions}
            onChangeText={setInstructions}
            multiline
            placeholder="Leave at door, give to doorman, etc."
            placeholderTextColor={Colors.gray500}
          />
        </View>

        <View style={[styles.toggleCard, {marginTop: 18}]}>
          <View style={{flex: 1, marginRight: 12}}>
            <Text style={styles.toggleTitle}>Require signature on delivery</Text>
            <Text style={styles.toggleSub}>
              The driver will ask the recipient to sign for the package.
            </Text>
          </View>
          <Switch
            value={requireSignature}
            onValueChange={setRequireSignature}
            trackColor={{false: '#D1D1D6', true: Colors.black}}
            thumbColor={Platform.OS === 'android' ? Colors.white : undefined}
            ios_backgroundColor="#D1D1D6"
          />
        </View>

        <Text style={styles.helperText}>
          We'll text your recipient a tracking link and pickup PIN.
        </Text>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <UbertButton title="Next" onPress={handleNext} />
      </View>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  required,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
  required?: boolean;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>
        {label}
        {required ? <Text style={styles.requiredMark}> *</Text> : null}
      </Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.gray500}
      />
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  scroll: {flex: 1},
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.black,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 14,
    letterSpacing: -0.4,
  },
  subHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.black,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderRadius: 14,
    marginBottom: 12,
  },
  addressSquare: {
    width: 14,
    height: 14,
    backgroundColor: Colors.black,
    marginLeft: 5,
    marginRight: 17,
  },
  addressLabel: {fontSize: 12, color: Colors.gray700, fontWeight: '600'},
  addressValue: {
    fontSize: 15,
    color: Colors.black,
    fontWeight: '600',
    marginTop: 2,
  },
  fieldCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
  },
  fieldDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderSubtle,
    marginLeft: 14,
  },
  fieldWrap: {paddingHorizontal: 14, paddingVertical: 10},
  fieldLabel: {
    fontSize: 12,
    color: Colors.gray700,
    fontWeight: '600',
    marginBottom: 2,
  },
  requiredMark: {color: Colors.error},
  fieldInput: {
    paddingVertical: 4,
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },
  multilineInput: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 90,
    fontSize: 15,
    color: Colors.black,
    textAlignVertical: 'top',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderRadius: 14,
  },
  toggleTitle: {fontSize: 15, fontWeight: '700', color: Colors.black},
  toggleSub: {fontSize: 13, color: Colors.gray700, marginTop: 4},
  helperText: {
    marginHorizontal: 20,
    marginTop: 10,
    fontSize: 12,
    color: Colors.gray700,
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
