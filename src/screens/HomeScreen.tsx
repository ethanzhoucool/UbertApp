import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  ImageSourcePropType,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomTabBar, TabKey} from '../components/common/BottomTabBar';
import {PressScale} from '../components/common/PressScale';
import {Toast} from '../components/common/Toast';
import {ServicesSheet} from '../components/sheets/ServicesSheet';
import {ActivitySheet} from '../components/sheets/ActivitySheet';
import {AccountSheet} from '../components/sheets/AccountSheet';
import {SchedulePickerSheet} from '../components/sheets/SchedulePickerSheet';
import {PromoSheet} from '../components/sheets/PromoSheet';
import {ExplorePromoSheet} from '../components/sheets/ExplorePromoSheet';
import {ComingSoonSheet} from '../components/sheets/ComingSoonSheet';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {recentPlaces, suggestedPlaces, Place} from '../data/mockPlaces';
import {Service} from '../data/mockServices';
import {restaurants, cuisines} from '../data/mockRestaurants';
import {CourierHomeView} from './courier/CourierHomeView';
import {ShopsHomeView} from './shops/ShopsHomeView';
import {useColors, useTheme, ColorPalette} from '../theme';

type Sheet =
  | 'services'
  | 'activity'
  | 'account'
  | 'schedule'
  | 'see-all'
  | 'reserve-promo'
  | 'explore-promo'
  | 'coming-soon-package'
  | 'coming-soon-reserve'
  | 'coming-soon-rent'
  | null;

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
  route: RouteProp<RootStackParamList, 'Home'>;
};

function formatScheduleLabel(date: Date | null): string {
  if (!date) {return 'Now';}
  const diffMins = Math.round((date.getTime() - Date.now()) / 60000);
  if (diffMins <= 0) {return 'Now';}
  if (diffMins < 60) {return `In ${diffMins} min`;}
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) {return `In ${diffHours} hr`;}
  return date.toLocaleDateString('en-US', {weekday: 'short', hour: 'numeric', minute: '2-digit'});
}

