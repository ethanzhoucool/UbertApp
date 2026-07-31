import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {
  seedTrustedContacts,
  TrustedContact,
  avatarUrl,
} from '../../data/mockTrustedContacts';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TrustedContacts'>;
};

export function TrustedContactsScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [contacts, setContacts] = useState<TrustedContact[]>(seedTrustedContacts);
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    console.log('[Ubert] TrustedContactsScreen mounted');
  }, []);

  const handleAdd = () => {
    if (!name.trim() || !phone.trim()) {
      return;
    }
    setContacts(prev => [
      ...prev,
      {
        id: `tc-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        avatarSeed: name.trim().toLowerCase().replace(/\s+/g, ''),
        shareTrips: true,
      },
    ]);
    setName('');
    setPhone('');
    setAddOpen(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title="Manage trusted contacts"
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity onPress={() => setAddOpen(true)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon name="person-add" size={22} color={Colors.black} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 80}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          We'll let your trusted contacts know if you tap "Share Trip" or call
          911 during a ride.
        </Text>

        {contacts.map((c, i) => (
          <View
            key={c.id}
            style={[
              styles.row,
              i < contacts.length - 1 && styles.rowDivider,
            ]}>
            <Image source={{uri: avatarUrl(c.avatarSeed)}} style={styles.avatar} />
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.phone}>{c.phone}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeBtn}
              activeOpacity={0.7}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              onPress={() =>
                setContacts(prev => prev.filter(p => p.id !== c.id))
              }>
              <Icon name="delete-outline" size={20} color="#E11900" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addRow}
          activeOpacity={0.7}
          onPress={() => setAddOpen(true)}>
          <View style={styles.addIcon}>
            <Icon name="add" size={22} color={Colors.black} />
          </View>
          <Text style={styles.addText}>Add trusted contact</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        transparent
        visible={addOpen}
        animationType="slide"
        onRequestClose={() => setAddOpen(false)}>
        <View style={styles.modalScrim}>
          <View style={[styles.modalCard, {paddingBottom: insets.bottom + 24}]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add a trusted contact</Text>
            <Text style={styles.modalSub}>
              They'll receive a text if you use Share Trip or emergency tools.
            </Text>

            <Text style={styles.fieldLabel}>NAME</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Maya Patel"
              placeholderTextColor="#9A9A9A"
            />
            <Text style={styles.fieldLabel}>PHONE</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 (555) 000-0000"
              placeholderTextColor="#9A9A9A"
              keyboardType="phone-pad"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setAddOpen(false)}
                activeOpacity={0.7}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleAdd}
                activeOpacity={0.85}>
                <Text style={styles.saveBtnText}>Add contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    intro: {
      fontSize: 14,
      color: '#6B6B6B',
      marginHorizontal: 16,
      marginTop: 14,
      marginBottom: 14,
      lineHeight: 20,
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
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#F6F6F6',
    },
    name: {fontSize: 16, fontWeight: '600', color: Colors.black},
    phone: {fontSize: 13, color: '#6B6B6B', marginTop: 2},
    removeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#FDECEC',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 18,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#E5E7EB',
      marginTop: 8,
    },
    addIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    addText: {fontSize: 16, fontWeight: '600', color: Colors.black},
    modalScrim: {flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end'},
    modalCard: {
      backgroundColor: Colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    modalHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#E5E7EB',
      alignSelf: 'center',
      marginBottom: 16,
    },
    modalTitle: {fontSize: 20, fontWeight: '800', color: Colors.black},
    modalSub: {fontSize: 14, color: '#6B6B6B', marginTop: 6, lineHeight: 20},
    fieldLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginTop: 16,
      marginBottom: 6,
    },
    input: {
      backgroundColor: '#F6F6F6',
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 14,
      fontSize: 16,
      color: Colors.black,
    },
    modalActions: {flexDirection: 'row', gap: 12, marginTop: 22},
    cancelBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: Colors.surfaceMuted,
      alignItems: 'center',
    },
    cancelBtnText: {fontSize: 15, fontWeight: '700', color: Colors.black},
    saveBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: Colors.black,
      alignItems: 'center',
    },
    saveBtnText: {fontSize: 15, fontWeight: '700', color: Colors.white},
  });
