import { colors } from '@/styles/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen({ children }: any) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        paddingHorizontal: 16,
      }}
    >
      {children}
    </SafeAreaView>
  );
}
