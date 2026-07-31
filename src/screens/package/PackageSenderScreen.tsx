import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
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
  navigation: StackNavigationProp<RootStackParamList, 'PackageSender'>;
  route: RouteProp<RootStackParamList, 'PackageSender'>;
};

export function PackageSenderScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {draft} = route.params;
  const [name, setName] = useState(draft.senderName ?? 'Ethan Zhou');
  const [phone, setPhone] = useState(draft.senderPhone ?? '+1 (555) 010-2233');
  const [address, setAddress] = useState(
    draft.senderAddress ?? '350 5th Ave, New York, NY',
  );
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    console.log('[Ubert] PackageSenderScreen mounted');
  }, []);

  const handleNext = () => {
    navigation.navigate('PackageRecipient', {
      draft: {
        ...draft,
        senderName: name,
        senderPhone: phone,
        senderAddress: address,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Pickup details" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Pickup details</Text>

        <TouchableOpacity style={styles.addressCard} activeOpacity={0.7}>
          <View style={styles.addressDot}>
            <View style={styles.addressDotInner} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.addressLabel}>Pickup address</Text>
            <Text style={styles.addressValue} numberOfLines={1}>
              {address}
            </Text>
          </View>
          <Icon name="chevron-right" size={22} color={Colors.gray500} />
        </TouchableOpacity>

        <View style={styles.fieldCard}>
          <Field
            label="Sender name"
            value={name}
            onChangeText={setName}
            required
          />
          <View style={styles.fieldDivider} />
          <Field
            label="Sender phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            required
          />
        </View>

        <Text style={styles.subHeading}>Pickup instructions</Text>
        <View style={styles.fieldCard}>
          <TextInput
            style={styles.multilineInput}
            value={instructions}
            onChangeText={setInstructions}
            multiline
            placeholder="Add a note for the driver (gate code, building entrance, etc.)"
            placeholderTextColor={Colors.gray500}
          />
        </View>
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
  addressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.black,
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
