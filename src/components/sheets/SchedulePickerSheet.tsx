import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BottomSheetModal} from '../common/BottomSheetModal';
import {UbertButton} from '../common/UbertButton';
import {Colors} from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date | null, label: string) => void;
}

interface Slot {
  key: string;
  label: string;
  sub: string;
  offsetMs: number | null;
}

function buildSlots(): Slot[] {
  const oneMin = 60 * 1000;
  const tomorrow8 = new Date();
  tomorrow8.setDate(tomorrow8.getDate() + 1);
  tomorrow8.setHours(8, 0, 0, 0);
  const tomorrowOffset = tomorrow8.getTime() - Date.now();

  return [
    {key: 'now', label: 'Now', sub: 'Pick up as soon as possible', offsetMs: null},
    {key: '15m', label: 'In 15 min', sub: formatPickupTime(15 * oneMin), offsetMs: 15 * oneMin},
    {key: '30m', label: 'In 30 min', sub: formatPickupTime(30 * oneMin), offsetMs: 30 * oneMin},
    {key: '1h', label: 'In 1 hour', sub: formatPickupTime(60 * oneMin), offsetMs: 60 * oneMin},
    {key: '2h', label: 'In 2 hours', sub: formatPickupTime(120 * oneMin), offsetMs: 120 * oneMin},
    {key: 'tomorrow', label: 'Tomorrow at 8:00 AM', sub: 'Save time for later', offsetMs: tomorrowOffset},
  ];
}

function formatPickupTime(offsetMs: number): string {
  const d = new Date(Date.now() + offsetMs);
  return d.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'});
}

export function SchedulePickerSheet({visible, onClose, onSelect}: Props) {
  const [selected, setSelected] = useState<string>('now');
  const slots = buildSlots();

  const handleConfirm = () => {
    const slot = slots.find(s => s.key === selected);
    if (!slot) {return;}
    if (slot.offsetMs === null) {
      onSelect(null, 'Now');
    } else {
      const date = new Date(Date.now() + slot.offsetMs);
      onSelect(date, slot.label);
    }
    onClose();
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose} title="When?" maxHeight="75%">
      <Text style={styles.intro}>
        Choose when you want to be picked up. Pickup time is approximate.
      </Text>

      {slots.map(slot => (
        <TouchableOpacity
          key={slot.key}
          style={styles.row}
          onPress={() => setSelected(slot.key)}
          activeOpacity={0.7}>
          <View style={styles.iconCol}>
            <Icon
              name={slot.key === 'now' ? 'flash-on' : 'schedule'}
              size={20}
              color={Colors.black}
            />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.label}>{slot.label}</Text>
            <Text style={styles.sub}>{slot.sub}</Text>
          </View>
          <View style={[styles.radio, selected === slot.key && styles.radioOn]}>
            {selected === slot.key && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>
      ))}

      <View style={{marginTop: 16}}>
        <UbertButton title="Confirm pickup time" onPress={handleConfirm} />
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 13,
    color: Colors.gray500,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ECECEC',
  },
  iconCol: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  sub: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderColor: Colors.black,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.black,
  },
});
