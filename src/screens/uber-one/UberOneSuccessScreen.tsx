import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet, StatusBar, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';
import {UberOneGold} from '../../theme/uberOneGold';
import {SparkleField} from '../../components/uber-one/SparkleField';
import {SparklyGoldButton} from '../../components/uber-one/SparklyGoldButton';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'UberOneSuccess'>;
};

const BG = '#0A0A0B';

export function UberOneSuccessScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log('[Ubert] UberOneSuccessScreen mounted');
  }, []);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      <View style={styles.content}>
        <View style={styles.checkOuter}>
          <SparkleField
            style={styles.checkSparkles}
            sparkles={[
              {top: 8, left: 14, size: 3, delay: 0, bright: true},
              {top: 20, left: 96, size: 2.5, delay: 280, bright: true},
              {top: 88, left: 18, size: 2, delay: 560},
              {top: 96, left: 90, size: 3, delay: 140, bright: true},
              {top: 52, left: 4, size: 2, delay: 720},
              {top: 48, left: 108, size: 2, delay: 400},
            ]}
          />
          <View style={styles.checkInner}>
            <View style={styles.checkShine} />
            <Icon name="check" size={56} color={UberOneGold.onGold} />
          </View>
        </View>

        <Text style={styles.title}>Welcome to Uber One</Text>
        <Text style={styles.sub}>Your benefits are active</Text>

        <View style={styles.benefitsList}>
          <Item icon="local-shipping" label="$0 delivery on eligible orders" />
          <Item icon="percent" label="Up to 10% off restaurants" />
          <Item icon="flight" label="6% back on airport rides" />
        </View>
      </View>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 16}]}>
        <SparklyGoldButton
          label="Get started"
          onPress={() =>
            navigation.reset({index: 0, routes: [{name: 'Home'}]})
          }
        />
      </View>
    </View>
  );
}

function Item({icon, label}: {icon: string; label: string}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.item}>
      <View style={styles.itemIcon}>
        <Icon name={icon} size={20} color={UberOneGold.base} />
      </View>
      <Text style={styles.itemText}>{label}</Text>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BG,
      justifyContent: 'space-between',
    },
    content: {flex: 1, paddingHorizontal: 32, justifyContent: 'center'},
    checkOuter: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: UberOneGold.soft,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    checkSparkles: {
      width: 120,
      height: 120,
    },
    checkInner: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: UberOneGold.base,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: UberOneGold.bright,
      shadowColor: UberOneGold.bright,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.6,
      shadowRadius: 16,
    },
    checkShine: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '42%',
      backgroundColor: 'rgba(255,255,255,0.28)',
    },
    title: {
      fontSize: 30,
      fontWeight: '800',
      color: Colors.white,
      textAlign: 'center',
      marginTop: 32,
      letterSpacing: -0.4,
    },
    sub: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.78)',
      textAlign: 'center',
      marginTop: 10,
      lineHeight: 22,
    },
    benefitsList: {marginTop: 40, gap: 14},
    item: {flexDirection: 'row', alignItems: 'center', gap: 12},
    itemIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: UberOneGold.softer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemText: {color: Colors.white, fontSize: 15, fontWeight: '600'},
    footer: {paddingHorizontal: 24, paddingTop: 10},
  });
