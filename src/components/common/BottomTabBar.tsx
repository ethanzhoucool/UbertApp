import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '../../theme';

const tabs = [
  {icon: 'home', label: 'Home', active: true},
  {icon: 'grid-view', label: 'Services', active: false},
  {icon: 'receipt-long', label: 'Activity', active: false},
  {icon: 'person-outline', label: 'Account', active: false},
];

export function BottomTabBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom || 8}]}>
      <View style={styles.divider} />
      <View style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab.label} style={styles.tab} activeOpacity={0.6}>
            <Icon
              name={tab.icon}
              size={24}
              color={tab.active ? Colors.black : Colors.gray500}
            />
            <Text
              style={[
                styles.label,
                {color: tab.active ? Colors.black : Colors.gray500},
                tab.active && styles.labelActive,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray200,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 4,
    minWidth: 64,
  },
  label: {
    fontSize: 11,
    marginTop: 3,
    fontWeight: '400',
  },
  labelActive: {
    fontWeight: '600',
  },
});
