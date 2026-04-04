import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {UbertText} from '../common/UbertText';
import {RideOption} from '../../data/mockRideOptions';
import {Colors, Spacing} from '../../theme';

interface Props {
  option: RideOption;
  selected: boolean;
  onSelect: (option: RideOption) => void;
}

export function RideOptionCard({option, selected, onSelect}: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selected]}
      onPress={() => onSelect(option)}
      activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Icon name="car-side" size={40} color={Colors.black} />
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <UbertText variant="body" color={Colors.black} style={{fontWeight: '700', fontSize: 16}}>
            {option.name}
          </UbertText>
          <View style={styles.capacityBadge}>
            <Icon name="account" size={12} color={Colors.gray700} />
            <UbertText variant="caption" style={{marginLeft: 2}}>
              {option.capacity}
            </UbertText>
          </View>
        </View>
        <UbertText variant="caption">
          {option.eta} min away
        </UbertText>
        <UbertText variant="caption" numberOfLines={1}>
          {option.description}
        </UbertText>
      </View>
      <View style={styles.priceContainer}>
        <UbertText variant="body" color={Colors.black} style={{fontWeight: '700'}}>
          {option.price}
        </UbertText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: Spacing.sm,
  },
  selected: {
    borderColor: Colors.black,
    backgroundColor: Colors.gray100,
  },
  iconContainer: {
    width: 64,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  priceContainer: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
});
