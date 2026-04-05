import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
      <Image
        source={{uri: option.imageUrl}}
        style={styles.carImage}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{option.name}</Text>
          <View style={styles.capacityBadge}>
            <Icon name="person" size={12} color={Colors.gray500} />
            <Text style={styles.capacityText}>{option.capacity}</Text>
          </View>
        </View>
        <Text style={styles.eta}>
          {option.eta} min away
        </Text>
        <Text style={styles.desc} numberOfLines={1}>
          {option.description}
        </Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{option.price}</Text>
        {option.multiplier && (
          <Text style={styles.multiplier}>{option.multiplier}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.base,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 4,
  },
  selected: {
    borderColor: Colors.black,
    backgroundColor: Colors.gray100,
  },
  carImage: {
    width: 72,
    height: 48,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  capacityText: {
    fontSize: 12,
    color: Colors.gray500,
    marginLeft: 2,
  },
  eta: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 2,
  },
  desc: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 1,
  },
  priceContainer: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.black,
  },
  multiplier: {
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
});
