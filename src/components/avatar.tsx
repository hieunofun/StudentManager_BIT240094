import { Image } from 'expo-image';
import { useState } from 'react';

import { colors } from '@/constants/theme';
import { useLocale } from '@/contexts/locale-context';

const defaultAvatar = require('../../assets/images/default-avatar.png');

export function Avatar({ uri = '', size = 56 }: { uri?: string; size?: number }) {
  const { t } = useLocale();
  const [failedUri, setFailedUri] = useState('');

  return (
    <Image
      accessibilityLabel={t('avatar')}
      testID="student-avatar"
      source={uri && uri !== failedUri ? { uri } : defaultAvatar}
      placeholder={defaultAvatar}
      contentFit="cover"
      onError={() => setFailedUri(uri)}
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.background }}
    />
  );
}
