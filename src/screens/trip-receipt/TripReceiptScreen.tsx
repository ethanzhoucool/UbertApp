import React, {useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TripReceipt'>;
  route: RouteProp<RootStackParamList, 'TripReceipt'>;
};

export function TripReceiptScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {driver, fare, duration} = route.params;

  useEffect(() => {
    console.log('[Ubert] TripReceiptScreen mounted');
  }, []);

  // Reasonably realistic breakdown from total fare.
  const totalNumber = parseFloat(fare.replace(/[^0-9.]/g, '')) || 0;
  const base = +(totalNumber * 0.42).toFixed(2);
  const distance = +(totalNumber * 0.3).toFixed(2);
  const time = +(totalNumber * 0.12).toFixed(2);
  const booking = +(totalNumber * 0.08).toFixed(2);
  const taxes = +(totalNumber * 0.08).toFixed(2);

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Receipt" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}>
        {/* Trip date row */}
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{dateString}</Text>
          <Text style={styles.totalText}>{fare}</Text>
        </View>

        {/* Fare breakdown card */}
        <Text style={styles.sectionLabel}>FARE BREAKDOWN</Text>
        <View style={styles.card}>
          <Row label="Base fare" value={`$${base.toFixed(2)}`} />
          <Row label="Distance" value={`$${distance.toFixed(2)}`} />
          <Row label="Time" value={`$${time.toFixed(2)}`} />
          <Row label="Booking fee" value={`$${booking.toFixed(2)}`} />
          <Row label="Taxes" value={`$${taxes.toFixed(2)}`} />
          <View style={styles.divider} />
          <Row label="Total" value={fare} bold />
        </View>

        {/* Paid-with row with brand logo block */}
        <Text style={styles.sectionLabel}>PAID WITH</Text>
        <View style={styles.payCard}>
          <View style={styles.cardLogo}>
            <Text style={styles.cardLogoText}>VISA</Text>
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={styles.payLabel}>Visa •••• 4242</Text>
            <Text style={styles.paySub}>Personal · default · {duration}</Text>
          </View>
        </View>

        {/* Driver card with avatar */}
        <Text style={styles.sectionLabel}>YOUR DRIVER</Text>
        <View style={styles.driverCard}>
          <Image source={{uri: driver.avatarUrl}} style={styles.avatar} />
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <Text style={styles.driverMeta}>
              {driver.carColor} {driver.carModel} · {driver.licensePlate}
            </Text>
          </View>
          <View style={styles.ratingBadge}>
            <Icon name="star" size={13} color={Colors.starYellow} />
            <Text style={styles.ratingText}>
              {driver.rating.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Adjustment + Email links */}
        <TouchableOpacity
          style={styles.adjustBtn}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert(
              'Request adjustment',
              'Our team will review your trip and follow up within 24 hours.',
            )
          }>
          <Icon name="receipt-long" size={20} color={Colors.black} />
          <Text style={styles.adjustText}>Request fare adjustment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.emailLink}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert(
              'Receipt emailed',
              'Sent to ethan.st.zhou@gmail.com',
            )
          }>
          <Icon name="email" size={18} color={Colors.black} />
          <Text style={styles.emailLinkText}>Email me this receipt</Text>
        </TouchableOpacity>

        {/* Help with this trip */}
        <TouchableOpacity
          style={styles.helpRow}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Help')}>
          <Icon name="help-outline" size={20} color={Colors.black} />
          <Text style={styles.helpRowText}>Help with this trip</Text>
          <Icon name="chevron-right" size={20} color="#9A9A9A" />
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <TouchableOpacity
          style={styles.doneBtn}
          activeOpacity={0.85}
          onPress={() =>
            navigation.reset({index: 0, routes: [{name: 'Home'}]})
          }>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && {fontWeight: '800', color: Colors.black}]}>
        {label}
      </Text>
      <Text style={[styles.rowValue, bold && {fontSize: 18, fontWeight: '800'}]}>
        {value}
      </Text>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    dateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 4,
    },
    dateText: {fontSize: 14, color: '#6B6B6B', fontWeight: '600', flex: 1, marginRight: 12},
    totalText: {
      fontSize: 32,
      fontWeight: '800',
      color: Colors.black,
      letterSpacing: -0.6,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginHorizontal: 16,
      marginTop: 22,
      marginBottom: 8,
    },
    card: {
      marginHorizontal: 16,
      backgroundColor: '#F6F6F6',
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    rowLabel: {fontSize: 14, color: '#444'},
    rowValue: {fontSize: 14, color: Colors.black, fontWeight: '600'},
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: '#D0D0D0',
      marginVertical: 6,
    },
    payCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      padding: 14,
      backgroundColor: '#F6F6F6',
      borderRadius: 14,
    },
    cardLogo: {
      width: 46,
      height: 32,
      borderRadius: 6,
      backgroundColor: '#1A1F71',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardLogoText: {
      color: '#F7B600',
      fontSize: 11,
      fontWeight: '900',
      letterSpacing: 1,
      fontStyle: 'italic',
    },
    payLabel: {fontSize: 15, fontWeight: '700', color: Colors.black},
    paySub: {fontSize: 13, color: '#6B6B6B', marginTop: 2},
    driverCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      padding: 14,
      backgroundColor: '#F6F6F6',
      borderRadius: 14,
    },
    avatar: {width: 48, height: 48, borderRadius: 24, backgroundColor: '#E5E7EB'},
    driverName: {fontSize: 15, fontWeight: '700', color: Colors.black},
    driverMeta: {fontSize: 13, color: '#6B6B6B', marginTop: 2},
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      backgroundColor: Colors.white,
      gap: 4,
    },
    ratingText: {fontSize: 13, fontWeight: '700', color: Colors.black},
    adjustBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
      marginTop: 20,
      paddingVertical: 14,
      borderRadius: 30,
      borderWidth: 1.5,
      borderColor: Colors.black,
      gap: 8,
    },
    adjustText: {fontSize: 15, fontWeight: '700', color: Colors.black},
    emailLink: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
      paddingVertical: 10,
      gap: 8,
    },
    emailLinkText: {
      fontSize: 14,
      fontWeight: '700',
      color: Colors.black,
      textDecorationLine: 'underline',
    },
    helpRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 16,
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor: '#F6F6F6',
      gap: 10,
    },
    helpRowText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '700',
      color: Colors.black,
    },
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
    doneBtn: {
      backgroundColor: Colors.black,
      borderRadius: 30,
      paddingVertical: 16,
      alignItems: 'center',
    },
    doneBtnText: {color: Colors.white, fontWeight: '800', fontSize: 16, letterSpacing: 0.2},
  });
