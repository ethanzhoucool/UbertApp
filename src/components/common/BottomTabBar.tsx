import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useColors, ColorPalette} from '../../theme';

export type TabKey = 'home' | 'services' | 'activity' | 'account';

const tabs: {
  key: TabKey;
  icon: string;
  label: string;
}[] = [
  {key: 'home', icon: 'home', label: 'Home'},
  {key: 'services', icon: 'apps', label: 'Services'},
  {key: 'activity', icon: 'receipt-long', label: 'Activity'},
  {key: 'account', icon: 'account-circle', label: 'Account'},
];

interface Props {
  onTabPress?: (tab: TabKey) => void;
  activeTab?: TabKey;
}

export function BottomTabBar({onTabPress, activeTab = 'home'}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  // One scale value per tab, briefly bumped when that tab becomes active.
  const scales = useRef(
    tabs.reduce<Record<TabKey, Animated.Value>>((acc, t) => {
      acc[t.key] = new Animated.Value(1);
      return acc;
    }, {} as Record<TabKey, Animated.Value>),
  ).current;
  // Label scales — visual haptic-equivalent on tab change (1 -> 1.03 -> 1).
  const labelScales = useRef(
    tabs.reduce<Record<TabKey, Animated.Value>>((acc, t) => {
      acc[t.key] = new Animated.Value(1);
      return acc;
    }, {} as Record<TabKey, Animated.Value>),
  ).current;

  useEffect(() => {
    const v = scales[activeTab];
    if (!v) {
      return;
    }
    Animated.sequence([
      Animated.timing(v, {
        toValue: 1.08,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(v, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start();

    const labelV = labelScales[activeTab];
    if (labelV) {
      Animated.sequence([
        Animated.timing(labelV, {
          toValue: 1.03,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(labelV, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activeTab, scales, labelScales]);

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom + 4}]}>
      <View style={styles.tabs}>
        {tabs.map(tab => {
          const active = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.6}
              onPress={() => onTabPress?.(tab.key)}>
              <Animated.View
                style={{transform: [{scale: scales[tab.key]}]}}>
                <Icon
                  name={tab.icon}
                  size={26}
                  color={active ? Colors.black : Colors.muted}
                />
              </Animated.View>
              <Animated.View
                style={{transform: [{scale: labelScales[tab.key]}]}}>
                <Text
                  style={[
                    styles.label,
                    {color: active ? Colors.black : Colors.muted},
                    active && styles.labelActive,
                  ]}>
                  {tab.label}
                </Text>
              </Animated.View>
              <View
                style={[
                  styles.indicator,
                  active ? styles.indicatorActive : null,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.white,
      borderTopWidth: 0.5,
      borderTopColor: Colors.hairline,
    },
    tabs: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 10,
    },
    tab: {
      alignItems: 'center',
      paddingVertical: 4,
      minWidth: 64,
    },
    label: {
      fontSize: 11,
      marginTop: 4,
      fontWeight: '400',
    },
    labelActive: {
      fontWeight: '700',
    },
    indicator: {
      marginTop: 4,
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: 'transparent',
    },
    indicatorActive: {
      backgroundColor: Colors.black,
    },
  });
