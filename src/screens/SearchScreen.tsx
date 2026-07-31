import React, {useMemo, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Divider} from '../components/common/Divider';
import {PressScale} from '../components/common/PressScale';
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {
  Place,
  recentPlaces,
  suggestedPlaces,
  currentLocation,
} from '../data/mockPlaces';
import {Spacing, useColors, ColorPalette} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Search'>;
};

export function SearchScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const {dispatch} = useTrip();
  const [query, setQuery] = useState('');

  const allPlaces = [...recentPlaces, ...suggestedPlaces];
  const filteredPlaces =
    query.length > 0
      ? allPlaces.filter(
          p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.address.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  const handleSelectPlace = (place: Place) => {
    dispatch({type: 'SET_DESTINATION', payload: place});
    navigation.navigate('RideSelection', {destination: place});
  };

  const displayPlaces = query.length > 0 ? filteredPlaces : recentPlaces;
  const hasNoResults = query.length > 0 && filteredPlaces.length === 0;

  return (
    <KeyboardAvoidingView
      style={[styles.container, {paddingTop: insets.top}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>

        <View style={styles.inputsCol}>
          {/* Origin */}
          <View style={styles.inputRow}>
            <View style={[styles.dot, {backgroundColor: Colors.success}]} />
            <View style={styles.originBox}>
              <Text style={styles.originText} numberOfLines={1}>
                {currentLocation.address}
              </Text>
            </View>
          </View>

          <View style={styles.connector} />

          {/* Destination */}
          <View style={styles.inputRow}>
            <View style={[styles.dot, {backgroundColor: Colors.black}]} />
            <TextInput
              style={styles.destInput}
              placeholder="Where to?"
              placeholderTextColor={Colors.gray500}
              value={query}
              onChangeText={setQuery}
              autoFocus
              returnKeyType="search"
            />
          </View>
        </View>
      </View>

      <Divider />

      {/* Airport pickup chip */}
      <TouchableOpacity
        style={styles.airportChip}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('AirlinePicker')}>
        <Icon name="flight" size={16} color={Colors.black} />
        <Text style={styles.airportChipText}>Airport pickup · Pick airline</Text>
        <Icon name="chevron-right" size={18} color={Colors.gray500} />
      </TouchableOpacity>

      {/* Results list */}
      <FlatList
        data={displayPlaces}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          hasNoResults ? null : (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {query.length > 0 ? 'Results' : 'Recent'}
              </Text>
            </View>
          )
        }
        ListEmptyComponent={
          hasNoResults ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Icon name="search-off" size={32} color={Colors.gray500} />
              </View>
              <Text style={styles.emptyTitle}>No results for "{query}"</Text>
              <Text style={styles.emptyHint}>
                Try a different name, address, or landmark.
              </Text>
            </View>
          ) : null
        }
        renderItem={({item}) => (
          <PressScale
            style={styles.placeRow}
            onPress={() => handleSelectPlace(item)}>
            <View style={styles.placeIcon}>
              <Icon
                name={query.length > 0 ? 'place' : 'history'}
                size={18}
                color={Colors.gray700}
              />
            </View>
            <View style={styles.placeText}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeAddr} numberOfLines={1}>
                {item.address}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.gray300} />
          </PressScale>
        )}
        ItemSeparatorComponent={() => <Divider style={{marginLeft: 64}} />}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          query.length === 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Suggestions</Text>
              </View>
              {suggestedPlaces.slice(0, 5).map(place => (
                <PressScale
                  key={place.id}
                  style={styles.placeRow}
                  onPress={() => handleSelectPlace(place)}>
                  <View style={styles.placeIcon}>
                    <Icon name="place" size={18} color={Colors.gray700} />
                  </View>
                  <View style={styles.placeText}>
                    <Text style={styles.placeName}>{place.name}</Text>
                    <Text style={styles.placeAddr} numberOfLines={1}>
                      {place.address}
                    </Text>
                  </View>
                  <Icon
                    name="chevron-right"
                    size={20}
                    color={Colors.gray300}
                  />
                </PressScale>
              ))}
            </>
          ) : null
        }
      />
    </KeyboardAvoidingView>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    header: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.base,
      paddingVertical: 14,
      alignItems: 'flex-start',
    },
    backBtn: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },
    inputsCol: {
      flex: 1,
      marginLeft: 8,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 42,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    connector: {
      width: 1.5,
      height: 14,
      backgroundColor: Colors.gray300,
      marginLeft: 2.25,
    },
    originBox: {
      flex: 1,
      marginLeft: 12,
      height: 42,
      justifyContent: 'center',
      backgroundColor: Colors.white,
      borderRadius: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: Colors.borderSubtle,
    },
    originText: {
      fontSize: 15,
      fontWeight: '600',
      color: Colors.black,
    },
    destInput: {
      flex: 1,
      marginLeft: 12,
      height: 42,
      backgroundColor: Colors.white,
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 15,
      fontWeight: '600',
      color: Colors.black,
      borderWidth: 1.5,
      borderColor: Colors.black,
      shadowColor: Colors.black,
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 2},
      elevation: 2,
    },
    sectionHeader: {
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.black,
    },
    placeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.base,
      paddingVertical: 14,
    },
    placeIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeText: {
      flex: 1,
      marginLeft: Spacing.md,
    },
    placeName: {
      fontSize: 15,
      fontWeight: '600',
      color: Colors.black,
    },
    placeAddr: {
      fontSize: 13,
      color: Colors.gray500,
      marginTop: 2,
    },
    airportChip: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: Spacing.base,
      marginTop: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: Colors.surfaceMuted,
      gap: 10,
    },
    airportChipText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: Colors.black,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.base,
      paddingTop: 56,
    },
    emptyIconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: Colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.black,
      textAlign: 'center',
    },
    emptyHint: {
      fontSize: 14,
      color: Colors.gray500,
      textAlign: 'center',
      marginTop: 6,
    },
  });
