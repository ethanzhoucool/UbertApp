import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'NotificationsSettings'>;
};

type ToggleKey =
  | 'order'
  | 'driver'
  | 'eta'
  | 'promos'
  | 'special'
  | 'activity'
  | 'receipts';

const SECTIONS: {
  label: string;
  rows: {key: ToggleKey; icon: string; title: string; caption: string}[];
}[] = [
  {
    label: 'TRIP',
    rows: [
      {
        key: 'order',
        icon: 'delivery-dining',
        title: 'Order updates',
        caption: 'Status changes and confirmations.',
      },
      {
        key: 'driver',
        icon: 'directions-car',
        title: 'Driver alerts',
        caption: 'When your driver is en route or arrives.',
      },
      {
        key: 'eta',
        icon: 'schedule',
        title: 'ETA & arrival',
        caption: 'Realtime updates as your ride approaches.',
      },
    ],
  },
  {
    label: 'PROMOTIONS',
    rows: [
      {
        key: 'promos',
        icon: 'local-offer',
        title: 'Promotions & news',
        caption: 'New features and product updates.',
      },
      {
        key: 'special',
        icon: 'redeem',
        title: 'Special offers',
        caption: 'Personalized deals and discounts.',
      },
    ],
  },
  {
    label: 'ACCOUNT',
    rows: [
      {
        key: 'activity',
        icon: 'lock',
        title: 'Account activity',
        caption: 'Sign-ins and security notices.',
      },
      {
        key: 'receipts',
        icon: 'receipt-long',
        title: 'Receipts & reminders',
        caption: 'Trip receipts and scheduled ride reminders.',
      },
    ],
  },
];

export function NotificationsSettingsScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [values, setValues] = useState<Record<ToggleKey, boolean>>({
    order: true,
    driver: true,
    eta: true,
    promos: false,
    special: true,
    activity: true,
    receipts: true,
  });

  useEffect(() => {
    console.log('[Ubert] NotificationsSettingsScreen mounted');
  }, []);

  const setValue = (key: ToggleKey, v: boolean) =>
    setValues(prev => ({...prev, [key]: v}));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Notifications" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 32}}
        showsVerticalScrollIndicator={false}>
        {SECTIONS.map(section => (
          <View key={section.label} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.label}</Text>
            <View style={styles.sectionBody}>
              {section.rows.map((row, idx) => (
                <View
                  key={row.key}
                  style={[
                    styles.row,
                    idx < section.rows.length - 1 && styles.rowDivider,
                  ]}>
                  <View style={styles.rowIcon}>
                    <Icon name={row.icon} size={22} color={Colors.black} />
                  </View>
                  <View style={{flex: 1, marginRight: 16}}>
                    <Text style={styles.rowTitle}>{row.title}</Text>
                    <Text style={styles.rowCaption}>{row.caption}</Text>
                  </View>
                  <Switch
                    value={values[row.key]}
                    onValueChange={v => setValue(row.key, v)}
                    trackColor={{false: '#E5E7EB', true: Colors.black}}
                    thumbColor={Colors.white}
                    ios_backgroundColor="#E5E7EB"
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    section: {
      marginTop: 20,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginHorizontal: 16,
      marginBottom: 8,
    },
    sectionBody: {
      backgroundColor: Colors.white,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    rowIcon: {
      width: 32,
      alignItems: 'center',
      marginRight: 12,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    rowTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: Colors.black,
    },
    rowCaption: {
      fontSize: 13,
      color: '#6B6B6B',
      marginTop: 2,
    },
  });
