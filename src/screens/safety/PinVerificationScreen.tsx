import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  Switch,
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
  navigation: StackNavigationProp<RootStackParamList, 'PinVerification'>;
};

export function PinVerificationScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [enabled, setEnabled] = useState(false);
  const [pin] = useState(['4', '2', '7', '9']);

  useEffect(() => {
    console.log('[Ubert] PinVerificationScreen mounted');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title="Set up PIN verification"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.pinHero}>
          <Text style={styles.heroTitle}>Make sure you're in the right car</Text>
          <Text style={styles.heroSub}>
            Your driver enters this 4-digit PIN before the trip begins.
          </Text>

          <View style={styles.digitsRow}>
            {pin.map((d, i) => (
              <View key={i} style={styles.digit}>
                <Text style={styles.digitText}>{d}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.pinHint}>Your PIN refreshes for every trip.</Text>
        </View>

        <View style={styles.toggleCard}>
          <View style={{flex: 1, marginRight: 12}}>
            <Text style={styles.toggleTitle}>Require a PIN</Text>
            <Text style={styles.toggleSub}>
              You'll see a fresh PIN before your driver arrives.
            </Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{false: '#E5E7EB', true: Colors.black}}
            thumbColor={Colors.white}
            ios_backgroundColor="#E5E7EB"
          />
        </View>

        <View style={styles.tipCard}>
          <Icon name="info-outline" size={20} color={Colors.black} />
          <Text style={styles.tipText}>
            You can always turn this off and switch back to regular pickups
            from this screen.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.85}
          onPress={() =>
            Alert.alert(
              enabled ? 'PIN turned on' : 'PIN turned off',
              enabled
                ? "Drivers will now need to enter your PIN before every trip."
                : 'PIN verification is now off.',
            )
          }>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    pinHero: {paddingHorizontal: 24, paddingTop: 24, alignItems: 'center'},
    heroTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: Colors.black,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    heroSub: {
      fontSize: 15,
      color: '#444',
      lineHeight: 22,
      marginTop: 8,
      textAlign: 'center',
    },
    digitsRow: {flexDirection: 'row', gap: 12, marginTop: 24},
    digit: {
      width: 60,
      height: 78,
      borderRadius: 14,
      backgroundColor: '#F6F6F6',
      borderWidth: 2,
      borderColor: '#E5E7EB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    digitText: {fontSize: 36, fontWeight: '900', color: Colors.black},
    pinHint: {fontSize: 13, color: '#6B6B6B', marginTop: 14},
    toggleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 28,
      padding: 16,
      backgroundColor: '#F6F6F6',
      borderRadius: 14,
    },
    toggleTitle: {fontSize: 16, fontWeight: '700', color: Colors.black},
    toggleSub: {fontSize: 13, color: '#6B6B6B', marginTop: 4, lineHeight: 18},
    tipCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      margin: 16,
      padding: 14,
      backgroundColor: Colors.surfaceMuted,
      borderRadius: 12,
      gap: 12,
    },
    tipText: {flex: 1, fontSize: 13, color: '#444', lineHeight: 18},
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
    saveBtnText: {color: Colors.white, fontWeight: '800', fontSize: 16, letterSpacing: 0.2},
  });
