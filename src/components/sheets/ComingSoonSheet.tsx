import React, {useMemo} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BottomSheetModal} from '../common/BottomSheetModal';
import {UbertButton} from '../common/UbertButton';
import {useColors, ColorPalette} from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon: string;
  iconBg?: string;
  onNotify: () => void;
}

export function ComingSoonSheet({
  visible,
  onClose,
  title,
  description,
  icon,
  iconBg = '#F5F5F5',
  onNotify,
}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <BottomSheetModal visible={visible} onClose={onClose} maxHeight="55%">
      <View style={[styles.iconWrap, {backgroundColor: iconBg}]}>
        <Icon name={icon} size={36} color={Colors.black} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.badge}>Coming soon</Text>

      <Text style={styles.body}>{description}</Text>

      <View style={styles.buttons}>
        <UbertButton
          title="Notify me when it's ready"
          variant="outline"
          onPress={() => {
            onNotify();
            onClose();
          }}
        />
      </View>
    </BottomSheetModal>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    iconWrap: {
      width: 80,
      height: 80,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 4,
      marginBottom: 18,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      letterSpacing: -0.3,
      color: Colors.black,
      textAlign: 'center',
    },
    badge: {
      fontSize: 11,
      fontWeight: '700',
      color: '#276EF1',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      textAlign: 'center',
      marginTop: 6,
    },
    body: {
      fontSize: 15,
      color: Colors.gray700,
      textAlign: 'center',
      marginTop: 12,
      lineHeight: 22,
      paddingHorizontal: 8,
    },
    buttons: {
      marginTop: 22,
    },
  });
