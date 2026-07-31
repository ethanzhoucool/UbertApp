import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'EditProfile'>;
};

type FieldKey =
  | 'first'
  | 'last'
  | 'email'
  | 'phone'
  | 'gender'
  | 'emergency'
  | 'password';

const GENDER_OPTIONS = ['Woman', 'Man', 'Non-binary', 'Prefer not to say'];

export function EditProfileScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [first, setFirst] = useState('Ethan');
  const [last, setLast] = useState('Zhou');
  const [email, setEmail] = useState('ethan@revyl.ai');
  const [phone, setPhone] = useState('+1 (555) 010-2233');
  const [gender, setGender] = useState('Prefer not to say');
  const [emergency, setEmergency] = useState('Not set');
  const [password] = useState('••••••••••');

  const [editorKey, setEditorKey] = useState<FieldKey | null>(null);
  const [editorValue, setEditorValue] = useState('');

  useEffect(() => {
    console.log('[Ubert] EditProfileScreen mounted');
  }, []);

  const openEditor = (key: FieldKey) => {
    const current: Record<FieldKey, string> = {
      first,
      last,
      email,
      phone,
      gender,
      emergency,
      password,
    };
    setEditorValue(current[key]);
    setEditorKey(key);
  };

  const handleSaveEditor = () => {
    if (!editorKey) {
      return;
    }
    switch (editorKey) {
      case 'first':
        setFirst(editorValue);
        break;
      case 'last':
        setLast(editorValue);
        break;
      case 'email':
        setEmail(editorValue);
        break;
      case 'phone':
        setPhone(editorValue);
        break;
      case 'emergency':
        setEmergency(editorValue);
        break;
      case 'gender':
        setGender(editorValue);
        break;
      case 'password':
        // Stub — password is masked
        break;
    }
    setEditorKey(null);
  };

  const handleAvatarPress = () => {
    Alert.alert('Profile photo', undefined, [
      {text: 'Take photo'},
      {text: 'Choose from library'},
      {text: 'Remove', style: 'destructive'},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const editorLabels: Record<FieldKey, string> = {
    first: 'First name',
    last: 'Last name',
    email: 'Email',
    phone: 'Phone number',
    gender: 'Gender',
    emergency: 'Emergency contact',
    password: 'Password',
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Edit account" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 32}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.avatarRow}>
          <TouchableOpacity activeOpacity={0.85} onPress={handleAvatarPress}>
            <Image
              source={{
                uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=ethan&backgroundColor=fcd34d&radius=50',
              }}
              style={styles.avatar}
            />
            <View style={styles.cameraBadge}>
              <Icon name="photo-camera" size={14} color={Colors.white} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.group}>
          <Row label="First name" value={first} onPress={() => openEditor('first')} />
          <Row label="Last name" value={last} onPress={() => openEditor('last')} />
          <Row
            label="Email"
            value={email}
            verified
            onPress={() => openEditor('email')}
          />
          <Row label="Phone number" value={phone} onPress={() => openEditor('phone')} />
          <Row label="Gender" value={gender} onPress={() => openEditor('gender')} />
          <Row
            label="Emergency contact"
            value={emergency}
            onPress={() => openEditor('emergency')}
          />
          <Row
            label="Password"
            value={password}
            onPress={() => openEditor('password')}
            last
          />
        </View>
      </ScrollView>

      <Modal
        visible={editorKey !== null}
        animationType="slide"
        onRequestClose={() => setEditorKey(null)}>
        <View style={[styles.editorContainer, {paddingTop: insets.top}]}>
          <View style={styles.editorHeader}>
            <TouchableOpacity
              onPress={() => setEditorKey(null)}
              hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
              <Icon name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.editorTitle}>
              {editorKey ? editorLabels[editorKey] : ''}
            </Text>
            <TouchableOpacity
              onPress={handleSaveEditor}
              hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
              <Text style={styles.editorSave}>Save</Text>
            </TouchableOpacity>
          </View>

          {editorKey === 'gender' ? (
            <View style={{marginTop: 12}}>
              {GENDER_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={styles.radioRow}
                  onPress={() => setEditorValue(opt)}
                  activeOpacity={0.7}>
                  <Text style={styles.radioLabel}>{opt}</Text>
                  <Icon
                    name={
                      editorValue === opt
                        ? 'radio-button-checked'
                        : 'radio-button-unchecked'
                    }
                    size={22}
                    color={editorValue === opt ? Colors.black : '#6B6B6B'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.editorBody}>
              <TextInput
                style={styles.editorInput}
                value={editorValue}
                onChangeText={setEditorValue}
                autoFocus
                placeholderTextColor="#6B6B6B"
                secureTextEntry={editorKey === 'password'}
                keyboardType={
                  editorKey === 'email'
                    ? 'email-address'
                    : editorKey === 'phone'
                    ? 'phone-pad'
                    : 'default'
                }
              />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

function Row({
  label,
  value,
  onPress,
  verified,
  last,
}: {
  label: string;
  value: string;
  onPress: () => void;
  verified?: boolean;
  last?: boolean;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <TouchableOpacity
      style={[styles.row, last && {borderBottomWidth: 0}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
        {verified && (
          <Icon
            name="check-circle"
            size={16}
            color="#06C167"
            style={{marginLeft: 6}}
          />
        )}
        <Icon
          name="chevron-right"
          size={20}
          color="#6B6B6B"
          style={{marginLeft: 4}}
        />
      </View>
    </TouchableOpacity>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    avatarRow: {
      alignItems: 'center',
      paddingTop: 24,
      paddingBottom: 24,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: '#F6F6F6',
    },
    cameraBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: Colors.white,
    },
    group: {
      marginTop: 4,
      backgroundColor: Colors.white,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 18,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    rowLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: Colors.black,
      flexShrink: 0,
    },
    rowRight: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginLeft: 16,
    },
    rowValue: {
      fontSize: 15,
      color: '#6B6B6B',
      maxWidth: 200,
    },
    editorContainer: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    editorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      height: 52,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    editorTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: Colors.black,
    },
    editorSave: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.black,
    },
    editorBody: {
      paddingHorizontal: 16,
      paddingTop: 24,
    },
    editorInput: {
      fontSize: 18,
      color: Colors.black,
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: 10,
      backgroundColor: '#F6F6F6',
    },
    radioRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 18,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    radioLabel: {
      fontSize: 16,
      color: Colors.black,
      fontWeight: '500',
    },
  });