export function HomeScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const {mode, toggle: toggleTheme} = useTheme();
  const insets = useSafeAreaInsets();
  const {width: windowWidth} = useWindowDimensions();
  const isTablet = windowWidth >= 700;
  const {state, dispatch} = useTrip();
  const [activeTab, setActiveTab] = useState<
    'rides' | 'delivery' | 'courier' | 'shops'
  >('rides');
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [tabLayouts, setTabLayouts] = useState<{
    rides?: {x: number; width: number};
    delivery?: {x: number; width: number};
    courier?: {x: number; width: number};
    shops?: {x: number; width: number};
  }>({});

  const scheduleLabel = formatScheduleLabel(state.scheduledTime);

  // Animated underline for Rides/Delivery tabs (0 = rides, 1 = delivery).
  const tabIndicator = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const map: Record<typeof activeTab, number> = {
      rides: 0,
      delivery: 1,
      courier: 2,
      shops: 3,
    };
    Animated.timing(tabIndicator, {
      toValue: map[activeTab],
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [activeTab, tabIndicator]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
  };

  // Surface toasts passed via navigation params (e.g. "Ride cancelled" from FindingDriver)
  const incomingToast = route.params?.toast;
  useEffect(() => {
    if (incomingToast) {
      showToast(incomingToast);
      navigation.setParams({toast: undefined});
    }
  }, [incomingToast, navigation]);

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

  const handleTabPress = (tab: TabKey) => {
    if (tab === 'home') {return;}
    if (tab === 'services') {setSheet('services');}
    if (tab === 'activity') {
      navigation.navigate('ActivityScreen');
    }
    if (tab === 'account') {setSheet('account');}
  };

  const handleServiceSelect = (service: Service) => {
    setSheet(null);
    if (service.id === 'ride') {
      handleSearchPress();
    } else if (service.id === 'package') {
      navigation.navigate('PackageDetails');
    } else if (service.id === 'reserve') {
      navigation.navigate('ReserveSchedule');
    } else if (service.id === 'rent') {
      navigation.navigate('RentBrowseCars');
    } else {
      navigation.navigate('ComingSoon', {
        title: service.name,
        description: service.description,
        icon: service.icon,
      });
    }
  };

  const handleScheduleSelect = (date: Date | null) => {
    dispatch({type: 'SET_SCHEDULE', payload: date});
  };

  return (
    <View
      style={[
        styles.container,
        isTablet && styles.containerTablet,
        {paddingTop: insets.top},
      ]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />

      <View style={[styles.panel, isTablet && styles.panelTablet]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Rides / Delivery / Courier / Shops top tabs */}
        <View style={styles.tabsRowOuter}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsRow}>
            <TopTab
              label="Rides"
              icon={<Image source={tabIcons.rides} style={styles.tabIcon} resizeMode="contain" />}
              active={activeTab === 'rides'}
              onPress={() => setActiveTab('rides')}
              onLayout={layout => setTabLayouts(p => ({...p, rides: layout}))}
            />
            <TopTab
              label="Delivery"
              icon={<Image source={tabIcons.delivery} style={styles.tabIcon} resizeMode="contain" />}
              active={activeTab === 'delivery'}
              onPress={() => setActiveTab('delivery')}
              onLayout={layout => setTabLayouts(p => ({...p, delivery: layout}))}
            />
            <TopTab
              label="Courier"
              icon={<Icon name="inventory-2" size={18} color={activeTab === 'courier' ? Colors.black : Colors.gray500} />}
              active={activeTab === 'courier'}
              onPress={() => setActiveTab('courier')}
              onLayout={layout => setTabLayouts(p => ({...p, courier: layout}))}
            />
            <TopTab
              label="Shops"
              icon={<Icon name="shopping-cart" size={18} color={activeTab === 'shops' ? Colors.black : Colors.gray500} />}
              active={activeTab === 'shops'}
              onPress={() => setActiveTab('shops')}
              onLayout={layout => setTabLayouts(p => ({...p, shops: layout}))}
            />
          </ScrollView>

          <TouchableOpacity
            style={styles.themeToggle}
            onPress={() => {
              toggleTheme();
              showToast(mode === 'dark' ? 'Light mode' : 'Dark mode');
            }}
            activeOpacity={0.7}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
            accessibilityLabel="Toggle dark mode"
            testID="theme-toggle">
            <Icon
              name={mode === 'dark' ? 'light-mode' : 'dark-mode'}
              size={22}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.tabsDivider} />

        {activeTab === 'delivery' ? (
          <DeliveryHomeContent
            onOpenBrowse={() => navigation.navigate('DeliveryBrowse')}
            onOpenRestaurant={(id: string) =>
              navigation.navigate('RestaurantDetail', {restaurantId: id})
            }
          />
        ) : activeTab === 'courier' ? (
          <CourierHomeView
            onSend={() => navigation.navigate('PackageDetails')}
            onReceive={() =>
              navigation.navigate('ComingSoon', {
                title: 'Receive a package',
                description:
                  "Track packages other people send to you, all in one place. We're putting the finishing touches on it.",
                icon: 'download',
              })
            }
            onHistory={() => navigation.navigate('ActivityScreen')}
          />
        ) : activeTab === 'shops' ? (
          <ShopsHomeView
            onOpenBrowse={() => navigation.navigate('ShopsBrowse')}
            onOpenStore={(storeId: string) =>
              navigation.navigate('StoreDetail', {storeId})
            }
          />
        ) : (
        <>
        {/* Search bar */}
        <View style={styles.searchBar}>
          <TouchableOpacity
            style={styles.searchInner}
            onPress={handleSearchPress}
            activeOpacity={0.85}>
            <Icon name="search" size={20} color={Colors.gray700} />
            <Text style={styles.searchText}>Where to?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nowPill}
            onPress={() => setSheet('schedule')}
            activeOpacity={0.7}>
            <Icon name="schedule" size={14} color={Colors.white} />
            <Text style={styles.nowLabel}>{scheduleLabel}</Text>
            <Icon name="keyboard-arrow-down" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Saved places */}
        <PressScale
          style={styles.savedPlaceRow}
          onPress={() => handlePlacePress(recentPlaces[1])}>
          <View style={styles.savedIcon}>
            <Icon name="work" size={16} color={Colors.white} />
          </View>
          <View style={styles.savedInfo}>
            <Text style={styles.savedName}>Work</Text>
            <Text style={styles.savedAddr}>{recentPlaces[1].address}</Text>
          </View>
        </PressScale>

        <View style={styles.savedDivider} />

        <PressScale
          style={styles.savedPlaceRow}
          onPress={() => handlePlacePress(recentPlaces[0])}>
          <View style={styles.savedIcon}>
            <Icon name="home" size={16} color={Colors.white} />
          </View>
          <View style={styles.savedInfo}>
            <Text style={styles.savedName}>Home</Text>
            <Text style={styles.savedAddr}>{recentPlaces[0].address}</Text>
          </View>
        </PressScale>

        {/* Divider band */}
        <View style={styles.sectionDivider} />

        {/* Suggestions */}
        <View style={styles.suggestionsHeader}>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          <TouchableOpacity onPress={() => setSheet('see-all')} activeOpacity={0.6}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}>
          <SuggestionCard
            image={suggestionIcons.ride}
            label="Ride"
            onPress={handleSearchPress}
          />
          <SuggestionCard
            image={suggestionIcons.package}
            label="Package"
            onPress={() => navigation.navigate('PackageDetails')}
          />
          <SuggestionCard
            image={suggestionIcons.reserve}
            label="Reserve"
            onPress={() => navigation.navigate('ReserveSchedule')}
          />
          <SuggestionCard
            image={suggestionIcons.rent}
            label="Rent"
            onPress={() => navigation.navigate('RentBrowseCars')}
          />
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
            color="#F2EFE9"
            icon="event-available"
            onPress={() => setSheet('reserve-promo')}
          />
          <PromoCard
            title="Explore locally"
            subtitle="Find popular destinations"
            color="#E8EEF7"
            icon="explore"
            onPress={() => setSheet('explore-promo')}
          />
        </ScrollView>

        {/* More destinations */}
        <View style={styles.sectionDivider} />
        <Text style={[styles.sectionTitle, {marginHorizontal: 16, marginTop: 16}]}>
          Recent destinations
        </Text>
        {suggestedPlaces.slice(0, 3).map(place => (
          <PressScale
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
          </PressScale>
        ))}

        <View style={{height: 20}} />
        </>
        )}
      </ScrollView>

      <BottomTabBar onTabPress={handleTabPress} activeTab="home" />
      </View>

      {/* Sheets */}
      <ServicesSheet
        visible={sheet === 'services' || sheet === 'see-all'}
        onClose={() => setSheet(null)}
        onSelectService={handleServiceSelect}
        title={sheet === 'see-all' ? 'All services' : 'Services'}
      />
      <ActivitySheet
        visible={sheet === 'activity'}
        onClose={() => setSheet(null)}
      />
      <AccountSheet
        visible={sheet === 'account'}
        onClose={() => setSheet(null)}
        onOpenTripHistory={() => {
          setSheet(null);
          navigation.navigate('ActivityScreen');
        }}
        onOpenWallet={() => {
          setSheet(null);
          navigation.navigate('Wallet');
        }}
        onOpenPromotions={() => {
          setSheet(null);
          navigation.navigate('Promotions');
        }}
        onOpenSettings={() => {
          setSheet(null);
          navigation.navigate('Settings');
        }}
        onOpenHelp={() => {
          setSheet(null);
          navigation.navigate('Help');
        }}
        onOpenEditProfile={() => {
          setSheet(null);
          navigation.navigate('EditProfile');
        }}
        onOpenSavedPlaces={() => {
          setSheet(null);
          navigation.navigate('SavedPlaces');
        }}
        onOpenUberOne={() => {
          setSheet(null);
          navigation.navigate('UberOneLanding');
        }}
        onShowComingSoon={feature => {
          setSheet(null);
          showToast(`${feature} coming soon`);
        }}
      />
      <SchedulePickerSheet
        visible={sheet === 'schedule'}
        onClose={() => setSheet(null)}
        onSelect={handleScheduleSelect}
      />
      <PromoSheet
        visible={sheet === 'reserve-promo'}
        onClose={() => setSheet(null)}
        onScheduleRide={() => setSheet('schedule')}
      />
      <ExplorePromoSheet
        visible={sheet === 'explore-promo'}
        onClose={() => setSheet(null)}
        onSelectPlace={handlePlacePress}
      />
      <ComingSoonSheet
        visible={sheet === 'coming-soon-package'}
        onClose={() => setSheet(null)}
        title="Send a package"
        description="Same-day delivery anywhere in the city. Drivers pick up your package and drop it off where you choose."
        icon="inventory-2"
        iconBg="#FFF3E0"
        onNotify={() => showToast("We'll notify you when Package launches")}
      />
      <ComingSoonSheet
        visible={sheet === 'coming-soon-reserve'}
        onClose={() => setSheet(null)}
        title="Reserve a ride"
        description="Book up to 90 days in advance. Lock in your pickup time and avoid the wait."
        icon="event-available"
        iconBg="#E8F5E9"
        onNotify={() => showToast("We'll notify you when Reserve is available")}
      />
      <ComingSoonSheet
        visible={sheet === 'coming-soon-rent'}
        onClose={() => setSheet(null)}
        title="Rent a car"
        description="Daily and hourly rentals delivered to your door. Perfect for road trips and errands."
        icon="vpn-key"
        iconBg="#E3F2FD"
        onNotify={() => showToast("We'll notify you when Rentals are live")}
      />

      <Toast
        message={toastMsg}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}

