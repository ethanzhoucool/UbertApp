import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../navigation/types';
import {useTrip} from '../../store/TripContext';
import {useColors, ColorPalette} from '../../theme';

const EATS_GREEN = '#06C167';
const META_GRAY = '#6B6B6B';
const FILL_GRAY = '#F6F6F6';

const COURIER_NAME = 'Marcus B.';
const COURIER_AVATAR_URI =
  'https://api.dicebear.com/7.x/avataaars/png?seed=Marcus%20B.&backgroundColor=fcd34d';
const COURIER_CAR_URI =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=70';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'DeliveryTracking'>;
};

const STAGES = [
  'Order placed',
  'Restaurant confirmed',
  'Preparing',
  'On the way',
  'Arriving',
  'Delivered',
];

const STAGE_HEADLINES = [
  'Order received',
  'Restaurant confirmed your order',
  'Preparing your order',
  'Your courier is on the way',
  'Arriving soon',
  'Order delivered',
];

export function DeliveryTrackingScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {state, dispatch} = useTrip();
  const [stage, setStage] = useState(0);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    console.log('[Ubert] DeliveryTrackingScreen mounted');
  }, []);

  useEffect(() => {
    if (stage >= STAGES.length - 1) {
      return;
    }
    const t = setTimeout(() => setStage(s => s + 1), 2200);
    return () => clearTimeout(t);
  }, [stage]);

  // Pulsing animation for current stage
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
    dispatch({type: 'CLEAR_CART'});
    navigation.reset({
      index: 0,
      routes: [{name: 'Home', params: {toast: 'Order delivered'}}],
    });
  };

  // Show courier card once "On the way" (stage >= 3)
  const showCourier = stage >= 3;
  const canCancel = stage < 2;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Live map (top 55%) */}
      <View style={styles.mapPlaceholder}>
        {/* Layered gray gradient strips give a faux-map feel */}
        <View style={[styles.mapBand, {top: 0, height: '20%', backgroundColor: '#EDF1F5'}]} />
        <View style={[styles.mapBand, {top: '20%', height: '15%', backgroundColor: '#E3E9EF'}]} />
        <View style={[styles.mapBand, {top: '35%', height: '25%', backgroundColor: '#E8EDF2'}]} />
        <View style={[styles.mapBand, {top: '60%', height: '20%', backgroundColor: '#DEE4EA'}]} />
        <View style={[styles.mapBand, {top: '80%', height: '20%', backgroundColor: '#E5EAF0'}]} />

        {/* Diagonal "roads" — light gray strips */}
        <View style={styles.roadDiag1} />
        <View style={styles.roadDiag2} />
        <View style={styles.roadStraight} />
        <View style={styles.roadStraightV} />

        {/* Subtle grid (overlay, hairline) */}
        <View style={styles.mapGrid}>
          {[...Array(6)].map((_, i) => (
            <View key={`h${i}`} style={[styles.mapLineH, {top: `${i * 18}%`}]} />
          ))}
          {[...Array(6)].map((_, i) => (
            <View key={`v${i}`} style={[styles.mapLineV, {left: `${i * 18}%`}]} />
          ))}
        </View>

        {/* Route polyline (between pins) */}
        <View style={styles.routeLine} />

        {/* Pickup pin */}
        <View style={[styles.pin, {top: '28%', left: '24%'}]}>
          <View style={styles.pinPickup}>
            <Icon name="restaurant" size={14} color={Colors.white} />
          </View>
        </View>
        {/* Dropoff pin */}
        <View style={[styles.pin, {top: '60%', right: '22%'}]}>
          <View style={styles.pinDropoff}>
            <Icon name="place" size={16} color={Colors.white} />
          </View>
        </View>
        {/* Floating back */}
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
          {/* Hero status */}
          <View style={styles.heroBlock}>
            <Text style={styles.heroHeadline}>{STAGE_HEADLINES[stage]}</Text>
            <Text style={styles.heroSub}>Arrives by 7:42 PM</Text>
            <Text style={styles.heroSubSmall}>Latest arrival by 7:55 PM</Text>
          </View>

          {/* 5-stage tracker */}
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
                      current && {
                        backgroundColor: EATS_GREEN,
                        opacity: pulse,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
          <Text style={styles.stageLabel}>{STAGES[stage]}</Text>

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
                <Text style={styles.courierSub}>Toyota Prius · ABC 123</Text>
              </View>
              <View style={styles.carThumb}>
                <Image
                  source={{uri: COURIER_CAR_URI}}
                  style={styles.carImage}
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity
                style={[styles.courierBtn, {marginLeft: 8}]}
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

          {/* Order details row */}
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowIcon}>
              <Icon name="receipt-long" size={18} color={Colors.black} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.rowLabel}>Order details</Text>
              {state.cartRestaurant && (
                <Text style={styles.rowSub} numberOfLines={1}>
                  {state.cartRestaurant.name} · {state.cart.length} item
                  {state.cart.length === 1 ? '' : 's'}
                </Text>
              )}
            </View>
            <Icon name="chevron-right" size={22} color={META_GRAY} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowIcon}>
              <Icon name="help-outline" size={18} color={Colors.black} />
            </View>
            <Text style={[styles.rowLabel, {flex: 1}]}>Help</Text>
            <Icon name="chevron-right" size={22} color={META_GRAY} />
          </TouchableOpacity>

          {canCancel && (
            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={styles.rowIcon}>
                <Icon name="cancel" size={18} color="#E11900" />
              </View>
              <Text style={[styles.rowLabel, styles.cancelText, {flex: 1}]}>
                Cancel order
              </Text>
              <Icon name="chevron-right" size={22} color="#E11900" />
            </TouchableOpacity>
          )}
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

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: '#E8EEF4'},
    mapPlaceholder: {
      height: '55%',
      backgroundColor: '#E5EBF1',
      overflow: 'hidden',
    },
    mapBand: {
      position: 'absolute',
      left: 0,
      right: 0,
    },
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
    roadStraight: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: '47%',
      height: 12,
      backgroundColor: '#F8FAFC',
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
      backgroundColor: EATS_GREEN,
      borderRadius: 2,
      transform: [{rotate: '24deg'}],
      opacity: 0.85,
    },
    mapGrid: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    mapLineH: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: StyleSheet.hairlineWidth,
      backgroundColor: 'rgba(0,0,0,0.06)',
    },
    mapLineV: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: StyleSheet.hairlineWidth,
      backgroundColor: 'rgba(0,0,0,0.06)',
    },
    pin: {
      position: 'absolute',
    },
    pinPickup: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: Colors.white,
    },
    pinDropoff: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: EATS_GREEN,
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
    heroBlock: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
    },
    heroHeadline: {
      fontSize: 22,
      fontWeight: '800',
      color: Colors.black,
      letterSpacing: -0.3,
    },
    heroSub: {
      fontSize: 14,
      color: Colors.black,
      marginTop: 4,
      fontWeight: '600',
    },
    heroSubSmall: {
      fontSize: 12,
      color: META_GRAY,
      marginTop: 2,
    },
    tracker: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      gap: 6,
      marginTop: 4,
    },
    trackerSegmentWrap: {
      flex: 1,
    },
    trackerSegment: {
      height: 6,
      borderRadius: 3,
      backgroundColor: '#E5E7EB',
    },
    trackerSegmentDone: {
      backgroundColor: EATS_GREEN,
    },
    stageLabel: {
      fontSize: 12,
      color: META_GRAY,
      fontWeight: '600',
      marginTop: 8,
      paddingHorizontal: 20,
    },
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
      backgroundColor: '#FCD34D',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    carThumb: {
      width: 44,
      height: 32,
      borderRadius: 6,
      backgroundColor: '#E5E7EB',
      overflow: 'hidden',
      marginLeft: 4,
    },
    carImage: {
      width: '100%',
      height: '100%',
    },
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
      borderColor: Colors.borderSubtle,
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
    cancelText: {color: '#E11900'},
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
      backgroundColor: EATS_GREEN,
      borderRadius: 28,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
    },
    doneText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '800',
    },
  });
