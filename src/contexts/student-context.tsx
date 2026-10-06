import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { loadStudents, saveStudents } from '@/storage/student-storage';
import { OperationError, type Student, type StudentDraft } from '@/types/student';
import { createId, normalizeStudent } from '@/utils/validation';

type Notice = 'added' | 'updated' | 'deleted';
type StudentContextValue = {
  students: Student[];
  status: 'loading' | 'ready' | 'error';
  notice: Notice | null;
  reload: () => Promise<void>;
  add: (draft: StudentDraft) => Promise<Student>;
  update: (id: string, draft: StudentDraft) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

const StudentContext = createContext<StudentContextValue | null>(null);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [status, setStatus] = useState<StudentContextValue['status']>('loading');
  const [notice, setNotice] = useState<Notice | null>(null);
  const storedStudents = useRef<Student[]>([]);
  const ready = useRef(false);
  const saving = useRef(false);
  const reading = useRef(false);

  const reload = useCallback(async () => {
    if (reading.current || saving.current) return;
    reading.current = true;
    ready.current = false;
    setStatus('loading');
    try {
      const data = await loadStudents();
      storedStudents.current = data;
      setStudents(data);
      ready.current = true;
      setStatus('ready');
    } catch {
      setStatus('error');
    } finally {
      reading.current = false;
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { void reload(); }, 0);
    return () => clearTimeout(timer);
  }, [reload]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  async function commitChange(change: (current: Student[]) => Student[], success: Notice) {
    if (!ready.current) throw new OperationError('storageNotReady');
    if (saving.current) throw new OperationError('storageBusy');
    saving.current = true;
    setNotice(null);
    try {
      const next = change(storedStudents.current);
      try {
        await saveStudents(next);
      } catch {
        throw new OperationError('saveFailed');
      }
      storedStudents.current = next;
      setStudents(next);
      setNotice(success);
    } finally {
      saving.current = false;
    }
  }

  async function add(draft: StudentDraft) {
    const value = normalizeStudent(draft);
    const student = { ...value, id: createId() };
    await commitChange((current) => {
      if (current.some((item) => item.studentId === value.studentId)) throw new OperationError('studentIdDuplicate');
      return [...current, student];
    }, 'added');
    return student;
  }

  async function update(id: string, draft: StudentDraft) {
    const value = normalizeStudent(draft);
    await commitChange((current) => {
      if (!current.some((item) => item.id === id)) throw new OperationError('studentNotFound');
      if (current.some((item) => item.id !== id && item.studentId === value.studentId)) throw new OperationError('studentIdDuplicate');
      return current.map((item) => item.id === id ? { ...value, id } : item);
    }, 'updated');
  }

  async function remove(id: string) {
    await commitChange((current) => {
      if (!current.some((item) => item.id === id)) throw new OperationError('studentNotFound');
      return current.filter((item) => item.id !== id);
    }, 'deleted');
  }

  return <StudentContext.Provider value={{ students, status, notice, reload, add, update, remove }}>{children}</StudentContext.Provider>;
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) throw new Error('StudentProvider is missing');
  return context;
}
