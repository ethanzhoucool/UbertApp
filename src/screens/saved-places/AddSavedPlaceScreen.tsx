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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {placeIconOptions} from '../../data/mockSavedPlaces';
import {upsertSavedPlace} from './SavedPlacesScreen';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'AddSavedPlace'>;
};

export function AddSavedPlaceScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [icon, setIcon] = useState<string>('place');

  useEffect(() => {
    console.log('[Ubert] AddSavedPlaceScreen mounted');
  }, []);

  const canSave = label.trim().length > 0 && address.trim().length > 0;

  const handleSave = () => {
    if (!canSave) {
      return;
    }
    upsertSavedPlace({
      id: `sp-${Date.now()}`,
      label: label.trim(),
      address: address.trim(),
      icon,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title="New saved place"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 100}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.fieldLabel}>LABEL</Text>
        <TextInput
          style={styles.input}
          value={label}
          onChangeText={setLabel}
          placeholder="e.g. Gym, Mom's house"
          placeholderTextColor="#9A9A9A"
        />

        <Text style={styles.fieldLabel}>ADDRESS</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Street address"
          placeholderTextColor="#9A9A9A"
        />

        <Text style={styles.fieldLabel}>ICON</Text>
        <View style={styles.iconGrid}>
          {placeIconOptions.map(opt => {
            const active = opt.value === icon;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.iconCell,
                  active && styles.iconCellActive,
                ]}
                activeOpacity={0.7}
                onPress={() => setIcon(opt.value)}>
                <Icon
                  name={opt.value}
                  size={22}
                  color={active ? Colors.white : Colors.black}
                />
                <Text
                  style={[
                    styles.iconLabel,
                    active && {color: Colors.white},
                  ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <TouchableOpacity
          style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
          activeOpacity={canSave ? 0.85 : 1}
          onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save place</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B6B6B',
    letterSpacing: 0.6,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 6,
  },
  input: {
    marginHorizontal: 16,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.black,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  iconCell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
    gap: 6,
  },
  iconCellActive: {backgroundColor: Colors.black},
  iconLabel: {fontSize: 13, fontWeight: '600', color: Colors.black},
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
  saveBtn: {
    backgroundColor: Colors.black,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnDisabled: {opacity: 0.4},
  saveBtnText: {color: Colors.white, fontWeight: '800', fontSize: 16, letterSpacing: 0.2},
});
