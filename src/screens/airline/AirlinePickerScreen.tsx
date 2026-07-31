import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {airlines, Airline} from '../../data/mockAirlines';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'AirlinePicker'>;
};

export function AirlinePickerScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Airline | null>(null);

  useEffect(() => {
    console.log('[Ubert] AirlinePickerScreen mounted');
  }, []);

  const filtered =
    query.length === 0
      ? airlines
      : airlines.filter(
          a =>
            a.name.toLowerCase().includes(query.toLowerCase()) ||
            a.iata.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title="Airline"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.searchWrap}>
        <Icon name="search" size={20} color="#6B6B6B" />
        <TextInput
          style={styles.search}
          value={query}
          onChangeText={setQuery}
          placeholder="Search airlines"
          placeholderTextColor="#9A9A9A"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Icon name="close" size={18} color="#6B6B6B" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.intro}>
        Your airline helps your driver pick the right terminal for drop-off.
      </Text>

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}>
        {filtered.map((a, i) => {
          const active = selected?.id === a.id;
          return (
            <TouchableOpacity
              key={a.id}
              style={[
                styles.row,
                i < filtered.length - 1 && styles.rowDivider,
              ]}
              activeOpacity={0.7}
              onPress={() => setSelected(a)}>
              <View style={styles.logoWrap}>
                {a.logoUrl ? (
                  <Image
                    source={{uri: a.logoUrl}}
                    style={styles.logoImg}
                    resizeMode="contain"
                  />
                ) : (
                  <View
                    style={[styles.logoFallback, {backgroundColor: a.logoColor}]}>
                    <Text style={styles.iataText}>{a.iata}</Text>
                  </View>
                )}
              </View>
              <View style={{flex: 1, marginLeft: 12}}>
                <Text style={styles.airlineName}>{a.name}</Text>
                <Text style={styles.terminal}>
                  {a.iata} · Terminal {a.terminal}
                </Text>
              </View>
              {active ? (
                <View style={styles.checkBadge}>
                  <Icon name="check" size={18} color={Colors.white} />
                </View>
              ) : (
                <View style={styles.checkPlaceholder} />
              )}
            </TouchableOpacity>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyWrap}>
            <Icon name="flight" size={40} color="#D0D0D0" />
            <Text style={styles.emptyText}>No airlines matched "{query}"</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <TouchableOpacity
          style={[styles.confirmBtn, !selected && {opacity: 0.4}]}
          activeOpacity={selected ? 0.85 : 1}
          disabled={!selected}
          onPress={() => selected && navigation.goBack()}>
          <Text style={styles.confirmBtnText}>
            {selected ? `Confirm ${selected.name}` : 'Pick an airline'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    gap: 8,
  },
  search: {flex: 1, fontSize: 15, color: Colors.black, paddingVertical: 0},
  intro: {
    fontSize: 13,
    color: '#6B6B6B',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
    lineHeight: 18,
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
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImg: {width: 40, height: 40, backgroundColor: '#F6F6F6'},
  logoFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iataText: {color: Colors.white, fontWeight: '800', fontSize: 16},
  airlineName: {fontSize: 15, fontWeight: '700', color: Colors.black},
  terminal: {fontSize: 13, color: '#6B6B6B', marginTop: 2},
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkPlaceholder: {width: 28, height: 28},
  emptyWrap: {alignItems: 'center', paddingVertical: 60},
  emptyText: {marginTop: 14, color: '#6B6B6B', fontSize: 14},
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
  confirmBtn: {
    backgroundColor: Colors.black,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmBtnText: {color: Colors.white, fontWeight: '800', fontSize: 16, letterSpacing: 0.2},
});
