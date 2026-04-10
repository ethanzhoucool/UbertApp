import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BottomSheetModal} from '../common/BottomSheetModal';
import {Colors} from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCopyLink: () => void;
}

const options = [
  {key: 'messages', icon: 'sms', label: 'Messages', sub: 'Send via text'},
  {key: 'mail', icon: 'email', label: 'Mail', sub: 'Send via email'},
  {key: 'whatsapp', icon: 'chat', label: 'WhatsApp', sub: 'Send via WhatsApp'},
];

export function ShareTripSheet({visible, onClose, onCopyLink}: Props) {
  return (
    <BottomSheetModal visible={visible} onClose={onClose} title="Share trip status" maxHeight="65%">
      <Text style={styles.intro}>
        Share your live trip status. Friends can see your driver, route, and ETA.
      </Text>

      {options.map(opt => (
        <TouchableOpacity
          key={opt.key}
          style={styles.row}
          onPress={onClose}
          activeOpacity={0.7}>
          <View style={styles.iconWrap}>
            <Icon name={opt.icon} size={20} color={Colors.black} />
          </View>
          <View style={styles.text}>
            <Text style={styles.label}>{opt.label}</Text>
            <Text style={styles.sub}>{opt.sub}</Text>
          </View>
          <Icon name="chevron-right" size={20} color={Colors.gray300} />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.copyRow}
        onPress={() => {
          onCopyLink();
          onClose();
        }}
        activeOpacity={0.7}>
        <View style={[styles.iconWrap, styles.copyIcon]}>
          <Icon name="content-copy" size={20} color={Colors.white} />
        </View>
        <View style={styles.text}>
          <Text style={styles.label}>Copy link</Text>
          <Text style={styles.sub}>ubert.com/trip/8HVN-392</Text>
        </View>
      </TouchableOpacity>
    </BottomSheetModal>
  );
}

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
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyIcon: {
    backgroundColor: Colors.black,
  },
  text: {
    flex: 1,
    marginLeft: 14,
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
});
