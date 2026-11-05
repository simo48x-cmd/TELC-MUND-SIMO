export type ThemeMode = 'midnight' | 'paper' | 'daylight';
export type StudioTheme = ThemeMode;
export type PlanMode = '45' | '60';
export type PlanDuration = 45 | 60;
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2';
export type CEFRLevel = 'A0/A1' | 'A2' | 'B1' | 'B2';
export type SlotMemorizationMode = 'builder' | 'scanner' | 'recall' | 'voice';
export type SlotInteractionMode = SlotMemorizationMode;
export type PartnerPersona = 'friendly' | 'shy' | 'dominant';

export interface UserProgressState {
  currentLevel: CEFRLevel;
  xp: number;
  streak: number;
  planDuration: PlanDuration;
  currentDay: number;
  theme: StudioTheme;
  masteredSlotIds: string[];
  reviewSlotIds: string[];
  completedTeil2Exams: number[];
  completedTeil3Topics: number[];
  unlockedCertificates: string[];
  scratchpadNotes: string;
}

export interface Teil2SlotItem {
  slotIndex: 1 | 2 | 3 | 4 | 5 | 6;
  slotLabelDe: string;
  slotLabelDarija: string;
  sourceTag: string;
  germanText: string;
  darijaHint: string;
  finalVerb: string;
  paperSentenceOriginal: string;
}

export interface Teil2Exam {
  id: number;
  title: string;
  category: string;
  slot1Smiya: string;
  slot2Fikra1: string;
  slot2Darija: string;
  slot3Fikra2: string;
  slot3Darija: string;
  slot4Ijabia: string;
  slot4Darija: string;
  slot5Salbia: string;
  slot5Darija: string;
  slot6Maghrib: string;
  slot6Darija: string;
  paperTextDe: string[];
}

export interface IdeaCardItem {
  id: string;
  slotIndex: number;
  labelBadge: string;
  germanClause: string;
  darijaHint: string;
  finalVerb: string;
  isDistractor: boolean;
}

export interface Teil3Topic {
  id: number;
  category: string;
  categoryColor: string;
  titleDe: string;
  titleDarija: string;
  dkhlaSlotAccusative: string;
  khatimaSlotNominative: string;
  herzPoint1De: string;
  herzPoint1Darija: string;
  herzPoint2De: string;
  herzPoint2Darija: string;
  recommendedJokerNumbers: number[];
}

export interface Teil3PlanningPoint {
  number: number;
  titleDe: string;
  titleDarija: string;
  directA2Question: string;
  directA2Answer: string;
  indirectB2Question: string;
  strongB2Answer: string;
  darijaTip: string;
}

export interface Teil1Step {
  stepNumber: number;
  titleSpin: string;
  titleDe: string;
  germanText: string;
  darijaText: string;
  highlightedSlots: string[];
}

export interface Teil1QA {
  id: number;
  questionDe: string;
  questionDarija: string;
  answerDe: string;
  answerDarija: string;
}

export interface Teil1BackupTemplate {
  id: string;
  topicNameDe: string;
  topicNameDarija: string;
  slotDefaultValue: string;
  einleitungDe: string;
  warumDe: string;
  detailsDe: string;
  fazitDe: string;
  darijaSummary: string;
}

export interface CertificationExam {
  id: string;
  fromLevel: CEFRLevel;
  toLevel: CEFRLevel;
  titleDe: string;
  titleDarija: string;
  passingScore: number;
  certificateBadgeDarija: string;
  questions: Array<{
    id: string;
    promptDe: string;
    promptDarija: string;
    options: string[];
    correctIndex: number;
    explanationDarija: string;
  }>;
}

export interface StudyDayPlan {
  day: number;
  intenseDay45: number;
  level: CEFRLevel;
  titleDe: string;
  titleDarija: string;
  pronunciationTask: string;
  slotMemoryTask: string;
  speakingSimTask: string;
}

export interface JobInterviewQuestion {
  id: number;
  questionDe: string;
  questionDarija: string;
  simpleA2B1Answer: string;
  strongB2Answer: string;
  darijaCoachTip: string;
  keyVocabulary: Array<{ word: string; meaningDarija: string }>;
}
