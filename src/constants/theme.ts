import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#181818', primaryPressed: '#2e2e2e', text: '#2c2c2c', muted: '#707070',
  background: '#f4f4f6', surface: '#ffffff', border: '#eaeaea', secondary: '#e7e8ec',
  danger: '#c70036', error: '#e7000b', success: '#007a55', successBackground: '#ecfdf5',
};

export const layout = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  container: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center' },
  header: { padding: 20, gap: 12 },
  title: { fontSize: 24, lineHeight: 32, fontWeight: '600', color: colors.text },
  subtitle: { fontSize: 14, lineHeight: 20, color: colors.muted },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 24 },
  actions: { flexDirection: 'row', gap: 12 },
  action: { flex: 1 },
  error: { fontSize: 14, lineHeight: 20, color: colors.error },
});
