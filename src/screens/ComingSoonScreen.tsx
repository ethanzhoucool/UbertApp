import React from 'react';
import {View, StyleSheet, StatusBar, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../components/common/ScreenHeader';
import {UbertButton} from '../components/common/UbertButton';
import {RootStackParamList} from '../navigation/types';
import {Colors} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ComingSoon'>;
  route: RouteProp<RootStackParamList, 'ComingSoon'>;
};

export function ComingSoonScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const {title, description, icon} = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Icon name={icon} size={48} color={Colors.black} />
        </View>
        <Text style={styles.heading}>{title} is coming soon</Text>
        <Text style={styles.desc}>{description}</Text>
        <View style={styles.badge}>
          <Icon name="schedule" size={14} color={Colors.gray700} />
          <Text style={styles.badgeText}>Not yet available in your area</Text>
        </View>
      </View>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <UbertButton
          title="Notify me when it launches"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F1F2F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.black,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  desc: {
    fontSize: 15,
    color: Colors.gray700,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F2F4',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray700,
    marginLeft: 6,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    backgroundColor: Colors.white,
  },
});
