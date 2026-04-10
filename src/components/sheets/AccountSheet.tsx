import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BottomSheetModal} from '../common/BottomSheetModal';
import {Colors} from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const rows = [
  {icon: 'account-balance-wallet', label: 'Wallet', sub: 'Payment methods, promos'},
  {icon: 'local-offer', label: 'Promotions', sub: 'Apply codes and view offers'},
  {icon: 'receipt-long', label: 'Trip history', sub: 'See all past rides'},
  {icon: 'settings', label: 'Settings', sub: 'Notifications, privacy, language'},
  {icon: 'help-outline', label: 'Help', sub: 'Support and FAQs'},
];

export function AccountSheet({visible, onClose}: Props) {
  return (
    <BottomSheetModal visible={visible} onClose={onClose} maxHeight="80%" showHandle title="Account">
      <View style={styles.profile}>
        <Image
          source={{uri: 'https://i.pravatar.cc/150?img=7'}}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Ethan Zhou</Text>
          <View style={styles.ratingRow}>
            <Icon name="star" size={14} color={Colors.black} />
            <Text style={styles.ratingText}>4.97</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        {rows.map((row, i) => (
          <TouchableOpacity
            key={row.label}
            style={[styles.row, i < rows.length - 1 && styles.rowBorder]}
            activeOpacity={0.6}>
            <View style={styles.rowIconWrap}>
              <Icon name={row.icon} size={20} color={Colors.black} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowSub}>{row.sub}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.gray300} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.signOut} activeOpacity={0.7}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.gray200,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
    marginLeft: 3,
  },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  editText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
  },
  menu: {
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  rowSub: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  signOut: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E11900',
  },
});
