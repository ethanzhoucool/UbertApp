import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BottomSheetModal} from '../common/BottomSheetModal';
import {services, Service} from '../../data/mockServices';
import {Colors} from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectService: (service: Service) => void;
  title?: string;
}

export function ServicesSheet({visible, onClose, onSelectService, title = 'Services'}: Props) {
  return (
    <BottomSheetModal visible={visible} onClose={onClose} title={title} maxHeight="80%">
      <View style={styles.grid}>
        {services.map(service => (
          <TouchableOpacity
            key={service.id}
            style={styles.tile}
            onPress={() => onSelectService(service)}
            activeOpacity={0.7}>
            <View style={styles.iconWrap}>
              <Icon name={service.icon} size={28} color={Colors.black} />
            </View>
            <Text style={styles.name}>{service.name}</Text>
            <Text style={styles.desc} numberOfLines={2}>
              {service.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 8,
  },
  tile: {
    width: '31%',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
  },
  desc: {
    fontSize: 11,
    color: Colors.gray500,
    textAlign: 'center',
    marginTop: 3,
  },
});
