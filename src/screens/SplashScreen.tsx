import React, {useEffect, useMemo, useRef} from 'react';
import {View, Animated, StyleSheet, StatusBar} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import {useColors, ColorPalette} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Splash'>;
};

export function SplashScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Home');
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, opacity]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.Text style={[styles.logo, {opacity}]}>UBERT</Animated.Text>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      fontSize: 48,
      fontWeight: '800',
      color: Colors.white,
      letterSpacing: -1,
    },
  });
