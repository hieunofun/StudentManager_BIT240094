import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import { OperationError } from '@/types/student';
import { createId } from '@/utils/validation';

export async function chooseAvatar(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new OperationError('photoPermissionDenied');
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
  if (result.canceled || !result.assets?.length) return null;
  try {
    const asset = result.assets[0];
    const directory = new Directory(Paths.document, 'student-avatars');
    directory.create({ intermediates: true, idempotent: true });
    const extension = asset.fileName?.split('.').pop()?.toLowerCase();
    const suffix = extension && /^[a-z0-9]{1,5}$/.test(extension) ? extension : 'jpg';
    const destination = new File(directory, `${createId()}.${suffix}`);
    await new File(asset.uri).copy(destination);
    return destination.uri;
  } catch {
    throw new OperationError('photoSaveFailed');
  }
}
