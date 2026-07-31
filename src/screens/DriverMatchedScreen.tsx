import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, StatusBar, Text, Image, Animated} from 'react-native';
import {PressScale} from '../components/common/PressScale';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MapBackground} from '../components/common/MapBackground';
import {UbertButton} from '../components/common/UbertButton';
import {Divider} from '../components/common/Divider';
import {Toast} from '../components/common/Toast';
import {MessageSheet} from '../components/sheets/MessageSheet';
import {CallingSheet} from '../components/sheets/CallingSheet';
import {ShareTripSheet} from '../components/sheets/ShareTripSheet';
import {SafetySheet} from '../components/sheets/SafetySheet';
import {RootStackParamList} from '../navigation/types';
import {driverApproachCoords} from '../data/mockRouteCoords';
import {useColors, ColorPalette} from '../theme';

type ActiveSheet = 'message' | 'call' | 'share' | 'safety' | null;

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'DriverMatched'>;
  route: RouteProp<RootStackParamList, 'DriverMatched'>;
};

export function DriverMatchedScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {driver} = route.params;
  const [driverIndex, setDriverIndex] = useState(0);
  const [eta, setEta] = useState(3);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const chipOpacity = useRef(new Animated.Value(1)).current;
  const carProgressAnim = useRef(new Animated.Value(1)).current;
  const [carProgress, setCarProgress] = useState(1);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDriverIndex(prev => {
        if (prev >= driverApproachCoords.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Drive carProgress 1 → 0 (far → pickup) smoothly via Animated.
  useEffect(() => {
    const target =
      1 - driverIndex / Math.max(1, driverApproachCoords.length - 1);
    Animated.timing(carProgressAnim, {
      toValue: target,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [driverIndex, carProgressAnim]);

  useEffect(() => {
    const id = carProgressAnim.addListener(({value}) => setCarProgress(value));
    return () => carProgressAnim.removeListener(id);
  }, [carProgressAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEta(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Crossfade the ETA chip text whenever `eta` changes.
  useEffect(() => {
    Animated.sequence([
      Animated.timing(chipOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(chipOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [eta, chipOpacity]);

  const arrived = driverIndex >= driverApproachCoords.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Map */}
      <View style={styles.mapArea}>
        <MapBackground
          showPickup
          showPolyline
          showCar={!arrived}
          carProgress={carProgress}
          style={StyleSheet.absoluteFillObject}
        />

        {/* ETA chip */}
        {!arrived && (
          <Animated.View
            style={[styles.etaChip, {top: insets.top + 16, opacity: chipOpacity}]}>
            <Text style={styles.etaChipText}>
              {eta <= 0 ? 'Arriving now' : `${eta} min away`}
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Bottom card */}
      <View style={[styles.bottomCard, {paddingBottom: insets.bottom + 16}]}>
        <View style={styles.handle} />

        <Text style={styles.statusText}>
          {arrived
            ? `${driver.name} has arrived`
            : `${driver.name} is on the way`}
        </Text>
        <Text style={styles.carText}>
          {driver.carColor} {driver.carModel} · {driver.licensePlate}
        </Text>

        <Divider style={{marginVertical: 14}} />

        {/* Driver info */}
        <View style={styles.driverRow}>
          <Image source={{uri: driver.avatarUrl}} style={styles.avatar} />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={14} color={Colors.black} />
              <Text style={styles.ratingText}>{driver.rating}</Text>
              <Text style={styles.tripsText}>
                {' '}
                · {driver.totalTrips} trips
              </Text>
            </View>
          </View>
          <View style={styles.plateBox}>
            <Text style={styles.plateText}>{driver.licensePlate}</Text>
          </View>
        </View>

        <Divider style={{marginVertical: 14}} />

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <ActionCircle icon="chat-bubble-outline" label="Message" onPress={() => setActiveSheet('message')} />
          <ActionCircle icon="phone" label="Call" onPress={() => setActiveSheet('call')} />
          <ActionCircle icon="share" label="Share" onPress={() => setActiveSheet('share')} />
          <ActionCircle icon="shield" label="Safety" onPress={() => setActiveSheet('safety')} />
        </View>

        {arrived && (
          <View style={{marginTop: 16}}>
            <UbertButton
              title="Start Trip"
              onPress={() => navigation.replace('TripInProgress', {driver})}
            />
          </View>
        )}
      </View>

      {/* Sheets */}
      <MessageSheet
        visible={activeSheet === 'message'}
        onClose={() => setActiveSheet(null)}
        driver={driver}
      />
      <CallingSheet
        visible={activeSheet === 'call'}
        onClose={() => setActiveSheet(null)}
        driver={driver}
      />
      <ShareTripSheet
        visible={activeSheet === 'share'}
        onClose={() => setActiveSheet(null)}
        onCopyLink={() => showToast('Trip link copied')}
      />
      <SafetySheet
        visible={activeSheet === 'safety'}
        onClose={() => setActiveSheet(null)}
      />

      <Toast
        message={toastMsg}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}

function ActionCircle({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <PressScale style={styles.actionBtn} onPress={onPress}>
      <View style={styles.actionCircle}>
        <Icon name={icon} size={18} color={Colors.black} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </PressScale>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  mapArea: {
    flex: 1,
  },
  etaChip: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: Colors.black,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
  },
  etaChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  bottomCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: -4},
    elevation: 12,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginBottom: 14,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
  },
  carText: {
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 4,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray200,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
    marginLeft: 3,
  },
  tripsText: {
    fontSize: 13,
    color: Colors.gray500,
  },
  plateBox: {
    borderWidth: 1.5,
    borderColor: Colors.gray300,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  plateText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.black,
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 11,
    color: Colors.gray700,
    marginTop: 5,
  },
  });
