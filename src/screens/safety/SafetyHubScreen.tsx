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
  navigation: StackNavigationProp<RootStackParamList, 'SafetyHub'>;
};

const BG = '#0E0E0F';
const SURFACE = '#1A1A1B';
const HAIRLINE = 'rgba(255,255,255,0.08)';
const TEXT_SUB = 'rgba(255,255,255,0.62)';

export function SafetyHubScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log('[Ubert] SafetyHubScreen mounted');
  }, []);

  const rows: {
    key: string;
    icon: string;
    title: string;
    sub: string;
    onPress: () => void;
  }[] = [
    {
      key: 'ridecheck',
      icon: 'health-and-safety',
      title: 'RideCheck',
      sub: 'We detect anomalies and check in if something goes wrong.',
      onPress: () => navigation.navigate('RideCheck'),
    },
    {
      key: 'contacts',
      icon: 'group',
      title: 'Trusted contacts',
      sub: 'Set up the people we should alert if you need help.',
      onPress: () => navigation.navigate('TrustedContacts'),
    },
    {
      key: 'share',
      icon: 'share-location',
      title: 'Share my trip',
      sub: 'Send your live location and ETA to anyone.',
      onPress: () => navigation.navigate('ShareTripSafety'),
    },
    {
      key: 'pin',
      icon: 'lock',
      title: 'PIN verification',
      sub: 'Verify your driver with a unique 4-digit PIN.',
      onPress: () => navigation.navigate('PinVerification'),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* Dark custom header (matches Uber's safety hub look) */}
      <View style={[styles.header, {paddingTop: insets.top + 6}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safety hub</Text>
        <View style={{width: 36}} />
      </View>

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 32}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Icon name="shield" size={40} color={Colors.white} />
          </View>
          <Text style={styles.heroTitle}>Safety hub</Text>
          <Text style={styles.heroSub}>
            Tools and information to help you feel safe on every trip.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>SAFETY TOOLKIT</Text>
        <View style={styles.group}>
          {rows.map((row, i) => (
            <TouchableOpacity
              key={row.key}
              style={[styles.row, i < rows.length - 1 && styles.rowDivider]}
              activeOpacity={0.7}
              onPress={row.onPress}>
              <View style={styles.iconWrap}>
                <Icon name={row.icon} size={22} color={Colors.white} />
              </View>
              <View style={{flex: 1, marginLeft: 12}}>
                <Text style={styles.rowTitle}>{row.title}</Text>
                <Text style={styles.rowSub}>{row.sub}</Text>
              </View>
              <Icon name="chevron-right" size={22} color={TEXT_SUB} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>EMERGENCY</Text>
        <View style={styles.group}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={[styles.iconWrap, {backgroundColor: '#3A0A0A'}]}>
              <Icon name="local-police" size={22} color="#FF6B6B" />
            </View>
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.rowTitle}>Call 911</Text>
              <Text style={styles.rowSub}>
                Connect to emergency services. Your trip details are shared.
              </Text>
            </View>
            <Icon name="chevron-right" size={22} color={TEXT_SUB} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: BG},
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 8,
      height: 56 + 6,
      backgroundColor: BG,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      fontSize: 17,
      fontWeight: '700',
      color: Colors.white,
      textAlign: 'center',
    },
    hero: {paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12},
    heroIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(255,255,255,0.08)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroTitle: {
      fontSize: 30,
      fontWeight: '800',
      color: Colors.white,
      letterSpacing: -0.5,
      marginTop: 16,
    },
    heroSub: {
      fontSize: 15,
      color: TEXT_SUB,
      lineHeight: 22,
      marginTop: 8,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: TEXT_SUB,
      letterSpacing: 0.7,
      marginHorizontal: 16,
      marginTop: 22,
      marginBottom: 10,
    },
    group: {
      marginHorizontal: 16,
      backgroundColor: SURFACE,
      borderRadius: 16,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 16,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: HAIRLINE,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.08)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowTitle: {fontSize: 16, fontWeight: '700', color: Colors.white},
    rowSub: {fontSize: 13, color: TEXT_SUB, marginTop: 4, lineHeight: 18},
  });
