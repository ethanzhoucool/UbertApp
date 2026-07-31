import React, {useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Settings'>;
};

type RowDef = {
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
};

export function SettingsScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log('[Ubert] SettingsScreen mounted');
  }, []);

  const showComingSoon = (label: string) => () =>
    Alert.alert(label, 'Coming soon.');

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => navigation.navigate('Home', {toast: 'Signed out'}),
      },
    ]);
  };

  const sections: {label: string; rows: RowDef[]}[] = [
    {
      label: 'PERSONAL',
      rows: [
        {
          label: 'Edit account',
          onPress: () => navigation.navigate('EditProfile'),
        },
        {label: 'Family and teens', onPress: showComingSoon('Family and teens')},
        {
          label: 'Manage Uber One',
          onPress: () => navigation.navigate('UberOneLanding'),
        },
      ],
    },
    {
      label: 'SAFETY',
      rows: [
        {
          label: 'Safety hub',
          onPress: () => navigation.navigate('SafetyHub'),
        },
      ],
    },
    {
      label: 'LOGIN & SECURITY',
      rows: [
        {label: 'Password', onPress: showComingSoon('Password')},
        {
          label: '2-step verification',
          onPress: showComingSoon('2-step verification'),
        },
        {
          label: 'Trusted contacts',
          onPress: () => navigation.navigate('TrustedContacts'),
        },
      ],
    },
    {
      label: 'PRIVACY & DATA',
      rows: [
        {
          label: 'Privacy Center',
          onPress: () => navigation.navigate('PrivacySettings'),
        },
        {label: 'App permissions', onPress: showComingSoon('App permissions')},
      ],
    },
    {
      label: 'COMMUNICATION',
      rows: [
        {
          label: 'Notification preferences',
          onPress: () => navigation.navigate('NotificationsSettings'),
        },
        {label: 'Do not disturb', onPress: showComingSoon('Do not disturb')},
      ],
    },
    {
      label: 'APPEARANCE',
      rows: [
        {
          label: 'Appearance',
          value: 'System',
          onPress: showComingSoon('Appearance'),
        },
      ],
    },
    {
      label: 'LANGUAGE',
      rows: [
        {
          label: 'App language',
          value: 'English',
          onPress: () => navigation.navigate('LanguageSettings'),
        },
      ],
    },
    {
      label: 'NOTIFICATIONS',
      rows: [
        {label: 'Push', onPress: showComingSoon('Push notifications')},
        {label: 'Email', onPress: showComingSoon('Email notifications')},
        {label: 'SMS', onPress: showComingSoon('SMS notifications')},
      ],
    },
    {
      label: 'ABOUT',
      rows: [
        {label: 'Terms', onPress: showComingSoon('Terms')},
        {label: 'Privacy notice', onPress: showComingSoon('Privacy notice')},
        {label: 'About', onPress: showComingSoon('About')},
        {label: 'Sign out', onPress: handleSignOut, danger: true},
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 32}}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.profileRow}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('EditProfile')}>
          <Image
            source={{
              uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=ethan&backgroundColor=fcd34d&radius=50',
            }}
            style={styles.profileAvatar}
          />
          <View style={{flex: 1, marginLeft: 14}}>
            <Text style={styles.profileName}>Ethan Zhou</Text>
            <Text style={styles.profilePhone}>+1 (555) 010-2233</Text>
          </View>
          <Icon name="chevron-right" size={22} color="#6B6B6B" />
        </TouchableOpacity>

        {sections.map(section => (
          <View key={section.label} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.label}</Text>
            <View style={styles.sectionBody}>
              {section.rows.map((row, idx) => (
                <TouchableOpacity
                  key={row.label}
                  style={[
                    styles.row,
                    idx < section.rows.length - 1 && styles.rowDivider,
                  ]}
                  onPress={row.onPress}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.rowLabel,
                      row.danger && {color: '#E11900'},
                    ]}>
                    {row.label}
                  </Text>
                  <View style={styles.rowRight}>
                    {row.value && (
                      <Text style={styles.rowValue}>{row.value}</Text>
                    )}
                    {!row.danger && (
                      <Icon
                        name="chevron-right"
                        size={20}
                        color="#6B6B6B"
                        style={{marginLeft: 6}}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.version}>Uber · v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 18,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    profileAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#F6F6F6',
    },
    profileName: {
      fontSize: 18,
      fontWeight: '700',
      color: Colors.black,
    },
    profilePhone: {
      fontSize: 14,
      color: '#6B6B6B',
      marginTop: 2,
    },
    section: {
      marginTop: 24,
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
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    rowLabel: {
      fontSize: 16,
      color: Colors.black,
      fontWeight: '500',
    },
    rowRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowValue: {
      fontSize: 15,
      color: '#6B6B6B',
    },
    version: {
      textAlign: 'center',
      fontSize: 12,
      color: '#6B6B6B',
      marginTop: 28,
    },
  });
