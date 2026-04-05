import React, {useState} from 'react';
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
import {RootStackParamList} from '../navigation/types';
import {useTrip} from '../store/TripContext';
import {
  Place,
  recentPlaces,
  suggestedPlaces,
  currentLocation,
} from '../data/mockPlaces';
import {Colors, Spacing} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Search'>;
};

export function SearchScreen({navigation}: Props) {
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
            <View style={[styles.dot, {backgroundColor: Colors.accent}]} />
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

      {/* Results list */}
      <FlatList
        data={displayPlaces}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {query.length > 0 ? 'Results' : 'Recent'}
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.placeRow}
            onPress={() => handleSelectPlace(item)}>
            <View style={styles.placeIcon}>
              <Icon
                name={query.length > 0 ? 'place' : 'history'}
                size={18}
                color={Colors.white}
              />
            </View>
            <View style={styles.placeText}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeAddr} numberOfLines={1}>
                {item.address}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.gray300} />
          </TouchableOpacity>
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
                <TouchableOpacity
                  key={place.id}
                  style={styles.placeRow}
                  onPress={() => handleSelectPlace(place)}>
                  <View style={styles.placeIcon}>
                    <Icon name="place" size={18} color={Colors.white} />
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
                </TouchableOpacity>
              ))}
            </>
          ) : null
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connector: {
    width: 2,
    height: 14,
    backgroundColor: Colors.gray300,
    marginLeft: 3,
  },
  originBox: {
    flex: 1,
    marginLeft: 12,
    height: 42,
    justifyContent: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  originText: {
    fontSize: 14,
    color: Colors.gray500,
  },
  destInput: {
    flex: 1,
    marginLeft: 12,
    height: 42,
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: Colors.black,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: 14,
  },
  placeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray700,
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
});
