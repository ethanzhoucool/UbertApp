import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {seededTripHistory, formatTripDate} from '../../data/mockTripHistory';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Help'>;
};

// Mirror the Activity tab's recent trips so Help stays consistent.
const TRIPS: {
  id: string;
  date: string;
  name: string;
  price: string;
}[] = seededTripHistory.map(trip => ({
  id: trip.id,
  date: formatTripDate(trip.date),
  name: trip.destination.name,
  price: trip.fare,
}));

const TOPICS: {key: string; icon: string; label: string}[] = [
  {key: 'trip', icon: 'error-outline', label: 'Trip issues and refunds'},
  {key: 'account', icon: 'person', label: 'Account and payment options'},
  {key: 'guide', icon: 'menu-book', label: 'A guide to Uber'},
  {key: 'access', icon: 'accessibility', label: 'Accessibility'},
  {key: 'safety', icon: 'shield', label: 'Safety'},
  {key: 'other', icon: 'more-horiz', label: 'Other'},
];

export function HelpScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  useEffect(() => {
    console.log('[Ubert] HelpScreen mounted');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Help" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.searchWrap}>
          <Icon name="search" size={20} color="#6B6B6B" />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search help"
            placeholderTextColor="#6B6B6B"
          />
        </View>

        <TouchableOpacity
          style={styles.aiBanner}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('HelpAiChat')}>
          <View style={styles.aiIcon}>
            <Icon name="auto-awesome" size={22} color={Colors.white} />
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={styles.aiTitle}>Chat with assistant</Text>
            <Text style={styles.aiSub}>
              Get instant answers from Uber's AI helper.
            </Text>
          </View>
          <Icon name="chevron-right" size={22} color={Colors.black} />
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>RECENT TRIPS</Text>
        <View style={styles.group}>
          {TRIPS.map((trip, i) => (
            <TouchableOpacity
              key={trip.id}
              style={[
                styles.tripRow,
                i < TRIPS.length - 1 && styles.rowDivider,
              ]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('HelpContact')}>
              <View style={styles.tripMap}>
                <View style={styles.tripMapGridV1} />
                <View style={styles.tripMapGridV2} />
                <View style={styles.tripMapGridH1} />
                <View style={styles.tripMapGridH2} />
                <Icon
                  name="place"
                  size={14}
                  color="#06C167"
                  style={styles.tripMapPickup}
                />
                <Icon
                  name="place"
                  size={14}
                  color="#E11900"
                  style={styles.tripMapDropoff}
                />
              </View>
              <View style={{flex: 1, marginLeft: 12}}>
                <Text style={styles.tripDate}>{trip.date}</Text>
                <Text style={styles.tripRoute} numberOfLines={1}>
                  {trip.name}
                </Text>
                <Text style={styles.tripHelp}>Help with this trip</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.tripPrice}>{trip.price}</Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color="#6B6B6B"
                  style={{marginTop: 4}}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>ALL TOPICS</Text>
        <View style={styles.group}>
          {TOPICS.map((topic, i) => (
            <TouchableOpacity
              key={topic.key}
              style={[
                styles.topicRow,
                i < TOPICS.length - 1 && styles.rowDivider,
              ]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('HelpContact')}>
              <Icon
                name={topic.icon}
                size={22}
                color={Colors.black}
                style={{marginRight: 16, width: 24, textAlign: 'center'}}
              />
              <Text style={styles.topicLabel}>{topic.label}</Text>
              <Icon name="chevron-right" size={20} color="#6B6B6B" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.contactCard, {paddingBottom: insets.bottom + 14}]}>
        <TouchableOpacity
          style={styles.contactInner}
          onPress={() => navigation.navigate('HelpContact')}
          activeOpacity={0.85}>
          <View style={styles.contactIcon}>
            <Icon name="support-agent" size={22} color={Colors.white} />
          </View>
          <View style={{flex: 1, marginLeft: 14}}>
            <Text style={styles.contactTitle}>Contact support</Text>
            <Text style={styles.contactSub}>We're here 24/7</Text>
          </View>
          <Icon name="chevron-right" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    searchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: '#F6F6F6',
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: Colors.black,
      marginLeft: 8,
      paddingVertical: 0,
    },
    aiBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 14,
      padding: 14,
      borderRadius: 14,
      backgroundColor: Colors.surfaceMuted,
    },
    aiIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
    },
    aiTitle: {fontSize: 15, fontWeight: '700', color: Colors.black},
    aiSub: {fontSize: 13, color: '#6B6B6B', marginTop: 2},
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginHorizontal: 16,
      marginTop: 28,
      marginBottom: 8,
    },
    group: {backgroundColor: Colors.white},
    tripRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    tripMap: {
      width: 56,
      height: 56,
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: '#EEF1F4',
    },
    tripMapGridV1: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 18,
      width: 1,
      backgroundColor: '#DCE0E5',
    },
    tripMapGridV2: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 38,
      width: 1,
      backgroundColor: '#DCE0E5',
    },
    tripMapGridH1: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 18,
      height: 1,
      backgroundColor: '#DCE0E5',
    },
    tripMapGridH2: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 38,
      height: 1,
      backgroundColor: '#DCE0E5',
    },
    tripMapPickup: {
      position: 'absolute',
      top: 8,
      left: 10,
    },
    tripMapDropoff: {
      position: 'absolute',
      bottom: 8,
      right: 10,
    },
    tripDate: {fontSize: 13, color: '#6B6B6B'},
    tripRoute: {
      fontSize: 15,
      fontWeight: '600',
      color: Colors.black,
      marginTop: 2,
    },
    tripHelp: {fontSize: 13, color: Colors.black, marginTop: 4, fontWeight: '600'},
    tripPrice: {fontSize: 15, fontWeight: '700', color: Colors.black},
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    topicRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    topicLabel: {
      flex: 1,
      fontSize: 16,
      color: Colors.black,
      fontWeight: '500',
    },
    contactCard: {
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 0,
      backgroundColor: Colors.black,
      borderRadius: 16,
      paddingTop: 6,
      paddingHorizontal: 6,
    },
    contactInner: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 14,
    },
    contactIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.white,
    },
    contactSub: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.7)',
      marginTop: 2,
    },
  });
