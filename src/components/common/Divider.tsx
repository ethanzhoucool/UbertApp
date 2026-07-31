import React, {useMemo} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useColors, ColorPalette} from '../../theme';

interface Props {
  style?: ViewStyle;
}

export function Divider({style}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return <View style={[styles.divider, style]} />;
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.gray200,
    },
  });
