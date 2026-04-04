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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UbertText} from '../components/common/UbertText';
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

  const filteredPlaces = query.length > 0
    ? [...recentPlaces, ...suggestedPlaces].filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.address.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const handleSelectPlace = (place: Place) => {
    dispatch({type: 'SET_DESTINATION', payload: place});
    navigation.navigate('RideSelection', {destination: place});
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {paddingTop: insets.top}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" />

      {/* Header with inputs */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={styles.inputsContainer}>
          {/* Origin input */}
          <View style={styles.inputRow}>
            <View style={[styles.dot, {backgroundColor: Colors.accent}]} />
            <View style={styles.inputWrap}>
              <UbertText variant="caption" color={Colors.gray500}>
                {currentLocation.address}
              </UbertText>
            </View>
          </View>

          <View style={styles.connector} />

          {/* Destination input */}
          <View style={styles.inputRow}>
            <View style={[styles.dot, {backgroundColor: Colors.black}]} />
            <TextInput
              style={styles.textInput}
              placeholder="Where to?"
              placeholderTextColor={Colors.gray500}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
          </View>
        </View>
      </View>

      <Divider />

      {/* Results */}
      <FlatList
        data={query.length > 0 ? filteredPlaces : recentPlaces}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <UbertText variant="body" color={Colors.black} style={{fontWeight: '600'}}>
              {query.length > 0 ? 'Results' : 'Recent'}
            </UbertText>
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
              <UbertText variant="body" color={Colors.black} style={{fontWeight: '500'}}>
                {item.name}
              </UbertText>
              <UbertText variant="caption" numberOfLines={1}>
                {item.address}
              </UbertText>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.gray500} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <Divider style={{marginLeft: 64}} />
        )}
        keyboardShouldPersistTaps="handled"
      />

      {query.length === 0 && (
        <>
          <View style={styles.sectionHeader}>
            <UbertText variant="body" color={Colors.black} style={{fontWeight: '600'}}>
              Suggestions
            </UbertText>
          </View>
          {suggestedPlaces.slice(0, 4).map(place => (
            <TouchableOpacity
              key={place.id}
              style={styles.placeRow}
              onPress={() => handleSelectPlace(place)}>
              <View style={styles.placeIcon}>
                <Icon name="place" size={18} color={Colors.white} />
              </View>
              <View style={styles.placeText}>
                <UbertText variant="body" color={Colors.black} style={{fontWeight: '500'}}>
                  {place.name}
                </UbertText>
                <UbertText variant="caption" numberOfLines={1}>
                  {place.address}
                </UbertText>
              </View>
              <Icon name="chevron-right" size={20} color={Colors.gray500} />
            </TouchableOpacity>
          ))}
        </>
      )}
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
    paddingVertical: Spacing.md,
    alignItems: 'flex-start',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  inputsContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connector: {
    width: 2,
    height: 16,
    backgroundColor: Colors.gray300,
    marginLeft: 3,
  },
  inputWrap: {
    flex: 1,
    marginLeft: Spacing.md,
    height: 40,
    justifyContent: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
  },
  textInput: {
    flex: 1,
    marginLeft: Spacing.md,
    height: 40,
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    fontSize: 15,
    color: Colors.black,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  placeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
});
