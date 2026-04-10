import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BottomSheetModal} from '../common/BottomSheetModal';
import {suggestedPlaces, Place} from '../../data/mockPlaces';
import {Colors} from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectPlace: (place: Place) => void;
}

export function ExplorePromoSheet({visible, onClose, onSelectPlace}: Props) {
  return (
    <BottomSheetModal visible={visible} onClose={onClose} title="Popular nearby" maxHeight="80%">
      <Text style={styles.intro}>
        Discover popular destinations around you. Tap any place to see ride options.
      </Text>

      {suggestedPlaces.slice(0, 6).map((place, i) => (
        <TouchableOpacity
          key={place.id}
          style={styles.row}
          onPress={() => {
            onClose();
            onSelectPlace(place);
          }}
          activeOpacity={0.7}>
          <View style={[styles.rank, {backgroundColor: rankColors[i % rankColors.length]}]}>
            <Text style={styles.rankText}>{i + 1}</Text>
          </View>
          <View style={styles.text}>
            <Text style={styles.name}>{place.name}</Text>
            <Text style={styles.addr} numberOfLines={1}>
              {place.address}
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={Colors.gray300} />
        </TouchableOpacity>
      ))}
    </BottomSheetModal>
  );
}

const rankColors = ['#276EF1', '#05944F', '#FF8000', '#7B61FF', '#E11900', '#0E8388'];

const styles = StyleSheet.create({
  intro: {
    fontSize: 13,
    color: Colors.gray500,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ECECEC',
  },
  rank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  text: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  addr: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
});
