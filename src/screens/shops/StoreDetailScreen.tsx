import React, {useEffect, useMemo} from 'react';
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
import {getStoreById, defaultAisles} from '../../data/mockStores';
import {productsForStore} from '../../data/mockProducts';
import {useShopsCart, cartSubtotal} from '../../store/shopsCart';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'StoreDetail'>;
  route: RouteProp<RootStackParamList, 'StoreDetail'>;
};

const SCREEN_W = Dimensions.get('window').width;
const GRID_GUTTER = 12;
const GRID_PADDING = 16;
const TILE_W = (SCREEN_W - GRID_PADDING * 2 - GRID_GUTTER) / 2;

export function StoreDetailScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const store = getStoreById(route.params.storeId);
  const cart = useShopsCart();

  useEffect(() => {
    console.log('[Ubert] StoreDetailScreen mounted', route.params.storeId);
  }, [route.params.storeId]);

  if (!store) {
    return (
      <View style={styles.container}>
        <Text style={{padding: 20}}>Store not found.</Text>
      </View>
    );
  }

  const allProducts = productsForStore(store.id);
  const cartCount = cart.lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{paddingBottom: cartCount > 0 ? 120 : 40}}
        showsVerticalScrollIndicator={false}>
        {/* Full-bleed parallax hero */}
        <View style={styles.hero}>
          <Image source={{uri: store.imageUrl}} style={styles.heroImg} />
          <View style={styles.heroOverlay} />
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

        {/* Store header card — overlaps hero */}
        <View style={styles.headerCard}>
          {store.brand && (
            <View
              style={[
                styles.brandBadge,
                {backgroundColor: store.brand.bg},
              ]}>
              <Text style={[styles.brandBadgeText, {color: store.brand.fg}]}>
                {store.brand.initials}
              </Text>
            </View>
          )}
          <Text style={styles.storeName}>{store.name}</Text>
          <View style={styles.metaRow}>
            <Icon name="star" size={14} color={Colors.starYellow} />
            <Text style={styles.metaText}>{store.rating.toFixed(1)}</Text>
            <Text style={styles.metaDot}> · </Text>
            <Icon name="schedule" size={13} color="#6B6B6B" />
            <Text style={styles.metaText}>{store.etaMinutes} min</Text>
            <Text style={styles.metaDot}> · </Text>
            <Text style={styles.metaText}>{store.deliveryFee} delivery</Text>
          </View>
          {store.minOrder && (
            <Text style={styles.minOrder}>{store.minOrder}</Text>
          )}

          <TouchableOpacity
            style={styles.cartHeaderBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ShopsCart')}>
            <Icon name="shopping-cart" size={18} color={Colors.black} />
            <Text style={styles.cartHeaderText}>Cart</Text>
            <Icon name="expand-more" size={20} color={Colors.black} />
          </TouchableOpacity>
        </View>

        {/* Horizontally scrollable aisle chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.aisleChipsRow}>
          <TouchableOpacity
            style={styles.aisleAllChip}
            activeOpacity={0.75}
            onPress={() =>
              navigation.navigate('Aisles', {storeId: store.id})
            }>
            <Icon name="view-list" size={16} color={Colors.white} />
            <Text style={styles.aisleAllText}>All aisles</Text>
          </TouchableOpacity>
          {defaultAisles.map(a => (
            <TouchableOpacity
              key={a.id}
              style={styles.aisleChip}
              activeOpacity={0.75}
              onPress={() =>
                navigation.navigate('Aisles', {storeId: store.id})
              }>
              <Icon name={a.icon} size={16} color={Colors.black} />
              <Text style={styles.aisleChipText}>{a.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product grid */}
        <Text style={styles.gridTitle}>Popular near you</Text>
        <View style={styles.grid}>
          {allProducts.map(p => (
            <TouchableOpacity
              key={p.id}
              style={styles.gridTile}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  storeId: store.id,
                  productId: p.id,
                })
              }>
              <Image source={{uri: p.imageUrl}} style={styles.gridImg} />
              <TouchableOpacity
                style={styles.gridAddBtn}
                onPress={() =>
                  navigation.navigate('ProductDetail', {
                    storeId: store.id,
                    productId: p.id,
                  })
                }>
                <Icon name="add" size={18} color={Colors.black} />
              </TouchableOpacity>
              <Text style={styles.gridPrice}>${p.price.toFixed(2)}</Text>
              <Text style={styles.gridName} numberOfLines={2}>
                {p.name}
              </Text>
              <Text style={styles.gridUnit}>{p.unit}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {cartCount > 0 && (
        <View style={[styles.cartBar, {paddingBottom: insets.bottom + 12}]}>
          <TouchableOpacity
            style={styles.cartBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ShopsCart')}>
            <View style={styles.cartCountPill}>
              <Text style={styles.cartCountText}>{cartCount}</Text>
            </View>
            <Text style={styles.cartLabel}>View cart</Text>
            <Text style={styles.cartTotal}>
              ${cartSubtotal(cart.lines).toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    hero: {height: 220},
    heroImg: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
      backgroundColor: '#F6F6F6',
    },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.18)',
    },
    iconBtn: {
      position: 'absolute',
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerCard: {
      marginTop: -22,
      marginHorizontal: 16,
      padding: 16,
      borderRadius: 16,
      backgroundColor: Colors.white,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#E5E7EB',
    },
    brandBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      marginBottom: 10,
    },
    brandBadgeText: {fontSize: 12, fontWeight: '900', letterSpacing: 0.4},
    storeName: {
      fontSize: 22,
      fontWeight: '800',
      color: Colors.black,
      letterSpacing: -0.3,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
      gap: 4,
    },
    metaText: {fontSize: 13, color: '#6B6B6B', fontWeight: '500'},
    metaDot: {color: '#6B6B6B'},
    minOrder: {fontSize: 13, color: '#6B6B6B', marginTop: 6},
    cartHeaderBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      marginTop: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: Colors.surfaceMuted,
      borderRadius: 20,
      gap: 6,
    },
    cartHeaderText: {fontSize: 13, fontWeight: '700', color: Colors.black},
    aisleChipsRow: {paddingHorizontal: 16, paddingTop: 16, gap: 8},
    aisleAllChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 22,
      backgroundColor: Colors.black,
      gap: 6,
    },
    aisleAllText: {fontSize: 13, fontWeight: '700', color: Colors.white},
    aisleChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 22,
      backgroundColor: '#F6F6F6',
      gap: 6,
    },
    aisleChipText: {fontSize: 13, fontWeight: '600', color: Colors.black},
    gridTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: Colors.black,
      marginHorizontal: 16,
      marginTop: 22,
      marginBottom: 12,
      letterSpacing: -0.2,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: GRID_PADDING,
      gap: GRID_GUTTER,
    },
    gridTile: {
      width: TILE_W,
      marginBottom: 16,
    },
    gridImg: {
      width: TILE_W,
      height: TILE_W,
      borderRadius: 12,
      backgroundColor: '#F6F6F6',
    },
    gridAddBtn: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 2},
    },
    gridPrice: {
      fontSize: 16,
      fontWeight: '800',
      color: Colors.black,
      marginTop: 8,
      letterSpacing: -0.2,
    },
    gridName: {fontSize: 13, color: Colors.black, marginTop: 2},
    gridUnit: {fontSize: 12, color: '#6B6B6B', marginTop: 2},
    cartBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 16,
      paddingTop: 8,
      backgroundColor: Colors.white,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#E5E7EB',
    },
    cartBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#06C167',
      borderRadius: 30,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 10,
    },
    cartCountPill: {
      backgroundColor: 'rgba(255,255,255,0.28)',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    cartCountText: {color: Colors.white, fontWeight: '800', fontSize: 13},
    cartLabel: {flex: 1, color: Colors.white, fontWeight: '800', fontSize: 15},
    cartTotal: {color: Colors.white, fontWeight: '800', fontSize: 15},
  });
