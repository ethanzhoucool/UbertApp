import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BottomSheetModal} from '../common/BottomSheetModal';
import {Driver} from '../../data/mockDriver';
import {Colors} from '../../theme';

interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  driver: Driver;
}

const quickReplies = [
  "I'm coming out now",
  "I'll be there in a minute",
  'Thanks!',
];

const driverReplies = [
  'Sounds good',
  'Take your time',
  'No problem 👍',
  "I'll be waiting outside",
];

function nowTime(): string {
  return new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'});
}

export function MessageSheet({visible, onClose, driver}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      // Seed with a driver greeting on open
      setMessages([
        {
          id: 'seed',
          text: `Hi! This is ${driver.name}. I'm on my way.`,
          fromMe: false,
          time: nowTime(),
        },
      ]);
      setDraft('');
    }
  }, [visible, driver.name]);

  const sendMessage = (text: string) => {
    if (!text.trim()) {return;}
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      text: text.trim(),
      fromMe: true,
      time: nowTime(),
    };
    setMessages(prev => [...prev, newMsg]);
    setDraft('');
    setTimeout(() => scrollRef.current?.scrollToEnd({animated: true}), 50);

    // Driver auto-reply after 1.5s
    setTimeout(() => {
      const reply = driverReplies[Math.floor(Math.random() * driverReplies.length)];
      setMessages(prev => [
        ...prev,
        {
          id: `m-${Date.now()}-r`,
          text: reply,
          fromMe: false,
          time: nowTime(),
        },
      ]);
      setTimeout(() => scrollRef.current?.scrollToEnd({animated: true}), 50);
    }, 1500);
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={driver.name}
      maxHeight="80%"
      scrollable={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={20}
        style={styles.container}>
        <ScrollView
          ref={scrollRef}
          style={styles.thread}
          contentContainerStyle={styles.threadContent}>
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.bubbleRow,
                msg.fromMe ? styles.bubbleRowMe : styles.bubbleRowThem,
              ]}>
              <View
                style={[
                  styles.bubble,
                  msg.fromMe ? styles.bubbleMe : styles.bubbleThem,
                ]}>
                <Text
                  style={[
                    styles.bubbleText,
                    msg.fromMe && styles.bubbleTextMe,
                  ]}>
                  {msg.text}
                </Text>
              </View>
              <Text style={styles.time}>{msg.time}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.quickRow}>
          {quickReplies.map(q => (
            <TouchableOpacity
              key={q}
              style={styles.quickPill}
              onPress={() => sendMessage(q)}
              activeOpacity={0.7}>
              <Text style={styles.quickText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            placeholder="Message"
            placeholderTextColor={Colors.gray500}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={() => sendMessage(draft)}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !draft.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage(draft)}
            disabled={!draft.trim()}>
            <Icon name="send" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 480,
  },
  thread: {
    flex: 1,
  },
  threadContent: {
    paddingVertical: 8,
  },
  bubbleRow: {
    marginBottom: 10,
  },
  bubbleRowMe: {
    alignItems: 'flex-end',
  },
  bubbleRowThem: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: Colors.black,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    color: Colors.black,
  },
  bubbleTextMe: {
    color: Colors.white,
  },
  time: {
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 3,
    marginHorizontal: 6,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
  },
  quickPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  quickText: {
    fontSize: 13,
    color: Colors.black,
    fontWeight: '500',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ECECEC',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.black,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
