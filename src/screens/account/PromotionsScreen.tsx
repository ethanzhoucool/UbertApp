import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Promotions'>;
};

type PromoStatus = 'active' | 'expired' | 'redeemed';

type Promo = {
  id: string;
  title: string;
  code: string;
  expires: string;
  region: string;
  status: PromoStatus;
};

const AVAILABLE: Promo[] = [
  {
    id: 'p1',
    title: '50% off your next ride',
    code: 'RIDE50',
    expires: 'Expires Jun 30, 2026',
    region: 'United States',
    status: 'active',
  },
  {
    id: 'p2',
    title: '$15 off airport trips',
    code: 'AIRPORT15',
    expires: 'Expires Jun 12, 2026',
    region: 'United States',
    status: 'active',
  },
];

const PAST: Promo[] = [
  {
    id: 'p3',
    title: '$10 off your first ride',
    code: 'WELCOME10',
    expires: 'Expired Apr 4, 2026',
    region: 'United States',
    status: 'redeemed',
  },
  {
    id: 'p4',
    title: 'Free delivery weekend',
    code: 'FREESHIP',
    expires: 'Expired Mar 28, 2026',
    region: 'United States',
    status: 'expired',
  },
];

export function PromotionsScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    console.log('[Ubert] PromotionsScreen mounted');
  }, []);

  const handleAddCode = () => {
    setCode('');
    setModalOpen(false);
    navigation.navigate('Home', {toast: 'Promo code added'});
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Promotions" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 60}}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.addRow}
          onPress={() => setModalOpen(true)}
          activeOpacity={0.7}>
          <Icon name="add" size={22} color={Colors.black} />
          <Text style={styles.addText}>Add promo code</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>AVAILABLE</Text>
        {AVAILABLE.map(promo => (
          <PromoCard key={promo.id} promo={promo} />
        ))}

        <Text style={styles.sectionLabel}>PAST PROMOTIONS</Text>
        {PAST.map(promo => (
          <PromoCard key={promo.id} promo={promo} />
        ))}

        <Text style={styles.footnote}>
          Promotions auto-apply at checkout.
        </Text>
      </ScrollView>

      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalRoot}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalOpen(false)}
          />
          <View style={[styles.modalSheet, {paddingBottom: insets.bottom + 20}]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add promo code</Text>
            <Text style={styles.modalCaption}>Enter your promo code</Text>
            <TextInput
              style={styles.modalInput}
              value={code}
              onChangeText={setCode}
              placeholder="PROMO CODE"
              placeholderTextColor="#6B6B6B"
              autoCapitalize="characters"
              autoFocus
            />
            <TouchableOpacity
              style={[
                styles.modalAdd,
                code.trim().length === 0 && {opacity: 0.4},
              ]}
              onPress={handleAddCode}
              disabled={code.trim().length === 0}
              activeOpacity={0.85}>
              <Text style={styles.modalAddText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function PromoCard({promo}: {promo: Promo}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const isActive = promo.status === 'active';
  const pillColor =
    promo.status === 'active'
      ? '#05944F'
      : promo.status === 'redeemed'
      ? '#6B6B6B'
      : '#E11900';
  const pillBg =
    promo.status === 'active' ? '#E6F4EC' : '#F1F2F4';
  const pillLabel =
    promo.status === 'active'
      ? 'Active'
      : promo.status === 'redeemed'
      ? 'Redeemed'
      : 'Expired';
  const pillIcon =
    promo.status === 'active'
      ? 'check-circle'
      : promo.status === 'redeemed'
      ? 'done-all'
      : 'event-busy';

  return (
    <View style={[styles.card, !isActive && {opacity: 0.7}]}>
      <View style={{flex: 1}}>
        <Text style={styles.cardTitle}>{promo.title}</Text>
        <Text style={styles.cardSub}>
          {promo.code} · {promo.expires} · {promo.region}
        </Text>
      </View>
      <View style={[styles.pill, {backgroundColor: pillBg}]}>
        <Icon
          name={pillIcon}
          size={12}
          color={pillColor}
          style={{marginRight: 4}}
        />
        <Text style={[styles.pillText, {color: pillColor}]}>{pillLabel}</Text>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    addRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 18,
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: '#E5E7EB',
    },
    addText: {
      fontSize: 15,
      fontWeight: '600',
      color: Colors.black,
      marginLeft: 8,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginHorizontal: 16,
      marginTop: 28,
      marginBottom: 10,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 10,
      padding: 16,
      borderRadius: 14,
      backgroundColor: '#F6F6F6',
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.black,
    },
    cardSub: {
      fontSize: 13,
      color: '#6B6B6B',
      marginTop: 4,
      lineHeight: 18,
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 12,
    },
    pillText: {
      fontSize: 12,
      fontWeight: '700',
    },
    footnote: {
      fontSize: 13,
      color: '#6B6B6B',
      textAlign: 'center',
      marginTop: 22,
      marginHorizontal: 32,
      lineHeight: 18,
    },
    modalRoot: {flex: 1, justifyContent: 'flex-end'},
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: Colors.modalBackdrop,
    },
    modalSheet: {
      backgroundColor: Colors.white,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    modalHandle: {
      width: 40,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: Colors.handleColor,
      alignSelf: 'center',
      marginBottom: 14,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: Colors.black,
      marginTop: 4,
    },
    modalCaption: {
      fontSize: 14,
      color: '#6B6B6B',
      marginTop: 6,
      marginBottom: 16,
    },
    modalInput: {
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderRadius: 10,
      backgroundColor: '#F6F6F6',
      fontSize: 16,
      color: Colors.black,
      marginBottom: 16,
      letterSpacing: 1.2,
    },
    modalAdd: {
      backgroundColor: Colors.black,
      paddingVertical: 16,
      borderRadius: 999,
      alignItems: 'center',
    },
    modalAddText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '700',
    },
  });
