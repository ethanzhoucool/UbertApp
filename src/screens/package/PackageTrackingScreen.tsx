import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PackageSize, RootStackParamList} from '../../navigation/types';
import {Colors} from '../../theme';

const ACCENT = '#276EF1';
const META_GRAY = '#6B6B6B';
const FILL_GRAY = '#F6F6F6';

const COURIER_NAME = 'Jordan P.';
const COURIER_AVATAR_URI =
  'https://api.dicebear.com/7.x/avataaars/png?seed=Jordan%20P.&backgroundColor=c0aede';

const SIZE_LABELS: Record<PackageSize, string> = {
  envelope: 'Envelope',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

const STAGES = [
  'Finding a courier',
  'Courier assigned',
  'Picking up',
  'On the way',
  'Delivered',
];

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'PackageTracking'>;
  route: RouteProp<RootStackParamList, 'PackageTracking'>;
};

export function PackageTrackingScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const {draft} = route.params;
  const [stage, setStage] = useState(0);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    console.log('[Ubert] PackageTrackingScreen mounted');
  }, []);

  useEffect(() => {
    if (stage >= STAGES.length - 1) {
      return;
    }
    const t = setTimeout(() => setStage(s => s + 1), 2200);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.5,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const handleDone = () => {
    const delivered = stage >= STAGES.length - 1;
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          params: {toast: delivered ? 'Package delivered' : 'Tracking your package'},
        },
      ],
    });
  };

  const showCourier = stage >= 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Faux live map (top 55%) */}
      <View style={styles.mapPlaceholder}>
        <View style={[styles.mapBand, {top: 0, height: '20%', backgroundColor: '#EDF1F5'}]} />
        <View style={[styles.mapBand, {top: '20%', height: '15%', backgroundColor: '#E3E9EF'}]} />
        <View style={[styles.mapBand, {top: '35%', height: '25%', backgroundColor: '#E8EDF2'}]} />
        <View style={[styles.mapBand, {top: '60%', height: '20%', backgroundColor: '#DEE4EA'}]} />
        <View style={[styles.mapBand, {top: '80%', height: '20%', backgroundColor: '#E5EAF0'}]} />

        <View style={styles.roadDiag1} />
        <View style={styles.roadDiag2} />
        <View style={styles.roadStraightV} />

        <View style={styles.routeLine} />

        {/* From pin */}
        <View style={[styles.pin, {top: '28%', left: '24%'}]}>
          <View style={styles.pinFrom}>
            <Icon name="inventory-2" size={13} color={Colors.white} />
          </View>
        </View>
        {/* To pin */}
        <View style={[styles.pin, {top: '60%', right: '22%'}]}>
          <View style={styles.pinTo}>
            <Icon name="place" size={16} color={Colors.white} />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.floatingBack, {top: insets.top + 8}]}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon name="arrow-back" size={20} color={Colors.black} />
        </TouchableOpacity>
      </View>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <View style={styles.dragHandle} />

        <ScrollView
          contentContainerStyle={{paddingBottom: insets.bottom + 120}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.heroBlock}>
            <Text style={styles.heroHeadline}>{STAGES[stage]}</Text>
            <Text style={styles.heroSub}>Estimated delivery 20–30 min</Text>
          </View>

          {/* Progress tracker */}
          <View style={styles.tracker}>
            {STAGES.map((_, idx) => {
              const completed = idx < stage;
              const current = idx === stage;
              return (
                <View key={idx} style={styles.trackerSegmentWrap}>
                  <Animated.View
                    style={[
                      styles.trackerSegment,
                      completed && styles.trackerSegmentDone,
                      current && {backgroundColor: ACCENT, opacity: pulse},
                    ]}
                  />
                </View>
              );
            })}
          </View>

          {/* Courier card */}
          {showCourier && (
            <View style={styles.courier}>
              <View style={styles.avatar}>
                <Image
                  source={{uri: COURIER_AVATAR_URI}}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.courierName}>{COURIER_NAME} ★ 4.9</Text>
                <Text style={styles.courierSub}>Your Uber Connect courier</Text>
              </View>
              <TouchableOpacity
                style={styles.courierBtn}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Icon name="call" size={18} color={Colors.black} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.courierBtn, {marginLeft: 8}]}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Icon name="chat-bubble-outline" size={18} color={Colors.black} />
              </TouchableOpacity>
            </View>
          )}

          {/* Package summary */}
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Icon name="inventory-2" size={18} color={Colors.black} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.rowLabel}>{SIZE_LABELS[draft.size]} package</Text>
              <Text style={styles.rowSub} numberOfLines={1}>
                {draft.description || 'No description'}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Icon name="place" size={18} color={Colors.black} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.rowLabel}>
                To {draft.recipientName ?? 'recipient'}
              </Text>
              <Text style={styles.rowSub} numberOfLines={1}>
                {draft.recipientAddress ?? 'Delivery address'}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
          <TouchableOpacity
            style={styles.doneBtn}
            activeOpacity={0.85}
            onPress={handleDone}>
            <Text style={styles.doneText}>
              {stage === STAGES.length - 1 ? 'Done' : 'Back to home'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#E8EEF4'},
  mapPlaceholder: {height: '55%', backgroundColor: '#E5EBF1', overflow: 'hidden'},
  mapBand: {position: 'absolute', left: 0, right: 0},
  roadDiag1: {
    position: 'absolute',
    width: '160%',
    height: 18,
    backgroundColor: '#F5F7FA',
    top: '32%',
    left: '-20%',
    transform: [{rotate: '-12deg'}],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  roadDiag2: {
    position: 'absolute',
    width: '160%',
    height: 14,
    backgroundColor: '#F2F4F8',
    top: '64%',
    left: '-20%',
    transform: [{rotate: '8deg'}],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  roadStraightV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '52%',
    width: 12,
    backgroundColor: '#F8FAFC',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  routeLine: {
    position: 'absolute',
    top: '36%',
    left: '28%',
    width: '50%',
    height: 3,
    backgroundColor: ACCENT,
    borderRadius: 2,
    transform: [{rotate: '24deg'}],
    opacity: 0.85,
  },
  pin: {position: 'absolute'},
  pinFrom: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  pinTo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  floatingBack: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: '50%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  dragHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginTop: 6,
    marginBottom: 6,
  },
  heroBlock: {paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16},
  heroHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.black,
    letterSpacing: -0.3,
  },
  heroSub: {fontSize: 14, color: META_GRAY, marginTop: 4, fontWeight: '600'},
  tracker: {flexDirection: 'row', paddingHorizontal: 20, gap: 6, marginTop: 4},
  trackerSegmentWrap: {flex: 1},
  trackerSegment: {height: 6, borderRadius: 3, backgroundColor: '#E5E7EB'},
  trackerSegmentDone: {backgroundColor: ACCENT},
  courier: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: FILL_GRAY,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#C0AEDE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {width: '100%', height: '100%'},
  courierName: {fontSize: 15, fontWeight: '700', color: Colors.black},
  courierSub: {fontSize: 13, color: META_GRAY, marginTop: 2},
  courierBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEEEEE',
    gap: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: FILL_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {fontSize: 15, fontWeight: '600', color: Colors.black},
  rowSub: {fontSize: 12, color: META_GRAY, marginTop: 2},
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
  doneBtn: {
    backgroundColor: Colors.black,
    borderRadius: 28,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {color: Colors.white, fontSize: 16, fontWeight: '800'},
});
