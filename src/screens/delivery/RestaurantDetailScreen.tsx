import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../navigation/types';
import {findRestaurant, MenuItem} from '../../data/mockRestaurants';
import {useTrip} from '../../store/TripContext';
import {useColors, ColorPalette} from '../../theme';

const EATS_GREEN = '#06C167';
const META_GRAY = '#6B6B6B';
const FILL_GRAY = '#F6F6F6';
const HERO_HEIGHT = 220;

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'RestaurantDetail'>;
  route: RouteProp<RootStackParamList, 'RestaurantDetail'>;
};

export function RestaurantDetailScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {state, dispatch} = useTrip();
  const restaurant = findRestaurant(route.params.restaurantId);
  const [activeSection, setActiveSection] = useState<string>('popular');
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('[Ubert] RestaurantDetailScreen mounted');
  }, []);

  const cartCount = useMemo(
    () => state.cart.reduce((sum, line) => sum + line.quantity, 0),
    [state.cart],
  );

  const cartSubtotal = useMemo(
    () =>
      state.cart.reduce(
        (sum, line) => sum + line.item.price * line.quantity,
        0,
      ),
    [state.cart],
  );

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <View style={[styles.fallbackHeader, {paddingTop: insets.top + 8}]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconBubble}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
            <Icon name="arrow-back" size={20} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.fallbackTitle}>Restaurant</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Restaurant not found.</Text>
        </View>
      </View>
    );
  }

  const handleAdd = (item: MenuItem) => {
    dispatch({type: 'ADD_CART_ITEM', payload: {restaurant, item}});
  };

  const etaText = restaurant.etaMaxMinutes
    ? `${restaurant.etaMinutes}–${restaurant.etaMaxMinutes} min`
    : `${restaurant.etaMinutes} min`;

  const heroTranslate = scrollY.interpolate({
    inputRange: [-HERO_HEIGHT, 0, HERO_HEIGHT],
    outputRange: [HERO_HEIGHT / 2, 0, -HERO_HEIGHT / 3],
    extrapolate: 'clamp',
  });

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.setValue(e.nativeEvent.contentOffset.y);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Parallax hero */}
      <Animated.View
        style={[
          styles.hero,
          {
            backgroundColor: restaurant.heroColor ?? restaurant.imageColor,
            transform: [{translateY: heroTranslate}],
          },
        ]}>
        {restaurant.heroUri ? (
          <Image
            source={{uri: restaurant.heroUri}}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <Icon name="restaurant" size={64} color="rgba(255,255,255,0.45)" />
        )}
        <View style={styles.heroScrim} />
      </Animated.View>

      {/* Floating hero buttons */}
      <View style={[styles.heroBtnRow, {top: insets.top + 8}]}>
        <TouchableOpacity
          style={styles.iconBubble}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon name="arrow-back" size={20} color={Colors.black} />
        </TouchableOpacity>
        <View style={{flex: 1}} />
        <TouchableOpacity
          style={[styles.iconBubble, {marginRight: 8}]}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon name="ios-share" size={18} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBubble}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon name="favorite-border" size={20} color={Colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <View style={{height: HERO_HEIGHT - 24}} />

        {/* Header card */}
        <View style={styles.headerCard}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.cuisineTags}>
            {restaurant.cuisineTags ??
              `${restaurant.priceTier ?? '$$'} · ${restaurant.cuisine}`}
          </Text>

          <View style={styles.ratingRow}>
            <Icon name="star" size={14} color={Colors.black} />
            <Text style={styles.ratingText}>
              {restaurant.rating.toFixed(1)} ({restaurant.ratingCount ?? '500+'} ratings)
            </Text>
            <Text style={styles.ratingLink}> · See reviews</Text>
          </View>

          <Text style={styles.infoLine}>
            {etaText} · ${restaurant.deliveryFee.toFixed(2)} Delivery Fee · Group order
          </Text>

          <View style={styles.hoursPill}>
            <View style={styles.hoursDot} />
            <Text style={styles.hoursText}>
              {restaurant.hours ?? 'Open until 10:00 PM'}
            </Text>
          </View>
        </View>

        {/* Sticky tab bar */}
        <View style={styles.tabBarWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabBar}>
            {restaurant.menu.map(section => {
              const active = activeSection === section.id;
              return (
                <TouchableOpacity
                  key={section.id}
                  style={styles.tabItem}
                  onPress={() => setActiveSection(section.id)}
                  activeOpacity={0.7}>
                  <Text
                    style={[styles.tabLabel, active && styles.tabLabelActive]}>
                    {section.title}
                  </Text>
                  {active && <View style={styles.tabUnderline} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Menu sections */}
        {restaurant.menu.map(section => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map(item => (
              <MenuRow
                key={item.id}
                item={item}
                onAdd={() => handleAdd(item)}
                onPress={() =>
                  navigation.navigate('RestaurantItemDetail', {
                    restaurantId: restaurant.id,
                    itemId: item.id,
                  })
                }
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Floating green cart bar */}
      {cartCount > 0 && (
        <View style={[styles.cartBarWrap, {paddingBottom: insets.bottom + 12}]}>
          <TouchableOpacity
            style={styles.cartBar}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('DeliveryCart')}>
            <Text style={styles.cartBarText}>
              View cart · {cartCount} item{cartCount === 1 ? '' : 's'} · $
              {cartSubtotal.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function MenuRow({
  item,
  onAdd,
  onPress,
}: {
  item: MenuItem;
  onAdd: () => void;
  onPress: () => void;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.menuItemBody}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
      </View>

      <View
        style={[
          styles.menuThumb,
          {backgroundColor: item.thumbColor ?? '#E5E7EB'},
        ]}>
        {item.imageUri && (
          <Image
            source={{uri: item.imageUri}}
            style={styles.menuThumbImage}
            resizeMode="cover"
          />
        )}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={onAdd}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon name="add" size={18} color={Colors.black} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    hero: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: HERO_HEIGHT,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    heroImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    heroScrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.08)',
    },
    heroBtnRow: {
      position: 'absolute',
      left: 12,
      right: 12,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 10,
    },
    iconBubble: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 2,
    },
    headerCard: {
      backgroundColor: Colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
    },
    name: {
      fontSize: 24,
      fontWeight: '800',
      color: Colors.black,
      letterSpacing: -0.4,
    },
    cuisineTags: {
      fontSize: 13,
      color: META_GRAY,
      marginTop: 6,
      fontWeight: '500',
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    ratingText: {
      fontSize: 13,
      fontWeight: '700',
      color: Colors.black,
      marginLeft: 4,
    },
    ratingLink: {
      fontSize: 13,
      color: Colors.black,
      textDecorationLine: 'underline',
      fontWeight: '500',
    },
    infoLine: {
      fontSize: 13,
      color: Colors.black,
      marginTop: 8,
      fontWeight: '500',
    },
    hoursPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      marginTop: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 14,
      backgroundColor: FILL_GRAY,
      gap: 6,
    },
    hoursDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: EATS_GREEN,
    },
    hoursText: {
      fontSize: 12,
      fontWeight: '600',
      color: Colors.black,
    },
    tabBarWrap: {
      backgroundColor: Colors.white,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    tabBar: {
      paddingHorizontal: 16,
      gap: 20,
    },
    tabItem: {
      paddingVertical: 12,
    },
    tabLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: META_GRAY,
    },
    tabLabelActive: {
      color: Colors.black,
    },
    tabUnderline: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: Colors.black,
    },
    section: {
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 4,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: Colors.black,
      marginBottom: 10,
      letterSpacing: -0.2,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.borderSubtle,
    },
    menuItemBody: {flex: 1, marginRight: 12},
    menuItemName: {fontSize: 15, fontWeight: '600', color: Colors.black},
    menuItemDesc: {
      fontSize: 13,
      color: META_GRAY,
      marginTop: 4,
      lineHeight: 18,
    },
    menuItemPrice: {
      fontSize: 15,
      fontWeight: '500',
      color: Colors.black,
      marginTop: 8,
    },
    menuThumb: {
      width: 80,
      height: 80,
      borderRadius: 12,
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      padding: 4,
      overflow: 'hidden',
    },
    menuThumbImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    addBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    cartBarWrap: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 16,
      paddingTop: 10,
    },
    cartBar: {
      backgroundColor: EATS_GREEN,
      borderRadius: 28,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    cartBarText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '800',
    },
    empty: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    emptyText: {fontSize: 14, color: META_GRAY},
    fallbackHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 12,
      gap: 12,
    },
    fallbackTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: Colors.black,
    },
  });
