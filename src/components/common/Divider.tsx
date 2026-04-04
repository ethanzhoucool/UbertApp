import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Colors} from '../../theme';

interface Props {
  style?: ViewStyle;
}

export function Divider({style}: Props) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray200,
  },
});
