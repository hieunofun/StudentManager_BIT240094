import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/constants/theme';

type Props = TextInputProps & { label: string; error?: string; required?: boolean };

export function TextField({ label, error, required = false, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}{required && <Text style={styles.required}> *</Text>}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, focused && styles.focused, !!error && styles.invalid]}
      />
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  label: { color: colors.text, fontSize: 14, lineHeight: 20, fontWeight: '500' },
  required: { color: colors.error },
  input: { minHeight: 44, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.border, borderRadius: 12, fontSize: 16, lineHeight: 22, color: colors.text, backgroundColor: colors.surface },
  focused: { borderColor: colors.primary },
  invalid: { borderColor: colors.error },
  error: { color: colors.error, fontSize: 14, lineHeight: 20 },
});