function TopTab({
  label,
  icon,
  active,
  onPress,
  onLayout,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onPress: () => void;
  onLayout: (layout: {x: number; width: number}) => void;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      onLayout={e => {
        const {x, width} = e.nativeEvent.layout;
        onLayout({x, width});
      }}>
      {icon}
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
      {active && <View style={styles.tabUnderlineStatic} />}
    </TouchableOpacity>
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
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <PressScale style={styles.card} onPress={onPress}>
      <View style={styles.cardImageWrap}>
        <Image source={image} style={styles.cardImg} resizeMode="contain" />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
    </PressScale>
  );
}

function DeliveryHomeContent({
  onOpenBrowse,
  onOpenRestaurant,
}: {
  onOpenBrowse: () => void;
  onOpenRestaurant: (id: string) => void;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View>
      <TouchableOpacity
        style={styles.deliverySearch}
        onPress={onOpenBrowse}
        activeOpacity={0.85}>
        <Icon name="search" size={20} color={Colors.gray700} />
        <Text style={styles.deliverySearchText}>Find food in your area</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, {marginHorizontal: 16, marginTop: 18}]}>
        Cuisines
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.deliveryCuisinesRow}>
        {cuisines.map(c => (
          <TouchableOpacity
            key={c.id}
            style={styles.deliveryCuisineChip}
            onPress={onOpenBrowse}
            activeOpacity={0.7}>
            <Icon name={c.icon} size={20} color={Colors.black} />
            <Text style={styles.deliveryCuisineLabel}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={[styles.sectionTitle, {marginHorizontal: 16, marginTop: 22}]}>
        Featured restaurants
      </Text>
      {restaurants.slice(0, 4).map(r => (
        <PressScale
          key={r.id}
          style={styles.deliveryRestaurantRow}
          onPress={() => onOpenRestaurant(r.id)}>
          <View
            style={[
              styles.deliveryRestaurantThumb,
              {backgroundColor: r.imageColor},
            ]}>
            {r.heroUri ? (
              <Image
                source={{uri: r.heroUri}}
                style={styles.deliveryRestaurantThumbImg}
                resizeMode="cover"
              />
            ) : (
              <Icon name="restaurant" size={28} color="rgba(255,255,255,0.85)" />
            )}
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={styles.deliveryRestaurantName}>{r.name}</Text>
            <Text style={styles.deliveryRestaurantSub}>{r.cuisine}</Text>
            <View style={styles.deliveryMetaRow}>
              <Icon name="star" size={12} color={Colors.starYellow} />
              <Text style={styles.deliveryMetaText}>
                {r.rating.toFixed(1)}
              </Text>
              <Text style={styles.deliveryMetaDot}>•</Text>
              <Text style={styles.deliveryMetaText}>{r.etaMinutes} min</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color={Colors.gray300} />
        </PressScale>
      ))}

      <TouchableOpacity
        style={styles.deliveryAllBtn}
        onPress={onOpenBrowse}
        activeOpacity={0.7}>
        <Text style={styles.deliveryAllText}>See all restaurants</Text>
        <Icon name="arrow-forward" size={18} color={Colors.black} />
      </TouchableOpacity>
    </View>
  );
}

function PromoCard({
  title,
  subtitle,
  color,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  onPress: () => void;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <PressScale
      style={[styles.promoCard, {backgroundColor: color}]}
      onPress={onPress}>
      <View style={styles.promoContent}>
        <Text style={styles.promoTitle}>{title}</Text>
        <Text style={styles.promoSub}>{subtitle}</Text>
        <View style={styles.promoArrow}>
          <Icon name="arrow-forward" size={16} color={Colors.black} />
        </View>
      </View>
      <View style={styles.promoIconWrap}>
        <Icon name={icon} size={64} color="rgba(0,0,0,0.18)" />
      </View>
    </PressScale>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  containerTablet: {
    backgroundColor: '#F4F5F7',
  },
  panel: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.white,
  },
  panelTablet: {
    maxWidth: 640,
    alignSelf: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // Tabs
  tabsRowOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 24,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    gap: 6,
  },
  tabsSpacer: {
    flex: 1,
  },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tabActive: {},
  tabIcon: {
    width: 22,
    height: 16,
  },
  tabLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.gray500,
  },
  tabLabelActive: {
    fontWeight: '800',
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
  tabUnderlineStatic: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.black,
    borderRadius: 1.5,
  },
  tabsDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderSubtle,
  },

  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
    height: 52,
    paddingLeft: 16,
    paddingRight: 6,
  },
  searchInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  searchText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: Colors.black,
    marginLeft: 10,
  },
  nowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.black,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  nowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
  },

  // Saved places
  savedPlaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  savedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.black,
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
    backgroundColor: Colors.borderSubtle,
    marginLeft: 62,
    marginRight: 16,
  },

  // Section divider
  sectionDivider: {
    height: 8,
    backgroundColor: Colors.surfaceMuted,
    marginTop: 4,
  },

  // Suggestions
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.black,
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray700,
  },

  // Cards
  cardsRow: {
    paddingHorizontal: 16,
    gap: 14,
  },
  card: {
    width: 104,
    alignItems: 'center',
  },
  cardImageWrap: {
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardImg: {
    width: 110,
    height: 110,
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
    width: 240,
    height: 132,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 1,
  },
  promoContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  promoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.black,
    lineHeight: 22,
  },
  promoSub: {
    fontSize: 13,
    color: Colors.gray900,
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
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  promoIconWrap: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Recent
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentInfo: {
    flex: 1,
    marginLeft: 14,
  },
  recentName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  recentAddr: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 1,
  },

  // Delivery tab
  deliverySearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  deliverySearchText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.gray700,
  },
  deliveryCuisinesRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  deliveryCuisineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: Colors.gray100,
    gap: 6,
  },
  deliveryCuisineLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  deliveryRestaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  deliveryRestaurantThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  deliveryRestaurantThumbImg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  deliveryRestaurantName: {fontSize: 15, fontWeight: '700', color: Colors.black},
  deliveryRestaurantSub: {fontSize: 13, color: Colors.gray700, marginTop: 2},
  deliveryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  deliveryMetaText: {fontSize: 12, color: Colors.gray700, fontWeight: '500'},
  deliveryMetaDot: {color: Colors.gray500, marginHorizontal: 2},
  deliveryAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    gap: 8,
  },
  deliveryAllText: {fontSize: 15, fontWeight: '600', color: Colors.black},
  });
