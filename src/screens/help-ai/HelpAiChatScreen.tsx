import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'HelpAiChat'>;
};

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const SEED_MSGS: Msg[] = [
  {
    id: 'm0',
    role: 'assistant',
    text: 'Hi Ethan, how can I help today?',
  },
];

const QUICK_PROMPTS = ['Trip issue', 'Payment problem', 'Account help'];

const MOCK_REPLIES: Record<string, string> = {
  'trip issue':
    "I'm sorry to hear that. Which trip was the issue with — your most recent trip to JFK Terminal 4, or another one?",
  'payment problem':
    "Sure — you can update your payment in Settings > Wallet, or I can help you add a new method right now. Which would you like?",
  'account help':
    "Happy to help. Are you trying to update your name, change your email, or something else?",
  default:
    "I've got it. Let me look that up for you. (A live human agent can take over at any time — just say 'live agent'.)",
};

export function HelpAiChatScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [msgs, setMsgs] = useState<Msg[]>(SEED_MSGS);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    console.log('[Ubert] HelpAiChatScreen mounted');
  }, []);

  const send = (text: string) => {
    if (!text.trim()) {
      return;
    }
    const userMsg: Msg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: text.trim(),
    };
    const replyKey = text.trim().toLowerCase().replace(/[?.!]/g, '');
    const reply = MOCK_REPLIES[replyKey] ?? MOCK_REPLIES.default;
    const aiMsg: Msg = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      text: reply,
    };
    setMsgs(prev => [...prev, userMsg, aiMsg]);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({animated: true}), 60);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.black} />

      {/* Black header */}
      <View style={[styles.header, {paddingTop: insets.top + 6}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.headerTitle}>Chat with assistant</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online · usually replies instantly</Text>
          </View>
        </View>
        <View style={styles.aiBadge}>
          <Icon name="auto-awesome" size={18} color={Colors.white} />
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{paddingBottom: 20, paddingTop: 14}}
        showsVerticalScrollIndicator={false}>
        {msgs.map(m => (
          <View
            key={m.id}
            style={[
              styles.bubbleWrap,
              m.role === 'user' && {alignItems: 'flex-end'},
            ]}>
            <View
              style={[
                styles.bubble,
                m.role === 'user' ? styles.userBubble : styles.aiBubble,
              ]}>
              <Text
                style={[
                  styles.bubbleText,
                  m.role === 'user' && {color: Colors.white},
                ]}>
                {m.text}
              </Text>
            </View>
          </View>
        ))}

        {msgs.length === 1 && (
          <View style={styles.quickWrap}>
            {QUICK_PROMPTS.map(q => (
              <TouchableOpacity
                key={q}
                style={styles.quickChip}
                onPress={() => send(q)}
                activeOpacity={0.7}>
                <Text style={styles.quickText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputBar, {paddingBottom: insets.bottom + 8}]}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#9A9A9A"
          returnKeyType="send"
          onSubmitEditing={() => send(input)}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && {opacity: 0.4}]}
          onPress={() => send(input)}
          activeOpacity={0.85}>
          <Icon name="send" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: Colors.black,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {fontSize: 17, fontWeight: '800', color: Colors.white},
    onlineRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2},
    onlineDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: '#06C167'},
    onlineText: {fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500'},
    aiBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.12)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bubbleWrap: {paddingHorizontal: 16, marginVertical: 6, alignItems: 'flex-start'},
    bubble: {
      maxWidth: '85%',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 18,
    },
    aiBubble: {backgroundColor: Colors.surfaceMuted, borderTopLeftRadius: 4},
    userBubble: {backgroundColor: Colors.black, borderTopRightRadius: 4},
    bubbleText: {fontSize: 15, color: Colors.black, lineHeight: 21},
    quickWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      marginTop: 8,
      gap: 8,
    },
    quickChip: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 20,
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: Colors.black,
    },
    quickText: {fontSize: 13, color: Colors.black, fontWeight: '700'},
    inputBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingTop: 10,
      backgroundColor: Colors.white,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#E5E7EB',
      gap: 8,
    },
    input: {
      flex: 1,
      backgroundColor: '#F6F6F6',
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15,
      color: Colors.black,
      maxHeight: 100,
    },
    sendBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
