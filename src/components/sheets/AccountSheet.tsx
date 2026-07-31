import React, {useMemo} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BottomSheetModal} from '../common/BottomSheetModal';
import {useColors, ColorPalette} from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onOpenTripHistory?: () => void;
  onOpenWallet?: () => void;
  onOpenPromotions?: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onOpenEditProfile?: () => void;
  onOpenSavedPlaces?: () => void;
  onOpenUberOne?: () => void;
  onShowComingSoon?: (feature: string) => void;
}

type RowKey =
  | 'help'
  | 'wallet'
  | 'activity'
  | 'promotions'
  | 'uber-one'
  | 'gift'
  | 'saved-places'
  | 'settings'
  | 'sign-out';

const rows: {key: RowKey; icon: string; label: string}[] = [
  {key: 'help', icon: 'help-outline', label: 'Help'},
  {key: 'wallet', icon: 'account-balance-wallet', label: 'Wallet'},
  {key: 'activity', icon: 'history', label: 'Activity'},
  {key: 'promotions', icon: 'local-offer', label: 'Promotions'},
  {key: 'uber-one', icon: 'workspace-premium', label: 'Uber One'},
  {key: 'gift', icon: 'card-giftcard', label: 'Send a gift'},
  {key: 'saved-places', icon: 'bookmark-border', label: 'Saved places'},
  {key: 'settings', icon: 'settings', label: 'Settings'},
  {key: 'sign-out', icon: 'logout', label: 'Sign Out'},
];

export function AccountSheet({
  visible,
  onClose,
  onOpenTripHistory,
  onOpenWallet,
  onOpenPromotions,
  onOpenSettings,
  onOpenHelp,
  onOpenEditProfile,
  onOpenSavedPlaces,
  onOpenUberOne,
  onShowComingSoon,
}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const handleRowPress = (key: RowKey) => {
    switch (key) {
      case 'help':
        if (onOpenHelp) {
          onOpenHelp();
        } else if (onShowComingSoon) {
          onShowComingSoon('Help');
        } else {
          onClose();
        }
        return;
      case 'wallet':
        if (onOpenWallet) {
          onOpenWallet();
        } else {
          onClose();
        }
        return;
      case 'activity':
        if (onOpenTripHistory) {
          onOpenTripHistory();
        } else {
          onClose();
        }
        return;
      case 'promotions':
        if (onOpenPromotions) {
          onOpenPromotions();
        } else if (onShowComingSoon) {
          onShowComingSoon('Promotions');
        } else {
          onClose();
        }
        return;
      case 'uber-one':
        if (onOpenUberOne) {
          onOpenUberOne();
        } else {
          onClose();
        }
        return;
      case 'saved-places':
        if (onOpenSavedPlaces) {
          onOpenSavedPlaces();
        } else if (onShowComingSoon) {
          onShowComingSoon('Saved places');
        } else {
          onClose();
        }
        return;
      case 'gift':
        if (onShowComingSoon) {
          onShowComingSoon('Send a gift');
        } else {
          onClose();
        }
        return;
      case 'settings':
        if (onOpenSettings) {
          onOpenSettings();
        } else if (onShowComingSoon) {
          onShowComingSoon('Settings');
        } else {
          onClose();
        }
        return;
      case 'sign-out':
        onClose();
        return;
    }
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose} maxHeight="92%" showHandle title="Account">
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=ethan&backgroundColor=fcd34d&radius=50',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Ethan Zhou</Text>
        <View style={styles.ratingRow}>
          <Icon name="star" size={14} color={Colors.black} />
          <Text style={styles.ratingText}>5.00</Text>
        </View>

        <TouchableOpacity
          style={styles.editRow}
          activeOpacity={0.6}
          onPress={() => {
            if (onOpenEditProfile) {
              onOpenEditProfile();
            } else {
              onClose();
            }
          }}>
          <Text style={styles.editText}>Edit account</Text>
          <Icon name="chevron-right" size={20} color={Colors.gray500} />
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        {rows.map(row => (
          <TouchableOpacity
            key={row.key}
            style={styles.row}
            activeOpacity={0.6}
            onPress={() => handleRowPress(row.key)}>
            <Icon name={row.icon} size={22} color={Colors.black} style={styles.rowIcon} />
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Icon name="chevron-right" size={20} color={Colors.gray500} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.version}>v1.0.0 (build 100)</Text>
    </BottomSheetModal>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    profileCard: {
      alignItems: 'center',
      paddingVertical: 12,
      paddingBottom: 4,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: Colors.fieldFill,
    },
    name: {
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: -0.2,
      color: Colors.black,
      marginTop: 10,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    ratingText: {
      fontSize: 13,
      fontWeight: '600',
      color: Colors.black,
      marginLeft: 3,
    },
    editRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 14,
      paddingVertical: 8,
      paddingHorizontal: 14,
    },
    editText: {
      fontSize: 15,
      fontWeight: '600',
      color: Colors.black,
      marginRight: 4,
    },
    menu: {
      marginTop: 12,
      marginHorizontal: -20,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    rowIcon: {
      width: 28,
      marginRight: 16,
      textAlign: 'center',
    },
    rowLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      color: Colors.black,
    },
    version: {
      textAlign: 'center',
      fontSize: 12,
      color: Colors.textTertiary,
      marginTop: 20,
      marginBottom: 8,
    },
  });
