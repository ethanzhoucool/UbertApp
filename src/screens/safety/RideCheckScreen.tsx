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
  navigation: StackNavigationProp<RootStackParamList, 'RideCheck'>;
};

const BULLETS: {icon: string; title: string; desc: string}[] = [
  {
    icon: 'route',
    title: 'Unexpected route changes',
    desc: "If your driver goes off the expected route, we'll check in on you.",
  },
  {
    icon: 'hourglass-empty',
    title: 'Long unexpected stops',
    desc: 'A long mid-trip pause may indicate something is wrong.',
  },
  {
    icon: 'crash',
    title: 'Possible crash detected',
    desc: "If your phone's sensors look like a collision, we'll act fast.",
  },
  {
    icon: 'schedule',
    title: 'Early or late drop-off',
    desc: "Major mismatches against your trip's expected ETA.",
  },
];

export function RideCheckScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    console.log('[Ubert] RideCheckScreen mounted');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="About RideCheck" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 40}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Icon name="health-and-safety" size={36} color={Colors.white} />
          </View>
          <Text style={styles.heroTitle}>RideCheck has your back</Text>
          <Text style={styles.heroSub}>
            If your trip goes off course, takes an unexpected long stop, or
            ends early, we'll check in automatically.
          </Text>
        </View>

        <View style={styles.toggleCard}>
          <View style={{flex: 1, marginRight: 12}}>
            <Text style={styles.toggleTitle}>RideCheck</Text>
            <Text style={styles.toggleSub}>
              Auto check-ins during unusual trip events.
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

        <Text style={styles.sectionLabel}>WHAT WE LOOK FOR</Text>
        <View style={styles.bullets}>
          {BULLETS.map((b, i) => (
            <View
              key={b.title}
              style={[
                styles.bulletRow,
                i < BULLETS.length - 1 && styles.bulletDivider,
              ]}>
              <View style={styles.bulletIcon}>
                <Icon name={b.icon} size={20} color={Colors.black} />
              </View>
              <View style={{flex: 1, marginLeft: 12}}>
                <Text style={styles.bulletTitle}>{b.title}</Text>
                <Text style={styles.bulletDesc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.learnBtn}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert(
              'About RideCheck',
              'Visit help.uber.com to read the full RideCheck overview.',
            )
          }>
          <Icon name="open-in-new" size={18} color={Colors.black} />
          <Text style={styles.learnBtnText}>Learn more</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    hero: {paddingHorizontal: 24, paddingTop: 24, alignItems: 'flex-start'},
    heroIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: Colors.black,
      letterSpacing: -0.5,
      marginTop: 18,
    },
    heroSub: {fontSize: 15, color: '#444', lineHeight: 22, marginTop: 8},
    toggleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 16,
      padding: 16,
      backgroundColor: '#F6F6F6',
      borderRadius: 14,
    },
    toggleTitle: {fontSize: 16, fontWeight: '700', color: Colors.black},
    toggleSub: {fontSize: 13, color: '#6B6B6B', marginTop: 4, lineHeight: 18},
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginHorizontal: 16,
      marginTop: 14,
      marginBottom: 10,
    },
    bullets: {
      marginHorizontal: 16,
      backgroundColor: Colors.white,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#E5E7EB',
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    bulletDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    bulletIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F6F6F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bulletTitle: {fontSize: 15, fontWeight: '700', color: Colors.black},
    bulletDesc: {fontSize: 13, color: '#6B6B6B', marginTop: 4, lineHeight: 18},
    learnBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
      marginTop: 22,
      paddingVertical: 14,
      borderRadius: 30,
      borderWidth: 1.5,
      borderColor: Colors.black,
      gap: 8,
    },
    learnBtnText: {fontSize: 15, fontWeight: '700', color: Colors.black},
  });
