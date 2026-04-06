import React, {useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomTabBar} from '../components/common/BottomTabBar';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {recentPlaces, suggestedPlaces, Place} from '../data/mockPlaces';
import {Colors} from '../theme';

const suggestionIcons = {
  ride: require('../assets/icons/ride.png'),
  package: require('../assets/icons/package.png'),
  reserve: require('../assets/icons/reserve.png'),
  rent: require('../assets/icons/rent.png'),
};

const tabIcons = {
  rides: require('../assets/icons/rides-tab.png'),
  delivery: require('../assets/icons/delivery-tab.png'),
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();
  const {dispatch} = useTrip();
  const [activeTab, setActiveTab] = useState<'rides' | 'delivery'>('rides');

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const handlePlacePress = useCallback(
    (place: Place) => {
      dispatch({type: 'SET_DESTINATION', payload: place});
      navigation.navigate('RideSelection', {destination: place});
    },
    [navigation, dispatch],
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Rides / Delivery tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'rides' && styles.tabActive]}
            onPress={() => setActiveTab('rides')}>
            <Image source={tabIcons.rides} style={styles.tabIcon} resizeMode="contain" />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'rides' && styles.tabLabelActive,
              ]}>
              Rides
            </Text>
            {activeTab === 'rides' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'delivery' && styles.tabActive]}
            onPress={() => setActiveTab('delivery')}>
            <Image source={tabIcons.delivery} style={styles.tabIcon} resizeMode="contain" />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'delivery' && styles.tabLabelActive,
              ]}>
              Delivery
            </Text>
            {activeTab === 'delivery' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={handleSearchPress}
          activeOpacity={0.85}>
          <Icon name="search" size={20} color={Colors.gray700} />
          <Text style={styles.searchText}>Where to?</Text>
          <View style={styles.nowPill}>
            <Icon name="schedule" size={14} color={Colors.black} />
            <Text style={styles.nowLabel}>Now</Text>
            <Icon name="keyboard-arrow-down" size={16} color={Colors.black} />
          </View>
        </TouchableOpacity>

        {/* Saved places */}
        <TouchableOpacity
          style={styles.savedPlaceRow}
          onPress={() => handlePlacePress(recentPlaces[1])}>
          <View style={styles.savedIcon}>
            <Icon name="work" size={16} color={Colors.white} />
          </View>
          <View style={styles.savedInfo}>
            <Text style={styles.savedName}>Work</Text>
            <Text style={styles.savedAddr}>{recentPlaces[1].address}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.savedDivider} />

        <TouchableOpacity
          style={styles.savedPlaceRow}
          onPress={() => handlePlacePress(recentPlaces[0])}>
          <View style={styles.savedIcon}>
            <Icon name="home" size={16} color={Colors.white} />
          </View>
          <View style={styles.savedInfo}>
            <Text style={styles.savedName}>Home</Text>
            <Text style={styles.savedAddr}>{recentPlaces[0].address}</Text>
          </View>
        </TouchableOpacity>

        {/* Divider band */}
        <View style={styles.sectionDivider} />

        {/* Suggestions */}
        <View style={styles.suggestionsHeader}>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}>
          <SuggestionCard image={suggestionIcons.ride} label="Ride" onPress={handleSearchPress} />
          <SuggestionCard image={suggestionIcons.package} label="Package" />
          <SuggestionCard image={suggestionIcons.reserve} label="Reserve" />
          <SuggestionCard image={suggestionIcons.rent} label="Rent" />
        </ScrollView>

        {/* Ways to plan */}
        <Text style={[styles.sectionTitle, {marginTop: 24, marginHorizontal: 16}]}>
          Ways to plan with Uber
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promoRow}>
          <PromoCard
            title="Reserve a ride"
            subtitle="Plan ahead for your trip"
            color="#E8F5E9"
            icon="event-available"
          />
          <PromoCard
            title="Explore locally"
            subtitle="Find popular destinations"
            color="#F3E5F5"
            icon="explore"
          />
        </ScrollView>

        {/* More destinations */}
        <View style={styles.sectionDivider} />
        <Text style={[styles.sectionTitle, {marginHorizontal: 16, marginTop: 16}]}>
          Recent destinations
        </Text>
        {suggestedPlaces.slice(0, 3).map(place => (
          <TouchableOpacity
            key={place.id}
            style={styles.recentRow}
            onPress={() => handlePlacePress(place)}>
            <View style={styles.recentIcon}>
              <Icon name="history" size={16} color={Colors.gray700} />
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentName}>{place.name}</Text>
              <Text style={styles.recentAddr} numberOfLines={1}>
                {place.address}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.gray300} />
          </TouchableOpacity>
        ))}

        <View style={{height: 20}} />
      </ScrollView>

      <BottomTabBar />
    </View>
  );
}

function SuggestionCard({
  image,
  label,
  onPress,
}: {
  image: ImageSourcePropType;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={image} style={styles.cardImg} resizeMode="cover" />
      <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function PromoCard({
  title,
  subtitle,
  color,
  icon,
}: {
  title: string;
  subtitle: string;
  color: string;
  icon: string;
}) {
  return (
    <TouchableOpacity style={[styles.promoCard, {backgroundColor: color}]} activeOpacity={0.8}>
      <View style={styles.promoContent}>
        <Text style={styles.promoTitle}>{title}</Text>
        <Text style={styles.promoSub}>{subtitle}</Text>
        <View style={styles.promoArrow}>
          <Icon name="arrow-forward" size={16} color={Colors.black} />
        </View>
      </View>
      <View style={styles.promoIconWrap}>
        <Icon name={icon} size={48} color="rgba(0,0,0,0.12)" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },

  // Tabs
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    gap: 6,
  },
  tabActive: {},
  tabIcon: {
    width: 30,
    height: 20,
  },
  tabLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.gray500,
  },
  tabLabelActive: {
    fontWeight: '700',
    color: Colors.black,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.black,
    borderRadius: 1.5,
  },

  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 28,
    marginHorizontal: 16,
    marginTop: 14,
    height: 50,
    paddingLeft: 16,
    paddingRight: 6,
  },
  searchText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: Colors.gray500,
    marginLeft: 10,
  },
  nowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 3,
  },
  nowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
  },

  // Saved places
  savedPlaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  savedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedInfo: {
    flex: 1,
    marginLeft: 14,
  },
  savedName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  savedAddr: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 2,
  },
  savedDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E8E8E8',
    marginLeft: 66,
    marginRight: 16,
  },

  // Section divider
  sectionDivider: {
    height: 8,
    backgroundColor: '#F5F5F5',
    marginTop: 4,
  },

  // Suggestions
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray700,
  },

  // Cards
  cardsRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 100,
    alignItems: 'center',
  },
  cardImg: {
    width: 92,
    height: 92,
    borderRadius: 16,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    marginTop: 8,
  },

  // Promo cards
  promoRow: {
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 12,
  },
  promoCard: {
    width: 220,
    height: 120,
    borderRadius: 14,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.black,
  },
  promoSub: {
    fontSize: 12,
    color: Colors.gray700,
    marginTop: 2,
  },
  promoArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  promoIconWrap: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Recent
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentInfo: {
    flex: 1,
    marginLeft: 14,
  },
  recentName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.black,
  },
  recentAddr: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 1,
  },
});
