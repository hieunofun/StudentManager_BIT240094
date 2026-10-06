import type { FieldErrors, Student, StudentDraft } from '@/types/student';

export const STUDENT_ID_PATTERN = /^B[A-Z]{2}(2[2-6])[0-9]{4}$/;

export function normalizeStudent(draft: StudentDraft): StudentDraft {
  return {
    name: draft.name.trim(),
    studentId: draft.studentId.trim(),
    email: draft.email.trim(),
    avatarUri: draft.avatarUri.trim(),
  };
}

export function isAvatarUrlValid(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const url = new URL(value.trim());
    return (url.protocol === 'http:' || url.protocol === 'https:') && !!url.hostname;
  } catch {
    return false;
  }
}

export function validateStudent(draft: StudentDraft, students: Student[], editingId?: string): FieldErrors {
  const value = normalizeStudent(draft);
  const errors: FieldErrors = {};
  if (!value.name) errors.name = 'nameRequired';
  if (!STUDENT_ID_PATTERN.test(value.studentId)) errors.studentId = 'studentIdInvalid';
  else if (students.some((student) => student.id !== editingId && student.studentId === value.studentId)) {
    errors.studentId = 'studentIdDuplicate';
  }
  if (!value.email) errors.email = 'emailRequired';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) errors.email = 'emailInvalid';
  return errors;
}

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
