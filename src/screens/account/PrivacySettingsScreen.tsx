import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'PrivacySettings'>;
};

export function PrivacySettingsScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [shareTripData, setShareTripData] = useState(true);

  useEffect(() => {
    console.log('[Ubert] PrivacySettingsScreen mounted');
  }, []);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Are you sure?',
      "You won't be able to undo this after 30 days.",
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            navigation.navigate('Home', {
              toast: 'Deletion request submitted',
            }),
        },
      ],
    );
  };

  const handleRemoveContacts = () => {
    Alert.alert('Stored contacts removed', 'Your synced contacts have been cleared.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Privacy & data" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 32}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Manage your privacy preferences and how Uber handles your data.
        </Text>

        <TouchableOpacity
          style={styles.checkupBanner}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('PrivacyCheckup')}>
          <View style={styles.checkupIcon}>
            <Icon name="verified-user" size={22} color={Colors.white} />
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={styles.checkupTitle}>Start privacy checkup</Text>
            <Text style={styles.checkupSub}>
              A 3-step review of your location, data and ad preferences.
            </Text>
          </View>
          <Icon name="chevron-right" size={22} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.tilesGroup}>
          <Tile
            icon="location-on"
            title="Location"
            sub="Choose how Uber accesses your location."
            onPress={() => Alert.alert('Location', 'Permission settings.')}
          />
          <Tile
            icon="folder"
            title="Manage your data"
            sub="Download or delete data."
            onPress={() => Alert.alert('Manage your data', 'Data tools.')}
          />
          <Tile
            icon="contacts"
            title="Stored contacts"
            sub="Contacts synced for emergency and sharing."
            trailing={
              <TouchableOpacity
                onPress={handleRemoveContacts}
                style={styles.removeBtn}
                activeOpacity={0.7}>
                <Text style={styles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            }
            last
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PERSONALIZATION</Text>
          <View style={styles.sectionBody}>
            <View style={[styles.row, styles.rowDivider]}>
              <View style={{flex: 1, marginRight: 16}}>
                <Text style={styles.rowTitle}>Personalized ads</Text>
                <Text style={styles.rowCaption}>
                  See offers based on your activity.
                </Text>
              </View>
              <Switch
                value={personalizedAds}
                onValueChange={setPersonalizedAds}
                trackColor={{false: '#E5E7EB', true: Colors.black}}
                thumbColor={Colors.white}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 16}}>
                <Text style={styles.rowTitle}>Share trip data for research</Text>
                <Text style={styles.rowCaption}>
                  Help improve safety and mobility studies.
                </Text>
              </View>
              <Switch
                value={shareTripData}
                onValueChange={setShareTripData}
                trackColor={{false: '#E5E7EB', true: Colors.black}}
                thumbColor={Colors.white}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteRow}
          onPress={handleDeleteAccount}
          activeOpacity={0.7}>
          <Icon
            name="delete-forever"
            size={22}
            color="#E11900"
            style={{marginRight: 12}}
          />
          <Text style={styles.deleteText}>Delete your account</Text>
          <View style={{flex: 1}} />
          <Icon name="chevron-right" size={20} color="#E11900" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Tile({
  icon,
  title,
  sub,
  onPress,
  trailing,
  last,
}: {
  icon: string;
  title: string;
  sub: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  last?: boolean;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <TouchableOpacity
      style={[styles.tile, !last && styles.tileDivider]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}>
      <View style={styles.tileIcon}>
        <Icon name={icon} size={22} color={Colors.black} />
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.tileTitle}>{title}</Text>
        <Text style={styles.tileSub}>{sub}</Text>
      </View>
      {trailing ? (
        trailing
      ) : (
        <Icon name="chevron-right" size={20} color="#6B6B6B" />
      )}
    </TouchableOpacity>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    intro: {
      fontSize: 14,
      color: '#6B6B6B',
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 18,
      lineHeight: 20,
    },
    tilesGroup: {
      marginHorizontal: 16,
      backgroundColor: '#F6F6F6',
      borderRadius: 14,
      overflow: 'hidden',
    },
    checkupBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 18,
      padding: 14,
      borderRadius: 14,
      backgroundColor: Colors.black,
    },
    checkupIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkupTitle: {fontSize: 15, fontWeight: '700', color: Colors.white},
    checkupSub: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.78)',
      marginTop: 2,
      lineHeight: 18,
    },
    tile: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 16,
    },
    tileDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    tileIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    tileTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.black,
    },
    tileSub: {
      fontSize: 13,
      color: '#6B6B6B',
      marginTop: 2,
      lineHeight: 18,
    },
    removeBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: Colors.white,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#E5E7EB',
    },
    removeBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: Colors.black,
    },
    section: {marginTop: 28},
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginHorizontal: 16,
      marginBottom: 8,
    },
    sectionBody: {backgroundColor: Colors.white},
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    rowTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: Colors.black,
    },
    rowCaption: {
      fontSize: 13,
      color: '#6B6B6B',
      marginTop: 2,
    },
    deleteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 18,
      marginTop: 28,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#E5E7EB',
      borderBottomColor: '#E5E7EB',
    },
    deleteText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#E11900',
    },
  });
