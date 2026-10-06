const assert = require('node:assert/strict');
const test = require('node:test');
const { loadSource } = require('./load-source.cjs');
const { STUDENT_ID_PATTERN, normalizeStudent, validateStudent, isAvatarUrlValid } = loadSource('src/utils/validation.ts');
const draft = { name: 'Phan Văn Hiếu', studentId: 'BIT240094', email: 'hieu@example.com', avatarUri: '' };

for (const studentId of ['BIT240094', 'BAA220000', 'BZZ269999']) {
  test(`accept ${studentId}`, () => assert.equal(STUDENT_ID_PATTERN.test(studentId), true));
}
for (const studentId of ['AIT240094', 'Bit240094', 'BIT210094', 'BIT270094', 'BIT24009']) {
  test(`reject ${studentId}`, () => assert.equal(STUDENT_ID_PATTERN.test(studentId), false));
}
test('trim all stored fields and reject whitespace-only required values', () => {
  assert.deepEqual(normalizeStudent({ ...draft, name: ' Phan Văn Hiếu ', studentId: ' BIT240094 ', email: ' hieu@example.com ', avatarUri: ' https://example.com/photo.jpg ' }), { ...draft, avatarUri: 'https://example.com/photo.jpg' });
  assert.deepEqual(validateStudent({ ...draft, name: ' ', studentId: ' ', email: ' ' }, []), { name: 'nameRequired', studentId: 'studentIdInvalid', email: 'emailRequired' });
});
test('reject malformed emails; allow common email formats', () => {
  for (const email of ['hieu', 'hieu@', 'hieu@example', 'hieu @example.com', 'a@@example.com']) {
    assert.equal(validateStudent({ ...draft, email }, []).email, 'emailInvalid');
  }
  assert.deepEqual(validateStudent({ ...draft, email: 'hieu+student@example.com.vn' }, []), {});
});
test('reject duplicate student IDs, excluding the same record during edit', () => {
  const students = [{ ...draft, id: 'stable-id' }];
  assert.equal(validateStudent(draft, students).studentId, 'studentIdDuplicate');
  assert.deepEqual(validateStudent(draft, students, 'stable-id'), {});
  assert.equal(validateStudent(draft, students, 'another-id').studentId, 'studentIdDuplicate');
});
test('avatar is optional; only valid HTTP/HTTPS URLs can be entered', () => {
  for (const value of ['', ' https://example.com/photo.jpg ', 'http://example.com/avatar']) assert.equal(isAvatarUrlValid(value), true);
  for (const value of ['avatar.png', 'https://', 'file:///photo.jpg', 'ftp://example.com/photo', 'javascript:alert(1)']) assert.equal(isAvatarUrlValid(value), false);
});
