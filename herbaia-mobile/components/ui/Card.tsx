import { colors, shadow } from '@/styles/theme';
import { View } from 'react-native';

export default function Card({ children }: any) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 15,
        ...shadow,
      }}
    >
      {children}
    </View>
  );
}