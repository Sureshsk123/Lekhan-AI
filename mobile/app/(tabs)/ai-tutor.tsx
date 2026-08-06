import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Clipboard } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useToast } from '../../src/contexts/ToastContext';
import { ChatMessage, ChatSession } from '../../src/types';
import aiTutorService from '../../src/services/aiTutorService';
import Input from '../../src/components/common/Input';
import Button from '../../src/components/common/Button';

const SUGGESTIONS = [
  'How do I say "Where is the nearest restaurant?" in Hindi?',
  'Explain the difference between formal and informal Tamil greetings.',
  'Show me a sample conversation at a market in Telugu.',
  'What are common verb endings in Kannada?',
];

export default function AiTutorScreen() {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await aiTutorService.getChatSessions();
      setSessions(data);
      if (data.length > 0) {
        setActiveSessionId(data[0]._id || data[0].id || null);
        loadHistory(data[0]._id || data[0].id || '');
      } else {
        createNewSession();
      }
    } catch (e) {
      createNewSession();
    }
  };

  const createNewSession = async () => {
    try {
      const session = await aiTutorService.createChatSession({ title: 'New Conversation' });
      const id = session._id || session.id || Math.random().toString();
      setActiveSessionId(id);
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: 'Namaste! I am your AI Language Tutor. How can I assist your language journey today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: 'Namaste! I am your AI Language Tutor. Ask me any language question!',
          timestamp: 'Just now',
        },
      ]);
    }
  };

  const loadHistory = async (sessionId: string) => {
    try {
      const history = await aiTutorService.getChatHistory(sessionId);
      if (history.length > 0) {
        setMessages(history);
      }
    } catch (e) {
      // Keep existing
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const res = await aiTutorService.askAiTutor({
        message: query,
        sessionId: activeSessionId || undefined,
      });

      if (res.sessionId && res.sessionId !== activeSessionId) {
        setActiveSessionId(res.sessionId);
      }

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: res.reply || "AI Tutor is currently unavailable. Please start the local Ollama server.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'ai',
          text: err?.response?.data?.message || err?.message || "AI Tutor is currently unavailable. Please start the local Ollama server.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    showToast('Message copied to clipboard!', 'success');
  };

  const handleRegenerate = () => {
    if (messages.length > 1) {
      const lastUser = [...messages].reverse().find((m) => m.sender === 'user');
      if (lastUser) {
        handleSend(lastUser.text);
      }
    }
  };

  const handleDeleteSession = async () => {
    if (activeSessionId) {
      try {
        await aiTutorService.deleteChatSession(activeSessionId);
      } catch (e) {}
      showToast('Session deleted', 'info');
      createNewSession();
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>AI Tutor 🤖</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.smallBtn} onPress={createNewSession}>
            <Text style={styles.smallBtnText}>+ New</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn]} onPress={handleDeleteSession}>
            <Text style={styles.deleteBtnText}>🗑 Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sugRow}>
          {SUGGESTIONS.map((s, i) => (
            <TouchableOpacity key={i} style={styles.sugChip} onPress={() => handleSend(s)}>
              <Text style={styles.sugText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[styles.msgWrapper, item.sender === 'user' ? styles.userWrapper : styles.aiWrapper]}>
            <View style={[styles.msgBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.msgText, item.sender === 'user' ? styles.userText : styles.aiText]}>
                {item.text}
              </Text>
              <View style={styles.msgFooter}>
                <Text style={styles.timeText}>{item.timestamp}</Text>
                {item.sender === 'ai' && (
                  <TouchableOpacity onPress={() => handleCopy(item.text)}>
                    <Text style={styles.actionIcon}>📋</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>🤖 AI Tutor is typing...</Text>
        </View>
      )}

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <Input
          placeholder="Ask AI Tutor..."
          value={inputText}
          onChangeText={setInputText}
          style={styles.input}
        />
        <Button title="Send" onPress={() => handleSend()} size="sm" style={styles.sendBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  textDark: { color: '#F8FAFC' },
  headerActions: { flexDirection: 'row', gap: 8 },
  smallBtn: { backgroundColor: '#2563EB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  smallBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  deleteBtn: { backgroundColor: '#FEE2E2' },
  deleteBtnText: { color: '#EF4444', fontWeight: '700', fontSize: 12 },
  sugRow: { maxHeight: 50, marginBottom: 12 },
  sugChip: { backgroundColor: '#E0EFFE', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, marginRight: 8 },
  sugText: { color: '#1D4ED8', fontSize: 12, fontWeight: '600' },
  msgWrapper: { marginVertical: 6, flexDirection: 'row' },
  userWrapper: { justifyContent: 'flex-end' },
  aiWrapper: { justifyContent: 'flex-start' },
  msgBubble: { maxWidth: '82%', padding: 14, borderRadius: 16 },
  userBubble: { backgroundColor: '#2563EB', borderBottomRightRadius: 2 },
  aiBubble: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 2 },
  msgText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#FFFFFF' },
  aiText: { color: '#0F172A' },
  msgFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  timeText: { fontSize: 10, color: '#94A3B8' },
  actionIcon: { fontSize: 14, marginLeft: 8 },
  typingIndicator: { padding: 8, alignItems: 'center' },
  typingText: { fontSize: 12, color: '#64748B', fontStyle: 'italic' },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  input: { flex: 1, marginBottom: 0 },
  sendBtn: { height: 48, justifyContent: 'center' },
});
