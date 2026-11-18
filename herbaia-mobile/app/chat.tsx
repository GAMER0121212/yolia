import { askHerbalAI } from '@/services/openai';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ChatScreen() {
  const params = useLocalSearchParams();

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      role: 'assistant',
      text:
        'Hola 🌿 Soy HerbalIA. Pregúntame sobre plantas medicinales.',
    },
  ]);

  useEffect(() => {
    if (params.plant) {
      const plantQuestion = `Cuéntame sobre ${params.plant}`;

      sendAutomaticMessage(plantQuestion);
    }
  }, []);

  async function sendAutomaticMessage(question: string) {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    const response = await askHerbalAI(question);

    const botMessage = {
      id: Math.random().toString(),
      role: 'assistant',
      text: response,
    };

    setMessages((prev) => [...prev, botMessage]);

    setLoading(false);
  }

  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessage('');

    setLoading(true);

    const response = await askHerbalAI(message);

    const botMessage = {
      id: Math.random().toString(),
      role: 'assistant',
      text: response,
    };

    setMessages((prev) => [...prev, botMessage]);

    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        flex: 1,
        backgroundColor: '#F4F6F8',
      }}
    >
      {/* HEADER */}
      <View
        style={{
          paddingTop: 70,
          paddingBottom: 20,
          paddingHorizontal: 20,

          backgroundColor: '#166534',

          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 28,
            fontWeight: 'bold',
          }}
        >
          HerbalIA Chat 🌿
        </Text>

        <Text
          style={{
            color: '#DCFCE7',
            marginTop: 6,
          }}
        >
          Asistente inteligente de plantas medicinales
        </Text>
      </View>

      {/* MESSAGES */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf:
                item.role === 'user'
                  ? 'flex-end'
                  : 'flex-start',

              backgroundColor:
                item.role === 'user'
                  ? '#166534'
                  : '#fff',

              padding: 14,

              borderRadius: 22,

              marginBottom: 12,

              maxWidth: '82%',
            }}
          >
            <Text
              style={{
                color:
                  item.role === 'user'
                    ? '#fff'
                    : '#111827',

                lineHeight: 22,
              }}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* LOADING */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#166534"
          style={{
            marginBottom: 10,
          }}
        />
      )}

      {/* INPUT */}
      <View
        style={{
          position: 'absolute',

          bottom: 20,
          left: 20,
          right: 20,

          flexDirection: 'row',
          alignItems: 'center',

          backgroundColor: '#fff',

          borderRadius: 30,

          paddingHorizontal: 18,
          paddingVertical: 10,

          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Pregunta algo..."
          placeholderTextColor="#9CA3AF"
          style={{
            flex: 1,
            fontSize: 15,
          }}
        />

        <TouchableOpacity
          onPress={sendMessage}
          style={{
            width: 48,
            height: 48,

            borderRadius: 24,

            backgroundColor: '#166534',

            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="send"
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}