import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { DataState } from '@/components/data-state';
import { colors, layout } from '@/constants/theme';
import { useLocale } from '@/contexts/locale-context';
import { useStudents } from '@/contexts/student-context';

export default function StudentListScreen() {
  const { students, status } = useStudents();
  const { t, language } = useLocale();

  return (
    <SafeAreaView style={layout.screen}>
      <View style={layout.container}>
        <View style={layout.header}>
          <Text style={layout.title}>{t('appTitle')}</Text>
          <View style={styles.toolbar}>
            <Text style={[layout.subtitle, styles.subtitle]}>{t('listTitle')}</Text>
            <Button title={t('addStudent')} onPress={() => router.push('/student-form')} disabled={status !== 'ready'} />
          </View>
        </View>
        {status !== 'ready' ? <DataState /> :
          <FlatList
            data={students}
            extraData={language}
            keyExtractor={(student) => student.id}
            contentContainerStyle={[styles.list, students.length === 0 && styles.emptyList]}
            initialNumToRender={10}
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${item.name}, ${item.studentId}`}
                onPress={() => router.push({ pathname: '/student/[id]', params: { id: item.id } })}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
                <Avatar uri={item.avatarUri} />
                <View style={styles.rowText}>
                  <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
                  <Text style={layout.subtitle}>{item.studentId}</Text>
                </View>
                <Text accessible={false} style={styles.chevron}>›</Text>
              </Pressable>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  subtitle: { flex: 1 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  emptyList: { flexGrow: 1 },
  row: { minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, borderRadius: 12 },
  rowText: { flex: 1, minWidth: 0, gap: 4 },
  name: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: colors.text },
  chevron: { fontSize: 24, color: colors.muted, paddingRight: 4 },
  pressed: { backgroundColor: colors.background },
  separator: { height: 1, backgroundColor: colors.border },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 80 },
  emptyTitle: { fontSize: 18, lineHeight: 26, fontWeight: '600', color: colors.text },
  emptyDescription: { fontSize: 14, lineHeight: 22, color: colors.muted, textAlign: 'center', maxWidth: 280 },
});
