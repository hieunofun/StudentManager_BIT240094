import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { DataState } from '@/components/data-state';
import { colors, layout } from '@/constants/theme';
import { useLocale } from '@/contexts/locale-context';
import { useStudents } from '@/contexts/student-context';
import { OperationError } from '@/types/student';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { students, status, remove } = useStudents();
  const { t } = useLocale();
  const student = students.find((item) => item.id === id);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<OperationError['code'] | null>(null);
  const deleting = useRef(false);

  async function deleteStudent() {
    if (!student || deleting.current) return;
    deleting.current = true;
    setBusy(true);
    setError(null);
    try {
      await remove(student.id);
      setConfirmVisible(false);
      router.dismissTo('/');
    } catch (failure) {
      setConfirmVisible(false);
      setError(failure instanceof OperationError ? failure.code : 'saveFailed');
    } finally {
      deleting.current = false;
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={layout.screen}>
      <View style={layout.container}>
        <View style={layout.header}>
          <View style={styles.back}><Button title={t('back')} variant="outline" disabled={busy} onPress={() => router.dismissTo('/')} /></View>
          <Text style={layout.title}>{t('detailTitle')}</Text>
        </View>
        {status !== 'ready' ? <DataState /> : !student ?
          <View style={layout.content}><Text style={layout.error}>{t('studentNotFound')}</Text></View> :
          <ScrollView contentContainerStyle={layout.content}>
            <View style={styles.avatar}><Avatar uri={student.avatarUri} size={96} /></View>
            <View style={styles.field}><Text style={layout.subtitle}>{t('name')}</Text><Text selectable style={styles.value}>{student.name}</Text></View>
            <View style={styles.field}><Text style={layout.subtitle}>{t('studentId')}</Text><Text selectable style={styles.value}>{student.studentId}</Text></View>
            <View style={styles.field}><Text style={layout.subtitle}>{t('email')}</Text><Text selectable style={styles.value}>{student.email}</Text></View>
            {!!error && <Text accessibilityRole="alert" style={layout.error}>{t(error)}</Text>}
            <View style={layout.actions}>
              <Button title={t('edit')} disabled={busy} style={layout.action} onPress={() => router.push({ pathname: '/student-form', params: { id: student.id } })} />
              <Button title={t(busy ? 'deleting' : 'delete')} disabled={busy} variant="danger" style={layout.action} onPress={() => { setError(null); setConfirmVisible(true); }} />
            </View>
          </ScrollView>}
      </View>
      <ConfirmationDialog visible={confirmVisible} message={t('confirmDelete')} onNo={() => setConfirmVisible(false)} onYes={() => { void deleteStudent(); }} busy={busy} destructive />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start' },
  avatar: { alignItems: 'center', paddingVertical: 12 },
  field: { gap: 8 },
  value: { fontSize: 16, lineHeight: 24, color: colors.text, flexShrink: 1 },
});
