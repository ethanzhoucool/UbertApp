import React, {useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'UberOneBenefits'>;
};

const SECTIONS: {
  title: string;
  rows: {icon: string; label: string; desc: string}[];
}[] = [
  {
    title: 'EATS',
    rows: [
      {
        icon: 'restaurant',
        label: '$0 Delivery Fee on food',
        desc: 'Eligible orders over $15 from a wide range of restaurants.',
      },
      {
        icon: 'percent',
        label: '5–10% off pickup orders',
        desc: 'Save extra on pickup at participating spots.',
      },
      {
        icon: 'fastfood',
        label: 'Member Mondays',
        desc: 'Special offers every Monday on eligible orders.',
      },
    ],
  },
  {
    title: 'RIDES',
    rows: [
      {
        icon: 'flight',
        label: '6% Uber Cash on airport rides',
        desc: 'Get back Uber Cash on every eligible airport pickup.',
      },
      {
        icon: 'wifi',
        label: 'Top-tier support',
        desc: 'Priority help for Uber One members, 24/7.',
      },
    ],
  },
  {
    title: 'GROCERY & RETAIL',
    rows: [
      {
        icon: 'shopping-cart',
        label: '$0 Delivery Fee on groceries',
        desc: 'On eligible orders over $35.',
      },
      {
        icon: 'local-offer',
        label: '5% off eligible orders',
        desc: 'Automatic discount applied at checkout.',
      },
    ],
  },
];

export function UberOneBenefitsScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log('[Ubert] UberOneBenefitsScreen mounted');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title="Uber One benefits"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 24}}
        showsVerticalScrollIndicator={false}>
        {SECTIONS.map(section => (
          <View key={section.title}>
            <Text style={styles.sectionLabel}>{section.title}</Text>
            <View style={styles.group}>
              {section.rows.map((row, i) => (
                <View
                  key={row.label}
                  style={[
                    styles.row,
                    i < section.rows.length - 1 && styles.rowDivider,
                  ]}>
                  <View style={styles.iconWrap}>
                    <Icon name={row.icon} size={22} color={Colors.black} />
                  </View>
                  <View style={{flex: 1, marginLeft: 12}}>
                    <Text style={styles.rowTitle}>{row.label}</Text>
                    <Text style={styles.rowSub}>{row.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginHorizontal: 16,
      marginTop: 18,
      marginBottom: 8,
    },
    group: {
      marginHorizontal: 16,
      backgroundColor: Colors.white,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#E5E7EB',
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#F6F6F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowTitle: {fontSize: 15, fontWeight: '600', color: Colors.black},
    rowSub: {fontSize: 13, color: '#6B6B6B', marginTop: 4, lineHeight: 18},
  });
