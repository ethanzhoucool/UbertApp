import React, {useEffect, useMemo} from 'react';
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
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'UberOneLanding'>;
};

const GOLD = '#C8A24B';
const BG = '#0A0A0B';
const SURFACE = '#161618';
const TEXT_SUB = 'rgba(255,255,255,0.72)';

const PERKS = [
  '10% off rides and eligible Eats orders',
  'Free delivery on eligible orders',
  '6% Uber Cash back on airport rides',
];

export function UberOneLandingScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log('[Ubert] UberOneLandingScreen mounted');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      <ScrollView
        contentContainerStyle={{paddingBottom: 180}}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, {paddingTop: insets.top + 12}]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
            <Icon name="close" size={22} color={Colors.white} />
          </TouchableOpacity>

          {/* Uber One brand lockup with gold underline */}
          <View style={styles.brandLockup}>
            <Text style={styles.brandUber}>Uber</Text>
            <Text style={styles.brandOne}>One</Text>
          </View>
          <View style={styles.brandUnderline} />

          <Text style={styles.heroTitle}>
            Members save 10% on rides, free delivery, and more.
          </Text>

          {/* 3-row benefits list with gold checkmarks */}
          <View style={styles.perksList}>
            {PERKS.map(p => (
              <View key={p} style={styles.perkRow}>
                <View style={styles.perkCheck}>
                  <Icon name="check" size={16} color={BG} />
                </View>
                <Text style={styles.perkText}>{p}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.learnMore}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('UberOneBenefits')}>
          <Text style={styles.learnMoreText}>See all benefits</Text>
          <Icon name="arrow-forward" size={18} color={Colors.white} />
        </TouchableOpacity>

        <Text style={styles.legal}>
          Auto-renews monthly until cancelled. Cancel anytime in the app.
        </Text>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <TouchableOpacity
          style={styles.subscribeBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('UberOnePayment')}>
          <Text style={styles.subscribeBtnText}>Try free for 1 month</Text>
        </TouchableOpacity>
        <Text style={styles.subtitlePrice}>$9.99/mo after</Text>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: BG},
    hero: {paddingHorizontal: 24, paddingBottom: 32},
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandLockup: {flexDirection: 'row', alignItems: 'flex-end', marginTop: 42, gap: 8},
    brandUber: {
      fontSize: 44,
      fontWeight: '900',
      color: Colors.white,
      letterSpacing: -1,
      lineHeight: 48,
    },
    brandOne: {
      fontSize: 44,
      fontWeight: '900',
      color: GOLD,
      letterSpacing: -1,
      lineHeight: 48,
    },
    brandUnderline: {
      width: 56,
      height: 4,
      borderRadius: 2,
      backgroundColor: GOLD,
      marginTop: 12,
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: Colors.white,
      marginTop: 22,
      letterSpacing: -0.4,
      lineHeight: 36,
    },
    perksList: {marginTop: 28, gap: 14},
    perkRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
    perkCheck: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: GOLD,
      alignItems: 'center',
      justifyContent: 'center',
    },
    perkText: {flex: 1, color: Colors.white, fontSize: 15, fontWeight: '600'},
    learnMore: {
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 18,
      backgroundColor: SURFACE,
      borderRadius: 22,
      marginTop: 8,
      gap: 8,
    },
    learnMoreText: {color: Colors.white, fontWeight: '700', fontSize: 14},
    legal: {
      fontSize: 12,
      color: TEXT_SUB,
      textAlign: 'center',
      marginTop: 22,
      marginHorizontal: 24,
      lineHeight: 18,
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 16,
      paddingTop: 10,
      backgroundColor: BG,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: 'rgba(255,255,255,0.1)',
    },
    subscribeBtn: {
      backgroundColor: GOLD,
      borderRadius: 30,
      paddingVertical: 16,
      alignItems: 'center',
    },
    subscribeBtnText: {color: BG, fontWeight: '900', fontSize: 16, letterSpacing: 0.2},
    subtitlePrice: {
      color: Colors.white,
      fontSize: 13,
      textAlign: 'center',
      marginTop: 10,
      fontWeight: '600',
    },
  });
