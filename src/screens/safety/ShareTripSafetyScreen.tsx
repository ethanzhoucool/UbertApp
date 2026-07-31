import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {
  seedTrustedContacts,
  avatarUrl,
} from '../../data/mockTrustedContacts';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ShareTripSafety'>;
};

export function ShareTripSafetyScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string[]>(['tc1']);

  useEffect(() => {
    console.log('[Ubert] ShareTripSafetyScreen mounted');
  }, []);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Share live trip" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Icon name="share-location" size={32} color={Colors.white} />
          </View>
          <Text style={styles.heroTitle}>Always know they're on the way</Text>
          <Text style={styles.heroSub}>
            Share your trip status and live location with anyone in your
            contacts. They can follow along until you arrive.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>SHARE WITH</Text>
        {seedTrustedContacts.map((c, i) => (
          <TouchableOpacity
            key={c.id}
            style={[
              styles.row,
              i < seedTrustedContacts.length - 1 && styles.rowDivider,
            ]}
            activeOpacity={0.7}
            onPress={() => toggle(c.id)}>
            <Image source={{uri: avatarUrl(c.avatarSeed)}} style={styles.avatar} />
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.phone}>{c.phone}</Text>
            </View>
            <View
              style={[
                styles.checkbox,
                selected.includes(c.id) && styles.checkboxOn,
              ]}>
              {selected.includes(c.id) && (
                <Icon name="check" size={16} color={Colors.white} />
              )}
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionLabel}>OR SHARE A LINK</Text>
        <View style={styles.linkCard}>
          <Text style={styles.linkText} numberOfLines={1}>
            uber.com/r/9LkM-87KP-Trip
          </Text>
          <TouchableOpacity style={styles.copyBtn} activeOpacity={0.7}>
            <Icon name="content-copy" size={16} color={Colors.black} />
            <Text style={styles.copyBtnText}>Copy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <TouchableOpacity
          style={[styles.shareBtn, selected.length === 0 && {opacity: 0.4}]}
          activeOpacity={selected.length > 0 ? 0.85 : 1}
          disabled={selected.length === 0}
          onPress={() => navigation.goBack()}>
          <Icon name="share-location" size={18} color={Colors.white} />
          <Text style={styles.shareBtnText}>
            Share live trip
            {selected.length > 0
              ? ` · ${selected.length} ${
                  selected.length === 1 ? 'contact' : 'contacts'
                }`
              : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    hero: {padding: 24},
    heroIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: Colors.black,
      marginTop: 16,
      letterSpacing: -0.3,
    },
    heroSub: {fontSize: 15, color: '#444', marginTop: 8, lineHeight: 22},
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 8,
    },
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
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#F6F6F6',
    },
    name: {fontSize: 16, fontWeight: '600', color: Colors.black},
    phone: {fontSize: 13, color: '#6B6B6B', marginTop: 2},
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#C0C0C0',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxOn: {borderColor: Colors.black, backgroundColor: Colors.black},
    linkCard: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 16,
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: '#F6F6F6',
      gap: 10,
    },
    linkText: {flex: 1, fontSize: 14, fontWeight: '500', color: Colors.black},
    copyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: Colors.white,
      gap: 6,
    },
    copyBtnText: {fontWeight: '700', color: Colors.black, fontSize: 13},
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 16,
      paddingTop: 10,
      backgroundColor: Colors.white,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#E5E7EB',
    },
    shareBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.black,
      borderRadius: 30,
      paddingVertical: 16,
      gap: 8,
    },
    shareBtnText: {color: Colors.white, fontWeight: '800', fontSize: 16, letterSpacing: 0.2},
  });
