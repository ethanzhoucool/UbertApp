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
  navigation: StackNavigationProp<RootStackParamList, 'HelpContact'>;
};

const CATEGORIES = [
  'Trip issue',
  'Refund request',
  'Account help',
  'Payment problem',
  'Other',
];

export function HelpContactScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('ethan@revyl.ai');

  useEffect(() => {
    console.log('[Ubert] HelpContactScreen mounted');
  }, []);

  const handleSubmit = () => {
    navigation.navigate('Home', {
      toast: "We got your message. We'll be in touch.",
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Contact support" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.fieldLabel}>WHAT'S THIS ABOUT?</Text>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setCategoryOpen(prev => !prev)}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.pickerText,
              !category && {color: '#6B6B6B'},
            ]}>
            {category || 'Choose a category'}
          </Text>
          <Icon
            name={categoryOpen ? 'expand-less' : 'expand-more'}
            size={22}
            color={Colors.black}
          />
        </TouchableOpacity>
        {categoryOpen && (
          <View style={styles.categoryList}>
            {CATEGORIES.map((c, i) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.categoryRow,
                  i < CATEGORIES.length - 1 && styles.categoryDivider,
                ]}
                onPress={() => {
                  setCategory(c);
                  setCategoryOpen(false);
                }}
                activeOpacity={0.7}>
                <Text style={styles.categoryText}>{c}</Text>
                {category === c && (
                  <Icon name="check" size={20} color={Colors.black} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.fieldLabel, {marginTop: 22}]}>MESSAGE</Text>
        <TextInput
          style={styles.textarea}
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder="Describe your issue"
          placeholderTextColor="#6B6B6B"
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.attachRow} activeOpacity={0.7}>
          <Icon name="attach-file" size={20} color={Colors.black} />
          <Text style={styles.attachText}>Add a screenshot</Text>
        </TouchableOpacity>

        <Text style={[styles.fieldLabel, {marginTop: 18}]}>EMAIL</Text>
        <View style={styles.emailInputWrap}>
          <Icon name="email" size={20} color="#6B6B6B" />
          <TextInput
            style={styles.emailInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#6B6B6B"
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    fieldLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#6B6B6B',
      letterSpacing: 0.6,
      marginHorizontal: 16,
      marginTop: 18,
      marginBottom: 8,
    },
    picker: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 16,
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderRadius: 10,
      backgroundColor: '#F6F6F6',
    },
    pickerText: {
      fontSize: 15,
      color: Colors.black,
      fontWeight: '500',
    },
    categoryList: {
      marginHorizontal: 16,
      marginTop: 6,
      borderRadius: 10,
      backgroundColor: '#F6F6F6',
      overflow: 'hidden',
    },
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    categoryDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    categoryText: {
      fontSize: 15,
      color: Colors.black,
    },
    textarea: {
      marginHorizontal: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      minHeight: 140,
      borderRadius: 10,
      backgroundColor: '#F6F6F6',
      fontSize: 15,
      color: Colors.black,
    },
    attachRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 12,
      paddingVertical: 10,
    },
    attachText: {
      fontSize: 15,
      fontWeight: '600',
      color: Colors.black,
      marginLeft: 8,
    },
    input: {
      marginHorizontal: 16,
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderRadius: 10,
      backgroundColor: '#F6F6F6',
      fontSize: 15,
      color: Colors.black,
    },
    emailInputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      paddingHorizontal: 14,
      borderRadius: 10,
      backgroundColor: '#F6F6F6',
    },
    emailInput: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 8,
      fontSize: 15,
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
    submitBtn: {
      backgroundColor: Colors.black,
      paddingVertical: 16,
      borderRadius: 999,
      alignItems: 'center',
    },
    submitText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '700',
    },
  });
