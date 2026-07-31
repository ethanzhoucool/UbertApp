import React, {useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {defaultAisles, getStoreById} from '../../data/mockStores';
import {productsInAisle} from '../../data/mockProducts';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Aisles'>;
  route: RouteProp<RootStackParamList, 'Aisles'>;
};

export function AislesScreen({navigation, route}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const store = getStoreById(route.params.storeId);

  useEffect(() => {
    console.log('[Ubert] AislesScreen mounted', route.params.storeId);
  }, [route.params.storeId]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title={store ? `Aisles at ${store.name}` : 'Browse aisles'}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 24}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Find exactly what you need, one aisle at a time.
        </Text>

        <View style={styles.list}>
          {defaultAisles.map((a, i) => {
            const firstProduct = productsInAisle(
              route.params.storeId,
              a.id,
            )[0];
            return (
              <TouchableOpacity
                key={a.id}
                style={[
                  styles.row,
                  i < defaultAisles.length - 1 && styles.rowDivider,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  if (firstProduct) {
                    navigation.navigate('ProductDetail', {
                      storeId: route.params.storeId,
                      productId: firstProduct.id,
                    });
                  }
                }}>
                <View style={styles.iconWrap}>
                  <Icon name={a.icon} size={22} color={Colors.black} />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.rowTitle}>{a.name}</Text>
                  <Text style={styles.rowSub}>{a.itemCount} items</Text>
                </View>
                <Icon name="chevron-right" size={22} color="#6B6B6B" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
      marginTop: 16,
      marginBottom: 12,
      lineHeight: 20,
    },
    list: {marginTop: 4},
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#F6F6F6',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    rowTitle: {fontSize: 16, fontWeight: '600', color: Colors.black},
    rowSub: {fontSize: 13, color: '#6B6B6B', marginTop: 2},
  });
