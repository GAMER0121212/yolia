import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

export default function Chatbot() {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push('/chat')}
      style={{
        position: 'absolute',

        bottom: 105,
        right: 24,

        width: 68,
        height: 68,

        borderRadius: 34,

        backgroundColor: '#166534',

        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: {
          width: 0,
          height: 8,
        },

        elevation: 12,
      }}
    >
      {/* Glow */}
      <View
        style={{
          position: 'absolute',

          width: 82,
          height: 82,

          borderRadius: 41,

          backgroundColor: 'rgba(34,197,94,0.15)',
        }}
      />

      <Ionicons
        name="chatbubble-ellipses"
        size={30}
        color="#fff"
      />
    </TouchableOpacity>
  );
}