import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {MapBackground} from '../../components/common/MapBackground';
import {RootStackParamList} from '../../navigation/types';
import {useTrip} from '../../store/TripContext';
import {formatTripDate} from '../../data/mockTripHistory';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ActivityScreen'>;
};

type Tab = 'upcoming' | 'past';

export function ActivityScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {state} = useTrip();
  const [tab, setTab] = useState<Tab>('past');

  useEffect(() => {
    console.log('[Ubert] ActivityScreen mounted');
  }, []);

  const upcoming = state.scheduledTime ? 1 : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Your activity" onBack={() => navigation.goBack()} />

      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => setTab('upcoming')}>
          <Text
            style={[
              styles.tabLabel,
              tab === 'upcoming' && styles.tabLabelActive,
            ]}>
            Upcoming {upcoming > 0 && `(${upcoming})`}
          </Text>
          {tab === 'upcoming' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => setTab('past')}>
          <Text
            style={[
              styles.tabLabel,
              tab === 'past' && styles.tabLabelActive,
            ]}>
            Past
          </Text>
          {tab === 'past' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 32}}
        showsVerticalScrollIndicator={false}>
        {tab === 'upcoming' ? (
          upcoming === 0 ? (
            <Empty
              icon="event-available"
              title="Nothing planned yet"
              sub="Reserve a ride to see it here before pickup."
            />
          ) : (
            <View style={styles.upcomingCard}>
              <View style={styles.upcomingHeader}>
                <Icon name="event-available" size={20} color={Colors.black} />
                <Text style={styles.upcomingTitle}>Reserved ride</Text>
              </View>
              <Text style={styles.upcomingSub}>
                {state.scheduledTime?.toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>
              <View style={styles.upcomingRow}>
                <View style={[styles.dot, {backgroundColor: '#06C167'}]} />
                <Text style={styles.upcomingAddr}>
                  {state.origin.address}
                </Text>
              </View>
              <View style={styles.upcomingRow}>
                <View style={[styles.dot, {backgroundColor: Colors.black}]} />
                <Text style={styles.upcomingAddr}>
                  {state.destination?.name ?? 'Destination'}
                </Text>
              </View>
            </View>
          )
        ) : state.history.length === 0 ? (
          <Empty
            icon="receipt-long"
            title="No past trips yet"
            sub="Once you take a ride, it'll appear here."
          />
        ) : (
          state.history.map((trip, i) => (
            <TouchableOpacity
              key={trip.id}
              style={[
                styles.tripCard,
                i === state.history.length - 1 && {marginBottom: 0},
              ]}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('TripDetail', {tripId: trip.id})
              }>
              <View style={styles.mapThumb}>
                <MapBackground
                  showPickup
                  showDropoff
                  showPolyline
                  style={StyleSheet.absoluteFillObject}
                />
              </View>
              <View style={styles.tripBody}>
                <View style={styles.tripTopRow}>
                  <Text style={styles.tripDate}>
                    {formatTripDate(trip.date)}
                  </Text>
                  <Text style={styles.tripFare}>{trip.fare}</Text>
                </View>
                <View style={styles.tripRouteRow}>
                  <View style={[styles.routeDotSm, {backgroundColor: '#06C167'}]} />
                  <Text style={styles.tripRouteText} numberOfLines={1}>
                    {trip.destination.name}
                  </Text>
                </View>
                <View style={styles.tripMetaRow}>
                  <View style={styles.classChip}>
                    <Icon name="local-taxi" size={11} color={Colors.black} />
                    <Text style={styles.classChipText}>
                      {trip.rideOption.name}
                    </Text>
                  </View>
                  {trip.rating > 0 && (
                    <View style={styles.classChip}>
                      <Icon name="star" size={11} color={Colors.starYellow} />
                      <Text style={styles.classChipText}>
                        {trip.rating.toFixed(1)}
                      </Text>
                    </View>
                  )}
                  <View style={styles.classChip}>
                    <Icon name="schedule" size={11} color={Colors.black} />
                    <Text style={styles.classChipText}>{trip.duration}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function Empty({icon, title, sub}: {icon: string; title: string; sub: string}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.emptyWrap}>
      <Icon name={icon} size={48} color="#D0D0D0" />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySub}>{sub}</Text>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    tabsRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    tab: {
      paddingTop: 12,
      paddingBottom: 10,
      marginRight: 28,
    },
    tabLabel: {fontSize: 16, fontWeight: '600', color: '#6B6B6B'},
    tabLabelActive: {color: Colors.black, fontWeight: '800'},
    tabUnderline: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: -StyleSheet.hairlineWidth,
      height: 3,
      backgroundColor: Colors.black,
      borderRadius: 1.5,
    },
    upcomingCard: {
      margin: 16,
      padding: 16,
      backgroundColor: '#F6F6F6',
      borderRadius: 14,
    },
    upcomingHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
    upcomingTitle: {fontSize: 16, fontWeight: '700', color: Colors.black},
    upcomingSub: {fontSize: 14, color: '#444', marginTop: 4},
    upcomingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 12,
    },
    dot: {width: 8, height: 8, borderRadius: 4},
    upcomingAddr: {fontSize: 14, color: Colors.black, flex: 1},
    tripCard: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginTop: 14,
      borderRadius: 14,
      backgroundColor: Colors.white,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#E5E7EB',
      overflow: 'hidden',
    },
    mapThumb: {
      width: 88,
      height: 88,
      backgroundColor: '#E8E9ED',
      overflow: 'hidden',
    },
    tripBody: {flex: 1, paddingHorizontal: 12, paddingVertical: 10, justifyContent: 'center'},
    tripTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    tripDate: {fontSize: 12, color: '#6B6B6B', fontWeight: '600'},
    tripFare: {fontSize: 16, fontWeight: '800', color: Colors.black},
    tripRouteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 6,
    },
    routeDotSm: {width: 6, height: 6, borderRadius: 3},
    tripRouteText: {flex: 1, fontSize: 15, fontWeight: '700', color: Colors.black},
    tripMetaRow: {flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap'},
    classChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      backgroundColor: Colors.surfaceMuted,
      gap: 4,
    },
    classChipText: {fontSize: 11, fontWeight: '700', color: Colors.black},
    emptyWrap: {alignItems: 'center', paddingVertical: 80, paddingHorizontal: 32},
    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: Colors.black,
      marginTop: 16,
    },
    emptySub: {
      fontSize: 14,
      color: '#6B6B6B',
      marginTop: 8,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
