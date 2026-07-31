import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {UbertButton} from '../../components/common/UbertButton';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ReserveSchedule'>;
};

const GOLD = '#C8A24B';
const FIELD_FILL = '#F6F6F6';

// 90-day window starting today
const DAY_RANGE = Array.from({length: 90}, (_, i) => i);

const HOURS_12 = Array.from({length: 12}, (_, i) => i + 1); // 1..12
const MINUTES = ['00', '15', '30', '45'];
const PERIODS = ['AM', 'PM'] as const;

function dayDate(offset: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}

function formatChipDay(offset: number) {
  const d = dayDate(offset);
  return {
    weekday: d.toLocaleDateString('en-US', {weekday: 'short'}),
    day: d.getDate().toString(),
  };
}

function formatFullDate(offset: number) {
  return dayDate(offset).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function ReserveScheduleScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [dayOffset, setDayOffset] = useState(1);
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState('15');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [pickup, setPickup] = useState('350 5th Ave, New York, NY');
  const [dropoff, setDropoff] = useState('LaGuardia Airport, Queens, NY');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);

  // staged values for the time picker
  const [draftHour, setDraftHour] = useState(hour);
  const [draftMinute, setDraftMinute] = useState(minute);
  const [draftPeriod, setDraftPeriod] = useState<'AM' | 'PM'>(period);

  useEffect(() => {
    console.log('[Ubert] ReserveScheduleScreen mounted');
  }, []);

  const timeLabel = useMemo(
    () => `${hour}:${minute} ${period}`,
    [hour, minute, period],
  );

  const openTimePicker = () => {
    setDraftHour(hour);
    setDraftMinute(minute);
    setDraftPeriod(period);
    setShowTimePicker(true);
  };

  const confirmTime = () => {
    setHour(draftHour);
    setMinute(draftMinute);
    setPeriod(draftPeriod);
    setShowTimePicker(false);
  };

  const handleNext = () => {
    navigation.navigate('ReserveRideType', {
      draft: {
        date: formatFullDate(dayOffset),
        time: timeLabel,
        pickup,
        dropoff,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Reserve a ride" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}>
        {/* Stacked location fields with connector */}
        <View style={styles.locationsWrap}>
          <View style={styles.connectorCol}>
            <View style={styles.greenDot} />
            <View style={styles.connectorLine} />
            <View style={styles.redSquare} />
          </View>
          <View style={styles.fieldsCol}>
            <View style={styles.locationField}>
              <TextInput
                style={styles.locationInput}
                value={pickup}
                onChangeText={setPickup}
                placeholder="Pickup location"
                placeholderTextColor={Colors.gray500}
              />
            </View>
            <View style={styles.locationField}>
              <TextInput
                style={styles.locationInput}
                value={dropoff}
                onChangeText={setDropoff}
                placeholder="Where to?"
                placeholderTextColor={Colors.gray500}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.addStopRow} activeOpacity={0.7}>
          <Icon name="add" size={18} color={Colors.black} />
          <Text style={styles.addStopText}>Add stop</Text>
        </TouchableOpacity>

        {/* Helper */}
        <Text style={styles.helperLine}>Book up to 90 days ahead</Text>

        {/* Week-strip calendar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekStrip}>
          {DAY_RANGE.slice(0, 14).map(offset => {
            const active = dayOffset === offset;
            const isToday = offset === 0;
            const {weekday, day} = formatChipDay(offset);
            return (
              <TouchableOpacity
                key={offset}
                style={[styles.dayPill, active && styles.dayPillActive]}
                onPress={() => setDayOffset(offset)}
                activeOpacity={0.75}>
                <Text
                  style={[
                    styles.dayPillWeekday,
                    active && styles.dayPillWeekdayActive,
                  ]}>
                  {weekday}
                </Text>
                <Text
                  style={[
                    styles.dayPillNumber,
                    active && styles.dayPillNumberActive,
                  ]}>
                  {day}
                </Text>
                {isToday && (
                  <View
                    style={[
                      styles.todayDot,
                      active && styles.todayDotActive,
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={styles.morePill}
            activeOpacity={0.75}
            onPress={() => setShowMoreModal(true)}>
            <Text style={styles.morePillText}>More</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Time row */}
        <TouchableOpacity
          style={styles.timeRow}
          activeOpacity={0.7}
          onPress={openTimePicker}>
          <Icon name="schedule" size={20} color={Colors.black} />
          <Text style={styles.timeText}>Pick up at {timeLabel}</Text>
          <View style={styles.reserveChip}>
            <Icon name="schedule" size={12} color={GOLD} />
            <Text style={styles.reserveChipText}>Reserve</Text>
          </View>
          <Icon name="chevron-right" size={22} color={Colors.gray500} />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <UbertButton title="Next" onPress={handleNext} />
      </View>

      {/* Time picker half-sheet */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowTimePicker(false)}
        />
        <View style={[styles.sheet, {paddingBottom: insets.bottom + 16}]}>
          <View style={styles.sheetBar}>
            <TouchableOpacity onPress={() => setShowTimePicker(false)}>
              <Text style={styles.sheetCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.sheetTitle}>Select pickup time</Text>
            <TouchableOpacity onPress={confirmTime}>
              <Text style={styles.sheetConfirm}>Confirm</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wheelWrap}>
            <View pointerEvents="none" style={styles.wheelSelectionBand} />
            <View style={styles.wheelCol}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.wheelContent}>
                {HOURS_12.map(h => (
                  <TouchableOpacity
                    key={h}
                    style={styles.wheelItem}
                    onPress={() => setDraftHour(h)}>
                    <Text
                      style={[
                        styles.wheelText,
                        draftHour === h && styles.wheelTextActive,
                      ]}>
                      {h}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.wheelCol}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.wheelContent}>
                {MINUTES.map(m => (
                  <TouchableOpacity
                    key={m}
                    style={styles.wheelItem}
                    onPress={() => setDraftMinute(m)}>
                    <Text
                      style={[
                        styles.wheelText,
                        draftMinute === m && styles.wheelTextActive,
                      ]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.wheelCol}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.wheelContent}>
                {PERIODS.map(p => (
                  <TouchableOpacity
                    key={p}
                    style={styles.wheelItem}
                    onPress={() => setDraftPeriod(p)}>
                    <Text
                      style={[
                        styles.wheelText,
                        draftPeriod === p && styles.wheelTextActive,
                      ]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* Full-month placeholder modal */}
      <Modal
        visible={showMoreModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMoreModal(false)}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowMoreModal(false)}
        />
        <View style={[styles.sheet, {paddingBottom: insets.bottom + 16}]}>
          <View style={styles.sheetBar}>
            <TouchableOpacity onPress={() => setShowMoreModal(false)}>
              <Text style={styles.sheetCancel}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.sheetTitle}>Choose a date</Text>
            <View style={{width: 56}} />
          </View>
          <ScrollView
            style={{maxHeight: 360}}
            contentContainerStyle={styles.moreList}>
            {DAY_RANGE.map(offset => {
              const active = dayOffset === offset;
              return (
                <TouchableOpacity
                  key={offset}
                  style={styles.moreRow}
                  onPress={() => {
                    setDayOffset(offset);
                    setShowMoreModal(false);
                  }}>
                  <Text style={styles.moreRowText}>
                    {formatFullDate(offset)}
                  </Text>
                  {active && (
                    <Icon name="check" size={18} color={Colors.black} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},

  // Location fields
  locationsWrap: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
  },
  connectorCol: {
    width: 24,
    alignItems: 'center',
    paddingTop: 18,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#D8D8D8',
    marginVertical: 6,
  },
  redSquare: {
    width: 10,
    height: 10,
    backgroundColor: Colors.error,
  },
  fieldsCol: {flex: 1},
  locationField: {
    backgroundColor: FIELD_FILL,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  locationInput: {
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.black,
  },

  addStopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 4,
    paddingVertical: 10,
    gap: 8,
  },
  addStopText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },

  helperLine: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    fontSize: 13,
    color: Colors.gray700,
  },

  // Week strip
  weekStrip: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dayPill: {
    width: 56,
    paddingVertical: 10,
    borderRadius: 28,
    alignItems: 'center',
    backgroundColor: FIELD_FILL,
  },
  dayPillActive: {
    backgroundColor: Colors.black,
  },
  dayPillWeekday: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.gray700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayPillWeekdayActive: {color: '#D8D8D8'},
  dayPillNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.black,
    marginTop: 2,
  },
  dayPillNumberActive: {color: Colors.white},
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.black,
    marginTop: 4,
  },
  todayDotActive: {backgroundColor: Colors.white},
  morePill: {
    paddingHorizontal: 16,
    height: 64,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FIELD_FILL,
  },
  morePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.black,
  },

  // Time row
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: FIELD_FILL,
    borderRadius: 12,
    gap: 12,
  },
  timeText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  reserveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GOLD,
    gap: 4,
  },
  reserveChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 0.3,
  },

  // Footer CTA
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: Colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },

  // Modal / sheet
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.modalBackdrop,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
  },
  sheetBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderSubtle,
  },
  sheetCancel: {fontSize: 15, color: Colors.gray700, fontWeight: '500'},
  sheetConfirm: {fontSize: 15, color: Colors.black, fontWeight: '700'},
  sheetTitle: {fontSize: 16, fontWeight: '700', color: Colors.black},

  wheelWrap: {
    flexDirection: 'row',
    height: 220,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  wheelSelectionBand: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 90,
    height: 40,
    backgroundColor: FIELD_FILL,
    borderRadius: 8,
  },
  wheelCol: {flex: 1},
  wheelContent: {
    paddingVertical: 90,
    alignItems: 'center',
  },
  wheelItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelText: {
    fontSize: 18,
    color: Colors.gray500,
  },
  wheelTextActive: {
    color: Colors.black,
    fontWeight: '700',
  },

  // More-modal list
  moreList: {paddingHorizontal: 16, paddingVertical: 8},
  moreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderSubtle,
  },
  moreRowText: {fontSize: 15, color: Colors.black, fontWeight: '500'},
});
