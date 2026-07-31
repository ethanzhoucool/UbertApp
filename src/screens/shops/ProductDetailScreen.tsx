import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../navigation/types';
import {productsForStore} from '../../data/mockProducts';
import {addToShopsCart} from '../../store/shopsCart';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ProductDetail'>;
  route: RouteProp<RootStackParamList, 'ProductDetail'>;
};

type ReplacementPref = 'substitute' | 'contact' | 'refund';

const REPLACEMENT_OPTIONS: {
  key: ReplacementPref;
  title: string;
  sub: string;
}[] = [
  {
    key: 'substitute',
    title: 'Let shopper choose',
    sub: "We'll trust your shopper to pick the best substitute.",
  },
  {
    key: 'contact',
    title: 'Send a list of alternatives',
    sub: 'Choose from a few preferred replacements in chat.',
  },
  {
    key: 'refund',
    title: 'Refund the item',
    sub: 'Skip it entirely and refund this item only.',
  },
];

const HERO_HEIGHT = Math.min(Dimensions.get('window').width, 420);

export function ProductDetailScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const products = productsForStore(route.params.storeId);
  const product = products.find(p => p.id === route.params.productId);
  const [qty, setQty] = useState(1);
  const [replacement, setReplacement] = useState<ReplacementPref>('substitute');

  useEffect(() => {
    console.log('[Ubert] ProductDetailScreen mounted', route.params.productId);
  }, [route.params.productId]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={{padding: 20}}>Product not found.</Text>
      </View>
    );
  }

  const lineTotal = product.price * qty;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{paddingBottom: 160}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{uri: product.imageUrl}} style={styles.heroImg} />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.iconBtn, {top: insets.top + 8, left: 16}]}>
            <Icon name="arrow-back" size={20} color={Colors.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, {top: insets.top + 8, right: 16}]}
            activeOpacity={0.85}>
            <Icon name="favorite-border" size={20} color={Colors.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.unit}>{product.unit}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.qtyStepper}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(q => Math.max(1, q - 1))}>
                <Icon
                  name="remove"
                  size={20}
                  color={qty === 1 ? '#B0B0B0' : Colors.black}
                />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(q => q + 1)}>
                <Icon name="add" size={20} color={Colors.black} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionLabel}>REPLACEMENT PREFERENCES</Text>
          <View style={styles.replGroup}>
            {REPLACEMENT_OPTIONS.map((opt, i) => {
              const active = opt.key === replacement;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.replRow,
                    i < REPLACEMENT_OPTIONS.length - 1 && styles.replDivider,
                  ]}
                  onPress={() => setReplacement(opt.key)}
                  activeOpacity={0.7}>
                  <View
                    style={[styles.radio, active && styles.radioActive]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                  <View style={{flex: 1, marginLeft: 12}}>
                    <Text style={styles.replTitle}>{opt.title}</Text>
                    <Text style={styles.replSub}>{opt.sub}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.85}
          onPress={() => {
            addToShopsCart(product, qty, replacement);
            navigation.goBack();
          }}>
          <Text style={styles.addBtnText}>
            Add to cart · ${lineTotal.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    hero: {height: HERO_HEIGHT, backgroundColor: '#F6F6F6'},
    heroImg: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
      backgroundColor: '#F6F6F6',
    },
    iconBtn: {
      position: 'absolute',
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 2},
    },
    body: {paddingHorizontal: 16, paddingTop: 22},
    price: {fontSize: 30, fontWeight: '800', color: Colors.black, letterSpacing: -0.4},
    unit: {fontSize: 14, color: '#6B6B6B', marginTop: 2},
    name: {fontSize: 22, fontWeight: '700', color: Colors.black, marginTop: 12},
    qtyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 24,
    },
    qtyLabel: {flex: 1, fontSize: 16, fontWeight: '600', color: Colors.black},
    qtyStepper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 22,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingHorizontal: 4,
    },
    qtyBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qtyValue: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.black,
      minWidth: 24,
      textAlign: 'center',
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginTop: 32,
      marginBottom: 8,
    },
    replGroup: {
      backgroundColor: '#F6F6F6',
      borderRadius: 12,
      overflow: 'hidden',
    },
    replRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    replDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: '#C0C0C0',
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioActive: {borderColor: Colors.black},
    radioDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: Colors.black,
    },
    replTitle: {fontSize: 15, fontWeight: '600', color: Colors.black},
    replSub: {fontSize: 13, color: '#6B6B6B', marginTop: 2},
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 16,
      paddingTop: 10,
      backgroundColor: Colors.white,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#E5E7EB',
    },
    addBtn: {
      backgroundColor: '#06C167',
      borderRadius: 30,
      paddingVertical: 16,
      alignItems: 'center',
    },
    addBtnText: {color: Colors.white, fontWeight: '800', fontSize: 16, letterSpacing: 0.2},
  });
