import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UbertButton} from '../components/common/UbertButton';
import {StarRating} from '../components/common/StarRating';
import {Divider} from '../components/common/Divider';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {Colors} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TripComplete'>;
  route: RouteProp<RootStackParamList, 'TripComplete'>;
};

const COMPLIMENTS = [
  {key: 'chat', icon: 'chat-bubble-outline', label: 'Good conversation'},
  {key: 'nav', icon: 'navigation', label: 'Expert driving'},
  {key: 'music', icon: 'music-note', label: 'Great music'},
  {key: 'clean', icon: 'clean-hands', label: 'Clean vehicle'},
];

export function TripCompleteScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const {driver, fare, duration} = route.params;
  const {state, dispatch} = useTrip();
  const [rating, setRating] = useState(0);
  const [selectedTip, setSelectedTip] = useState<string | null>(null);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([]);

  const tipOptions = ['$1', '$2', '$5', 'Other'];

  const toggleCompliment = (label: string) => {
    setSelectedCompliments(prev =>
      prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label],
    );
  };

  const handleDone = () => {
    if (state.destination && state.selectedRide) {
      dispatch({
        type: 'COMPLETE_TRIP',
        payload: {
          id: `trip-${Date.now()}`,
          destination: state.destination,
          driver,
          rideOption: state.selectedRide,
          fare,
          duration,
          date: new Date(),
          rating,
          compliments: selectedCompliments,
        },
      });
    }
    dispatch({type: 'RESET'});
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Route line visual */}
        <View style={styles.routeVisual}>
          <View style={[styles.routeDot, {backgroundColor: '#276EF1'}]} />
          <View style={styles.routeLine} />
          <View style={[styles.routeDot, {backgroundColor: Colors.black}]} />
        </View>

        <Text style={styles.title}>You've arrived</Text>

        {/* Trip stats */}
        <View style={styles.statsRow}>
          <StatItem icon="straighten" label="Distance" value="2.3 mi" />
          <View style={styles.statDivider} />
          <StatItem icon="access-time" label="Duration" value={duration} />
          <View style={styles.statDivider} />
          <StatItem icon="receipt" label="Total" value={fare} />
        </View>

        <Divider style={{marginVertical: 20}} />

        {/* Driver + rating */}
        <View style={styles.driverSection}>
          <Image source={{uri: driver.avatarUrl}} style={styles.avatar} />
          <Text style={styles.rateQuestion}>
            Rate your trip with {driver.name}
          </Text>
          <StarRating rating={rating} onRate={setRating} interactive size={40} />
        </View>

        {rating >= 4 && (
          <>
            <Divider style={{marginVertical: 20}} />

            {/* Compliments */}
            <Text style={styles.sectionTitle}>Compliments</Text>
            <View style={styles.complimentsRow}>
              {COMPLIMENTS.map(c => (
                <Compliment
                  key={c.key}
                  icon={c.icon}
                  label={c.label}
                  selected={selectedCompliments.includes(c.label)}
                  onPress={() => toggleCompliment(c.label)}
                />
              ))}
            </View>
          </>
        )}

        <Divider style={{marginVertical: 20}} />

        {/* Tip */}
        <Text style={styles.sectionTitle}>Tip {driver.name}?</Text>
        <Text style={styles.tipSubtext}>
          Tips go directly to {driver.name}.
        </Text>
        <View style={styles.tipRow}>
          {tipOptions.map(tip => (
            <TouchableOpacity
              key={tip}
              style={[
                styles.tipPill,
                selectedTip === tip && styles.tipPillActive,
              ]}
              onPress={() =>
                setSelectedTip(tip === selectedTip ? null : tip)
              }>
              <Text
                style={[
                  styles.tipPillText,
                  selectedTip === tip && styles.tipPillTextActive,
                ]}>
                {tip}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Divider style={{marginVertical: 20}} />

        {/* Driver info */}
        <View style={styles.driverInfoRow}>
          <Image source={{uri: driver.avatarUrl}} style={styles.smallAvatar} />
          <View style={{marginLeft: 12, flex: 1}}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <Text style={styles.carDetail}>
              {driver.carColor} {driver.carModel} · {driver.licensePlate}
            </Text>
          </View>
          <View style={styles.ratingBadge}>
            <Icon name="star" size={14} color={Colors.black} />
            <Text style={styles.ratingBadgeText}>{driver.rating}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed footer */}
      <View style={[styles.footer, {paddingBottom: insets.bottom + 8}]}>
        <UbertButton title="Done" onPress={handleDone} />
      </View>
    </View>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statItem}>
      <Icon name={icon} size={20} color={Colors.gray700} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function Compliment({
  icon,
  label,
  selected,
  onPress,
}: {
  icon: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.complimentChip, selected && styles.complimentChipActive]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Icon
        name={icon}
        size={16}
        color={selected ? Colors.white : Colors.gray700}
      />
      <Text
        style={[
          styles.complimentText,
          selected && styles.complimentTextActive,
        ]}>
        {label}
      </Text>
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },

  // Route visual
  routeVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 0,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeLine: {
    width: 80,
    height: 3,
    backgroundColor: Colors.gray300,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 0,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.gray200,
  },

  // Driver rating
  driverSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.gray200,
    marginBottom: 14,
  },
  rateQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 14,
    textAlign: 'center',
  },

  // Section title
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },

  // Compliments
  complimentsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  complimentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  complimentChipActive: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  complimentText: {
    fontSize: 13,
    color: Colors.gray700,
  },
  complimentTextActive: {
    color: Colors.white,
  },

  // Tips
  tipSubtext: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 4,
  },
  tipRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  tipPill: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipPillActive: {
    backgroundColor: Colors.black,
  },
  tipPillText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  tipPillTextActive: {
    color: Colors.white,
  },

  // Driver info
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray200,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  carDetail: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.gray200,
  },
});
