import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { DataState } from '@/components/data-state';
import { colors, layout } from '@/constants/theme';
import { useLocale } from '@/contexts/locale-context';
import { useStudents } from '@/contexts/student-context';
import { OperationError, type Student } from '@/types/student';

export default function StudentListScreen() {
  const { students, status, remove } = useStudents();
  const { t, language } = useLocale();
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<OperationError['code'] | null>(null);
  const deleting = useRef(false);

  async function deleteStudent() {
    if (!studentToDelete || deleting.current) return;
    deleting.current = true;
    setBusy(true);
    setError(null);
    try {
      await remove(studentToDelete.id);
      setStudentToDelete(null);
    } catch (failure) {
      setStudentToDelete(null);
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
          <Text style={layout.title}>{t('appTitle')}</Text>
          <View style={styles.toolbar}>
            <Text style={[layout.subtitle, styles.subtitle]}>{t('listTitle')}</Text>
            <Button title={t('addStudent')} onPress={() => router.push('/student-form')} disabled={status !== 'ready' || busy} />
          </View>
          {!!error && <Text accessibilityRole="alert" style={layout.error}>{t(error)}</Text>}
        </View>
        {status !== 'ready' ? <DataState /> :
          <FlatList
            data={students}
            extraData={language}
            keyExtractor={(student) => student.id}
            contentContainerStyle={[styles.list, students.length === 0 && styles.emptyList]}
            initialNumToRender={10}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${item.name}, ${item.studentId}`}
                  accessibilityState={{ disabled: busy }}
                  disabled={busy}
                  onPress={() => router.push({ pathname: '/student/[id]', params: { id: item.id } })}
                  style={({ pressed }) => [styles.studentInfo, pressed && styles.pressed]}>
                  <Avatar uri={item.avatarUri} size={44} />
                  <View style={styles.rowText}>
                    <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
                    <Text style={layout.subtitle}>{item.studentId}</Text>
                  </View>
                </Pressable>
                <View style={styles.rowActions}>
                  <Button title={t('edit')} accessibilityLabel={`${t('edit')}: ${item.name}`} variant="outline" disabled={busy} style={styles.rowButton} onPress={() => router.push({ pathname: '/student-form', params: { id: item.id } })} />
                  <Button title={t('delete')} accessibilityLabel={`${t('delete')}: ${item.name}`} variant="danger" disabled={busy} style={styles.rowButton} onPress={() => { setError(null); setStudentToDelete(item); }} />
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>{t('emptyTitle')}</Text>
                <Text style={styles.emptyDescription}>{t('emptyDescription')}</Text>
              </View>
            }
          />}
      </View>
      <ConfirmationDialog visible={!!studentToDelete} message={t('confirmDelete')} onNo={() => setStudentToDelete(null)} onYes={() => { void deleteStudent(); }} busy={busy} destructive />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  subtitle: { flex: 1 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  emptyList: { flexGrow: 1 },
  row: { minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: 8 },
  studentInfo: { flex: 1, minWidth: 0, minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, borderRadius: 12 },
  rowActions: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 },
  rowButton: { paddingHorizontal: 8, minWidth: 44 },
  rowText: { flex: 1, minWidth: 0, gap: 4 },
  name: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: colors.text },
  pressed: { backgroundColor: colors.background },
  separator: { height: 1, backgroundColor: colors.border },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 80 },
  emptyTitle: { fontSize: 18, lineHeight: 26, fontWeight: '600', color: colors.text },
  emptyDescription: { fontSize: 14, lineHeight: 22, color: colors.muted, textAlign: 'center', maxWidth: 280 },
});
