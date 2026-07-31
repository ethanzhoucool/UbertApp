import React, {useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useColors, ColorPalette} from '../../theme';
import {shopCategories, stores} from '../../data/mockStores';

interface Props {
  onOpenBrowse: () => void;
  onOpenStore: (storeId: string) => void;
}

export function ShopsHomeView({onOpenBrowse, onOpenStore}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  useEffect(() => {
    console.log('[Ubert] ShopsHomeView mounted');
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        style={styles.searchBar}
        onPress={onOpenBrowse}
        activeOpacity={0.85}>
        <Icon name="search" size={20} color="#6B6B6B" />
        <Text style={styles.searchText}>
          Search groceries, pharmacy and more
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catsRow}>
        {shopCategories.map(c => (
          <TouchableOpacity
            key={c.id}
            style={styles.catChip}
            onPress={onOpenBrowse}
            activeOpacity={0.7}>
            <Icon name={c.icon} size={20} color={Colors.black} />
            <Text style={styles.catLabel}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Stores near you</Text>
      {stores.slice(0, 4).map(s => (
        <TouchableOpacity
          key={s.id}
          style={styles.storeRow}
          activeOpacity={0.85}
          onPress={() => onOpenStore(s.id)}>
          <Image source={{uri: s.imageUrl}} style={styles.storeThumb} />
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={styles.storeName}>{s.name}</Text>
            <View style={styles.storeMeta}>
              <Icon name="star" size={12} color={Colors.starYellow} />
              <Text style={styles.metaText}>{s.rating.toFixed(1)}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>{s.etaMinutes} min</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>{s.deliveryFee}</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color="#6B6B6B" />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.seeAllBtn}
        onPress={onOpenBrowse}
        activeOpacity={0.7}>
        <Text style={styles.seeAllText}>See all stores</Text>
        <Icon name="arrow-forward" size={18} color={Colors.black} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.surfaceMuted,
      borderRadius: 10,
      marginHorizontal: 16,
      marginTop: 14,
      paddingHorizontal: 14,
      height: 48,
      gap: 10,
    },
    searchText: {fontSize: 15, color: '#6B6B6B', fontWeight: '600'},
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: Colors.black,
      marginHorizontal: 16,
      marginTop: 22,
      marginBottom: 10,
    },
    catsRow: {paddingHorizontal: 16, gap: 8},
    catChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 24,
      backgroundColor: Colors.surfaceMuted,
      gap: 6,
    },
    catLabel: {fontSize: 14, fontWeight: '600', color: Colors.black},
    storeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    storeThumb: {
      width: 64,
      height: 64,
      borderRadius: 10,
      backgroundColor: Colors.surfaceMuted,
    },
    storeName: {fontSize: 15, fontWeight: '700', color: Colors.black},
    storeMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      gap: 4,
    },
    metaText: {fontSize: 12, color: '#6B6B6B', fontWeight: '500'},
    metaDot: {color: '#6B6B6B'},
    seeAllBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
      marginHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: '#E5E7EB',
      gap: 8,
      marginBottom: 20,
    },
    seeAllText: {fontSize: 15, fontWeight: '600', color: Colors.black},
  });
