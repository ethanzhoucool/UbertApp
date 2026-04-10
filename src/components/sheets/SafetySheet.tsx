import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BottomSheetModal} from '../common/BottomSheetModal';
import {Colors} from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const tools = [
  {
    icon: 'phone-in-talk',
    label: 'Call 911',
    sub: 'Get help from emergency services',
    iconBg: '#E11900',
    important: true,
  },
  {
    icon: 'share-location',
    label: 'Share trip status',
    sub: 'Send your live location to a contact',
    iconBg: '#276EF1',
  },
  {
    icon: 'verified-user',
    label: 'RideCheck',
    sub: 'We detect long stops and route changes',
    iconBg: '#05944F',
  },
  {
    icon: 'group',
    label: 'Trusted contacts',
    sub: 'Share trips automatically with people you trust',
    iconBg: '#7B61FF',
  },
  {
    icon: 'flag',
    label: 'Report a safety issue',
    sub: 'Tell us about something that happened',
    iconBg: '#FF8000',
  },
];

export function SafetySheet({visible, onClose}: Props) {
  return (
    <BottomSheetModal visible={visible} onClose={onClose} title="Safety toolkit" maxHeight="80%">
      <Text style={styles.intro}>
        Use these tools any time you feel you need a hand. They're here for your peace of mind.
      </Text>

      {tools.map(tool => (
        <TouchableOpacity
          key={tool.label}
          style={[styles.row, tool.important && styles.rowImportant]}
          activeOpacity={0.7}>
          <View style={[styles.iconWrap, {backgroundColor: tool.iconBg}]}>
            <Icon name={tool.icon} size={20} color={Colors.white} />
          </View>
          <View style={styles.text}>
            <Text style={[styles.label, tool.important && styles.labelImportant]}>
              {tool.label}
            </Text>
            <Text style={styles.sub}>{tool.sub}</Text>
          </View>
          <Icon name="chevron-right" size={20} color={Colors.gray300} />
        </TouchableOpacity>
      ))}
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
  rowImportant: {},
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  labelImportant: {
    color: '#E11900',
  },
  sub: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
});
