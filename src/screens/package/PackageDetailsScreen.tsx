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
import {UbertButton} from '../../components/common/UbertButton';
import {PackageSize, RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'PackageDetails'>;
};

const SIZES: {key: PackageSize; label: string; sub: string; glyph: string}[] = [
  {
    key: 'envelope',
    label: 'Envelope',
    sub: 'Documents · up to 5 lbs',
    glyph: '✉️',
  },
  {
    key: 'small',
    label: 'Small',
    sub: 'Up to 20 lbs · Fits in a backpack',
    glyph: '\u{1F4E6}',
  },
  {
    key: 'medium',
    label: 'Medium',
    sub: 'Up to 50 lbs · Fits in a car trunk',
    glyph: '\u{1F4E6}',
  },
  {
    key: 'large',
    label: 'Large',
    sub: 'Up to 150 lbs · Fits across the back seat',
    glyph: '\u{1F4E6}',
  },
];

export function PackageDetailsScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState<PackageSize | null>(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    console.log('[Ubert] PackageDetailsScreen mounted');
  }, []);

  const canContinue = size !== null;

  const handleNext = () => {
    if (!size) return;
    navigation.navigate('PackageSender', {
      draft: {size, description},
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Send a package" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>What are you sending?</Text>

        <View style={styles.card}>
          {SIZES.map((s, i) => {
            const active = size === s.key;
            return (
              <TouchableOpacity
                key={s.key}
                style={[
                  styles.sizeRow,
                  i < SIZES.length - 1 && styles.sizeRowDivider,
                  active && styles.sizeRowActive,
                ]}
                onPress={() => setSize(s.key)}
                activeOpacity={0.7}>
                <View style={styles.glyphWrap}>
                  <Text style={styles.glyph}>{s.glyph}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.sizeLabel}>{s.label}</Text>
                  <Text style={styles.sizeSub}>{s.sub}</Text>
                </View>
                <Icon name="chevron-right" size={22} color={Colors.gray500} />
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.subHeading}>Package description</Text>
        <View style={styles.descCard}>
          <TextInput
            style={styles.descInput}
            placeholder="Birthday gift, documents"
            placeholderTextColor={Colors.gray500}
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <UbertButton
          title="Next"
          onPress={handleNext}
          disabled={!canContinue}
        />
      </View>
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
  card: {
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
  },
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Colors.white,
  },
  sizeRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderSubtle,
  },
  sizeRowActive: {
    backgroundColor: '#F2F2F2',
    borderLeftWidth: 3,
    borderLeftColor: Colors.black,
  },
  glyphWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  glyph: {fontSize: 20},
  sizeLabel: {fontSize: 16, fontWeight: '700', color: Colors.black},
  sizeSub: {fontSize: 13, color: Colors.gray700, marginTop: 2},
  descCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
  },
  descInput: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontSize: 15,
    color: Colors.black,
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
