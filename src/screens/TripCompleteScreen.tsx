import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, StatusBar, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UbertText} from '../components/common/UbertText';
import {UbertButton} from '../components/common/UbertButton';
import {StarRating} from '../components/common/StarRating';
import {Divider} from '../components/common/Divider';
import {RootStackParamList} from '../navigation/types';
import {Colors, Spacing} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TripComplete'>;
  route: RouteProp<RootStackParamList, 'TripComplete'>;
};

export function TripCompleteScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const {driver, fare, duration} = route.params;
  const [rating, setRating] = useState(0);
  const [selectedTip, setSelectedTip] = useState<string | null>(null);

  const tipOptions = ['$1', '$2', '$5', 'Custom'];

  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Success icon */}
        <View style={styles.successIcon}>
          <Icon name="check-circle" size={64} color={Colors.black} />
        </View>

        <UbertText variant="title" style={styles.title}>
          You've arrived!
        </UbertText>

        {/* Trip summary */}
        <View style={styles.tripSummary}>
          <SummaryItem icon="place" label="Distance" value="2.3 mi" />
          <SummaryItem icon="access-time" label="Duration" value={duration} />
          <SummaryItem icon="attach-money" label="Total" value={fare} />
        </View>

        <Divider style={{marginVertical: Spacing.lg}} />

        {/* Rating */}
        <UbertText variant="body" color={Colors.black} style={{fontWeight: '600', textAlign: 'center'}}>
          How was your trip with {driver.name}?
        </UbertText>

        <View style={styles.ratingContainer}>
          <StarRating
            rating={rating}
            onRate={setRating}
            interactive
            size={40}
          />
        </View>

        <Divider style={{marginVertical: Spacing.lg}} />

        {/* Tip section */}
        <UbertText variant="body" color={Colors.black} style={{fontWeight: '600'}}>
          Add a tip for {driver.name}
        </UbertText>

        <View style={styles.tipRow}>
          {tipOptions.map(tip => (
            <TouchableOpacity
              key={tip}
              style={[
                styles.tipPill,
                selectedTip === tip && styles.tipPillSelected,
              ]}
              onPress={() => setSelectedTip(tip === selectedTip ? null : tip)}>
              <UbertText
                variant="body"
                color={selectedTip === tip ? Colors.white : Colors.black}
                style={{fontWeight: '600'}}>
                {tip}
              </UbertText>
            </TouchableOpacity>
          ))}
        </View>

        <Divider style={{marginVertical: Spacing.lg}} />

        {/* Driver info */}
        <View style={styles.driverRow}>
          <Image
            source={{uri: driver.avatarUrl}}
            style={styles.driverAvatar}
          />
          <View style={{marginLeft: Spacing.md}}>
            <UbertText variant="body" color={Colors.black} style={{fontWeight: '600'}}>
              {driver.name}
            </UbertText>
            <UbertText variant="caption">
              {driver.carColor} {driver.carModel} \u2022 {driver.licensePlate}
            </UbertText>
          </View>
        </View>

        {/* Compliments */}
        <View style={styles.complimentsRow}>
          <ComplimentChip icon="chat-bubble-outline" label="Great conversation" />
          <ComplimentChip icon="navigation" label="Expert navigation" />
          <ComplimentChip icon="music-note" label="Good music" />
        </View>
      </ScrollView>

      {/* Done button */}
      <View style={[styles.footer, {paddingBottom: insets.bottom + 8}]}>
        <UbertButton title="Done" onPress={handleDone} />
      </View>
    </View>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.summaryItem}>
      <Icon name={icon} size={20} color={Colors.gray700} />
      <UbertText variant="caption" style={{marginTop: 4}}>
        {label}
      </UbertText>
      <UbertText variant="body" color={Colors.black} style={{fontWeight: '700'}}>
        {value}
      </UbertText>
    </View>
  );
}

function ComplimentChip({icon, label}: {icon: string; label: string}) {
  return (
    <TouchableOpacity style={styles.complimentChip}>
      <Icon name={icon} size={16} color={Colors.gray700} />
      <UbertText variant="caption" style={{marginLeft: 6}}>
        {label}
      </UbertText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  successIcon: {
    alignSelf: 'center',
    marginBottom: Spacing.base,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  tripSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  ratingContainer: {
    marginTop: Spacing.base,
    alignItems: 'center',
  },
  tipRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: 10,
  },
  tipPill: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipPillSelected: {
    backgroundColor: Colors.black,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray200,
  },
  complimentsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.base,
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
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.gray200,
  },
});
