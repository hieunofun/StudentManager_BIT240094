import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { useLocale } from '@/contexts/locale-context';
import { useStudents } from '@/contexts/student-context';

export function SuccessNotice() {
  const { notice } = useStudents();
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  const [opacity] = useState(() => new Animated.Value(0));
  useEffect(() => {
    opacity.setValue(0);
    if (notice) Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  }, [notice, opacity]);
  if (!notice) return null;
  return (
    <Animated.View pointerEvents="none" style={[styles.notice, { bottom: insets.bottom + 16, opacity }]}>
      <Text accessibilityLiveRegion="polite" style={styles.text}>{t(notice)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  notice: { position: 'absolute', alignSelf: 'center', maxWidth: '90%', backgroundColor: colors.successBackground, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16 },
  text: { fontSize: 14, lineHeight: 20, color: colors.success },
});
