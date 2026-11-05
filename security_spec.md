# Security Specification — TELC B2 Mündlich & Karriere Master Pro

## 1. Data Invariants
1. **Global Default-Deny**: All paths not explicitly matched in `/userProgress/{userId}` and `/userProgress/{userId}/sessions/{sessionId}` are strictly denied (`allow read, write: if false;`).
2. **Verified Owner Isolation**: Only a signed-in user with `request.auth.token.email_verified == true` whose `request.auth.uid == userId` can read or write `/userProgress/{userId}`.
3. **Relational Parent Sync (Master Gate)**: A `PracticeSession` document under `/userProgress/{userId}/sessions/{sessionId}` can only be created or read if the parent `/userProgress/{userId}` document exists (`exists(/databases/$(database)/documents/userProgress/$(userId))`) and belongs to `request.auth.uid`.
4. **Strict Key & Type Blueprints**:
   - `UserProgress` requires and allows ONLY `['ownerId', 'displayName', 'currentLevel', 'xp', 'streak', 'planMode', 'theme', 'masteredSlotIds', 'completedDays', 'certifiedLevels', 'createdAt', 'updatedAt']`.
   - `PracticeSession` requires and allows ONLY `['ownerId', 'moduleType', 'examId', 'score', 'notes', 'createdAt']`.
5. **Temporal & Identity Immutability**: `ownerId` and `createdAt` are immutable on updates; `createdAt == request.time` on create and `updatedAt == request.time` on update.

## 2. The "Dirty Dozen" Payloads
1. **Payload 1 (Shadow Field Injection)**: `UserProgress` create with extra field `"isAdmin": true` -> `PERMISSION_DENIED`.
2. **Payload 2 (Identity Spoofing)**: Authenticated user `uid_A` creates `/userProgress/uid_A` with `ownerId: "uid_B"` -> `PERMISSION_DENIED`.
3. **Payload 3 (Unverified Email Spoof)**: User with `email_verified: false` attempts to create `/userProgress/uid_A` -> `PERMISSION_DENIED`.
4. **Payload 4 (Cross-User Read / PII Blanket)**: User `uid_B` attempts `get` or `list` on `/userProgress/uid_A` -> `PERMISSION_DENIED`.
5. **Payload 5 (ID Poisoning)**: Document ID exceeding 128 chars or containing invalid characters (`../hack`) -> `PERMISSION_DENIED`.
6. **Payload 6 (Value Poisoning on Update)**: Updating `xp` with a string `"1000000"` or negative integer -> `PERMISSION_DENIED`.
7. **Payload 7 (Unbounded Array Exhaustion)**: `masteredSlotIds` array with 500 elements (`> 300`) -> `PERMISSION_DENIED`.
8. **Payload 8 (Orphaned Subcollection Write)**: Creating `/userProgress/uid_A/sessions/s1` when `/userProgress/uid_A` does not exist -> `PERMISSION_DENIED`.
9. **Payload 9 (Timestamp Forgery)**: Setting `createdAt` to a past client timestamp instead of `request.time` -> `PERMISSION_DENIED`.
10. **Payload 10 (Immortal Field Mutation)**: Mutating `createdAt` or `ownerId` during `update` -> `PERMISSION_DENIED`.
11. **Payload 11 (Invalid Enum State)**: Setting `currentLevel` to `"C2"` (not in `['A1', 'A2', 'B1', 'B2']`) -> `PERMISSION_DENIED`.
12. **Payload 12 (Session Mutation)**: Attempting to update an immutable `PracticeSession` record after creation -> `PERMISSION_DENIED`.
