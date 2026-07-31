import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'LanguageSettings'>;
};

const LANGUAGES: {code: string; label: string}[] = [
  {code: 'ar', label: 'العربية'},
  {code: 'zh', label: '中文 (简体)'},
  {code: 'nl', label: 'Nederlands'},
  {code: 'en', label: 'English'},
  {code: 'es', label: 'Español'},
  {code: 'fr', label: 'Français'},
  {code: 'de', label: 'Deutsch'},
  {code: 'hi', label: 'हिन्दी'},
  {code: 'it', label: 'Italiano'},
  {code: 'ja', label: '日本語'},
  {code: 'ko', label: '한국어'},
  {code: 'pt', label: 'Português'},
  {code: 'ru', label: 'Русский'},
  {code: 'tr', label: 'Türkçe'},
].sort((a, b) => a.label.localeCompare(b.label));

export function LanguageSettingsScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('en');
  const [query, setQuery] = useState('');

  useEffect(() => {
    console.log('[Ubert] LanguageSettingsScreen mounted');
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return LANGUAGES;
    }
    return LANGUAGES.filter(l => l.label.toLowerCase().includes(q));
  }, [query]);

  const handleSelect = (code: string) => {
    setSelected(code);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="App language" onBack={() => navigation.goBack()} />

      <View style={styles.searchWrap}>
        <Icon name="search" size={20} color="#6B6B6B" />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search languages"
          placeholderTextColor="#6B6B6B"
        />
      </View>

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 24}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.group}>
          {filtered.map((lang, i) => {
            const active = selected === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.row,
                  i < filtered.length - 1 && styles.rowDivider,
                ]}
                onPress={() => handleSelect(lang.code)}
                activeOpacity={0.7}>
                <Text style={styles.rowLabel}>{lang.label}</Text>
                {active && (
                  <Icon name="check" size={22} color={Colors.black} />
                )}
              </TouchableOpacity>
            );
          })}
          {filtered.length === 0 && (
            <Text style={styles.empty}>No languages match your search.</Text>
          )}
        </View>
      </ScrollView>
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
      marginTop: 16,
      marginBottom: 8,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: '#F6F6F6',
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: Colors.black,
      marginLeft: 8,
      paddingVertical: 0,
    },
    group: {
      marginTop: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    rowLabel: {
      fontSize: 16,
      color: Colors.black,
      fontWeight: '500',
    },
    empty: {
      textAlign: 'center',
      fontSize: 14,
      color: '#6B6B6B',
      marginTop: 32,
    },
  });
