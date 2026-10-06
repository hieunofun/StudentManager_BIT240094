const assert = require('node:assert/strict');
const test = require('node:test');
const { loadSource } = require('./load-source.cjs');

function pickerMock({ granted = true, canceled = false, copyFails = false } = {}) {
  let launches = 0;
  let copied = false;
  let copyTarget = '';
  class Directory {
    constructor(root, name) { this.uri = `${root}/${name}`; }
    create() {}
  }
  class File {
    constructor(parent, name) { this.uri = name ? `${parent.uri}/${name}` : parent; }
    async copy(destination) {
      // Ensure chooseAvatar waits for the asynchronous SDK 57 copy before returning.
      await new Promise((resolve) => setTimeout(resolve, 10));
      if (copyFails) throw new Error('Disk full');
      copied = true;
      copyTarget = destination.uri;
    }
  }
  const picker = loadSource('src/utils/avatar-picker.ts', {
    'expo-image-picker': {
      requestMediaLibraryPermissionsAsync: async () => ({ granted }),
      launchImageLibraryAsync: async () => { launches++; return { canceled, assets: canceled ? null : [{ uri: 'file:///cache/photo.jpg', fileName: 'photo.jpg' }] }; },
    },
    'expo-file-system': { Directory, File, Paths: { document: 'file:///documents' } },
  });
  return { picker, launches: () => launches, copied: () => copied, target: () => copyTarget };
}
test('denied permission does not open the picker or copy a photo (mock native APIs)', async () => {
  const value = pickerMock({ granted: false });
  await assert.rejects(value.picker.chooseAvatar(), { code: 'photoPermissionDenied' });
  assert.equal(value.launches(), 0);
  assert.equal(value.copied(), false);
});
test('cancel returns null and does not copy a photo (mock native APIs)', async () => {
  const value = pickerMock({ canceled: true });
  assert.equal(await value.picker.chooseAvatar(), null);
  assert.equal(value.copied(), false);
});
test('copy is awaited and returns a documents URI, not a cache URI (mock native APIs)', async () => {
  const value = pickerMock();
  const uri = await value.picker.chooseAvatar();
  assert.equal(value.copied(), true);
  assert.equal(uri, value.target());
  assert.match(uri, /^file:\/\/\/documents\/student-avatars\/.+\.jpg$/);
});
test('copy failure rejects with a translated error key (mock native APIs)', async () => {
  const value = pickerMock({ copyFails: true });
  await assert.rejects(value.picker.chooseAvatar(), { code: 'photoSaveFailed' });
});
