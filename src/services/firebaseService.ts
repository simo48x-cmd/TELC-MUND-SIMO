import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDocFromServer,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CEFRLevel, PlanDuration, StudioTheme, UserProgressState } from '../types';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map((provider) => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

void testConnection();

const LOCAL_STORAGE_KEY = 'telc_b2_mohammed_progress_v1';

export const DEFAULT_USER_PROGRESS: UserProgressState = {
  currentLevel: 'A0/A1',
  xp: 250,
  streak: 5,
  planDuration: 60,
  currentDay: 1,
  theme: 'midnight',
  masteredSlotIds: ['1-s1', '1-s2', '1-s4', '18-s1'],
  reviewSlotIds: ['1-s5'],
  completedTeil2Exams: [1],
  completedTeil3Topics: [1],
  unlockedCertificates: [],
  scratchpadNotes: 'Teil 2 (#1 Fast Food):\n- Smiya: Fast Food im Alltag\n- Fikra 1: dass viele Menschen wegen Zeitmangel oft zu Fast Food greifen\n- Vorteil: dass es schnell geht und im Alltag viel Zeit spart\n- Nachteil: dass es zu viel Fett und Zucker enthält\n\nTeil 3 (#1 Sportfest):\n- Wann: Samstag 10 Uhr\n- Wo: Stadtpark / Sporthalle\n- Essen: Gesundes Obst & Wasser'
};

export function loadLocalProgress(): UserProgressState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_USER_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<UserProgressState>;
    return {
      ...DEFAULT_USER_PROGRESS,
      ...parsed,
      masteredSlotIds: Array.isArray(parsed.masteredSlotIds) ? parsed.masteredSlotIds : DEFAULT_USER_PROGRESS.masteredSlotIds,
      reviewSlotIds: Array.isArray(parsed.reviewSlotIds) ? parsed.reviewSlotIds : DEFAULT_USER_PROGRESS.reviewSlotIds,
      completedTeil2Exams: Array.isArray(parsed.completedTeil2Exams) ? parsed.completedTeil2Exams : DEFAULT_USER_PROGRESS.completedTeil2Exams,
      completedTeil3Topics: Array.isArray(parsed.completedTeil3Topics) ? parsed.completedTeil3Topics : DEFAULT_USER_PROGRESS.completedTeil3Topics,
      unlockedCertificates: Array.isArray(parsed.unlockedCertificates) ? parsed.unlockedCertificates : DEFAULT_USER_PROGRESS.unlockedCertificates,
    };
  } catch {
    return { ...DEFAULT_USER_PROGRESS };
  }
}

export function saveLocalProgress(state: UserProgressState): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save progress to localStorage:', e);
  }
}

export async function signInWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function logOutFirebase(): Promise<void> {
  await signOut(auth);
}

export function observeAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function syncProgressToFirestore(state: UserProgressState): Promise<void> {
  saveLocalProgress(state);
  const user = auth.currentUser;
  if (!user) return;

  const path = `userProgress/${user.uid}`;
  const docRef = doc(db, 'userProgress', user.uid);
  try {
    const existing = await getDoc(docRef);
    const payload: Record<string, unknown> = {
      uid: user.uid,
      displayName: (user.displayName || 'Mohammed El Jebouri').slice(0, 99),
      currentLevel: state.currentLevel as CEFRLevel,
      xp: Math.max(0, Math.min(999999, Math.round(state.xp))),
      streak: Math.max(0, Math.min(3650, Math.round(state.streak))),
      planDuration: (state.planDuration === 45 ? 45 : 60) as PlanDuration,
      currentDay: Math.max(1, Math.min(60, Math.round(state.currentDay))),
      theme: (['midnight', 'paper', 'daylight'].includes(state.theme) ? state.theme : 'midnight') as StudioTheme,
      masteredSlotIds: state.masteredSlotIds.slice(0, 499),
      reviewSlotIds: state.reviewSlotIds.slice(0, 499),
      completedTeil2Exams: state.completedTeil2Exams.slice(0, 99),
      completedTeil3Topics: state.completedTeil3Topics.slice(0, 99),
      unlockedCertificates: state.unlockedCertificates.slice(0, 9),
      scratchpadNotes: (state.scratchpadNotes || '').slice(0, 4999),
      updatedAt: serverTimestamp()
    };

    if (!existing.exists()) {
      payload.createdAt = serverTimestamp();
    } else {
      const existingData = existing.data();
      if (existingData?.createdAt) {
        payload.createdAt = existingData.createdAt;
      } else {
        payload.createdAt = serverTimestamp();
      }
    }

    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToCloudProgress(
  userId: string,
  onUpdate: (cloudState: Partial<UserProgressState>) => void
): () => void {
  const path = `userProgress/${userId}`;
  const docRef = doc(db, 'userProgress', userId);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onUpdate({
          currentLevel: data.currentLevel,
          xp: data.xp,
          streak: data.streak,
          planDuration: data.planDuration,
          currentDay: data.currentDay,
          theme: data.theme,
          masteredSlotIds: data.masteredSlotIds,
          reviewSlotIds: data.reviewSlotIds,
          completedTeil2Exams: data.completedTeil2Exams,
          completedTeil3Topics: data.completedTeil3Topics,
          unlockedCertificates: data.unlockedCertificates,
          scratchpadNotes: data.scratchpadNotes
        });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function recordPracticeSession(params: {
  moduleType: 'teil1' | 'teil2' | 'teil3' | 'interview' | 'certification';
  topicTitle: string;
  score: number;
  feedbackSummary: string;
}): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const path = `userProgress/${user.uid}/sessions`;
  try {
    await addDoc(collection(db, 'userProgress', user.uid, 'sessions'), {
      uid: user.uid,
      moduleType: params.moduleType,
      topicTitle: params.topicTitle.slice(0, 199),
      score: Math.max(0, Math.min(100, Math.round(params.score))),
      feedbackSummary: params.feedbackSummary.slice(0, 1999),
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToPracticeSessions(
  userId: string,
  onSessions: (sessions: Array<{ id: string; moduleType: string; topicTitle: string; score: number; feedbackSummary: string }>) => void
): () => void {
  const path = `userProgress/${userId}/sessions`;
  const q = query(collection(db, 'userProgress', userId, 'sessions'), orderBy('createdAt', 'desc'), limit(10));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        moduleType: String(d.data().moduleType || 'teil2'),
        topicTitle: String(d.data().topicTitle || ''),
        score: Number(d.data().score || 0),
        feedbackSummary: String(d.data().feedbackSummary || '')
      }));
      onSessions(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}
