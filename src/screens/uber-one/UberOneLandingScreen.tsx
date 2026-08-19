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
import {UberOneGold} from '../../theme/uberOneGold';
import {SparkleField} from '../../components/uber-one/SparkleField';
import {SparklyGoldButton} from '../../components/uber-one/SparklyGoldButton';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'UberOneLanding'>;
};

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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={{paddingBottom: 180}}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, {paddingTop: insets.top + 12}]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
            <Icon name="close" size={22} color={Colors.iconPrimary} />
          </TouchableOpacity>

          {/* Uber One brand lockup with sparkly gold accent */}
          <View style={styles.brandLockup}>
            <Text style={styles.brandUber}>Uber</Text>
            <View style={styles.brandOneWrap}>
              <Text style={styles.brandOne}>One</Text>
              <SparkleField
                style={styles.brandSparkles}
                tone="onLight"
                sparkles={[
                  {top: -4, left: -6, size: 3, delay: 0, bright: true},
                  {top: 8, left: 52, size: 2.5, delay: 350, bright: true},
                  {top: 28, left: 18, size: 2, delay: 700},
                  {top: -2, left: 78, size: 2, delay: 180},
                ]}
              />
            </View>
          </View>
          <View style={styles.brandUnderlineWrap}>
            <View style={styles.brandUnderline} />
            <View style={styles.brandUnderlineShine} />
          </View>

          <Text style={styles.heroTitle}>
            Members save 10% on rides, free delivery, and more.
          </Text>

          {/* 3-row benefits list with sparkly gold checkmarks */}
          <View style={styles.perksList}>
            {PERKS.map(p => (
              <View key={p} style={styles.perkRow}>
                <View style={styles.perkCheck}>
                  <View style={styles.perkCheckShine} />
                  <Icon name="check" size={16} color={UberOneGold.onGold} />
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
          <Icon name="arrow-forward" size={18} color={Colors.iconPrimary} />
        </TouchableOpacity>

        <Text style={styles.legal}>
          Auto-renews monthly until cancelled. Cancel anytime in the app.
        </Text>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <SparklyGoldButton
          label="Try free for 1 month"
          onPress={() => navigation.navigate('UberOnePayment')}
        />
        <Text style={styles.subtitlePrice}>$9.99/mo after</Text>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.background},
    hero: {paddingHorizontal: 24, paddingBottom: 32},
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.closeBtnBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandLockup: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginTop: 42,
      gap: 8,
    },
    brandUber: {
      fontSize: 44,
      fontWeight: '900',
      color: Colors.textPrimary,
      letterSpacing: -1,
      lineHeight: 48,
    },
    brandOneWrap: {
      position: 'relative',
      paddingRight: 10,
      paddingTop: 6,
    },
    brandOne: {
      fontSize: 44,
      fontWeight: '900',
      // Pale gold is unreadable on white, so the wordmark uses the deep tone.
      color: UberOneGold.deep,
      letterSpacing: -1,
      lineHeight: 48,
      textShadowColor: UberOneGold.soft,
      textShadowOffset: {width: 0, height: 0},
      textShadowRadius: 10,
    },
    brandSparkles: {
      width: 100,
      height: 48,
    },
    brandUnderlineWrap: {
      width: 64,
      height: 5,
      marginTop: 12,
      borderRadius: 3,
      overflow: 'hidden',
      backgroundColor: UberOneGold.deep,
    },
    brandUnderline: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: UberOneGold.base,
    },
    brandUnderlineShine: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      backgroundColor: 'rgba(255,255,255,0.35)',
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: Colors.textPrimary,
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
      backgroundColor: UberOneGold.base,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: UberOneGold.bright,
      shadowColor: UberOneGold.bright,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.45,
      shadowRadius: 6,
    },
    perkCheckShine: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '45%',
      backgroundColor: 'rgba(255,255,255,0.28)',
    },
    perkText: {
      flex: 1,
      color: Colors.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    learnMore: {
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 18,
      backgroundColor: Colors.surfaceAlt,
      borderRadius: 22,
      marginTop: 8,
      gap: 8,
    },
    learnMoreText: {color: Colors.textPrimary, fontWeight: '700', fontSize: 14},
    legal: {
      fontSize: 12,
      color: Colors.textTertiary,
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
      backgroundColor: Colors.background,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
    },
    subtitlePrice: {
      color: Colors.textPrimary,
      fontSize: 13,
      textAlign: 'center',
      marginTop: 10,
      fontWeight: '600',
    },
  });
