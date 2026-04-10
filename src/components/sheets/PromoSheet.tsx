import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BottomSheetModal} from '../common/BottomSheetModal';
import {UbertButton} from '../common/UbertButton';
import {Colors} from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onScheduleRide: () => void;
}

export function PromoSheet({visible, onClose, onScheduleRide}: Props) {
  return (
    <BottomSheetModal visible={visible} onClose={onClose} maxHeight="60%">
      <View style={styles.heroIcon}>
        <Icon name="event-available" size={48} color="#05944F" />
      </View>

      <Text style={styles.title}>Reserve a ride</Text>
      <Text style={styles.body}>
        Book up to 90 days in advance. We'll match you with a driver right
        before pickup so you never have to wait around.
      </Text>

      <View style={styles.bullets}>
        <Bullet icon="schedule" text="Pick a time that works for you" />
        <Bullet icon="local-taxi" text="Driver matched closer to pickup" />
        <Bullet icon="check-circle" text="Cancel free up to 1 hour before" />
      </View>

      <UbertButton
        title="Schedule a ride"
        onPress={() => {
          onClose();
          onScheduleRide();
        }}
      />
    </BottomSheetModal>
  );
}

function Bullet({icon, text}: {icon: string; text: string}) {
  return (
    <View style={styles.bulletRow}>
      <Icon name={icon} size={18} color={Colors.gray700} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  bullets: {
    marginTop: 18,
    marginBottom: 22,
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bulletText: {
    fontSize: 14,
    color: Colors.black,
    flex: 1,
  },
});
