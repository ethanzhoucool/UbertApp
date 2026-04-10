import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '../../theme';

export type TabKey = 'home' | 'services' | 'activity' | 'account';

const tabs: {key: TabKey; icon: string; label: string}[] = [
  {key: 'home', icon: 'home', label: 'Home'},
  {key: 'services', icon: 'grid-view', label: 'Services'},
  {key: 'activity', icon: 'receipt-long', label: 'Activity'},
  {key: 'account', icon: 'person-outline', label: 'Account'},
];

interface Props {
  onTabPress?: (tab: TabKey) => void;
  activeTab?: TabKey;
}

export function BottomTabBar({onTabPress, activeTab = 'home'}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom || 8}]}>
      <View style={styles.divider} />
      <View style={styles.tabs}>
        {tabs.map(tab => {
          const active = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.6}
              onPress={() => onTabPress?.(tab.key)}>
              <Icon
                name={tab.icon}
                size={24}
                color={active ? Colors.black : Colors.gray500}
              />
              <Text
                style={[
                  styles.label,
                  {color: active ? Colors.black : Colors.gray500},
                  active && styles.labelActive,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
