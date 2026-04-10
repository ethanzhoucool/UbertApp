import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Driver} from '../../data/mockDriver';
import {Colors} from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  driver: Driver;
}

export function CallingSheet({visible, onClose, driver}: Props) {
  const insets = useSafeAreaInsets();
  const pulse = useRef(new Animated.Value(0)).current;
  const [seconds, setSeconds] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSeconds(0);
      setConnected(false);
      return;
    }

    // Pulsing ring animation
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    // Connect after 3s
    const connectTimer = setTimeout(() => setConnected(true), 3000);

    // Tick seconds once connected
    const tickInterval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => {
      loop.stop();
      clearTimeout(connectTimer);
      clearInterval(tickInterval);
    };
  }, [visible, pulse]);

  const ringScale = pulse.interpolate({inputRange: [0, 1], outputRange: [1, 1.4]});
  const ringOpacity = pulse.interpolate({inputRange: [0, 1], outputRange: [0.5, 0]});

  function fmtTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.container, {paddingTop: insets.top + 60}]}>
        <StatusBar barStyle="light-content" />

        <Text style={styles.label}>
          {connected ? 'Connected' : 'Calling…'}
        </Text>

        <View style={styles.avatarWrap}>
          <Animated.View
            style={[
              styles.ring,
              {transform: [{scale: ringScale}], opacity: ringOpacity},
            ]}
          />
          <Image source={{uri: driver.avatarUrl}} style={styles.avatar} />
        </View>

        <Text style={styles.name}>{driver.name}</Text>
        <Text style={styles.sub}>
          {connected ? fmtTime(seconds) : `${driver.carColor} ${driver.carModel}`}
        </Text>

        <View style={[styles.controls, {paddingBottom: insets.bottom + 32}]}>
          <View style={styles.controlRow}>
            <ControlButton icon="mic-off" label="Mute" />
            <ControlButton icon="dialpad" label="Keypad" />
            <ControlButton icon="volume-up" label="Speaker" />
          </View>

          <TouchableOpacity style={styles.endBtn} onPress={onClose} activeOpacity={0.8}>
            <Icon name="call-end" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function ControlButton({icon, label}: {icon: string; label: string}) {
  return (
    <TouchableOpacity style={styles.controlBtn} activeOpacity={0.7}>
      <View style={styles.controlCircle}>
        <Icon name={icon} size={22} color={Colors.white} />
      </View>
      <Text style={styles.controlLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  avatarWrap: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 22,
  },
  ring: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#222',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
  },
  sub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 6,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    gap: 28,
    marginBottom: 36,
  },
  controlBtn: {
    alignItems: 'center',
  },
  controlCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
  },
  endBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E11900',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
