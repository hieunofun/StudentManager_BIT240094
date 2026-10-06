import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { colors, layout } from '@/constants/theme';
import { useLocale } from '@/contexts/locale-context';
import { useStudents } from '@/contexts/student-context';

export function DataState() {
  const { status, reload } = useStudents();
  const { t } = useLocale();
  return (
    <View style={styles.state}>
      {status === 'loading' ? <><ActivityIndicator color={colors.primary} /><Text style={layout.subtitle}>{t('loading')}</Text></> :
        <><Text style={layout.error} accessibilityRole="alert">{t('loadFailed')}</Text><Button title={t('retry')} onPress={() => { void reload(); }} variant="outline" /></>}
    </View>
  );
}

const styles = StyleSheet.create({ state: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 } });
