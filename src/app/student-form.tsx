import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { DataState } from '@/components/data-state';
import { StudentForm } from '@/components/student-form';
import { layout } from '@/constants/theme';
import { useLocale } from '@/contexts/locale-context';
import { useStudents } from '@/contexts/student-context';

export default function StudentFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { students, status } = useStudents();
  const { t } = useLocale();
  const student = students.find((item) => item.id === id);

  if (status !== 'ready') return <SafeAreaView style={layout.screen}><DataState /></SafeAreaView>;
  if (id && !student) {
    return (
      <SafeAreaView style={layout.screen}>
        <View style={layout.header}>
          <Button title={t('back')} variant="outline" onPress={() => router.dismissTo('/')} />
          <Text style={layout.error}>{t('studentNotFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }
  // Mount after storage loads; language changes keep the unsaved draft.
  return <StudentForm key={id ?? 'new'} student={student} />;
}
