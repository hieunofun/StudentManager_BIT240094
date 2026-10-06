import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Student } from '@/types/student';

export const STORAGE_KEY = '@StudentManager_BIT240094/students';

function isStudent(value: unknown): value is Student {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return ['id', 'name', 'studentId', 'email', 'avatarUri'].every((key) => typeof record[key] === 'string');
}

export async function loadStudents(): Promise<Student[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored === null) return [];
  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed) || !parsed.every(isStudent) || new Set(parsed.map((student) => student.id)).size !== parsed.length) {
    throw new Error('Invalid local student data');
  }
  return parsed;
}

export async function saveStudents(students: Student[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}
