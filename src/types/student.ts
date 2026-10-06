export type Student = {
  id: string;
  name: string;
  studentId: string;
  email: string;
  avatarUri: string;
};

export type StudentDraft = Omit<Student, 'id'>;
export type FieldErrors = Partial<Record<'name' | 'studentId' | 'email' | 'avatarUrl',
  'nameRequired' | 'studentIdInvalid' | 'studentIdDuplicate' | 'emailRequired' | 'emailInvalid' | 'avatarUrlInvalid'>>;

export type OperationErrorCode = 'storageNotReady' | 'storageBusy' | 'saveFailed' | 'studentNotFound' | 'studentIdDuplicate' | 'photoPermissionDenied' | 'photoSaveFailed';

export class OperationError extends Error {
  constructor(public readonly code: OperationErrorCode) {
    super(code);
  }
}
