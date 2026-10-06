import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { DataState } from '@/components/data-state';
import { TextField } from '@/components/text-field';
import { layout } from '@/constants/theme';
import { useLocale } from '@/contexts/locale-context';
import { useStudents } from '@/contexts/student-context';
import { OperationError, type FieldErrors, type Student, type StudentDraft } from '@/types/student';
import { chooseAvatar } from '@/utils/avatar-picker';
import { isAvatarUrlValid, normalizeStudent, validateStudent } from '@/utils/validation';

export function StudentForm({ student }: { student?: Student }) {
  const id = student?.id;
  const { students, status, add, update } = useStudents();
  const { t } = useLocale();
  const editing = !!id;
  const [name, setName] = useState(student?.name ?? '');
  const [studentId, setStudentId] = useState(student?.studentId ?? '');
  const [email, setEmail] = useState(student?.email ?? '');
  const initialUri = student?.avatarUri ?? '';
  const [avatarUrl, setAvatarUrl] = useState(/^https?:\/\//i.test(initialUri) ? initialUri : '');
  const [localAvatar, setLocalAvatar] = useState(/^https?:\/\//i.test(initialUri) ? '' : initialUri);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [operationError, setOperationError] = useState<OperationError['code'] | null>(null);
  const [pendingDraft, setPendingDraft] = useState<StudentDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [choosingPhoto, setChoosingPhoto] = useState(false);
  const submitting = useRef(false);
  const picking = useRef(false);
  const avatarUri = avatarUrl.trim() || localAvatar;
  const busy = saving || choosingPhoto;

  function clearError(field: keyof FieldErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setOperationError(null);
  }

  function leaveForm() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  async function pickPhoto() {
    if (picking.current || submitting.current) return;
    picking.current = true;
    setChoosingPhoto(true);
    setOperationError(null);
    try {
      const uri = await chooseAvatar();
      if (uri) {
        setLocalAvatar(uri);
        setAvatarUrl('');
        clearError('avatarUrl');
      }
    } catch (failure) {
      setOperationError(failure instanceof OperationError ? failure.code : 'photoSaveFailed');
    } finally {
      picking.current = false;
      setChoosingPhoto(false);
    }
  }

  async function persistStudent(draft: StudentDraft) {
    if (submitting.current || picking.current || status !== 'ready') return;
    submitting.current = true;
    setSaving(true);
    setOperationError(null);
    try {
      if (id) {
        await update(id, draft);
        setPendingDraft(null);
        router.dismissTo({ pathname: '/student/[id]', params: { id } });
      } else {
        const created = await add(draft);
        router.replace({ pathname: '/student/[id]', params: { id: created.id } });
      }
    } catch (failure) {
      setPendingDraft(null);
      setOperationError(failure instanceof OperationError ? failure.code : 'saveFailed');
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  function saveForm() {
    if (submitting.current || picking.current || status !== 'ready') return;
    const draft = normalizeStudent({ name, studentId, email, avatarUri });
    const fieldErrors = validateStudent(draft, students, id);
    if (!isAvatarUrlValid(avatarUrl)) fieldErrors.avatarUrl = 'avatarUrlInvalid';
    setErrors(fieldErrors);
    setOperationError(null);
    if (Object.keys(fieldErrors).length) return;
    if (editing) setPendingDraft(draft);
    else void persistStudent(draft);
  }

  return (
    <SafeAreaView style={layout.screen}>
      <KeyboardAvoidingView style={layout.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={layout.header}>
          <View style={styles.back}><Button title={t('back')} variant="outline" disabled={busy} onPress={leaveForm} /></View>
          <Text style={layout.title}>{t(editing ? 'editTitle' : 'addTitle')}</Text>
        </View>
        {status !== 'ready' ? <DataState /> : editing && !student ?
          <View style={layout.content}><Text style={layout.error}>{t('studentNotFound')}</Text></View> :
          <ScrollView contentContainerStyle={layout.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
            <Text style={layout.subtitle}>{t('requiredHint')}</Text>
            <TextField label={t('name')} required placeholder={t('namePlaceholder')} value={name} editable={!busy} onChangeText={(value) => { setName(value); clearError('name'); }} error={errors.name && t(errors.name)} autoCapitalize="words" />
            <TextField label={t('studentId')} required placeholder={t('studentIdPlaceholder')} value={studentId} editable={!busy} onChangeText={(value) => { setStudentId(value); clearError('studentId'); }} error={errors.studentId && t(errors.studentId)} autoCapitalize="characters" autoCorrect={false} />
            <TextField label={t('email')} required placeholder={t('emailPlaceholder')} value={email} editable={!busy} onChangeText={(value) => { setEmail(value); clearError('email'); }} error={errors.email && t(errors.email)} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            <View style={styles.avatarSection}>
              <Avatar uri={avatarUri} size={80} />
              <Button title={t(choosingPhoto ? 'choosingPhoto' : 'choosePhoto')} variant="outline" disabled={busy} onPress={() => { void pickPhoto(); }} />
              {!!avatarUri && <Button title={t('removePhoto')} variant="outline" disabled={busy} onPress={() => { setLocalAvatar(''); setAvatarUrl(''); clearError('avatarUrl'); }} />}
            </View>
            <TextField label={t('avatarUrl')} placeholder={t('avatarPlaceholder')} value={avatarUrl} editable={!busy} onChangeText={(value) => { setAvatarUrl(value); if (value.trim()) setLocalAvatar(''); clearError('avatarUrl'); }} error={errors.avatarUrl && t(errors.avatarUrl)} keyboardType="url" autoCapitalize="none" autoCorrect={false} />
            {!!operationError && <Text accessibilityRole="alert" style={layout.error}>{t(operationError)}</Text>}
            <View style={layout.actions}>
              <Button title={t('cancel')} variant="outline" disabled={busy} onPress={leaveForm} style={layout.action} />
              <Button title={t(saving ? 'saving' : 'save')} disabled={busy} onPress={saveForm} style={layout.action} />
            </View>
          </ScrollView>}
      </KeyboardAvoidingView>
      <ConfirmationDialog visible={!!pendingDraft} message={t('confirmEdit')} onNo={() => setPendingDraft(null)} onYes={() => { if (pendingDraft) void persistStudent(pendingDraft); }} busy={saving} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start' },
  avatarSection: { alignItems: 'center', gap: 12 },
});
