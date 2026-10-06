import { Modal, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { colors, layout } from '@/constants/theme';
import { useLocale } from '@/contexts/locale-context';

type Props = {
  visible: boolean;
  message: string;
  onNo: () => void;
  onYes: () => void;
  busy?: boolean;
  destructive?: boolean;
};

export function ConfirmationDialog({ visible, message, onNo, onYes, busy = false, destructive = false }: Props) {
  const { t } = useLocale();
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={() => { if (!busy) onNo(); }}>
      <View style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text style={styles.title}>{t('confirmation')}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={layout.actions}>
            <Button title={t('no')} onPress={onNo} disabled={busy} variant="outline" style={layout.action} />
            <Button title={t('yes')} onPress={onYes} disabled={busy} variant={destructive ? 'danger' : 'primary'} style={layout.action} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  dialog: { width: '100%', maxWidth: 360, padding: 24, gap: 20, borderRadius: 16, backgroundColor: colors.surface },
  title: { fontSize: 18, lineHeight: 26, fontWeight: '600', color: colors.text },
  message: { fontSize: 16, lineHeight: 24, color: colors.text },
});
