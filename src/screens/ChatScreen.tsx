import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTwitchStore } from '../stores/twitchStore';
import { twitchService } from '../services/twitchService';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  color?: string;
  badges?: string[];
}

const ChatScreen = ({ route }: any) => {
  const { channel } = route.params || {};
  const { user } = useTwitchStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (channel) {
      connectToChat(channel);
    }

    return () => {
      // Cleanup connection
    };
  }, [channel]);

  const connectToChat = async (channelName: string) => {
    try {
      setIsConnecting(true);

      // Mock messages for now (würde IRC-Verbindung sein)
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          username: 'Streamer',
          message: 'Welcome to the stream!',
          timestamp: new Date().toLocaleTimeString(),
          color: '#9146ff',
        },
        {
          id: '2',
          username: 'Viewer1',
          message: 'Hey! What are we playing today?',
          timestamp: new Date().toLocaleTimeString(),
          color: '#00ff00',
        },
        {
          id: '3',
          username: 'Viewer2',
          message: 'LUL',
          timestamp: new Date().toLocaleTimeString(),
          color: '#ff6b6b',
        },
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to connect to chat:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !user?.id || !channel) return;

    try {
      setIsSending(true);

      // Add message to UI immediately
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        username: user.display_name,
        message: messageText,
        timestamp: new Date().toLocaleTimeString(),
        color: '#9146ff',
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessageText('');

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Send via API
      // await twitchService.sendChatMessage(broadcasterId, messageText, user.id);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={styles.messageContainer}>
      <Text
        style={[
          styles.username,
          { color: item.color || '#ffffff' },
        ]}
      >
        {item.username}
      </Text>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Messages List */}
      {isConnecting ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9146ff" />
          <Text style={styles.loadingText}>Chat wird verbunden...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />
      )}

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Schreibe eine Nachricht..."
          placeholderTextColor="#53535f"
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
          editable={!isConnecting}
        />
        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!messageText.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e10',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 12,
    fontSize: 14,
  },
  messagesList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  messageContainer: {
    marginBottom: 12,
  },
  username: {
    fontWeight: '600',
    fontSize: 13,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#1a1a1e',
    borderTopColor: '#2a2a2e',
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2a2a2e',
    color: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9146ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#53535f',
    opacity: 0.5,
  },
});

export default ChatScreen;
