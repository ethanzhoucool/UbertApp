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
import {shopCategories, stores, Store} from '../../data/mockStores';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ShopsBrowse'>;
};

export function ShopsBrowseScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<string>('grocery');

  useEffect(() => {
    console.log('[Ubert] ShopsBrowseScreen mounted');
  }, []);

  const filtered = stores.filter(s => s.category === category);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Shop nearby stores" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 32}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.heroTitle}>Get it in 30 min or less</Text>
        <Text style={styles.heroSub}>
          Groceries, essentials and more delivered fast.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catsRow}>
          {shopCategories.map(c => {
            const active = category === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={styles.catTile}
                onPress={() => setCategory(c.id)}
                activeOpacity={0.85}>
                <View
                  style={[
                    styles.catImageWrap,
                    active && styles.catImageWrapActive,
                  ]}>
                  <Image
                    source={{uri: c.imageUrl}}
                    style={styles.catImage}
                  />
                  <View style={styles.catIconBadge}>
                    <Icon name={c.icon} size={14} color={Colors.white} />
                  </View>
                </View>
                <Text
                  style={[
                    styles.catLabel,
                    active && styles.catLabelActive,
                  ]}
                  numberOfLines={1}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Stores</Text>
        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Icon name="search-off" size={40} color="#6B6B6B" />
            <Text style={styles.emptyText}>
              No stores in this category yet
            </Text>
          </View>
        ) : (
          filtered.map(store => (
            <StoreCard
              key={store.id}
              store={store}
              onPress={() =>
                navigation.navigate('StoreDetail', {storeId: store.id})
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function StoreCard({store, onPress}: {store: Store; onPress: () => void}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <TouchableOpacity
      style={styles.storeCard}
      activeOpacity={0.85}
      onPress={onPress}>
      <View style={styles.storeImgWrap}>
        <Image source={{uri: store.imageUrl}} style={styles.storeImg} />
        {store.brand && (
          <View
            style={[
              styles.brandChip,
              {backgroundColor: store.brand.bg},
            ]}>
            <Text style={[styles.brandChipText, {color: store.brand.fg}]}>
              {store.brand.initials}
            </Text>
          </View>
        )}
        <View style={styles.etaPill}>
          <Icon name="schedule" size={11} color={Colors.white} />
          <Text style={styles.etaPillText}>{store.etaMinutes} min</Text>
        </View>
      </View>
      <View style={styles.storeBody}>
        <Text style={styles.storeName} numberOfLines={1}>
          {store.name}
        </Text>
        <View style={styles.storeMeta}>
          <Icon name="star" size={13} color={Colors.starYellow} />
          <Text style={styles.metaText}>{store.rating.toFixed(1)}</Text>
          <Text style={styles.metaDot}> · </Text>
          <Text style={styles.metaText}>{store.deliveryFee} delivery</Text>
        </View>
        <View style={styles.tagsRow}>
          {store.tags.map(tag => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    heroTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: Colors.black,
      letterSpacing: -0.3,
      marginHorizontal: 16,
      marginTop: 18,
    },
    heroSub: {
      fontSize: 14,
      color: '#6B6B6B',
      marginHorizontal: 16,
      marginTop: 4,
    },
    catsRow: {
      paddingHorizontal: 16,
      paddingVertical: 18,
      gap: 14,
      alignItems: 'flex-start',
    },
    catTile: {
      alignItems: 'center',
      width: 76,
    },
    catImageWrap: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: '#F6F6F6',
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    catImageWrapActive: {
      borderColor: Colors.black,
    },
    catImage: {
      width: '100%',
      height: '100%',
      backgroundColor: '#F6F6F6',
    },
    catIconBadge: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: Colors.white,
    },
    catLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: Colors.black,
      marginTop: 8,
      textAlign: 'center',
    },
    catLabelActive: {
      fontWeight: '800',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: Colors.black,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 12,
      letterSpacing: -0.2,
    },
    storeCard: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 14,
      overflow: 'hidden',
      backgroundColor: Colors.white,
    },
    storeImgWrap: {
      position: 'relative',
    },
    storeImg: {
      width: '100%',
      height: 160,
      borderRadius: 14,
      backgroundColor: '#F6F6F6',
    },
    brandChip: {
      position: 'absolute',
      left: 12,
      bottom: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      minWidth: 36,
      alignItems: 'center',
    },
    brandChipText: {fontSize: 12, fontWeight: '900', letterSpacing: 0.4},
    etaPill: {
      position: 'absolute',
      right: 12,
      bottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.78)',
      gap: 4,
    },
    etaPillText: {color: Colors.white, fontSize: 11, fontWeight: '700'},
    storeBody: {paddingHorizontal: 4, paddingTop: 10},
    storeName: {fontSize: 17, fontWeight: '700', color: Colors.black},
    storeMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      gap: 2,
    },
    metaText: {fontSize: 13, color: '#6B6B6B', fontWeight: '500'},
    metaDot: {color: '#6B6B6B'},
    tagsRow: {flexDirection: 'row', marginTop: 8, gap: 6, flexWrap: 'wrap'},
    tagPill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: Colors.surfaceMuted,
    },
    tagText: {fontSize: 12, color: Colors.black, fontWeight: '600'},
    emptyWrap: {alignItems: 'center', paddingVertical: 32},
    emptyText: {marginTop: 12, color: '#6B6B6B'},
  });
