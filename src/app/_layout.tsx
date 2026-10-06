import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SuccessNotice } from '@/components/success-notice';
import { colors } from '@/constants/theme';
import { LocaleProvider } from '@/contexts/locale-context';
import { StudentProvider } from '@/contexts/student-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <StudentProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }} />
          <SuccessNotice />
        </StudentProvider>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
