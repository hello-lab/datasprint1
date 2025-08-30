import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hey there! I'm Steppe, your personal fitness assistant and pal. Ask me anything about fitness, wellness, or corporate health!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // Simulate AI responses (in a real app, this would call an API)
  const getAIResponse = async (userMessage) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple response logic for demo
    const message = userMessage.toLowerCase();
    
    if (message.includes('step') || message.includes('walk')) {
      return "Great question about steps! Walking is one of the best exercises for overall health. I recommend aiming for 10,000 steps daily. Start with where you are now and gradually increase. Even short walks during work breaks can make a big difference!";
    } else if (message.includes('exercise') || message.includes('workout')) {
      return "Exercise is fantastic for both physical and mental health! For corporate wellness, I suggest starting with 20-30 minutes of activity daily. This could be morning stretches, lunch break walks, or desk exercises. What type of activities interest you most?";
    } else if (message.includes('stress') || message.includes('tired')) {
      return "Stress management is crucial for workplace wellness! Try the breathing exercise in our Home tab - it's perfect for quick stress relief. Also, regular physical activity, proper sleep, and staying hydrated can significantly reduce stress levels.";
    } else if (message.includes('team') || message.includes('coworker')) {
      return "Team wellness activities are amazing for building morale! Consider organizing walking meetings, group challenges, or wellness workshops. Creating a supportive environment where colleagues encourage each other's health goals can transform workplace culture!";
    } else if (message.includes('diet') || message.includes('food')) {
      return "Nutrition plays a huge role in workplace productivity! Focus on balanced meals, stay hydrated, and consider healthy snacks like fruits or nuts. Meal prep can help maintain good eating habits even during busy work days.";
    } else {
      return "That's a great question! As your corporate fitness assistant, I'm here to help with all aspects of workplace wellness - from physical activity and stress management to team building and healthy habits. What specific area would you like to explore?";
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await getAIResponse(inputText);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      Alert.alert('Error', 'Failed to get response from Steppe');
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.botMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userText : styles.botText
        ]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
        <Text style={styles.headerTitle}>Steppe AI Assistant</Text>
        <View style={styles.statusIndicator}>
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>Steppe is typing...</Text>
            </View>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me about fitness, wellness, or teamwork..."
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3871f5',
    padding: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginLeft: 12,
  },
  statusIndicator: {
    backgroundColor: '#28a745',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#3871f5',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#333',
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingIndicator: {
    backgroundColor: '#e9ecef',
    borderRadius: 16,
    padding: 12,
    alignSelf: 'flex-start',
  },
  typingText: {
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  sendButton: {
    backgroundColor: '#3871f5',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default ChatbotScreen;