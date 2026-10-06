const assert = require('node:assert/strict');
const test = require('node:test');
const { loadSource } = require('./load-source.cjs');
const student = { id: 'stable-id', name: 'Phan Văn Hiếu', studentId: 'BIT240094', email: 'hieu@example.com', avatarUri: 'file:///documents/student-avatars/photo.jpg' };

function storageMock() {
  let saved = null;
  let writes = 0;
  const api = { getItem: async () => saved, setItem: async (_key, value) => { writes++; saved = value; } };
  const storage = loadSource('src/storage/student-storage.ts', { '@react-native-async-storage/async-storage': { __esModule: true, default: api } });
  return { storage, api, set: (value) => { saved = value; }, getWrites: () => writes };
}

test('initial read never writes; persisted IDs and local avatar URIs survive another read', async () => {
  const { storage, getWrites } = storageMock();
  assert.deepEqual(await storage.loadStudents(), []);
  assert.equal(getWrites(), 0);
  await storage.saveStudents([student]);
  assert.deepEqual(await storage.loadStudents(), [student]);
  assert.equal(getWrites(), 1);
});
test('corrupted saved data is rejected without overwriting it', async () => {
  const { storage, set, getWrites } = storageMock();
  for (const value of ['broken JSON', '{}', '[{"id": "missing-fields"}]', JSON.stringify([student, student])]) {
    set(value);
    await assert.rejects(storage.loadStudents());
  }
  assert.equal(getWrites(), 0);
});
test('read and write errors propagate to the caller', async () => {
  const { storage, api } = storageMock();
  api.getItem = async () => { throw new Error('Read denied'); };
  api.setItem = async () => { throw new Error('Storage full'); };
  await assert.rejects(storage.loadStudents(), /Read denied/);
  await assert.rejects(storage.saveStudents([student]), /Storage full/);
});
