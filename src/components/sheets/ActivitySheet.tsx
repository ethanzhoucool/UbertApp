import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BottomSheetModal} from '../common/BottomSheetModal';
import {useTrip} from '../../store/TripContext';
import {CompletedTrip, formatTripDate} from '../../data/mockTripHistory';
import {Colors} from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function ActivitySheet({visible, onClose}: Props) {
  const {state} = useTrip();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <BottomSheetModal visible={visible} onClose={onClose} title="Past trips" maxHeight="85%">
      {state.history.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="receipt-long" size={40} color={Colors.gray300} />
          <Text style={styles.emptyText}>No past trips yet</Text>
        </View>
      ) : (
        state.history.map(trip => (
          <TripRow
            key={trip.id}
            trip={trip}
            expanded={expanded === trip.id}
            onToggle={() => setExpanded(expanded === trip.id ? null : trip.id)}
          />
        ))
      )}
    </BottomSheetModal>
  );
}

function TripRow({
  trip,
  expanded,
  onToggle,
}: {
  trip: CompletedTrip;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <View>
      <TouchableOpacity style={styles.row} onPress={onToggle} activeOpacity={0.7}>
        <Image source={{uri: trip.rideOption.imageUrl}} style={styles.carImg} resizeMode="contain" />
        <View style={styles.info}>
          <Text style={styles.dest} numberOfLines={1}>
            {trip.destination.name}
          </Text>
          <Text style={styles.meta}>
            {formatTripDate(trip.date)} · {trip.rideOption.name}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.fare}>{trip.fare}</Text>
          <Icon
            name={expanded ? 'expand-less' : 'expand-more'}
            size={18}
            color={Colors.gray500}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.receipt}>
          <ReceiptRow label="Driver" value={trip.driver.name} />
          <ReceiptRow
            label="Vehicle"
            value={`${trip.driver.carColor} ${trip.driver.carModel}`}
          />
          <ReceiptRow label="Plate" value={trip.driver.licensePlate} />
          <ReceiptRow label="Duration" value={trip.duration} />
          <ReceiptRow label="Total" value={trip.fare} bold />
          {trip.rating > 0 && (
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <Icon
                  key={s}
                  name={s <= trip.rating ? 'star' : 'star-border'}
                  size={16}
                  color={s <= trip.rating ? '#FFC043' : Colors.gray300}
                />
              ))}
            </View>
          )}
        </View>
      )}
      <View style={styles.divider} />
    </View>
  );
}

function ReceiptRow({label, value, bold}: {label: string; value: string; bold?: boolean}) {
  return (
    <View style={styles.receiptRow}>
      <Text style={styles.receiptLabel}>{label}</Text>
      <Text style={[styles.receiptValue, bold && styles.receiptValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  carImg: {
    width: 56,
    height: 36,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  dest: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  meta: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  fare: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.black,
  },
  receipt: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  receiptLabel: {
    fontSize: 13,
    color: Colors.gray500,
  },
  receiptValue: {
    fontSize: 13,
    color: Colors.black,
    fontWeight: '500',
  },
  receiptValueBold: {
    fontSize: 14,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ECECEC',
  },
});
