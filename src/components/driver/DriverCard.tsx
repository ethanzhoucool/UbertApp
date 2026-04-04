import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {UbertText} from '../common/UbertText';
import {Divider} from '../common/Divider';
import {Driver} from '../../data/mockDriver';
import {Colors, Spacing} from '../../theme';

interface Props {
  driver: Driver;
  eta?: number;
  statusText: string;
}

export function DriverCard({driver, eta, statusText}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flex: 1}}>
          <UbertText variant="heading">{statusText}</UbertText>
          {eta !== undefined && (
            <View style={styles.etaPill}>
              <UbertText variant="body" color={Colors.white} style={{fontWeight: '700'}}>
                {eta} min
              </UbertText>
            </View>
          )}
        </View>
      </View>

      <Divider style={{marginVertical: Spacing.md}} />

      <View style={styles.driverRow}>
        <View style={styles.driverInfo}>
          <Image
            source={{uri: driver.avatarUrl}}
            style={styles.avatar}
          />
          <View style={{marginLeft: Spacing.md}}>
            <UbertText variant="body" color={Colors.black} style={{fontWeight: '600'}}>
              {driver.name}
            </UbertText>
            <View style={styles.ratingRow}>
              <Icon name="star" size={14} color={Colors.black} />
              <UbertText variant="caption" color={Colors.black} style={{marginLeft: 2}}>
                {driver.rating}
              </UbertText>
            </View>
          </View>
        </View>

        <View style={styles.carInfo}>
          <UbertText variant="body" color={Colors.black} style={{fontWeight: '600', textAlign: 'right'}}>
            {driver.carColor} {driver.carModel}
          </UbertText>
          <UbertText variant="caption" style={{textAlign: 'right'}}>
            {driver.licensePlate}
          </UbertText>
        </View>
      </View>

      <Divider style={{marginVertical: Spacing.md}} />

      <View style={styles.actionsRow}>
        <ActionButton icon="chat-bubble-outline" label="Message" />
        <ActionButton icon="phone" label="Call" />
        <ActionButton icon="share" label="Share" />
      </View>
    </View>
  );
}

function ActionButton({icon, label}: {icon: string; label: string}) {
  return (
    <TouchableOpacity style={styles.actionBtn}>
      <View style={styles.actionCircle}>
        <Icon name={icon} size={20} color={Colors.black} />
      </View>
      <UbertText variant="caption" style={{marginTop: 4}}>
        {label}
      </UbertText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etaPill: {
    backgroundColor: Colors.black,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray200,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  carInfo: {
    alignItems: 'flex-end',
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
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
