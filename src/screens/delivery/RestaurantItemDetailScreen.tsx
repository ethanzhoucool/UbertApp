import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../navigation/types';
import {findRestaurant, MenuItem} from '../../data/mockRestaurants';
import {useTrip} from '../../store/TripContext';
import {Colors} from '../../theme';

const EATS_GREEN = '#06C167';
const META_GRAY = '#6B6B6B';
const HERO_HEIGHT = 240;

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'RestaurantItemDetail'>;
  route: RouteProp<RootStackParamList, 'RestaurantItemDetail'>;
};

export function RestaurantItemDetailScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const {dispatch} = useTrip();
  const restaurant = findRestaurant(route.params.restaurantId);
  const item: MenuItem | undefined = restaurant?.menu
    .flatMap(section => section.items)
    .find(it => it.id === route.params.itemId);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    console.log('[Ubert] RestaurantItemDetailScreen mounted');
  }, []);

  if (!restaurant || !item) {
    return (
      <View style={styles.container}>
        <View style={[styles.fallbackHeader, {paddingTop: insets.top + 8}]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconBubble}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
            <Icon name="arrow-back" size={20} color={Colors.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Item not found.</Text>
        </View>
      </View>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      dispatch({type: 'ADD_CART_ITEM', payload: {restaurant, item}});
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero image */}
      <View style={[styles.hero, {backgroundColor: item.thumbColor ?? '#E5E7EB'}]}>
        {item.imageUri ? (
          <Image
            source={{uri: item.imageUri}}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <Icon name="restaurant" size={56} color="rgba(255,255,255,0.5)" />
        )}
      </View>
      <TouchableOpacity
        style={[styles.iconBubble, styles.floatingBack, {top: insets.top + 8}]}
        onPress={() => navigation.goBack()}
        hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
        <Icon name="arrow-back" size={20} color={Colors.black} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 140}}
        showsVerticalScrollIndicator={false}>
        <View style={{height: HERO_HEIGHT - 20}} />
        <View style={styles.sheet}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Text style={styles.desc}>{item.description}</Text>

          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>Special instructions</Text>
          <View style={styles.notesCard}>
            <TextInput
              style={styles.notesInput}
              placeholder="Add a note (e.g. no onions)"
              placeholderTextColor={Colors.gray500}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer: quantity stepper + add button */}
      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <View style={styles.stepper}>
          <TouchableOpacity
            onPress={() => setQty(q => Math.max(1, q - 1))}
            style={styles.stepBtn}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon
              name="remove"
              size={20}
              color={qty <= 1 ? Colors.gray300 : Colors.black}
            />
          </TouchableOpacity>
          <Text style={styles.qty}>{qty}</Text>
          <TouchableOpacity
            onPress={() => setQty(q => q + 1)}
            style={styles.stepBtn}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="add" size={20} color={Colors.black} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.85}
          onPress={handleAdd}>
          <Text style={styles.addText}>
            Add {qty} to cart · ${(item.price * qty).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  floatingBack: {
    position: 'absolute',
    left: 12,
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
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.black,
    letterSpacing: -0.4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
    marginTop: 8,
  },
  desc: {
    fontSize: 15,
    color: META_GRAY,
    lineHeight: 22,
    marginTop: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginTop: 20,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 10,
  },
  notesCard: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
  },
  notesInput: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontSize: 15,
    color: Colors.black,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: Colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    gap: 14,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F2F4',
    borderRadius: 28,
    paddingHorizontal: 6,
    height: 52,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
  addBtn: {
    flex: 1,
    backgroundColor: EATS_GREEN,
    borderRadius: 28,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {color: Colors.white, fontSize: 16, fontWeight: '800'},
  empty: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  emptyText: {fontSize: 14, color: META_GRAY},
  fallbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
