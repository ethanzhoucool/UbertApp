import React, {useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'UberOneSuccess'>;
};

const GOLD = '#C8A24B';
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
          <View style={styles.checkInner}>
            <Icon name="check" size={56} color={BG} />
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
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() =>
            navigation.reset({index: 0, routes: [{name: 'Home'}]})
          }>
          <Text style={styles.primaryBtnText}>Get started</Text>
        </TouchableOpacity>
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
        <Icon name={icon} size={20} color={GOLD} />
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
      backgroundColor: 'rgba(200,162,75,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    checkInner: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: GOLD,
      alignItems: 'center',
      justifyContent: 'center',
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
      backgroundColor: 'rgba(200,162,75,0.12)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemText: {color: Colors.white, fontSize: 15, fontWeight: '600'},
    footer: {paddingHorizontal: 24, paddingTop: 10},
    primaryBtn: {
      backgroundColor: Colors.white,
      borderRadius: 30,
      paddingVertical: 16,
      alignItems: 'center',
    },
    primaryBtnText: {color: BG, fontWeight: '900', fontSize: 16, letterSpacing: 0.2},
  });
