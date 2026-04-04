import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {UbertText} from '../common/UbertText';
import {Divider} from '../common/Divider';
import {Colors, Spacing, Shadows} from '../../theme';
import {suggestedPlaces} from '../../data/mockPlaces';

interface Props {
  onSearchPress: () => void;
}

export function SearchPanel({onSearchPress}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.searchBar}
        onPress={onSearchPress}
        activeOpacity={0.9}>
        <Icon name="search" size={20} color={Colors.gray700} />
        <UbertText
          variant="body"
          color={Colors.gray500}
          style={styles.searchText}>
          Where to?
        </UbertText>
        <View style={styles.timePill}>
          <Icon name="access-time" size={14} color={Colors.black} />
          <UbertText variant="caption" color={Colors.black} style={{fontWeight: '600', marginLeft: 4}}>
            Now
          </UbertText>
          <Icon name="keyboard-arrow-down" size={16} color={Colors.black} />
        </View>
      </TouchableOpacity>

      <ServiceIcons />

      <Divider style={{marginTop: Spacing.base}} />

      <View style={styles.suggestionsHeader}>
        <UbertText variant="body" style={{fontWeight: '600', color: Colors.black}}>
          Suggestions
        </UbertText>
      </View>

      {suggestedPlaces.slice(0, 3).map(place => (
        <TouchableOpacity key={place.id} style={styles.suggestionRow}>
          <View style={styles.suggestionIcon}>
            <Icon name="place" size={20} color={Colors.white} />
          </View>
          <View style={styles.suggestionText}>
            <UbertText variant="body" color={Colors.black} style={{fontWeight: '500'}}>
              {place.name}
            </UbertText>
            <UbertText variant="caption" numberOfLines={1}>
              {place.address}
            </UbertText>
          </View>
          <Icon name="chevron-right" size={20} color={Colors.gray500} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ServiceIcons() {
  const services = [
    {icon: 'local-taxi', label: 'Ride'},
    {icon: 'restaurant', label: 'Food'},
    {icon: 'inventory-2', label: 'Package'},
    {icon: 'event', label: 'Reserve'},
  ];

  return (
    <View style={styles.servicesRow}>
      {services.map(s => (
        <TouchableOpacity key={s.label} style={styles.serviceItem}>
          <View style={styles.serviceIconBg}>
            <Icon name={s.icon} size={22} color={Colors.white} />
          </View>
          <UbertText variant="caption" color={Colors.black} style={{marginTop: 6, fontWeight: '500'}}>
            {s.label}
          </UbertText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 26,
    paddingHorizontal: Spacing.base,
    height: 52,
    ...Shadows.card,
  },
  searchText: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.lg,
  },
  serviceItem: {
    alignItems: 'center',
  },
  serviceIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionsHeader: {
    paddingVertical: Spacing.md,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
});
