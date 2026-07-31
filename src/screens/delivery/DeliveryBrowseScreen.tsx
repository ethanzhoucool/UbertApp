import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PressScale} from '../../components/common/PressScale';
import {RootStackParamList} from '../../navigation/types';
import {
  restaurants,
  eatsCategories,
  Restaurant,
  RestaurantBadge,
} from '../../data/mockRestaurants';
import {useTrip} from '../../store/TripContext';
import {useColors, ColorPalette} from '../../theme';

const EATS_GREEN = '#06C167';
const META_GRAY = '#6B6B6B';
const FILL_GRAY = '#F6F6F6';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'DeliveryBrowse'>;
};

type Mode = 'delivery' | 'pickup';

const FILTERS = ['Sort', 'Price', 'Dietary', 'Under 30 min'];

export function DeliveryBrowseScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {state} = useTrip();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<Mode>('delivery');
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log('[Ubert] DeliveryBrowseScreen mounted');
  }, []);

  const cartCount = state.cart.reduce((sum, line) => sum + line.quantity, 0);

  const filtered = restaurants.filter(r => {
    if (query && !r.name.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    return true;
  });

  const toggleBookmark = (id: string) => {
    setBookmarked(prev => ({...prev, [id]: !prev[id]}));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Address pill header */}
      <View style={[styles.topBar, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity
          style={styles.addressPill}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.addressText} numberOfLines={1}>
            Now · 123 Main St
          </Text>
          <Icon name="keyboard-arrow-down" size={20} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            cartCount > 0 ? navigation.navigate('DeliveryCart') : null
          }
          style={styles.basketBtn}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon name="shopping-bag" size={22} color={Colors.black} />
          {cartCount > 0 && (
            <View style={styles.basketBadge}>
              <Text style={styles.basketBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Unique fingerprint header text */}
      <Text style={styles.fingerprint}>Food delivery</Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{paddingBottom: insets.bottom + 24}}
        showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={Colors.black} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a restaurant"
            placeholderTextColor={META_GRAY}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {/* Delivery / Pickup pills */}
        <View style={styles.modeRow}>
          <ModePill
            label="Delivery"
            active={mode === 'delivery'}
            onPress={() => setMode('delivery')}
          />
          <ModePill
            label="Pickup"
            active={mode === 'pickup'}
            onPress={() => setMode('pickup')}
          />
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}>
          {eatsCategories.map(c => (
            <TouchableOpacity
              key={c.id}
              activeOpacity={0.7}
              style={styles.categoryItem}>
              <View style={[styles.categoryCircle, {backgroundColor: c.color}]}>
                <Icon name={c.icon} size={24} color={Colors.black} />
              </View>
              <Text style={styles.categoryLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              activeOpacity={0.7}
              style={styles.filterChip}>
              <Text style={styles.filterChipText}>{f}</Text>
              {f === 'Sort' && (
                <Icon
                  name="keyboard-arrow-down"
                  size={16}
                  color={Colors.black}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Feed */}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="restaurant" size={48} color={Colors.gray300} />
            <Text style={styles.emptyText}>No matching restaurants</Text>
          </View>
        ) : (
          filtered.map(r => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              bookmarked={!!bookmarked[r.id]}
              onBookmark={() => toggleBookmark(r.id)}
              onPress={() =>
                navigation.navigate('RestaurantDetail', {restaurantId: r.id})
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function ModePill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <TouchableOpacity
      style={[styles.modePill, active && styles.modePillActive]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={[styles.modePillText, active && styles.modePillTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function badgeColor(badge?: RestaurantBadge): string {
  if (badge === 'free-delivery' || badge === 'bogo') {
    return EATS_GREEN;
  }
  if (badge === 'top-eats') {
    return '#1A1A1A';
  }
  if (badge === 'offers') {
    return '#E11900';
  }
  return EATS_GREEN;
}

function RestaurantCard({
  restaurant,
  bookmarked,
  onBookmark,
  onPress,
}: {
  restaurant: Restaurant;
  bookmarked: boolean;
  onBookmark: () => void;
  onPress: () => void;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const etaText = restaurant.etaMaxMinutes
    ? `${restaurant.etaMinutes}–${restaurant.etaMaxMinutes} min`
    : `${restaurant.etaMinutes} min`;

  return (
    <PressScale style={styles.card} onPress={onPress}>
      <View
        style={[styles.cardHero, {backgroundColor: restaurant.heroColor ?? restaurant.imageColor}]}>
        {restaurant.heroUri && (
          <Image
            source={{uri: restaurant.heroUri}}
            style={styles.cardHeroImage}
            resizeMode="cover"
          />
        )}
        {restaurant.badgeLabel && (
          <View
            style={[
              styles.badge,
              {backgroundColor: badgeColor(restaurant.badge)},
            ]}>
            <Text style={styles.badgeText}>{restaurant.badgeLabel}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={onBookmark}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon
            name={bookmarked ? 'favorite' : 'favorite-border'}
            size={20}
            color={bookmarked ? '#E11900' : Colors.black}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardNameRow}>
          <Text style={styles.cardName} numberOfLines={1}>
            {restaurant.name}
          </Text>
          {restaurant.topEats && (
            <View style={styles.topEatsCheck}>
              <Icon name="check" size={12} color={Colors.white} />
            </View>
          )}
        </View>
        <Text style={styles.cardMeta} numberOfLines={1}>
          ★ {restaurant.rating.toFixed(1)} ({restaurant.ratingCount ?? '500+'})
          {' · '}
          {etaText}
          {' · '}${restaurant.deliveryFee.toFixed(2)} Delivery Fee
        </Text>
      </View>
    </PressScale>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    scroll: {flex: 1},
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 8,
      backgroundColor: Colors.white,
    },
    addressPill: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
    addressText: {
      fontSize: 17,
      fontWeight: '800',
      color: Colors.black,
      letterSpacing: -0.2,
      marginRight: 4,
    },
    basketBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: FILL_GRAY,
      alignItems: 'center',
      justifyContent: 'center',
    },
    basketBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: EATS_GREEN,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    basketBadgeText: {
      color: Colors.white,
      fontSize: 11,
      fontWeight: '800',
    },
    fingerprint: {
      position: 'absolute',
      width: 1,
      height: 1,
      opacity: 0,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 8,
      backgroundColor: FILL_GRAY,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 48,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 15,
      fontWeight: '500',
      color: Colors.black,
      padding: 0,
    },
    modeRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 8,
    },
    modePill: {
      paddingVertical: 9,
      paddingHorizontal: 18,
      borderRadius: 22,
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    modePillActive: {
      backgroundColor: Colors.black,
      borderColor: Colors.black,
    },
    modePillText: {
      fontSize: 14,
      fontWeight: '700',
      color: Colors.black,
    },
    modePillTextActive: {color: Colors.white},
    categoriesRow: {
      paddingHorizontal: 16,
      paddingVertical: 4,
      gap: 18,
    },
    categoryItem: {
      alignItems: 'center',
      width: 72,
    },
    categoryCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: Colors.black,
      marginTop: 6,
      textAlign: 'center',
    },
    filtersRow: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 8,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: Colors.white,
      gap: 4,
    },
    filterChipText: {
      fontSize: 13,
      fontWeight: '600',
      color: Colors.black,
    },
    card: {
      marginHorizontal: 16,
      marginBottom: 22,
      backgroundColor: Colors.white,
    },
    cardHero: {
      width: '100%',
      aspectRatio: 16 / 9,
      borderRadius: 14,
      overflow: 'hidden',
      justifyContent: 'flex-start',
    },
    cardHeroImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    badge: {
      position: 'absolute',
      top: 12,
      left: 12,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 6,
    },
    badgeText: {
      color: Colors.white,
      fontSize: 12,
      fontWeight: '800',
    },
    heartBtn: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardBody: {
      paddingTop: 10,
    },
    cardNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    cardName: {
      fontSize: 16,
      fontWeight: '800',
      color: Colors.black,
      letterSpacing: -0.2,
      flexShrink: 1,
    },
    topEatsCheck: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: EATS_GREEN,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardMeta: {
      fontSize: 12,
      color: META_GRAY,
      marginTop: 3,
      fontWeight: '500',
    },
    empty: {alignItems: 'center', paddingVertical: 48},
    emptyText: {fontSize: 14, color: META_GRAY, marginTop: 12},
  });
