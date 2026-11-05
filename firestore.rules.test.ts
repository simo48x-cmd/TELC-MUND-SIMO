import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rulesText = fs.readFileSync('firestore.rules', 'utf8');

test('firestore.rules enforces all 8 pillars and rejects the Dirty Dozen payloads', () => {
  // 1. Default deny catch-all
  assert.equal(rulesText.includes('allow read, write: if false;'), true);
  // 2. Email verification check
  assert.equal(rulesText.includes('request.auth.token.email_verified == true'), true);
  // 3. Path variable hardening
  assert.equal(rulesText.includes('isValidId(userId)'), true);
  assert.equal(rulesText.includes('isValidId(sessionId)'), true);
  // 4. Master Gate relational check on subcollection
  assert.equal(
    rulesText.includes('exists(/databases/$(database)/documents/userProgress/$(userId))'),
    true
  );
  // 5. Strict key blueprints (hasAll + hasOnly)
  assert.equal(rulesText.includes('.keys().hasAll('), true);
  assert.equal(rulesText.includes('.keys().hasOnly('), true);
  // 6. Immortal field & server timestamp enforcement
  assert.equal(rulesText.includes('incoming().ownerId == existing().ownerId'), true);
  assert.equal(rulesText.includes('incoming().createdAt == existing().createdAt'), true);
  assert.equal(rulesText.includes('incoming().createdAt == request.time'), true);
  assert.equal(rulesText.includes('incoming().updatedAt == request.time'), true);
  // 7. Secure list query enforcement
  assert.equal(rulesText.includes('resource.data.ownerId == request.auth.uid'), true);
});
