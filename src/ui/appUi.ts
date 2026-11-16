import { User } from 'firebase/auth';
import {
  CEFRLevel,
  CertificationExam,
  PartnerPersona,
  PlanDuration,
  SlotInteractionMode,
  StudioTheme,
  UserProgressState
} from '../types';
import {
  MOHAMMED_PROFILE,
  BIN_EL_OUIDANE_STEPS,
  BIN_EL_OUIDANE_QAS,
  TEIL1_BACKUP_TEMPLATES
} from '../data/teil1Data';
import {
  TEIL2_EXAMS,
  TEIL2_RONDE6_UNIVERSAL_JOKER,
  build6RoundsForExam
} from '../data/teil2Data';
import {
  TEIL3_METHODOLOGY_OVERVIEW,
  TEIL3_20_UNIVERSAL_POINTS,
  TEIL3_48_TOPICS,
  TEIL3_56_REDEMITTEL,
  TEIL3_KATEGORIE3_QA
} from '../data/teil3Data';
import {
  PHONETICS_RULES_A1,
  VERB_KICK_EXAMPLES_A2,
  LEVEL_PROGRESSION_META,
  LEVEL_CERTIFICATION_EXAMS,
  PLACEMENT_DIAGNOSTIC_QUESTIONS,
  STUDY_PLAN_60_DAYS
} from '../data/levelsAndPlanData';
import {
  WIRTSCHAFT_JOB_INTERVIEW_12_QAS,
  BIOSCIENCE_EXAM_LINKS
} from '../data/careerAndScienceData';
import {
  splitClauseFinalVerb,
  checkVerbAtEnd,
  buildDistractorWithMiddleVerb,
  transformDirectToIndirectQuestion,
  evaluateSlotSimilarity,
  getExpectedSentenceForTurn,
  getVoiceCallOpeningGreeting,
  getTeleprompterWhisperLevels,
  buildPostCallDiagnosticReport,
  PostCallDiagnosticReport,
  SimulatorTurnContext,
  splitGermanWordIntoSyllables,
  buildSelectionSyllableBreakdown,
  splitGermanTextIntoSentences,
  extractCleanWordsFromSelection,
  segmentExamPaperForLaserScanner,
  LaserSlotKey
} from '../utils/pingPongLogic';
import {
  sfx,
  speakGermanText,
  stopGermanSpeech,
  stopGermanAudio,
  playGermanSelection,
  translateDeToAr,
  HardWordEntry,
  loadHardWordsBank,
  saveHardWordToBank,
  removeHardWordFromBank,
  isWordInHardBank,
  QuickVoiceComparisonRecorder,
  speakGermanGeminiTts,
  startBrowserSpeechRecognition,
  fastGradeSlotSubmission,
  evaluateTurnWithStrictExaminer,
  queryGermanCareerSearch,
  fetchLiveProteinSummary
} from '../services/audioAndAiService';
import {
  loadLocalProgress,
  syncProgressToFirestore,
  signInWithGoogle,
  logOutFirebase,
  observeAuth,
  subscribeToCloudProgress,
  recordPracticeSession
} from '../services/firebaseService';
import { TelcSpatialScene } from '../xr/TelcSpatialScene';

type MainTab = 'teil2' | 'teil3' | 'teil1' | 'levels' | 'career' | 'xr3d';

interface AppUiRuntimeState {
  activeTab: MainTab;
  progress: UserProgressState;
  currentUser: User | null;

  // Teil 2 state
  selectedTeil2Id: number;
  teil2Search: string;
  slotMode: SlotInteractionMode;
  filledSlotsByExam: Record<number, Record<string, string>>;
  revealedBlurSlots: Record<string, boolean>;
  selectedBankSlotKey: string | null;
  distractorErrorMsg: string | null;
  useUniversalJokerRonde6: boolean;
  useUniversalMoroccoJokerRonde5: boolean;
  useVerbatimPaperPhotocopyMode: boolean;
  laserActiveSlotFilter: 'ALL' | LaserSlotKey;
  voiceActiveRound: number;
  voiceTranscript: string;
  voiceIsRecording: boolean;
  voiceFeedback: { score: number; verbOk: boolean; corrected: string; darija: string } | null;

  // Teil 3 state
  selectedTeil3Category: string;
  selectedTeil3Id: number;
  teil3Search: string;
  indirectTransformerActive: boolean;
  selectedJokerPointNumber: number;
  prepTimerSeconds: number;
  prepTimerRunning: boolean;
  teil3CheckedPointNumbers: number[];

  // Levels & Plan state
  activeCertExam: CertificationExam | null;
  certAnswers: Record<string, number>;
  certResult: { score: number; passed: boolean; badgeText: string } | null;
  showDiagnosticModal: boolean;
  diagnosticAnswers: Record<string, number>;
  selectedStudyLevelFilter: CEFRLevel | 'ALL';

  // Career & AI Simulator state
  selectedInterviewId: number;
  showB2InterviewVersion: Record<number, boolean>;
  simSubMode: 'chat' | 'call';
  aiSimMode: 'teil1' | 'teil2' | 'teil3' | 'interview';
  aiPersona: PartnerPersona;
  aiUserMessage: string;
  aiLoading: boolean;
  simHandsFreeMode: boolean;
  simIsListening: boolean;
  simSpeechLang: 'de-DE' | 'ar-MA';
  simAutoSendAfterSilence: boolean;
  simAutoSpeakReply: boolean;
  simSpeakSpeed: 0.85 | 1.0;
  simPartnerIsSpeaking: boolean;
  simHintVisible: boolean;
  simRoundNumber: number;
  simTurnScores: number[];
  aiConversation: Array<{
    sender: 'mohammed' | 'partner';
    textDe: string;
    darijaTip?: string;
    correction?: string;
    score?: number;
    cefrLevel?: '0' | 'A1' | 'A2' | 'B1' | 'B2';
    isSanityRejected?: boolean;
    correctedSentenceDe?: string;
    sauerstoff?: string;
    scorecard?: {
      ausdruck: number;
      aufgabe: number;
      korrektheit: number;
      aussprache: number;
      totalOutOf60: number;
      passed: boolean;
      summaryDarija: string;
    };
  }>;

  // Live AI Voice Call Studio state
  callState: 'IDLE' | 'AI_SPEAKING' | 'USER_LISTENING' | 'EVALUATING' | 'PAUSED' | 'ENDED';
  callAvatarRole: 'pruefer_markus' | 'partnerin_lisa' | 'hr_thomas';
  callDurationSeconds: number;
  callMicMuted: boolean;
  callLiveCaptionDe: string;
  callLastAiQuestionDe: string;
  callInstantToast: { badgeText: string; isPositive: boolean; detailDarija: string } | null;
  callTeleprompterOpen: boolean;
  callTeleprompterLevel: 1 | 2 | 3;
  callTurnsLog: Array<{
    userSaidDe: string;
    targetSentenceDe: string;
    scoreOutOf60: number;
    cefrLevel: string;
    darijaCritique: string;
    verbAtEndCorrect: boolean;
  }>;
  callReport: PostCallDiagnosticReport | null;

  careerSearchQuery: string;
  careerSearchResult: { text: string; sources: Array<{ uri: string; title: string }> } | null;
  careerSearchLoading: boolean;

  // 3D XR & Bioscience state
  xrRoundIndex: number;
  xrGameState: 'title' | 'playing' | 'paused' | 'gameover';
  selectedBioId: string;
  liveBioMetadata: Record<string, { sequenceLength: number; entryTitle: string; resolution: string; experimentalMethod: string }>;

  // Global Smart Selection & Click-Word Translator + Pronouncer Studio state
  selectionPopup: {
    visible: boolean;
    selectedText: string;
    syllables: string;
    translationAr: string;
    translationLoading: boolean;
    wordByWordList: Array<{ wordDe: string; syllables: string; meaningAr: string }>;
    wordByWordLoading: boolean;
    playingTag: string | null;
    isRecordingVoice: boolean;
    hasRecordedClip: boolean;
    savedToBank: boolean;
  };
  hardWordsBank: HardWordEntry[];
  showHardWordsModal: boolean;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderClauseWithGoldVerb(clause: string, explicitFinalVerb?: string): string {
  const { prefix, finalVerb, punctuation } = splitClauseFinalVerb(clause, explicitFinalVerb);
  if (!finalVerb) return `<span>${escapeHtml(clause)}</span>`;
  const prefixHtml = prefix ? `<span>${escapeHtml(prefix)} </span>` : '';
  return `${prefixHtml}<span class="verb-gold-badge inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/25 border border-amber-400 text-amber-300 font-bold font-mono-de" title="Verb am Ende (الفعل المصرف فـ آخر الجملة)">[${escapeHtml(finalVerb)}]</span><span>${escapeHtml(punctuation)}</span>`;
}

/**
 * Highlights `origVerb` inside `origSub` in a red badge so the student immediately sees
 * the exact verb inside the yellow-highlighted sentence in the real PDF text.
 */
function renderOrigSubWithRedVerb(origSub: string, origVerb: string): string {
  if (!origSub) return '';
  const cleanVerb = (origVerb || '').trim();
  if (!cleanVerb) return escapeHtml(origSub);

  const escapedVerbRegex = cleanVerb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const boundaryRegex = new RegExp(`(^|[^a-zA-ZäöüÄÖÜß])(${escapedVerbRegex})(?=$|[^a-zA-ZäöüÄÖÜß])`, 'i');
  const match = origSub.match(boundaryRegex);

  if (match && match.index !== undefined) {
    const startIdx = match.index + match[1].length;
    const endIdx = startIdx + match[2].length;
    const before = origSub.slice(0, startIdx);
    const matched = origSub.slice(startIdx, endIdx);
    const after = origSub.slice(endIdx);
    return `${escapeHtml(before)}<span class="orig-verb-red-badge inline-block px-1.5 py-0.5 mx-0.5 rounded bg-red-600 text-white font-extrabold font-mono-de shadow-sm" title="الفعل فـ الورقة الأصلية: ${escapeHtml(cleanVerb)}">${escapeHtml(matched)}</span>${escapeHtml(after)}`;
  }

  const lowerIdx = origSub.toLowerCase().indexOf(cleanVerb.toLowerCase());
  if (lowerIdx !== -1) {
    const before = origSub.slice(0, lowerIdx);
    const matched = origSub.slice(lowerIdx, lowerIdx + cleanVerb.length);
    const after = origSub.slice(lowerIdx + cleanVerb.length);
    return `${escapeHtml(before)}<span class="orig-verb-red-badge inline-block px-1.5 py-0.5 mx-0.5 rounded bg-red-600 text-white font-extrabold font-mono-de shadow-sm" title="الفعل فـ الورقة الأصلية: ${escapeHtml(cleanVerb)}">${escapeHtml(matched)}</span>${escapeHtml(after)}`;
  }

  return escapeHtml(origSub);
}

/**
 * Renders a German text with a subtle 🔊 button at the beginning of each individual sentence
 * so the student can click 🔊 next to any sentence to hear just that sentence!
 */
function renderSentencesWithInlineAudioButtons(rawGermanText: string): string {
  const sentences = splitGermanTextIntoSentences(rawGermanText);
  if (sentences.length === 0) return '';
  return sentences
    .map(
      (s, idx) =>
        `<span class="inline mr-1.5 leading-relaxed"><button type="button" data-action="play-single-sentence" data-sentence="${escapeHtml(
          s
        )}" title="اسمع نطق هذه الجملة فقط (1x)" aria-label="نطق الجملة ${
          idx + 1
        }" class="inline-flex items-center justify-center px-1.5 py-0.5 mr-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black text-[11px] font-bold transition cursor-pointer align-baseline">🔊</button><span class="selectable-german-sentence">${escapeHtml(
          s
        )}</span></span>`
    )
    .join(' ');
}

export class TelcMasterAppUI {
  private root: HTMLElement;
  private spatialScene: TelcSpatialScene | null = null;
  private state: AppUiRuntimeState;
  private prepInterval: number | null = null;
  private activeSpeechRec: { stop: () => void } | null = null;
  private simSpeechRec: { stop: () => void } | null = null;
  private simSilenceTimer: number | null = null;
  private callTimerInterval: number | null = null;
  private callSpeechRec: { stop: () => void } | null = null;
  private callSilenceTimer: number | null = null;
  private cloudUnsub: (() => void) | null = null;
  private quickRecorder = new QuickVoiceComparisonRecorder();

  constructor(root: HTMLElement, spatialScene: TelcSpatialScene | null = null) {
    this.root = root;
    this.spatialScene = spatialScene;
    const initialProgress = loadLocalProgress();

    // Auto-fill Exam #1 slots initially so Mohammed sees the full power immediately
    const exam1 = TEIL2_EXAMS[0];
    const initialFilled: Record<number, Record<string, string>> = {
      1: {
        slot1: exam1.slot1Theme,
        slot2: exam1.slot2Point1,
        slot3: exam1.slot3Point2,
        slot4: exam1.slot4Advantage,
        slot5: exam1.slot5Disadvantage,
        slot6: exam1.slot6Morocco
      }
    };

    const isAutostart = new URLSearchParams(window.location.search).get('autostart') === '1';

    this.state = {
      activeTab: 'teil2',
      progress: initialProgress,
      currentUser: null,

      selectedTeil2Id: 1,
      teil2Search: '',
      slotMode: 'builder',
      filledSlotsByExam: initialFilled,
      revealedBlurSlots: {},
      selectedBankSlotKey: null,
      distractorErrorMsg: null,
      useUniversalJokerRonde6: false,
      useUniversalMoroccoJokerRonde5: true,
      useVerbatimPaperPhotocopyMode: true,
      laserActiveSlotFilter: 'ALL',
      voiceActiveRound: 1,
      voiceTranscript: '',
      voiceIsRecording: false,
      voiceFeedback: null,

      selectedTeil3Category: 'ALL',
      selectedTeil3Id: 1,
      teil3Search: '',
      indirectTransformerActive: true,
      selectedJokerPointNumber: 1,
      prepTimerSeconds: 20 * 60,
      prepTimerRunning: false,
      teil3CheckedPointNumbers: [],

      activeCertExam: null,
      certAnswers: {},
      certResult: null,
      showDiagnosticModal: false,
      diagnosticAnswers: {},
      selectedStudyLevelFilter: 'ALL',

      selectedInterviewId: 1,
      showB2InterviewVersion: { 1: true, 2: true, 3: true },
      simSubMode: 'chat',
      aiSimMode: 'teil2',
      aiPersona: 'friendly',
      aiUserMessage: '',
      aiLoading: false,
      simHandsFreeMode: false,
      simIsListening: false,
      simSpeechLang: 'de-DE',
      simAutoSendAfterSilence: true,
      simAutoSpeakReply: true,
      simSpeakSpeed: 1.0,
      simPartnerIsSpeaking: false,
      simHintVisible: false,
      simRoundNumber: 1,
      simTurnScores: [],
      aiConversation: [
        {
          sender: 'partner',
          textDe: 'Hallo Mohammed! Lass uns mit Teil 2 (Thema #1: Fast Food kann süchtig machen) starten. Bitte sprich oder schreib deine Ronde 1 (Einleitung + Fikra 1 aus dem Text)!',
          darijaTip: '🎙️ برك على "هضر بصوتك" وقول الجولة 1: In meinem Text geht es um das Thema „Fast Food kann süchtig machen“. Der Autor erwähnt, dass...',
          correctedSentenceDe: `In meinem Text geht es um das Thema „${exam1.slot1Theme}“. Der Autor erwähnt, dass ${exam1.slot2Point1}. Was steht in deinem Text?`
        }
      ],

      callState: 'IDLE',
      callAvatarRole: 'partnerin_lisa',
      callDurationSeconds: 0,
      callMicMuted: false,
      callLiveCaptionDe: '',
      callLastAiQuestionDe: `Hallo Mohammed! Wir diskutieren heute über das Thema „${exam1.titleDe}“. Bitte beginne mit deiner Einleitung in Ronde 1!`,
      callInstantToast: null,
      callTeleprompterOpen: true,
      callTeleprompterLevel: 1,
      callTurnsLog: [],
      callReport: null,

      careerSearchQuery: 'Bachelor Wirtschaft Berufseinstieg Controlling Gehalt Deutschland',
      careerSearchResult: null,
      careerSearchLoading: false,

      xrRoundIndex: 0,
      xrGameState: isAutostart ? 'playing' : 'playing',
      selectedBioId: 'bio-dopamine',
      liveBioMetadata: {},

      selectionPopup: {
        visible: false,
        selectedText: '',
        syllables: '',
        translationAr: '',
        translationLoading: false,
        wordByWordList: [],
        wordByWordLoading: false,
        playingTag: null,
        isRecordingVoice: false,
        hasRecordedClip: false,
        savedToBank: false
      },
      hardWordsBank: loadHardWordsBank(),
      showHardWordsModal: false
    };

    this.applyThemeToDocument(this.state.progress.theme);
    this.syncBodyDatasetState();
    this.setupFirebaseListeners();
    void this.loadBioDataFor('bio-dopamine');
  }

  private setupFirebaseListeners(): void {
    observeAuth((user) => {
      this.state.currentUser = user;
      if (this.cloudUnsub) {
        this.cloudUnsub();
        this.cloudUnsub = null;
      }
      if (user) {
        this.cloudUnsub = subscribeToCloudProgress(user.uid, (cloudData) => {
          this.state.progress = {
            ...this.state.progress,
            ...cloudData,
            masteredSlotIds: cloudData.masteredSlotIds || this.state.progress.masteredSlotIds,
            reviewSlotIds: cloudData.reviewSlotIds || this.state.progress.reviewSlotIds,
            completedTeil2Exams: cloudData.completedTeil2Exams || this.state.progress.completedTeil2Exams,
            completedTeil3Topics: cloudData.completedTeil3Topics || this.state.progress.completedTeil3Topics,
            unlockedCertificates: cloudData.unlockedCertificates || this.state.progress.unlockedCertificates,
          };
          this.applyThemeToDocument(this.state.progress.theme);
          this.render();
        });
      }
      this.render();
    });
  }

  private applyThemeToDocument(theme: StudioTheme): void {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'midnight') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  private syncBodyDatasetState(): void {
    document.body.dataset.state = this.state.xrGameState;
    document.body.dataset.xrVisible = this.state.activeTab === 'xr3d' ? 'true' : 'false';
  }

  private addXpAndSync(amount: number): void {
    this.state.progress.xp += amount;
    void syncProgressToFirestore(this.state.progress);
  }

  private async loadBioDataFor(bioId: string): Promise<void> {
    const item = BIOSCIENCE_EXAM_LINKS.find((b) => b.id === bioId);
    if (!item || this.state.liveBioMetadata[bioId]) return;
    const meta = await fetchLiveProteinSummary(item.uniprotId, item.pdbId);
    this.state.liveBioMetadata[bioId] = meta;
    if (this.state.activeTab === 'xr3d') {
      this.render();
    }
  }

  public mount(): void {
    this.render();
    this.attachDelegatedEvents();
  }

  private getCurrentExam() {
    return TEIL2_EXAMS.find((e) => e.id === this.state.selectedTeil2Id) || TEIL2_EXAMS[0];
  }

  private getCurrentTeil3Topic() {
    return TEIL3_48_TOPICS.find((t) => t.id === this.state.selectedTeil3Id) || TEIL3_48_TOPICS[0];
  }

  public render(): void {
    this.syncBodyDatasetState();
    const { progress } = this.state;
    const levelMeta = LEVEL_PROGRESSION_META[progress.currentLevel];

    this.root.innerHTML = `
      <div class="studio-shell min-h-screen flex flex-col">
        ${this.renderTopHeader(levelMeta)}
        ${this.renderMainNavigation()}
        <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
          ${this.state.activeTab === 'teil2' ? this.renderTeil2Studio() : ''}
          ${this.state.activeTab === 'teil3' ? this.renderTeil3Studio() : ''}
          ${this.state.activeTab === 'teil1' ? this.renderTeil1Studio() : ''}
          ${this.state.activeTab === 'levels' ? this.renderLevelsAndPlanStudio() : ''}
          ${this.state.activeTab === 'career' ? this.renderCareerAndAiStudio() : ''}
          ${this.state.activeTab === 'xr3d' ? this.renderXr3dAndBioStudio() : ''}
        </main>
        ${this.renderFooter()}
        ${this.state.activeCertExam ? this.renderCertificationModal(this.state.activeCertExam) : ''}
        ${this.state.showDiagnosticModal ? this.renderDiagnosticModal() : ''}
        ${this.state.showHardWordsModal ? this.renderHardWordsBankModal() : ''}
        ${this.state.selectionPopup.visible ? this.renderSelectionStudioPopup() : ''}
      </div>
    `;
  }

  private renderTopHeader(levelMeta: typeof LEVEL_PROGRESSION_META['A0/A1']): string {
    const { progress, currentUser } = this.state;
    const levels: CEFRLevel[] = ['A0/A1', 'A2', 'B1', 'B2'];
    const currentIdx = levels.indexOf(progress.currentLevel);
    const progressPercent = ((currentIdx + 1) / levels.length) * 100;

    return `
      <header class="studio-card sticky top-0 z-30 border-b shadow-sm px-4 sm:px-6 py-3">
        <div class="max-w-7xl mx-auto flex flex-col gap-3">
          <!-- Top Row: Brand, Candidate Profile, Gamification Counters, Theme & Cloud -->
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl font-extrabold text-emerald-400">
                B2
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h1 class="text-base sm:text-lg font-extrabold tracking-tight" dir="ltr">
                    TELC B2 Mündlich & Karriere Master Pro
                  </h1>
                  <span class="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" dir="ltr">
                    Interactive Ping-Pong Edition
                  </span>
                </div>
                <p class="text-xs opacity-80" dir="ltr">
                  👤 <strong>Mohammed El Jebouri</strong> (22 J. • Fès 🇲🇦 • Abitur Physik/Chemie • Bachelor Wirtschaft ➔ 🇩🇪)
                </p>
              </div>
            </div>

            <!-- Gamification & Controls -->
            <div class="flex flex-wrap items-center gap-2">
              <div class="studio-elevated px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5" title="النقاط المكتسبة">
                <span>⚡</span>
                <span dir="ltr">${progress.xp} XP</span>
              </div>
              <div class="studio-elevated px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5" title="أيام المداومة">
                <span>🔥</span>
                <span dir="ltr">${progress.streak} Tage</span>
              </div>
              <div class="studio-elevated px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 text-emerald-400" title="الفراغات المحفوظة">
                <span>🎯</span>
                <span dir="rtl">الفراغات المحفوظة: ${progress.masteredSlotIds.length}</span>
              </div>

              <!-- My Mündlich Hard Words Bank Button (📚 كلماتي الصعبة في النطق) -->
              <button
                type="button"
                data-action="open-hard-words-modal"
                data-testid="open-hard-words-btn"
                aria-label="كلماتي الصعبة في النطق"
                class="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-400/50 transition cursor-pointer flex items-center gap-1.5"
                dir="rtl"
              >
                <span>📚</span>
                <span>كلماتي الصعبة في النطق (${this.state.hardWordsBank.length})</span>
              </button>

              <!-- Plan Mode Switcher (45 vs 60 days) -->
              <button
                type="button"
                data-action="toggle-plan-duration"
                aria-label="تبديل خطة 45 أو 60 يوم"
                class="studio-elevated hover:border-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                dir="rtl"
              >
                📅 ${progress.planDuration === 45 ? 'خطة 45 يوم المكثفة' : 'خطة 60 يوم المريحة'}
              </button>

              <!-- Theme Selector -->
              <select
                data-action="change-theme"
                aria-label="اختيار مظهر المنصة"
                class="studio-elevated px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <option value="midnight" ${progress.theme === 'midnight' ? 'selected' : ''}>🌙 OLED Midnight Pro</option>
                <option value="paper" ${progress.theme === 'paper' ? 'selected' : ''}>📜 Paper Focus Mode</option>
                <option value="daylight" ${progress.theme === 'daylight' ? 'selected' : ''}>☀️ Daylight Crisp</option>
              </select>

              <!-- Audio Mute Toggle -->
              <button
                type="button"
                data-action="toggle-mute"
                aria-label="تشغيل أو كتم الصوت"
                class="studio-elevated px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              >
                ${sfx.muted ? '🔇 صامت' : '🔊 الصوت خدام'}
              </button>

              <!-- Cloud Sync Button -->
              ${
                currentUser
                  ? `<button type="button" data-action="firebase-logout" aria-label="تسجيل الخروج من السحابة" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 cursor-pointer">☁️ متصل (${escapeHtml(currentUser.displayName || 'Mohammed')})</button>`
                  : `<button type="button" data-action="firebase-login" aria-label="حفظ التقدم في السحابة" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer">☁️ حفظ التقدم فـ Cloud</button>`
              }
            </div>
          </div>

          <!-- Instant Selection & Word-Click Translator/Pronouncer Helper Bar -->
          <div class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/70 via-indigo-950/70 to-amber-950/70 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-1.5 font-bold text-emerald-300" dir="rtl">
              <span>🖱️</span>
              <span>سيلكسيوني أي كلمة أو جملة بالماوس (أو كليكي جوج مرات) لترجمتها للعربية وسماع نطقها وتقطيعها فوراً!</span>
            </div>
            <div class="flex flex-wrap items-center gap-1.5" dir="ltr">
              <span class="text-[11px] text-amber-300 font-bold" dir="rtl">جرب كلمة طويلة دابا:</span>
              ${['Sehenswürdigkeiten', 'Umweltverschmutzung', 'Verantwortungsbewusstsein', 'Wirtschaftswissenschaften']
                .map(
                  (w) => `
                    <button
                      type="button"
                      data-action="sel-open-word"
                      data-word="${escapeHtml(w)}"
                      aria-label="نطق وترجمة ${w}"
                      class="px-2 py-0.5 rounded-md bg-black/40 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-400/40 text-[11px] font-mono-de font-bold cursor-pointer transition"
                    >
                      🔍 ${escapeHtml(w)}
                    </button>
                  `
                )
                .join('')}
            </div>
          </div>

          <!-- Second Row: Live CEFR Level Meter (A0/A1 -> A2 -> B1 -> B2) & Darija Banner -->
          <div class="studio-elevated rounded-xl p-2.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div class="flex items-center gap-1.5 flex-wrap">
              ${levels
                .map((lvl, idx) => {
                  const isActive = lvl === progress.currentLevel;
                  const isPassed = idx < currentIdx;
                  const labels: Record<CEFRLevel, string> = {
                    'A0/A1': 'A0/A1 (البداية والنطق)',
                    'A2': 'A2 (تركيب الجمل)',
                    'B1': 'B1 (إتقان المنهجية)',
                    'B2': 'B2 (طلاقة الامتحان والخدمة)'
                  };
                  return `
                    <button
                      type="button"
                      data-action="select-cefr-level"
                      data-level="${lvl}"
                      aria-label="المستوى ${lvl}"
                      class="px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : isPassed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'opacity-70 hover:opacity-100 border border-transparent'
                      }"
                    >
                      <span>${isPassed ? '✅' : isActive ? '🎯' : '🔒'}</span>
                      <span dir="rtl">${labels[lvl]}</span>
                    </button>
                    ${idx < levels.length - 1 ? '<span class="opacity-40 text-xs">➔</span>' : ''}
                  `;
                })
                .join('')}
            </div>

            <div class="flex-1 flex items-center justify-between gap-3">
              <p class="text-xs sm:text-sm font-semibold text-amber-400" dir="rtl">
                ${escapeHtml(levelMeta.bannerDarija)}
              </p>
              <div class="flex items-center gap-2 shrink-0">
                <div class="w-24 h-2 rounded-full bg-zinc-700 overflow-hidden hidden sm:block">
                  <div class="h-full bg-emerald-500 transition-all duration-500" style="width: ${progressPercent}%"></div>
                </div>
                <button
                  type="button"
                  data-action="open-diagnostic"
                  aria-label="امتحان تحديد المستوى"
                  class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 cursor-pointer"
                  dir="rtl"
                >
                  🧭 حدد مستواي دابا
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  private renderMainNavigation(): string {
    const tabs: Array<{ id: MainTab; labelDarija: string; badgeDe: string }> = [
      { id: 'teil2', labelDarija: '🏓 Teil 2: 46 امتحان البينغ بونغ', badgeDe: '46 Exams • 6 Runden' },
      { id: 'teil3', labelDarija: '🤝 Teil 3: 48 موضوع التخطيط + 20 جوكر', badgeDe: '48 Topics • 20 Punkte' },
      { id: 'teil1', labelDarija: '✈️ Teil 1: محمد الجبوري + بين الويدان', badgeDe: '15/15 Punkte' },
      { id: 'levels', labelDarija: '📈 المستويات A0➔B2 + خطة 45/60 يوم', badgeDe: '4 Zertifikate' },
      { id: 'career', labelDarija: '💼 مقابلة العمل (Wirtschaft) + المحاكي الذكي', badgeDe: '12 Job Q&As + AI' },
      { id: 'xr3d', labelDarija: '🥽 القاعة ثلاثية الأبعاد (3D XR) + البيولوجيا', badgeDe: 'WebXR + PDB' }
    ];

    return `
      <nav aria-label="أقسام المنصة الرئيسية" class="studio-card border-b px-4 sm:px-6 py-2">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center gap-1.5">
          ${tabs
            .map((t) => {
              const active = this.state.activeTab === t.id;
              return `
                <button
                  type="button"
                  data-action="switch-tab"
                  data-tab="${t.id}"
                  aria-label="${t.labelDarija}"
                  class="px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'studio-elevated hover:border-emerald-500/50 opacity-85 hover:opacity-100'
                  }"
                >
                  <span dir="rtl">${t.labelDarija}</span>
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-mono-de ${
                    active ? 'bg-black/25 text-emerald-100' : 'bg-emerald-500/15 text-emerald-400'
                  }" dir="ltr">${t.badgeDe}</span>
                </button>
              `;
            })
            .join('')}
        </div>
      </nav>
    `;
  }

  // ====================================================================
  // MODULE: TEIL 2 INTERACTIVE 6-ROUND PING-PONG SLOT-FILLER (ALL 46 EXAMS)
  // ====================================================================
  private renderTeil2Studio(): string {
    const exam = this.getCurrentExam();
    const rounds = build6RoundsForExam(exam, {
      useUniversalMoroccoJoker: this.state.useUniversalMoroccoJokerRonde5,
      useVerbatimPaperClauses: this.state.useVerbatimPaperPhotocopyMode,
    });
    const searchLower = this.state.teil2Search.trim().toLowerCase();
    const filteredExams = TEIL2_EXAMS.filter(
      (e) =>
        !searchLower ||
        e.titleDe.toLowerCase().includes(searchLower) ||
        e.titleDarija.toLowerCase().includes(searchLower) ||
        e.paperTitle.toLowerCase().includes(searchLower) ||
        String(e.id) === searchLower
    );

    const modes: Array<{ id: SlotInteractionMode; titleDarija: string; subtitleDe: string }> = [
      { id: 'builder', titleDarija: '✨ الوضع 1: عمر الفراغات + الديطاي الجراحي', subtitleDe: 'Animated Slot-Builder + Verb-Kick Cases 1/2/3' },
      { id: 'scanner', titleDarija: '🔍 الوضع 2: رادار الورقة الحقيقية بالماركور الأصفر', subtitleDe: 'Sprechen_B2_2026.pdf Laser Scanner' },
      { id: 'recall', titleDarija: '🧠 الوضع 3: وضع الحفاظة السريعة والاختبار', subtitleDe: 'Active Recall Blur & Tap' },
      { id: 'voice', titleDarija: '🎙️ الوضع 4: كمل الفراغ بصوتك', subtitleDe: 'Voice Slot-Filler Challenge' }
    ];

    return `
      <section class="space-y-6">
        <!-- Top Selector & Search Bar for All 46 Exams -->
        <div class="studio-card rounded-2xl p-4 sm:p-5 space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div dir="rtl">
              <span class="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 mb-1">
                محاكي تعمير الفراغات والبينغ بونغ التفاعلي (46/46 امتحان كامل)
              </span>
              <h2 class="text-xl sm:text-2xl font-extrabold">
                اختار أي امتحان من الـ 46 موضوع ديال Teil 2 وطبق عليه منهجية 6 جولات
              </h2>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                data-action="prev-teil2-exam"
                aria-label="الموضوع السابق"
                class="studio-elevated px-3 py-2 rounded-xl text-xs font-bold hover:border-emerald-500 cursor-pointer"
                dir="rtl"
              >
                ◀ الموضوع السابق
              </button>

              <select
                data-action="select-teil2-dropdown"
                aria-label="اختيار امتحان Teil 2 من القائمة الكاملة (1 إلى 46)"
                class="studio-elevated px-3 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer max-w-xs sm:max-w-md"
                dir="ltr"
              >
                ${TEIL2_EXAMS.map(
                  (e) =>
                    `<option value="${e.id}" ${e.id === exam.id ? 'selected' : ''}>${escapeHtml(e.titleDe)} — ${escapeHtml(e.titleDarija)}</option>`
                ).join('')}
              </select>

              <button
                type="button"
                data-action="next-teil2-exam"
                aria-label="الموضوع التالي"
                class="studio-elevated px-3 py-2 rounded-xl text-xs font-bold hover:border-emerald-500 cursor-pointer"
                dir="rtl"
              >
                الموضوع التالي ▶
              </button>
            </div>
          </div>

          <!-- Search & Quick Pills for all 46 exams -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="search"
              data-action="search-teil2"
              value="${escapeHtml(this.state.teil2Search)}"
              placeholder="🔎 قلب على رقم أو اسم الموضوع بالألمانية أو الدارجة (مثلا: 1, Fast Food, 18, 34 Homeoffice...)"
              aria-label="البحث في امتحانات Teil 2"
              class="studio-elevated flex-1 px-4 py-2 rounded-xl text-sm"
              dir="rtl"
            />
            <div class="flex items-center gap-2">
              <button
                type="button"
                data-action="fill-all-slots-exam"
                aria-label="عمر جميع الفراغات دقة وحدة"
                class="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                dir="rtl"
              >
                ⚡ عمر جميع الفراغات (6/6)
              </button>
              <button
                type="button"
                data-action="clear-all-slots-exam"
                aria-label="فرغ الفراغات للتدريب"
                class="studio-elevated px-3.5 py-2 rounded-xl text-xs font-bold hover:border-amber-400 cursor-pointer"
                dir="rtl"
              >
                🔄 فرغ الفراغات للتدريب
              </button>
            </div>
          </div>

          <!-- Scrollable 46 Exam Pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1">
            ${filteredExams
              .map((e) => {
                const isSelected = e.id === exam.id;
                const isDone = this.state.progress.completedTeil2Exams.includes(e.id);
                return `
                  <button
                    type="button"
                    data-action="select-teil2-pill"
                    data-id="${e.id}"
                    aria-label="امتحان ${e.titleDe}"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow'
                        : isDone
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'studio-elevated opacity-80 hover:opacity-100'
                    }"
                    dir="ltr"
                  >
                    <span>${isDone ? '✅' : '📄'}</span>
                    <span>${escapeHtml(e.titleDe)}</span>
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>

        <!-- 4 Memorization Modes Switcher -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          ${modes
            .map((m) => {
              const active = this.state.slotMode === m.id;
              return `
                <button
                  type="button"
                  data-action="switch-slot-mode"
                  data-mode="${m.id}"
                  aria-label="${m.titleDarija}"
                  class="p-3.5 rounded-2xl text-right transition cursor-pointer flex flex-col justify-between gap-1 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-lg border border-indigo-400'
                      : 'studio-card hover:border-indigo-500/50'
                  }"
                >
                  <div class="text-sm font-extrabold" dir="rtl">${m.titleDarija}</div>
                  <div class="text-[11px] opacity-80 font-mono-de" dir="ltr">${m.subtitleDe}</div>
                </button>
              `;
            })
            .join('')}
        </div>

        <!-- Active Exam Banner + Paper-Photocopy & Morocco Joker Controls -->
        <div class="studio-card rounded-2xl p-4 sm:p-5 border-l-4 border-l-emerald-500 flex flex-col gap-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-mono-de uppercase tracking-wider text-emerald-400" dir="ltr">
                  TELC B2 Mündlich • Teil 2 Diskussion • Thema #${exam.id} von 46
                </span>
                <span class="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-mono-de font-bold" dir="ltr">
                  📄 Sprechen_B2_2026.pdf • Seite ${exam.pdfPage}
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-extrabold mt-0.5" dir="ltr">${escapeHtml(exam.titleDe)}</h3>
              <div class="text-xs sm:text-sm font-mono-de text-emerald-300 mt-0.5" dir="ltr">
                🎯 SLOT 1 (Überschrift in der Prüfung): <strong>„${escapeHtml(exam.paperTitle)}“</strong>
              </div>
              <p class="text-sm sm:text-base font-bold text-amber-400 mt-1" dir="rtl">${escapeHtml(exam.titleDarija)}</p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                data-action="speak-full-pingpong"
                aria-label="قراءة الحوار الكامل بالألمانية"
                class="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer flex items-center gap-1.5"
                dir="rtl"
              >
                <span>🔊</span>
                <span>اسمع الـ 6 جولات كاملة (1.0x)</span>
              </button>
              <button
                type="button"
                data-action="speak-full-pingpong-slow"
                aria-label="قراءة الحوار ببطء"
                class="studio-elevated px-3.5 py-2 rounded-xl text-xs font-bold hover:border-emerald-500 cursor-pointer"
                dir="rtl"
              >
                🐢 نطق بطيء للمبتدئين (0.8x)
              </button>
              <button
                type="button"
                data-action="mark-exam-completed"
                data-id="${exam.id}"
                aria-label="تسجيل هذا الموضوع كمحفوظ"
                class="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 cursor-pointer"
                dir="rtl"
              >
                ${this.state.progress.completedTeil2Exams.includes(exam.id) ? '✅ موضوع مضبوط (+50 XP)' : '🏆 علم هاد الموضوع كمضبوط'}
              </button>
            </div>
          </div>

          <!-- Surgical Paper-Photocopy & Zero-Memorization Morocco Joker Bar -->
          <div class="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs" dir="rtl">
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                data-action="toggle-verbatim-paper-mode"
                class="px-3 py-1.5 rounded-xl font-extrabold border transition cursor-pointer flex items-center gap-1.5 ${
                  this.state.useVerbatimPaperPhotocopyMode
                    ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200'
                    : 'studio-elevated opacity-80 hover:opacity-100'
                }"
              >
                <span>🔬</span>
                <span>${
                  this.state.useVerbatimPaperPhotocopyMode
                    ? 'وضع النسخ الجراحي الحرفي من الورقة مفعل (الحالات 1/2/3)'
                    : 'تفعيل وضع النسخ الجراحي الحرفي من الورقة'
                }</span>
              </button>

              <button
                type="button"
                data-action="toggle-ronde5-morocco-joker"
                class="px-3 py-1.5 rounded-xl font-extrabold border transition cursor-pointer flex items-center gap-1.5 ${
                  this.state.useUniversalMoroccoJokerRonde5
                    ? 'bg-amber-500 text-black border-amber-300'
                    : 'bg-amber-500/15 border-amber-400/40 text-amber-300 hover:bg-amber-500/25'
                }"
              >
                <span>🇲🇦</span>
                <span>${
                  this.state.useUniversalMoroccoJokerRonde5
                    ? 'الجوكر المغربي الموحد مفعل (0 حفاظة لكاع الـ 46 موضوع!)'
                    : 'جرب الجوكر المغربي الموحد (0 حفاظة فـ الجولة 5)'
                }</span>
              </button>
            </div>

            <div class="flex items-center gap-2 text-[11px] opacity-85">
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">الحالة 1: واجدة 100% فالورقة</span>
              <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">الحالة 2: رمي فعل واحد للخر</span>
              <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">الحالة 3: جمع الفعل المنفصل فالخر</span>
            </div>
          </div>
        </div>

        <!-- Mode-Specific Content -->
        ${this.state.slotMode === 'builder' ? this.renderTeil2Mode1Builder(exam, rounds) : ''}
        ${this.state.slotMode === 'scanner' ? this.renderTeil2Mode2Scanner(exam) : ''}
        ${this.state.slotMode === 'recall' ? this.renderTeil2Mode3Recall(exam, rounds) : ''}
        ${this.state.slotMode === 'voice' ? this.renderTeil2Mode4Voice(exam, rounds) : ''}
      </section>
    `;
  }

  private renderTeil2Mode1Builder(exam: ReturnType<typeof this.getCurrentExam>, rounds: ReturnType<typeof build6RoundsForExam>): string {
    const filled = this.state.filledSlotsByExam[exam.id] || {};
    const r1 = rounds[0];
    const r2 = rounds[1];
    const r3 = rounds[2];
    const r4 = rounds[3];
    const r5 = rounds[4];

    const [trap1Text, trap2Text] = exam.trapCards || [
      buildDistractorWithMiddleVerb(r3.slotContent),
      buildDistractorWithMiddleVerb(r4.slotContent),
    ];

    const bankCards = [
      { key: 'slot1', label: '🎯 SLOT 1 (Smiya mn lwarqa)', caseBadge: 'العنوان الحرفي من الورقة', text: r1.slotContent, isTrap: false },
      { key: 'slot2', label: '📄 SLOT 2 (Fikra 1)', caseBadge: exam.slot2_fikra1.caseBadge, text: r1.slot2Content || exam.slot2Point1, isTrap: false },
      { key: 'slot3', label: '📄 SLOT 3 (Fikra 2)', caseBadge: exam.slot3_fikra2.caseBadge, text: r2.slotContent, isTrap: false },
      { key: 'slot4', label: '✅ SLOT 4 (Ijabia / Vorteil)', caseBadge: exam.slot4_ijabia.caseBadge, text: r3.slotContent, isTrap: false },
      { key: 'slot5', label: '⚠️ SLOT 5 (Salbia / Nachteil)', caseBadge: exam.slot5_salbia.caseBadge, text: r4.slotContent, isTrap: false },
      { key: 'slot6', label: '🇲🇦 SLOT 6 (Lmaghrib)', caseBadge: 'جوكر المغرب الموحد (0 حفاظة)', text: r5.slotContent, isTrap: false },
      { key: 'trap1', label: '⚠️ فخ ترتيب الفعل (Trap Card — الفعل خاصو يرجع للأخير!)', caseBadge: '⚠️ فخ ترتيب الفعل (Trap Card — الفعل خاصو يرجع للأخير!)', text: trap1Text, isTrap: true },
      { key: 'trap2', label: '⚠️ فخ ترتيب الفعل (Trap Card — الفعل خاصو يرجع للأخير!)', caseBadge: '⚠️ فخ ترتيب الفعل (Trap Card — الفعل خاصو يرجع للأخير!)', text: trap2Text, isTrap: true }
    ];

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left Column (4 cols): Interactive Idea Bank (بنك الأفكار ديال الموضوع) -->
        <div class="lg:col-span-4 studio-card rounded-2xl p-4 sm:p-5 space-y-4 lg:sticky lg:top-36">
          <div dir="rtl">
            <h4 class="text-base font-extrabold text-emerald-400 flex items-center gap-2">
              <span>🧲</span>
              <span>بنك الأفكار ديال الموضوع (#${exam.id})</span>
            </h4>
            <p class="text-xs opacity-80 mt-1">
              كليكي على أي بطاقة صحيحة باش تطير لبلاصتها فـ لوحة البينغ بونغ! رد البال من البطاقات الفخاخ لي فيهم الفعل فالوسط.
            </p>
          </div>

          ${
            this.state.distractorErrorMsg
              ? `<div class="p-3 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs font-bold" dir="rtl">
                  ${escapeHtml(this.state.distractorErrorMsg)}
                </div>`
              : ''
          }

          <div class="space-y-2.5">
            ${bankCards
              .map((card) => {
                const isAlreadyPlaced = !card.isTrap && Boolean(filled[card.key]);
                return `
                  <button
                    type="button"
                    data-action="click-bank-card"
                    data-slot-key="${card.key}"
                    data-is-trap="${card.isTrap ? '1' : '0'}"
                    data-text="${escapeHtml(card.text)}"
                    aria-label="${escapeHtml(card.label)}"
                    class="w-full text-left p-3 rounded-xl border transition cursor-pointer ${
                      card.isTrap
                        ? 'studio-elevated border-rose-500/40 hover:border-rose-500'
                        : isAlreadyPlaced
                        ? 'bg-emerald-500/15 border-emerald-500/50 opacity-85'
                        : 'studio-elevated hover:border-amber-400'
                    }"
                  >
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span class="text-[11px] font-bold px-2 py-0.5 rounded ${
                        card.isTrap
                          ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }" dir="rtl">
                        ${
                          card.isTrap
                            ? escapeHtml(card.label)
                            : isAlreadyPlaced
                            ? `✅ محطوط فـ بلاصتو • ${escapeHtml(card.caseBadge)}`
                            : `👇 ${escapeHtml(card.caseBadge)}`
                        }
                      </span>
                      ${
                        card.isTrap
                          ? ''
                          : `<span class="text-[11px] font-mono-de opacity-75" dir="ltr">${escapeHtml(card.label)}</span>`
                      }
                    </div>
                    <div class="text-xs sm:text-sm font-medium" dir="ltr">
                      ${escapeHtml(card.text)}
                    </div>
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>

        <!-- Right Column (8 cols): 6-Round Ping-Pong Board -->
        <div class="lg:col-span-8 space-y-4">
          ${rounds
            .map((round) => {
              const isRonde1 = round.roundNumber === 1;
              const isRonde5 = round.roundNumber === 5;
              const isRonde6 = round.roundNumber === 6;
              const slotKey =
                round.roundNumber === 1
                  ? 'slot1'
                  : round.roundNumber === 2
                  ? 'slot3'
                  : round.roundNumber === 3
                  ? 'slot4'
                  : round.roundNumber === 4
                  ? 'slot5'
                  : 'slot6';

              const hasSlot1Filled = isRonde1 ? Boolean(filled['slot1']) : Boolean(filled[slotKey]);
              const hasSlot2Filled = isRonde1 ? Boolean(filled['slot2']) : false;

              const slot1Val = hasSlot1Filled ? round.slotContent : undefined;
              const slot2Val = hasSlot2Filled ? round.slot2Content : undefined;

              const badgeColors =
                round.speaker === 'Mohammed (Du)'
                  ? 'border-l-4 border-l-emerald-500'
                  : 'border-l-4 border-l-indigo-500';

              const surgical = round.surgicalMeta;

              return `
                <div class="studio-card rounded-2xl p-4 sm:p-5 space-y-3 ${badgeColors}">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                        round.speaker === 'Mohammed (Du)'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-indigo-500/20 text-indigo-400'
                      }" dir="ltr">
                        🏓 ${escapeHtml(round.titleDe)}
                      </span>
                      <span class="text-xs font-bold opacity-85" dir="rtl">${escapeHtml(round.titleDarija)}</span>
                      ${
                        surgical
                          ? `<span class="px-2 py-0.5 rounded-md text-[11px] font-extrabold ${
                              surgical.caseNum === 1
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : surgical.caseNum === 2
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }" dir="rtl">
                              🔬 ${escapeHtml(surgical.caseBadge)}
                            </span>`
                          : ''
                      }
                    </div>

                    <div class="flex items-center gap-1.5 flex-wrap">
                      ${
                        isRonde5
                          ? `<button
                              type="button"
                              data-action="toggle-ronde5-morocco-joker"
                              aria-label="تبديل الجوكر المغربي الموحد للجولة 5"
                              class="px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                                this.state.useUniversalMoroccoJokerRonde5
                                  ? 'bg-amber-500 text-black'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              } cursor-pointer"
                              dir="rtl"
                            >
                              🇲🇦 ${
                                this.state.useUniversalMoroccoJokerRonde5
                                  ? 'الجوكر المغربي الموحد (0 حفاظة) ✓'
                                  : 'بدل للجوكر المغربي الموحد (0 حفاظة)'
                              }
                            </button>`
                          : ''
                      }
                      ${
                        isRonde6
                          ? `<button
                              type="button"
                              data-action="toggle-ronde6-joker"
                              aria-label="تبديل الجوكر العالمي للجولة 6"
                              class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-pointer"
                              dir="rtl"
                            >
                              🃏 ${this.state.useUniversalJokerRonde6 ? 'الجوكر العالمي مفعل' : 'جرب الجوكر الاحتياطي'}
                            </button>`
                          : ''
                      }
                      <button
                        type="button"
                        data-action="speak-single-round"
                        data-round="${round.roundNumber}"
                        aria-label="نطق الجولة ${round.roundNumber}"
                        class="studio-elevated px-2.5 py-1 rounded-lg text-xs font-bold hover:border-emerald-500 cursor-pointer"
                        dir="ltr"
                      >
                        🔊 DE (1.0x)
                      </button>
                      <button
                        type="button"
                        data-action="speak-single-round-slow"
                        data-round="${round.roundNumber}"
                        aria-label="نطق بطيء للجولة ${round.roundNumber}"
                        class="studio-elevated px-2.5 py-1 rounded-lg text-xs font-bold hover:border-emerald-500 cursor-pointer"
                        dir="ltr"
                      >
                        🐢 0.8x
                      </button>
                    </div>
                  </div>

                  <!-- Darija Coaching Pill -->
                  <div class="studio-elevated rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-amber-300" dir="rtl">
                    💡 ${escapeHtml(round.darijaCoachingPill)}
                  </div>

                  <!-- Interactive German Template with Highlighted Slots -->
                  <div class="p-3.5 rounded-xl bg-black/25 border border-white/10 text-sm sm:text-base leading-relaxed space-y-2" dir="ltr">
                    <div>
                    ${
                      isRonde6 && this.state.useUniversalJokerRonde6
                        ? `<span class="text-amber-300 font-semibold">${escapeHtml(TEIL2_RONDE6_UNIVERSAL_JOKER.de)}</span>`
                        : isRonde1
                        ? `
                          <span>${escapeHtml(round.fixedTemplateBefore)}</span><button
                            type="button"
                            data-action="quick-fill-slot"
                            data-slot-key="slot1"
                            class="inline-flex items-center mx-1 px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer ${
                              slot1Val
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                : 'bg-amber-500/15 border-dashed border-amber-400 text-amber-300'
                            }"
                          >${slot1Val ? `🎯 ${escapeHtml(slot1Val)}` : `🎯 [ ${escapeHtml(round.slotLabel)} — كليكي باش تعمرو ]`}</button><span>${escapeHtml(round.fixedTemplateMiddle || '')}</span><button
                            type="button"
                            data-action="quick-fill-slot"
                            data-slot-key="slot2"
                            class="inline-flex items-center mx-1 px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer ${
                              slot2Val
                                ? 'bg-emerald-500/20 border-emerald-400 text-white'
                                : 'bg-amber-500/15 border-dashed border-amber-400 text-amber-300'
                            }"
                          >${slot2Val ? renderClauseWithGoldVerb(slot2Val, round.slot2FinalVerb) : `📄 [ ${escapeHtml(round.slot2Label || '')} — كليكي باش تعمرو ]`}</button><span>${escapeHtml(round.fixedTemplateAfter)}</span>
                        `
                        : isRonde6
                        ? `<span>${escapeHtml(round.fixedTemplateBefore)}</span>`
                        : `
                          <span>${escapeHtml(round.fixedTemplateBefore)}</span><button
                            type="button"
                            data-action="quick-fill-slot"
                            data-slot-key="${slotKey}"
                            class="inline-flex items-center mx-1 px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer ${
                              slot1Val
                                ? 'bg-emerald-500/20 border-emerald-400 text-white'
                                : 'bg-amber-500/15 border-dashed border-amber-400 text-amber-300'
                            }"
                          >${slot1Val ? renderClauseWithGoldVerb(slot1Val, round.finalVerb) : `🎯 [ ${escapeHtml(round.slotLabel)} — كليكي باش تعمرو ]`}</button><span>${escapeHtml(round.fixedTemplateAfter)}</span>
                        `
                    }
                    </div>
                    <!-- Individual Sentence Play Buttons (🔊) for this Round -->
                    <div class="pt-2 border-t border-white/10 text-xs sm:text-sm opacity-90">
                      ${renderSentencesWithInlineAudioButtons(
                        isRonde6 && this.state.useUniversalJokerRonde6
                          ? TEIL2_RONDE6_UNIVERSAL_JOKER.de
                          : round.slot2Content
                          ? `${round.fixedTemplateBefore}${round.slotContent}${round.fixedTemplateMiddle || ''}${round.slot2Content}${round.fixedTemplateAfter}`
                          : `${round.fixedTemplateBefore}${round.slotContent}${round.fixedTemplateAfter}`
                      )}
                    </div>
                  </div>

                  <!-- Surgical Paper-Photocopy Detail (الديطاي الجراحي من ورقة الامتحان) -->
                  ${
                    surgical
                      ? `<div class="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5 text-xs">
                          <div class="flex flex-wrap items-center justify-between gap-2" dir="rtl">
                            <span class="font-extrabold text-indigo-300">
                              🔬 الديطاي الجراحي (من ورقة الامتحان صفحة ${exam.pdfPage} • ${escapeHtml(surgical.caseBadge)}):
                            </span>
                            <span class="font-mono-de text-[11px] px-2 py-0.5 rounded bg-black/40 text-amber-300" dir="ltr">
                              Verb im Text: „${escapeHtml(surgical.origVerb)}“ ➔ am Ende: „${escapeHtml(surgical.finalVerb)}“
                            </span>
                          </div>
                          <div class="text-xs font-mono-de text-zinc-900 bg-[#fef08a] px-2.5 py-1.5 rounded-lg font-semibold" dir="ltr">
                            📄 <strong>Original im Blatt:</strong> „${renderOrigSubWithRedVerb(surgical.origSub, surgical.origVerb)}“
                          </div>
                          <div class="text-xs font-semibold text-emerald-300" dir="rtl">
                            🛠️ ${escapeHtml(surgical.surgicalDetail)}
                          </div>
                        </div>`
                      : ''
                  }

                  <!-- Darija Translation of the Slot -->
                  <div class="text-xs opacity-80 flex items-center justify-between gap-2" dir="rtl">
                    <span>🇲🇦 المعنى بالدارجة: <strong>${escapeHtml(round.darijaTranslation)}</strong> ${
                      round.slot2DarijaTranslation ? ` | <strong>${escapeHtml(round.slot2DarijaTranslation)}</strong>` : ''
                    }</span>
                    <span class="font-mono-de text-[11px] text-amber-400" dir="ltr">dass ... [Verb am Ende]</span>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  private renderTeil2Mode2Scanner(exam: ReturnType<typeof this.getCurrentExam>): string {
    const activeFilter = this.state.laserActiveSlotFilter;
    const segments = segmentExamPaperForLaserScanner(exam.originalArticleDe, {
      slot2: exam.surgicalSlots.slot2.origSub,
      slot3: exam.surgicalSlots.slot3.origSub,
      slot4: exam.surgicalSlots.slot4.origSub,
      slot5: exam.surgicalSlots.slot5.origSub,
    });

    const slotBadgeMeta: Record<LaserSlotKey, { badgeDe: string; badgeAr: string; markClass: string }> = {
      slot2: {
        badgeDe: 'SLOT 2 • Fikra 1',
        badgeAr: 'الفكرة 1 (الجولة 1)',
        markClass: 'bg-yellow-400/30 border-b-2 border-yellow-400 text-yellow-100',
      },
      slot3: {
        badgeDe: 'SLOT 3 • Fikra 2',
        badgeAr: 'الفكرة 2 (الجولة 2)',
        markClass: 'bg-sky-400/30 border-b-2 border-sky-400 text-sky-100',
      },
      slot4: {
        badgeDe: 'SLOT 4 • Vorteil',
        badgeAr: 'الإيجابية (الجولة 3)',
        markClass: 'bg-emerald-400/30 border-b-2 border-emerald-400 text-emerald-100',
      },
      slot5: {
        badgeDe: 'SLOT 5 • Nachteil',
        badgeAr: 'السلبية (الجولة 4)',
        markClass: 'bg-rose-400/30 border-b-2 border-rose-400 text-rose-100',
      },
    };

    const filterButtons: Array<{ id: 'ALL' | LaserSlotKey; labelAr: string }> = [
      { id: 'ALL', labelAr: '🔦 تلوين جميع الـ 4 جمل فـ الورقة' },
      { id: 'slot2', labelAr: '📄 SLOT 2: الفكرة 1' },
      { id: 'slot3', labelAr: '📄 SLOT 3: الفكرة 2' },
      { id: 'slot4', labelAr: '✅ SLOT 4: الإيجابية' },
      { id: 'slot5', labelAr: '⚠️ SLOT 5: السلبية' },
    ];

    const surgicalCards: Array<{ key: LaserSlotKey; titleDe: string; titleAr: string; colorClass: string; slot: typeof exam.surgicalSlots.slot2 }> = [
      {
        key: 'slot2',
        titleDe: 'SLOT 2 (Ronde 1 • Der Autor erwähnt, dass ...)',
        titleAr: 'الفكرة 1 المسروقة حرفياً من الورقة',
        colorClass: 'border-l-4 border-l-yellow-400',
        slot: exam.surgicalSlots.slot2,
      },
      {
        key: 'slot3',
        titleDe: 'SLOT 3 (Ronde 2 • In meinem Artikel steht auch, dass ...)',
        titleAr: 'الفكرة 2 المسروقة حرفياً من الورقة',
        colorClass: 'border-l-4 border-l-sky-400',
        slot: exam.surgicalSlots.slot3,
      },
      {
        key: 'slot4',
        titleDe: 'SLOT 4 (Ronde 3 • Ein großer Vorteil ist meiner Meinung nach, dass ...)',
        titleAr: 'الإيجابية (Vorteil) المسروقة من الورقة',
        colorClass: 'border-l-4 border-l-emerald-400',
        slot: exam.surgicalSlots.slot4,
      },
      {
        key: 'slot5',
        titleDe: 'SLOT 5 (Ronde 4 • Ein wichtiger Nachteil ist aber zum Beispiel, dass ...)',
        titleAr: 'السلبية (Nachteil) المسروقة من الورقة',
        colorClass: 'border-l-4 border-l-rose-400',
        slot: exam.surgicalSlots.slot5,
      },
    ];

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left Column (6 cols): Real Verbatim TELC Exam Paper (Sprechen_B2_2026.pdf) with Yellow Marker Highlights -->
        <div class="lg:col-span-6 studio-card rounded-2xl p-5 space-y-4 border-2 border-amber-500/50 lg:sticky lg:top-36">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-700 pb-3">
            <div dir="ltr">
              <span class="text-xs font-mono-de uppercase text-amber-400">
                Sprechen_B2_2026.pdf • Seite ${exam.pdfPage} • Offizielles Aufgabenblatt
              </span>
              <h4 class="text-lg font-extrabold">${escapeHtml(exam.titleDe)}</h4>
            </div>
            <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300" dir="rtl">
              📄 ورقة الامتحان الحقيقية (20 دقيقة د التحضير)
            </span>
          </div>

          <!-- Interactive Slot Highlight Filter Bar -->
          <div class="flex flex-wrap items-center gap-1.5" dir="rtl">
            ${filterButtons
              .map((b) => {
                const isActive = activeFilter === b.id;
                return `
                  <button
                    type="button"
                    data-action="set-laser-slot-filter"
                    data-filter="${b.id}"
                    class="px-2.5 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-black shadow'
                        : 'studio-elevated hover:border-amber-400 opacity-85'
                    }"
                  >
                    ${escapeHtml(b.labelAr)}
                  </button>
                `;
              })
              .join('')}
          </div>

          <!-- SLOT 1 Headline Highlight -->
          <div class="p-3 rounded-xl bg-amber-500/15 border-2 border-amber-400/60 space-y-1" dir="ltr">
            <div class="flex items-center justify-between text-xs font-bold text-amber-300">
              <span>🎯 [SLOT 1: Überschrift / Smiya mn lwarqa]</span>
              <span dir="rtl">انسخ العنوان كيما هو 100%!</span>
            </div>
            <div class="text-base sm:text-lg font-extrabold text-white">
              „${escapeHtml(exam.paperTitle)}“
            </div>
          </div>

          <!-- Full Verbatim German Exam Article with Bright Yellow Marker (#fef08a) & Red origVerb Badge -->
          <div class="p-4 rounded-xl bg-black/30 border border-white/10 text-sm sm:text-base leading-relaxed space-y-3" dir="ltr" data-testid="laser-verbatim-article">
            <div class="text-[11px] font-mono-de uppercase tracking-wider text-zinc-400 flex items-center justify-between">
              <span>Original-Prüfungstext (Lesetext Teil 2):</span>
              <span dir="rtl" class="text-amber-300">كليكي على أي سطر ملون بالماركور الأصفر باش تسمعو!</span>
            </div>
            <p class="leading-8">
              ${segments
                .map((seg) => {
                  if (!seg.slotKey) {
                    return `<span>${escapeHtml(seg.text)}</span>`;
                  }
                  const meta = slotBadgeMeta[seg.slotKey];
                  const slotObj = exam.surgicalSlots[seg.slotKey];
                  const isEmphasized = activeFilter === 'ALL' || activeFilter === seg.slotKey;
                  return `<mark
                    data-action="set-laser-slot-filter"
                    data-filter="${seg.slotKey}"
                    title="${meta.badgeDe} — ${meta.badgeAr}"
                    style="${isEmphasized ? 'background-color: #fef08a; color: #111827;' : ''}"
                    class="px-1.5 py-0.5 rounded cursor-pointer transition ${
                      isEmphasized
                        ? 'font-bold ring-2 ring-amber-400 shadow-sm'
                        : 'bg-white/10 text-zinc-300 opacity-60'
                    }"
                  ><span class="inline-block px-1.5 py-0.5 mr-1 rounded bg-zinc-900 text-[10px] font-mono-de uppercase text-amber-300 align-middle">[${meta.badgeDe}]</span>${renderOrigSubWithRedVerb(
                    seg.text,
                    slotObj.origVerb
                  )}</mark>`;
                })
                .join('')}
            </p>
          </div>

          <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm space-y-1" dir="rtl">
            <div class="font-extrabold text-emerald-400">🎯 سر المهنة بـ الماركور الأصفر فـ 20 دقيقة د التحضير:</div>
            <p>
              هادو هما الـ 4 جمل الحرفية وسط الورقة الحقيقية ديال الامتحان ملونين بـ الماركور الأصفر (<code>#fef08a</code>) والفعل الأصلي ملون بالأحمر! طبق عليهم الحالات الـ 3 (إما الفعل واجد فاللخر، أو رمي الفعل المصرف للخر مورا <code>dass</code>)!
            </p>
          </div>
        </div>

        <!-- Right Column (6 cols): Surgical Verb-Kick Breakdown for Slots 2, 3, 4, 5 + Morocco Joker -->
        <div class="lg:col-span-6 space-y-4">
          <div class="studio-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-2">
            <h4 class="text-base sm:text-lg font-extrabold text-emerald-400" dir="rtl">
              🔬 التحويل الجراحي الحرفي من الورقة إلى جمل <code>dass</code> (60/60)
            </h4>
            <button
              type="button"
              data-action="laser-scan-sound"
              aria-label="تشغيل رادار استخراج الأفكار"
              class="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
              dir="rtl"
            >
              🔊 اسمع الدخلة + الفكرة 1
            </button>
          </div>

          ${surgicalCards
            .map((item) => {
              const s = item.slot;
              const isHighlighted = activeFilter === item.key;
              return `
                <div class="studio-card rounded-2xl p-4 space-y-2.5 ${item.colorClass} ${
                  isHighlighted ? 'ring-2 ring-amber-400' : ''
                }">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xs font-mono-de font-extrabold text-amber-300" dir="ltr">${escapeHtml(item.titleDe)}</span>
                    <span class="px-2 py-0.5 rounded text-[11px] font-extrabold ${
                      s.caseNum === 1
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : s.caseNum === 2
                        ? 'bg-sky-500/20 text-sky-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }" dir="rtl">
                      🔬 ${escapeHtml(s.caseBadge)}
                    </span>
                  </div>

                  <div class="p-2.5 rounded-xl bg-[#fef08a] border border-amber-400 text-zinc-900 text-xs space-y-1" dir="ltr">
                    <div class="text-zinc-700 font-bold">📄 <strong>Original im Prüfungstext (Sprechen_B2_2026.pdf):</strong></div>
                    <div class="font-mono-de font-bold">„${renderOrigSubWithRedVerb(s.origSub, s.origVerb)}“</div>
                  </div>

                  <div class="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs sm:text-sm space-y-1" dir="ltr">
                    <div class="flex items-center justify-between text-[11px] text-emerald-300 font-bold">
                      <span>✅ Fertige dass-Clause (Verb am Ende):</span>
                      <button
                        type="button"
                        data-action="speak-text"
                        data-text="dass ${escapeHtml(s.dassClauseDe)}"
                        class="px-2 py-0.5 rounded bg-emerald-500/25 hover:bg-emerald-500 text-emerald-200 hover:text-black cursor-pointer"
                      >
                        🔊 اسمعها
                      </button>
                    </div>
                    <div class="font-bold text-white">
                      ..., dass ${renderClauseWithGoldVerb(s.dassClauseDe, s.finalVerb)}.
                    </div>
                  </div>

                  <div class="text-xs font-semibold text-amber-300" dir="rtl">
                    🇲🇦 المعنى: ${escapeHtml(s.arMeaning)}
                  </div>

                  <div class="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 font-semibold" dir="rtl">
                    🛠️ <strong>الديطاي الجراحي:</strong> ${escapeHtml(s.surgicalDetail)}
                  </div>
                </div>
              `;
            })
            .join('')}

          <!-- SLOT 6: Universal Zero-Memorization Morocco Joker Card -->
          <div class="studio-card rounded-2xl p-4 space-y-2.5 border-l-4 border-l-amber-400">
            <div class="flex flex-wrap items-center justify-between gap-2" dir="rtl">
              <span class="text-xs font-extrabold text-amber-400">🇲🇦 SLOT 6 (Ronde 5 • التجربة والمغرب — جوكر 0 حفاظة أو جملة خاصة)</span>
              <button
                type="button"
                data-action="toggle-ronde5-morocco-joker"
                class="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-amber-500 text-black cursor-pointer"
              >
                🔄 تبديل الجوكر المغربي
              </button>
            </div>
            <div class="p-2.5 rounded-xl bg-black/30 border border-white/10 text-xs space-y-1" dir="ltr">
              <div class="text-amber-300 font-bold">🃏 الجوكر المغربي الموحد (خدام مع كاع الـ 46 موضوع بلا حفاظة!):</div>
              <div>„In meinem Heimatland Marokko ist es so, dass ${renderClauseWithGoldVerb(exam.slot6_marokko.dassClause, exam.slot6_marokko.finalVerb)}.“</div>
              <div class="text-zinc-300" dir="rtl">${escapeHtml(exam.slot6_marokko.arMeaning)}</div>
            </div>
            <div class="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-1" dir="ltr">
              <div class="text-emerald-300 font-bold">🇲🇦 الجملة الخاصة بهاد الموضوع فـ المغرب:</div>
              <div>„In meinem Heimatland Marokko ist es so, dass ${renderClauseWithGoldVerb(exam.slot6_marokko.specificMoroccoDe)}.“</div>
              <div class="text-zinc-300" dir="rtl">${escapeHtml(exam.slot6_marokko.specificMoroccoAr)}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderTeil2Mode3Recall(exam: ReturnType<typeof this.getCurrentExam>, rounds: ReturnType<typeof build6RoundsForExam>): string {
    return `
      <div class="space-y-4">
        <div class="studio-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div dir="rtl">
            <h4 class="text-base font-extrabold text-amber-400">🧠 وضع الحفاظة السريعة والاختبار (Active Recall Blur)</h4>
            <p class="text-xs opacity-80">شوف المعنى بالدارجة، قول الجملة بالألمانية فـ خاطرك، عاد كليكي على الفراغ الضبابي باش تتحقق واش جبتي الفعل فـ اللخر!</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              data-action="reveal-all-blur"
              aria-label="إظهار جميع الفراغات"
              class="studio-elevated px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
              dir="rtl"
            >
              👁️ بين كلشي
            </button>
            <button
              type="button"
              data-action="hide-all-blur"
              aria-label="إخفاء جميع الفراغات"
              class="studio-elevated px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
              dir="rtl"
            >
              🙈 غطي كلشي للاختبار
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${rounds
            .map((r) => {
              const slotId = `${exam.id}-s${r.roundNumber}`;
              const isRevealed = Boolean(this.state.revealedBlurSlots[slotId]);
              const isMastered = this.state.progress.masteredSlotIds.includes(slotId);
              const isReview = this.state.progress.reviewSlotIds.includes(slotId);

              return `
                <div class="studio-card rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-extrabold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300" dir="ltr">
                        Ronde ${r.roundNumber} (${escapeHtml(r.speaker)})
                      </span>
                      <span class="text-xs font-bold ${
                        isMastered ? 'text-emerald-400' : isReview ? 'text-amber-400' : 'opacity-60'
                      }" dir="rtl">
                        ${isMastered ? '✅ محفوظة' : isReview ? '🔁 للمراجعة' : '⏳ قيد الحفظ'}
                      </span>
                    </div>

                    <!-- Darija Hint -->
                    <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300" dir="rtl">
                      💡 تلميح بالدارجة: ${escapeHtml(r.darijaTranslation)} ${
                        r.slot2DarijaTranslation ? ` + ${escapeHtml(r.slot2DarijaTranslation)}` : ''
                      }
                    </div>

                    <!-- Blurred / Revealed Slot -->
                    <div
                      data-action="toggle-blur-slot"
                      data-slot-id="${slotId}"
                      class="p-3 rounded-xl bg-black/25 border border-white/10 cursor-pointer transition"
                      dir="ltr"
                    >
                      <div class="text-xs opacity-70 mb-1">${escapeHtml(r.fixedTemplateBefore)}</div>
                      <div class="text-sm font-bold ${isRevealed ? 'slot-revealed' : 'slot-blur'}">
                        ${renderClauseWithGoldVerb(r.slotContent)}
                        ${r.slot2Content ? `<div class="mt-1">${renderClauseWithGoldVerb(r.slot2Content)}</div>` : ''}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      data-action="mark-slot-mastered"
                      data-slot-id="${slotId}"
                      aria-label="حفظت هذا الفراغ"
                      class="flex-1 py-1.5 rounded-lg text-xs font-bold bg-emerald-600/25 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 transition cursor-pointer"
                      dir="rtl"
                    >
                      ✅ حفظتها (+25 XP)
                    </button>
                    <button
                      type="button"
                      data-action="mark-slot-review"
                      data-slot-id="${slotId}"
                      aria-label="أعد هذا الفراغ للمراجعة"
                      class="flex-1 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 transition cursor-pointer"
                      dir="rtl"
                    >
                      🔁 عاودها ليا
                    </button>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  private renderTeil2Mode4Voice(exam: ReturnType<typeof this.getCurrentExam>, rounds: ReturnType<typeof build6RoundsForExam>): string {
    const activeRoundObj = rounds.find((r) => r.roundNumber === this.state.voiceActiveRound) || rounds[0];
    const targetClause = activeRoundObj.slot2Content || activeRoundObj.slotContent;

    return `
      <div class="studio-card rounded-2xl p-5 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div dir="rtl">
            <h4 class="text-lg font-extrabold text-emerald-400">🎙️ الوضع 4: كمل الفراغ بصوتك (Voice Slot-Filler Challenge)</h4>
            <p class="text-xs opacity-80">اختار الجولة، قرا البداية الثابتة، وقول الفراغ بصوتك أو كتبو باش المصحح الذكي يتحقق من الفعل فـ اللخر!</p>
          </div>

          <div class="flex items-center gap-1.5">
            ${rounds
              .map(
                (r) => `
                  <button
                    type="button"
                    data-action="select-voice-round"
                    data-round="${r.roundNumber}"
                    aria-label="اختيار الجولة ${r.roundNumber} للصوت"
                    class="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      this.state.voiceActiveRound === r.roundNumber
                        ? 'bg-emerald-600 text-white'
                        : 'studio-elevated'
                    }"
                    dir="ltr"
                  >
                    Ronde ${r.roundNumber}
                  </button>
                `
              )
              .join('')}
          </div>
        </div>

        <div class="p-4 rounded-2xl studio-elevated space-y-3">
          <div class="text-xs font-bold text-amber-300" dir="rtl">
            💡 الفكرة المطلوبة بالدارجة: ${escapeHtml(activeRoundObj.slot2DarijaTranslation || activeRoundObj.darijaTranslation)}
          </div>
          <div class="text-sm sm:text-base font-mono-de" dir="ltr">
            <span class="opacity-80">${escapeHtml(activeRoundObj.fixedTemplateBefore)}</span>
            <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">[ 🎙️ قول هاد الفراغ بصوتك ]</span>
            <span class="opacity-80">${escapeHtml(activeRoundObj.fixedTemplateAfter)}</span>
          </div>
          <div class="text-xs opacity-70" dir="ltr">
            Ziel-Slot: ${renderClauseWithGoldVerb(targetClause)}
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            data-action="toggle-voice-recording"
            aria-label="بدء أو إيقاف التسجيل الصوتي"
            class="px-5 py-3 rounded-xl text-sm font-extrabold cursor-pointer flex items-center justify-center gap-2 ${
              this.state.voiceIsRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }"
            dir="rtl"
          >
            <span>${this.state.voiceIsRecording ? '⏹️ وقف التسجيل' : '🎙️ اضغط وتكلم بالألمانية'}</span>
          </button>

          <input
            type="text"
            data-action="voice-text-input"
            value="${escapeHtml(this.state.voiceTranscript)}"
            placeholder="أو كتب جملة الفراغ هنا بالألمانية (dass ... [Verb am Ende])..."
            aria-label="إدخال جملة الفراغ بالألمانية"
            class="studio-elevated flex-1 px-4 py-3 rounded-xl text-sm"
            dir="ltr"
          />

          <button
            type="button"
            data-action="grade-voice-slot"
            aria-label="تصحيح الجملة بالذكاء الاصطناعي"
            class="px-5 py-3 rounded-xl text-sm font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            dir="rtl"
          >
            ✅ صحح ليا الجملة
          </button>
        </div>

        ${
          this.state.voiceFeedback
            ? `
              <div class="p-4 rounded-2xl border ${
                this.state.voiceFeedback.verbOk
                  ? 'bg-emerald-500/15 border-emerald-500/50'
                  : 'bg-amber-500/15 border-amber-500/50'
              } space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-extrabold" dir="rtl">${escapeHtml(this.state.voiceFeedback.darija)}</span>
                  <span class="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-black/30" dir="ltr">
                    Score: ${this.state.voiceFeedback.score}%
                  </span>
                </div>
                <div class="text-xs font-mono-de" dir="ltr">
                  Musterlösung: ${renderClauseWithGoldVerb(this.state.voiceFeedback.corrected)}
                </div>
              </div>
            `
            : ''
        }
      </div>
    `;
  }

  // ====================================================================
  // MODULE: TEIL 3 GEMEINSAM ETWAS PLANEN (48 TOPICS + 20 POINTS)
  // ====================================================================
  private renderTeil3Studio(): string {
    const topic = this.getCurrentTeil3Topic();
    const searchLower = this.state.teil3Search.trim().toLowerCase();
    const categories = [
      'ALL',
      'Kat 1: Party & Fest',
      'Kat 2: Veranstaltung & Infotag',
      'Kat 3: Präsentation',
      'Kat 4: Reise & Ausflug',
      'Kat 5: Hilfe, Spenden & Projekte'
    ];

    const filteredTopics = TEIL3_48_TOPICS.filter((t) => {
      const catMatch = this.state.selectedTeil3Category === 'ALL' || t.category === this.state.selectedTeil3Category;
      const textMatch =
        !searchLower ||
        t.titleDe.toLowerCase().includes(searchLower) ||
        t.titleDarija.toLowerCase().includes(searchLower) ||
        String(t.id) === searchLower;
      return catMatch && textMatch;
    });

    const recommendedJokers = TEIL3_20_UNIVERSAL_POINTS.filter((p) =>
      topic.recommendedJokerNumbers.includes(p.number)
    );

    const mins = Math.floor(this.state.prepTimerSeconds / 60);
    const secs = this.state.prepTimerSeconds % 60;
    const timerFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    return `
      <section class="space-y-6">
        <!-- Prof. Hicham's 20/80 Rule Banner -->
        <div class="studio-card rounded-2xl p-5 border-l-4 border-l-indigo-500 space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h2 class="text-xl sm:text-2xl font-extrabold" dir="rtl">${escapeHtml(TEIL3_METHODOLOGY_OVERVIEW.titleDarija)}</h2>
            <span class="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-300" dir="ltr">
              48/48 Prüfungsaufgaben • 20 Universal-Joker
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm" dir="rtl">
            <div class="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 font-semibold">
              🎯 <strong>الـ 20% اللولة (قلب الموضوع - Herz des Themas):</strong> ${escapeHtml(TEIL3_METHODOLOGY_OVERVIEW.rule20Darija)}
            </div>
            <div class="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 font-semibold">
              🃏 <strong>الـ 80% الكمالة (الجوكرات العالمية الـ 20):</strong> ${escapeHtml(TEIL3_METHODOLOGY_OVERVIEW.rule80Darija)}
            </div>
          </div>
        </div>

        <!-- Category Filters & Topic Selector (1 to 48) -->
        <div class="studio-card rounded-2xl p-4 sm:p-5 space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            ${categories
              .map((cat) => {
                const active = this.state.selectedTeil3Category === cat;
                return `
                  <button
                    type="button"
                    data-action="filter-teil3-cat"
                    data-cat="${escapeHtml(cat)}"
                    aria-label="فلتر فئة ${cat}"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                      active ? 'bg-indigo-600 text-white' : 'studio-elevated hover:border-indigo-400'
                    }"
                    dir="ltr"
                  >
                    ${cat === 'ALL' ? '🌟 Alle 48 Themen' : escapeHtml(cat)}
                  </button>
                `;
              })
              .join('')}
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              data-action="select-teil3-dropdown"
              aria-label="اختيار موضوع Teil 3 من 1 إلى 48"
              class="studio-elevated px-3 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer"
              dir="ltr"
            >
              ${TEIL3_48_TOPICS.map(
                (t) =>
                  `<option value="${t.id}" ${t.id === topic.id ? 'selected' : ''}>${escapeHtml(t.titleDe)} — ${escapeHtml(t.titleDarija)}</option>`
              ).join('')}
            </select>

            <input
              type="search"
              data-action="search-teil3"
              value="${escapeHtml(this.state.teil3Search)}"
              placeholder="🔎 قلب فـ 48 موضوع ديال التخطيط (مثلا: Sportfest, Valentin, Buch, Reise, Vorstellungsgespräch...)"
              aria-label="البحث في مواضيع Teil 3"
              class="studio-elevated flex-1 px-4 py-2 rounded-xl text-sm"
              dir="rtl"
            />
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto pb-2">
            ${filteredTopics
              .map((t) => {
                const active = t.id === topic.id;
                return `
                  <button
                    type="button"
                    data-action="select-teil3-pill"
                    data-id="${t.id}"
                    aria-label="موضوع ${t.titleDe}"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      active ? 'bg-indigo-600 text-white shadow' : 'studio-elevated opacity-85 hover:opacity-100'
                    }"
                    dir="ltr"
                  >
                    ${escapeHtml(t.titleDe)}
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>

        <!-- Selected Teil 3 Topic: Dkhla + 20% Herz des Themas + Recommended Jokers + Khatima -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-7 space-y-4">
            <div class="studio-card rounded-2xl p-5 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-mono-de text-indigo-400" dir="ltr">${escapeHtml(topic.category)} • Aufgabe #${topic.id}/48</span>
                  <h3 class="text-xl font-extrabold" dir="ltr">${escapeHtml(topic.titleDe)}</h3>
                  <p class="text-sm font-bold text-amber-400" dir="rtl">${escapeHtml(topic.titleDarija)}</p>
                </div>
                <button
                  type="button"
                  data-action="speak-teil3-plan"
                  aria-label="قراءة خطة الموضوع بالألمانية"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white cursor-pointer"
                  dir="rtl"
                >
                  🔊 اسمع التخطيط بالألمانية
                </button>
              </div>

              <!-- 1. Dkhla (Opening Slot-Filler) -->
              <div class="p-3.5 rounded-xl studio-elevated space-y-1.5">
                <div class="text-xs font-bold text-emerald-400" dir="rtl">1️⃣ الدخلة الثابتة (Dkhla Slot-Filler):</div>
                <div class="text-sm leading-relaxed" dir="ltr">
                  <button
                    type="button"
                    data-action="play-single-sentence"
                    data-sentence="${escapeHtml(`${TEIL3_METHODOLOGY_OVERVIEW.openingTemplate.templateBefore}${topic.dkhlaSlotAccusative}${TEIL3_METHODOLOGY_OVERVIEW.openingTemplate.templateAfter}`)}"
                    aria-label="نطق الدخلة"
                    class="inline-flex items-center justify-center w-5 h-5 mr-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/30 text-[11px] align-middle cursor-pointer transition"
                  >🔊</button>
                  „${escapeHtml(TEIL3_METHODOLOGY_OVERVIEW.openingTemplate.templateBefore)}<span class="px-2 py-0.5 rounded bg-emerald-500/25 border border-emerald-400 text-emerald-300 font-bold">${escapeHtml(topic.dkhlaSlotAccusative)}</span>${escapeHtml(TEIL3_METHODOLOGY_OVERVIEW.openingTemplate.templateAfter)}“
                </div>
              </div>

              <!-- 2. 20% Herz des Themas (2 Topic-Specific Points) -->
              <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div class="text-xs font-extrabold text-amber-300" dir="rtl">
                  2️⃣ الـ 20% اللولة: جوج نقط من قلب الموضوع (Herz des Themas) باش تبهر الممتحن:
                </div>
                <div class="space-y-2 text-sm" dir="ltr">
                  <div class="p-2.5 rounded-lg bg-black/20">
                    <strong>• Punkt A (Spezifisch):</strong> ${renderSentencesWithInlineAudioButtons(`Zuerst würde ich vorschlagen, dass wir ${topic.herzPoint1De}`)}
                    <div class="text-xs text-amber-300 mt-1" dir="rtl">🇲🇦 ${escapeHtml(topic.herzPoint1Darija)}</div>
                  </div>
                  <div class="p-2.5 rounded-lg bg-black/20">
                    <strong>• Punkt B (Spezifisch):</strong> ${renderSentencesWithInlineAudioButtons(`Außerdem wäre es sehr sinnvoll, wenn wir ${topic.herzPoint2De}`)}
                    <div class="text-xs text-amber-300 mt-1" dir="rtl">🇲🇦 ${escapeHtml(topic.herzPoint2Darija)}</div>
                  </div>
                </div>
              </div>

              <!-- 3. Recommended 80% Universal Jokers -->
              <div class="p-3.5 rounded-xl studio-elevated space-y-2">
                <div class="text-xs font-extrabold text-indigo-300" dir="rtl">
                  3️⃣ الـ 80% الكمالة: أحسن الجوكرات العالمية لي كيجيو مع هاد الموضوع:
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  ${recommendedJokers
                    .map(
                      (j) => `
                        <div class="p-2.5 rounded-lg bg-black/20 text-xs space-y-1">
                          <div class="font-bold text-emerald-400" dir="rtl">${escapeHtml(j.titleDarija)}</div>
                          <div dir="ltr">${renderSentencesWithInlineAudioButtons(this.state.indirectTransformerActive ? j.indirectB2Question : j.directA2Question)}</div>
                          <div class="opacity-85" dir="ltr">➔ ${renderSentencesWithInlineAudioButtons(j.strongB2Answer)}</div>
                        </div>
                      `
                    )
                    .join('')}
                </div>
              </div>

              <!-- 4. Khatima (Closing Slot-Filler) -->
              <div class="p-3.5 rounded-xl studio-elevated space-y-1.5">
                <div class="text-xs font-bold text-emerald-400" dir="rtl">4️⃣ الخاتمة الثابتة (Khatima Slot-Filler):</div>
                <div class="text-sm leading-relaxed" dir="ltr">
                  <button
                    type="button"
                    data-action="play-single-sentence"
                    data-sentence="${escapeHtml(`${TEIL3_METHODOLOGY_OVERVIEW.closingTemplate.templateBefore}${topic.khatimaSlotNominative}${TEIL3_METHODOLOGY_OVERVIEW.closingTemplate.templateAfter}`)}"
                    aria-label="نطق الخاتمة"
                    class="inline-flex items-center justify-center w-5 h-5 mr-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/30 text-[11px] align-middle cursor-pointer transition"
                  >🔊</button>
                  „${escapeHtml(TEIL3_METHODOLOGY_OVERVIEW.closingTemplate.templateBefore)}<span class="px-2 py-0.5 rounded bg-emerald-500/25 border border-emerald-400 text-emerald-300 font-bold">${escapeHtml(topic.khatimaSlotNominative)}</span>${escapeHtml(TEIL3_METHODOLOGY_OVERVIEW.closingTemplate.templateAfter)}“
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive 20-Minute Scratchpad (ورقة الوسخ التفاعلية) & Partner Rescue -->
          <div class="lg:col-span-5 space-y-4">
            <div class="studio-card rounded-2xl p-5 space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-base font-extrabold text-amber-400" dir="rtl">📝 ورقة الوسخ التفاعلية (20 دقيقة د التحضير)</h4>
                <div class="flex items-center gap-2">
                  <span class="font-mono-de text-sm font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300" dir="ltr">
                    ⏱️ ${timerFormatted}
                  </span>
                  <button
                    type="button"
                    data-action="toggle-prep-timer"
                    aria-label="تشغيل أو إيقاف عداد 20 دقيقة"
                    class="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white cursor-pointer"
                    dir="rtl"
                  >
                    ${this.state.prepTimerRunning ? '⏸️ إيقاف' : '▶️ ابدأ 20 د'}
                  </button>
                </div>
              </div>
              <p class="text-xs opacity-80" dir="rtl">
                قيد هنا غير رؤوس الأقلام كيفما غدير فـ قاعة التحضير نهار الامتحان (ملي كتهضر فـ المحاكي الصوتي على أي نقطة من الـ 20 كتعلم أوتوماتيكياً بـ ✅):
              </p>
              <div class="flex flex-wrap gap-1.5" dir="ltr">
                ${TEIL3_20_UNIVERSAL_POINTS.slice(0, 12)
                  .map((pt) => {
                    const checked = this.state.teil3CheckedPointNumbers.includes(pt.number);
                    return `<span class="px-2 py-0.5 rounded text-[11px] font-mono-de border ${
                      checked
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-black/20 border-white/10 opacity-75'
                    }">${checked ? '✅' : '⬜'} #${pt.number} ${escapeHtml(pt.titleDe.split('(')[0].trim())}</span>`;
                  })
                  .join('')}
              </div>
              <textarea
                data-action="update-scratchpad"
                rows="6"
                aria-label="ورقة الوسخ للملاحظات"
                class="studio-elevated w-full p-3 rounded-xl text-xs sm:text-sm font-mono-de"
                dir="ltr"
              >${escapeHtml(this.state.progress.scratchpadNotes)}</textarea>
            </div>

            <!-- Partner Rescue (الأوكسجين للبارتنر المبلوكي) -->
            <div class="studio-card rounded-2xl p-5 space-y-3 border border-emerald-500/30">
              <h4 class="text-base font-extrabold text-emerald-400" dir="rtl">
                🫁 تقنية "الأوكسجين" لإنقاذ البارتنر المبلوكي (Sauerstoff geben)
              </h4>
              <p class="text-xs opacity-85" dir="rtl">
                إلا طحتي مع بارتنر حشومي أو تبلوكا، ما تسكتش! عطيه سؤال فيه جوج اختيارات ساهلين (A oder B) باش يتسرح والممتحن يعطيك نتا العلامة الكاملة فـ التفاعل:
              </p>
              <div class="space-y-2">
                ${TEIL3_56_REDEMITTEL.filter((r) => r.category.includes('Sauerstoff'))
                  .map(
                    (item) => `
                      <div class="p-2.5 rounded-xl studio-elevated space-y-1">
                        <div class="text-xs font-bold" dir="ltr">„${escapeHtml(item.de)}“</div>
                        <div class="text-[11px] text-amber-300" dir="rtl">${escapeHtml(item.darija)}</div>
                      </div>
                    `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- All 20 Universal Planning Points + 1-Click Direct A2 -> Indirect B2 Transformer -->
        <div class="studio-card rounded-2xl p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div dir="rtl">
              <h3 class="text-lg sm:text-xl font-extrabold text-emerald-400">
                🃏 الـ 20 نقطة العالمية ديال التخطيط (20 Universal-Joker) + محول الأسئلة غير المباشرة
              </h3>
              <p class="text-xs opacity-80">
                كليكي على الزر باش تشوف الفرق بين السؤال المباشر البسيط (A2) والسؤال غير المباشر الراقي (B1/B2 Indirekte Frage):
              </p>
            </div>

            <button
              type="button"
              data-action="toggle-indirect-transformer"
              aria-label="تبديل بين الأسئلة المباشرة A2 والأسئلة غير المباشرة B2"
              class="px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                this.state.indirectTransformerActive
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-amber-500 text-black'
              }"
              dir="rtl"
            >
              ${
                this.state.indirectTransformerActive
                  ? '✨ مفعل: صيغة B2 الاحترافية (Indirekte Fragen + Konjunktiv II)'
                  : '🔄 مفعل: صيغة A2 البسيطة المباشرة (كليكي للترقية لـ B2)'
              }
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            ${TEIL3_20_UNIVERSAL_POINTS.map(
              (pt) => `
                <div class="studio-elevated rounded-xl p-3.5 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold text-emerald-400" dir="rtl">${escapeHtml(pt.titleDarija)}</span>
                    <button
                      type="button"
                      data-action="speak-text"
                      data-text="${escapeHtml(`${pt.indirectB2Question} ${pt.strongB2Answer}`)}"
                      aria-label="نطق النقطة ${pt.number}"
                      class="px-2 py-0.5 rounded bg-black/25 text-[11px] font-mono-de cursor-pointer"
                      dir="ltr"
                    >
                      🔊 Punkt #${pt.number}
                    </button>
                  </div>

                  <div class="text-xs sm:text-sm space-y-1.5" dir="ltr">
                    <div class="p-2 rounded bg-black/20">
                      <span class="text-[11px] font-mono-de text-indigo-300 block">
                        ${this.state.indirectTransformerActive ? '❓ B2 Indirekte Frage (Verb am Ende):' : '❓ A2 Direkte Frage:'}
                      </span>
                      <strong>${renderSentencesWithInlineAudioButtons(
                        this.state.indirectTransformerActive ? pt.indirectB2Question : pt.directA2Question
                      )}</strong>
                    </div>
                    <div class="p-2 rounded bg-black/20">
                      <span class="text-[11px] font-mono-de text-emerald-300 block">
                        ${this.state.indirectTransformerActive ? '💡 B2 Antwort (Konjunktiv II):' : '💡 A2 Antwort:'}
                      </span>
                      <span>${renderSentencesWithInlineAudioButtons(
                        this.state.indirectTransformerActive ? pt.strongB2Answer : pt.directA2Answer
                      )}</span>
                    </div>
                  </div>

                  <div class="text-[11px] text-amber-300" dir="rtl">💡 ${escapeHtml(pt.darijaTip)}</div>
                </div>
              `
            ).join('')}
          </div>
        </div>

        <!-- Kategorie 3 Special Q&As -->
        <div class="studio-card rounded-2xl p-5 space-y-3">
          <h4 class="text-base font-extrabold text-sky-400" dir="rtl">
            📘 أسئلة وأجوبة خاصة بالكاتيغوري 3 (تقديم كتاب، تعلم اللغات، وتقديم بلاد أو مدينة فاس)
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            ${TEIL3_KATEGORIE3_QA.map(
              (qa) => `
                <div class="studio-elevated p-3.5 rounded-xl space-y-2">
                  <div class="text-xs font-bold text-sky-300" dir="rtl">${escapeHtml(qa.topicDarija)}</div>
                  <div class="text-xs font-semibold" dir="ltr">❓ ${renderSentencesWithInlineAudioButtons(qa.questionDe)}</div>
                  <div class="text-xs opacity-90" dir="ltr">✅ ${renderSentencesWithInlineAudioButtons(qa.answerDe)}</div>
                  <div class="text-[11px] text-amber-300" dir="rtl">💡 ${escapeHtml(qa.darijaExplanation)}</div>
                </div>
              `
            ).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // MODULE: TEIL 1 STUDIO (MOHAMMED EL JEBOURI + BIN EL OUIDANE + 5 BACKUPS)
  // ====================================================================
  private renderTeil1Studio(): string {
    return `
      <section class="space-y-6">
        <!-- Mohammed El Jebouri Personal Introduction Card -->
        <div class="studio-card rounded-2xl p-5 border-l-4 border-l-emerald-500 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div dir="rtl">
              <span class="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400">
                Teil 1 • تقديم النفس الرسمي لمحمد الجبوري (15/15 نقطة مضمونة)
              </span>
              <h2 class="text-xl sm:text-2xl font-extrabold mt-1">
                تقديم محمد الجبوري (22 سنة • فاس • باك فيزيك وشيمي • إجازة فـ الاقتصاد)
              </h2>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                data-action="speak-text"
                data-text="${escapeHtml(MOHAMMED_PROFILE.introGerman)}"
                aria-label="استماع لتقديم محمد الجبوري"
                class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white cursor-pointer"
                dir="rtl"
              >
                🔊 اسمع التقديم الكامل (1.0x)
              </button>
              <button
                type="button"
                data-action="speak-text-slow"
                data-text="${escapeHtml(MOHAMMED_PROFILE.introGerman)}"
                aria-label="استماع بطيء لتقديم محمد الجبوري"
                class="studio-elevated px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
                dir="rtl"
              >
                🐢 بطيء (0.8x)
              </button>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-black/25 border border-white/10 text-sm sm:text-base leading-relaxed font-medium" dir="ltr">
            ${renderSentencesWithInlineAudioButtons(MOHAMMED_PROFILE.introGerman)}
          </div>

          <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm font-semibold text-amber-300" dir="rtl">
            🇲🇦 الشرح بالدارجة: ${escapeHtml(MOHAMMED_PROFILE.introDarija)}
          </div>
        </div>

        <!-- 4-Step Presentation: Eine Reise nach Bin el Ouidane -->
        <div class="studio-card rounded-2xl p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div dir="rtl">
              <h3 class="text-lg sm:text-xl font-extrabold text-emerald-400">
                🏞️ العرض الرئيسي (Teil 1): „Eine Reise nach Bin el Ouidane“ (4 مراحل متسلسلة)
              </h3>
              <p class="text-xs opacity-80">
                هذا هو العرض الرسمي ديالك فـ MUNd.pdf ص 1: رحلة الصيف الفايت مع 5 د الصحاب لضاية بين الويدان فـ جبال الأطلس!
              </p>
            </div>
            <button
              type="button"
              data-action="speak-text"
              data-text="${escapeHtml(BIN_EL_OUIDANE_STEPS.map((s) => s.germanText).join(' '))}"
              aria-label="استماع لعرض بين الويدان كاملاً"
              class="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white cursor-pointer"
              dir="rtl"
            >
              🔊 اسمع عرض Bin el Ouidane كامل
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${BIN_EL_OUIDANE_STEPS.map(
              (step) => `
                <div class="studio-elevated rounded-xl p-4 space-y-2.5 flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-extrabold text-emerald-400" dir="ltr">${escapeHtml(step.titleDe)}</span>
                      <button
                        type="button"
                        data-action="speak-text"
                        data-text="${escapeHtml(step.germanText)}"
                        aria-label="نطق المرحلة ${step.stepNumber}"
                        class="px-2 py-0.5 rounded bg-black/30 text-xs cursor-pointer"
                        dir="ltr"
                      >
                        🔊 Schritt ${step.stepNumber}
                      </button>
                    </div>
                    <div class="text-xs font-bold text-amber-300" dir="ltr">${escapeHtml(step.titleSpin)}</div>
                    <div class="text-sm leading-relaxed" dir="ltr">${renderSentencesWithInlineAudioButtons(step.germanText)}</div>
                    <p class="text-xs opacity-80" dir="rtl">🇲🇦 ${escapeHtml(step.darijaText)}</p>
                  </div>

                  <div class="flex flex-wrap gap-1.5 pt-2 border-t border-white/10" dir="ltr">
                    ${step.highlightedSlots
                      .map(
                        (v) =>
                          `<span class="px-2 py-0.5 rounded text-[11px] font-mono-de bg-emerald-500/20 text-emerald-300">${escapeHtml(v)}</span>`
                      )
                      .join('')}
                  </div>
                </div>
              `
            ).join('')}
          </div>
        </div>

        <!-- 4 Examiner Follow-up Questions (Anschlussfragen) -->
        <div class="studio-card rounded-2xl p-5 space-y-4">
          <h3 class="text-lg font-extrabold text-amber-400" dir="rtl">
            ❓ الأسئلة الـ 4 لي غيسولك الممتحن أو البارتنر مباشرة من بعد عرض بين الويدان:
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${BIN_EL_OUIDANE_QAS.map(
              (qa, idx) => `
                <div class="studio-elevated rounded-xl p-4 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-indigo-300" dir="ltr">Frage #${idx + 1}: „${escapeHtml(qa.questionDe)}“</span>
                    <button
                      type="button"
                      data-action="speak-text"
                      data-text="${escapeHtml(`${qa.questionDe} ${qa.answerDe}`)}"
                      aria-label="نطق السؤال والجواب ${idx + 1}"
                      class="px-2 py-0.5 rounded bg-black/30 text-xs cursor-pointer"
                      dir="ltr"
                    >
                      🔊
                    </button>
                  </div>
                  <div class="text-xs font-bold text-amber-300" dir="rtl">${escapeHtml(qa.questionDarija)}</div>
                  <div class="text-sm leading-relaxed" dir="ltr">✅ <strong>Antwort:</strong> ${renderSentencesWithInlineAudioButtons(qa.answerDe)}</div>
                  <div class="text-xs opacity-80" dir="rtl">🇲🇦 ${escapeHtml(qa.answerDarija)}</div>
                </div>
              `
            ).join('')}
          </div>
        </div>

        <!-- 5 Backup Teil 1 Topics -->
        <div class="studio-card rounded-2xl p-5 space-y-4">
          <h3 class="text-lg font-extrabold text-emerald-400" dir="rtl">
            🛡️ المواضيع الـ 5 الاحتياطية ديال Teil 1 (كتاب، فيلم، حدث التخرج، الوالد، الرياضة)
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${TEIL1_BACKUP_TEMPLATES.map((b) => {
              const fullBackupDe = `${b.einleitungDe.replace('[SLOT]', b.slotDefaultValue)} ${b.warumDe} ${b.detailsDe} ${b.fazitDe}`;
              return `
                <div class="studio-elevated rounded-xl p-4 space-y-2 flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-extrabold text-emerald-400" dir="ltr">${escapeHtml(b.topicNameDe)}</span>
                      <button
                        type="button"
                        data-action="speak-text"
                        data-text="${escapeHtml(fullBackupDe)}"
                        aria-label="نطق الموضوع الاحتياطي ${b.topicNameDe}"
                        class="px-2 py-0.5 rounded bg-black/30 text-xs cursor-pointer"
                        dir="ltr"
                      >
                        🔊
                      </button>
                    </div>
                    <div class="text-xs font-bold text-amber-300" dir="rtl">${escapeHtml(b.topicNameDarija)}</div>
                    <div class="text-xs sm:text-sm leading-relaxed" dir="ltr">${renderSentencesWithInlineAudioButtons(fullBackupDe)}</div>
                    <p class="text-xs opacity-75" dir="rtl">${escapeHtml(b.darijaSummary)}</p>
                  </div>
                  <div class="pt-2 border-t border-white/10 text-xs" dir="ltr">
                    <div class="text-indigo-300 font-semibold">🎯 Slot: ${escapeHtml(b.slotDefaultValue)}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // MODULE: PROGRESSIVE SPEAKING LEVELS (A0/A1 -> B2) & 45/60-DAY PLAN
  // ====================================================================
  private renderLevelsAndPlanStudio(): string {
    const filteredDays = STUDY_PLAN_60_DAYS.filter(
      (d) => this.state.selectedStudyLevelFilter === 'ALL' || d.level === this.state.selectedStudyLevelFilter
    );

    return `
      <section class="space-y-6">
        <!-- 4 Official Level Certification Cards -->
        <div class="studio-card rounded-2xl p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div dir="rtl">
              <h2 class="text-xl sm:text-2xl font-extrabold text-emerald-400">
                🎖️ الامتحانات الإشهادية الرسمية للانتقال من A0/A1 ➔ A2 ➔ B1 ➔ B2
              </h2>
              <p class="text-xs opacity-80">
                دوز الامتحان ديال كل مستوى وجيب 80% فما فوق باش تاخد شهادة المستوى وتفتح المستوى الجاي!
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            ${LEVEL_CERTIFICATION_EXAMS.map((cert) => {
              const isUnlocked = this.state.progress.unlockedCertificates.includes(cert.id);
              return `
                <div class="studio-elevated rounded-2xl p-4 flex flex-col justify-between gap-3 border ${
                  isUnlocked ? 'border-emerald-500' : 'border-white/10'
                }">
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <span class="px-2 py-0.5 rounded text-xs font-extrabold bg-emerald-500/20 text-emerald-300" dir="ltr">
                        ${cert.fromLevel} ➔ ${cert.toLevel}
                      </span>
                      <span>${isUnlocked ? '🏆 ناجح' : '📝 امتحان'}</span>
                    </div>
                    <h4 class="text-sm font-extrabold" dir="rtl">${escapeHtml(cert.titleDarija)}</h4>
                    <p class="text-xs opacity-75 font-mono-de" dir="ltr">${escapeHtml(cert.titleDe)}</p>
                  </div>

                  <button
                    type="button"
                    data-action="start-cert-exam"
                    data-cert-id="${cert.id}"
                    aria-label="بدء ${cert.titleDarija}"
                    class="w-full py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                      isUnlocked
                        ? 'bg-emerald-600/25 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }"
                    dir="rtl"
                  >
                    ${isUnlocked ? '🎖️ عاود الامتحان / شوف الشهادة' : '🚀 دوز الامتحان دابا (5 أسئلة)'}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Niveau A0/A1 Phonetics Studio & Niveau A2 Verb-Kick Animator -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Phonetics Studio -->
          <div class="studio-card rounded-2xl p-5 space-y-4">
            <h3 class="text-lg font-extrabold text-emerald-400" dir="rtl">
              🗣️ استوديو النطق الألماني من الصفر (Niveau A0/A1 Aussprache-Studio)
            </h3>
            <div class="space-y-3">
              ${PHONETICS_RULES_A1.map(
                (rule) => `
                  <div class="studio-elevated rounded-xl p-3.5 space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="px-2.5 py-0.5 rounded font-mono-de text-xs font-bold bg-emerald-500/20 text-emerald-300" dir="ltr">
                        ${escapeHtml(rule.symbol)}
                      </span>
                      <span class="text-xs font-semibold opacity-80" dir="ltr">${escapeHtml(rule.titleDe)}</span>
                    </div>
                    <p class="text-xs text-amber-300 font-semibold" dir="rtl">💡 ${escapeHtml(rule.ruleDarija)}</p>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      ${rule.examples
                        .map(
                          (ex) => `
                            <button
                              type="button"
                              data-action="speak-text"
                              data-text="${escapeHtml(ex.sentenceDe)}"
                              aria-label="نطق ${ex.word}"
                              class="p-2 rounded-lg bg-black/25 hover:border-emerald-400 border border-transparent text-left cursor-pointer transition"
                            >
                              <div class="text-xs font-bold text-white flex items-center justify-between" dir="ltr">
                                <span>${escapeHtml(ex.word)}</span>
                                <span>🔊</span>
                              </div>
                              <div class="text-[11px] text-emerald-400 font-bold" dir="rtl">${escapeHtml(ex.phoneticAr)}</div>
                              <div class="text-[10px] opacity-75" dir="rtl">${escapeHtml(ex.meaningDarija)}</div>
                            </button>
                          `
                        )
                        .join('')}
                    </div>
                  </div>
                `
              ).join('')}
            </div>
          </div>

          <!-- Niveau A2/B1 Verb-Kick Animator -->
          <div class="studio-card rounded-2xl p-5 space-y-4">
            <h3 class="text-lg font-extrabold text-amber-400" dir="rtl">
              👟 محاكي ركل الفعل لآخر الجملة مورا dass و weil (Niveau A2 ➔ B2 Verb-Kick)
            </h3>
            <p class="text-xs opacity-85" dir="rtl">
              فـ الجملة العادية (A1) الفعل كيكون فـ المرتبة التانية. ولكن ملي كتدخل عليها القالب ديال البينغ بونغ <strong>„..., dass“</strong>، الفعل كيطير لآخر الجملة وكيتلون بالذهبي:
            </p>
            <div class="space-y-3">
              ${VERB_KICK_EXAMPLES_A2.map(
                (vk) => `
                  <div class="studio-elevated rounded-xl p-3.5 space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-indigo-300" dir="ltr">${escapeHtml(vk.topic)}</span>
                      <button
                        type="button"
                        data-action="speak-text"
                        data-text="${escapeHtml(`${vk.connector} ${vk.subClauseB2} ${vk.kickedVerb}.`)}"
                        aria-label="نطق مثال ركل الفعل ${vk.topic}"
                        class="px-2 py-0.5 rounded bg-black/30 text-xs cursor-pointer"
                        dir="ltr"
                      >
                        🔊 اسمع الجملة
                      </button>
                    </div>
                    <div class="text-xs opacity-75 line-through" dir="ltr">
                      A1 Satz: ${escapeHtml(vk.mainClauseA1)}
                    </div>
                    <div class="text-sm font-semibold" dir="ltr">
                      B2 Slot: „${escapeHtml(vk.connector)} ${escapeHtml(vk.subClauseB2)} <span class="verb-gold-badge px-2 py-0.5 rounded bg-amber-500/25 border border-amber-400 text-amber-300 font-mono-de">${escapeHtml(vk.kickedVerb)}</span>.“
                    </div>
                    <div class="text-xs text-amber-300" dir="rtl">💡 ${escapeHtml(vk.darijaRule)}</div>
                  </div>
                `
              ).join('')}
            </div>
          </div>
        </div>

        <!-- 60-Day / 45-Day Study Plan Roadmap -->
        <div class="studio-card rounded-2xl p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div dir="rtl">
              <h3 class="text-lg sm:text-xl font-extrabold text-emerald-400">
                📅 البرنامج اليومي الكامل (${
                  this.state.progress.planDuration === 45 ? 'خطة 45 يوم المكثفة' : 'خطة 60 يوم المريحة'
                }) — من النهار 1 تال النهار 60
              </h3>
              <p class="text-xs opacity-80">
                كل نهار مقسم لـ 3 تمارين قصيرة: 10 دقايق نطق + 15 دقيقة حفظ الفراغات + 15 دقيقة محاكاة شفوية.
              </p>
            </div>

            <div class="flex items-center gap-1.5">
              ${(['ALL', 'A0/A1', 'A2', 'B1', 'B2'] as const)
                .map(
                  (lvl) => `
                    <button
                      type="button"
                      data-action="filter-study-plan"
                      data-level="${lvl}"
                      aria-label="فلتر الخطة حسب ${lvl}"
                      class="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                        this.state.selectedStudyLevelFilter === lvl
                          ? 'bg-emerald-600 text-white'
                          : 'studio-elevated'
                      }"
                      dir="ltr"
                    >
                      ${lvl === 'ALL' ? 'Alle 60 Tage' : lvl}
                    </button>
                  `
                )
                .join('')}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[560px] overflow-y-auto pr-1">
            ${filteredDays
              .map((d) => {
                const isCurrentDay = this.state.progress.currentDay === d.day;
                const isCompletedDay = d.day < this.state.progress.currentDay;
                return `
                  <div class="studio-elevated rounded-xl p-3.5 space-y-2 border ${
                    isCurrentDay
                      ? 'border-emerald-500 ring-1 ring-emerald-500/40'
                      : isCompletedDay
                      ? 'border-emerald-500/30 opacity-85'
                      : 'border-transparent'
                  }">
                    <div class="flex items-center justify-between">
                      <span class="px-2 py-0.5 rounded text-xs font-extrabold bg-indigo-500/20 text-indigo-300" dir="ltr">
                        60d: Tag ${d.day} | 45d: Tag ${d.intenseDay45} • [${d.level}]
                      </span>
                      <button
                        type="button"
                        data-action="set-current-day"
                        data-day="${d.day}"
                        aria-label="تحديد اليوم ${d.day}"
                        class="text-xs font-bold px-2 py-0.5 rounded cursor-pointer ${
                          isCurrentDay
                            ? 'bg-emerald-600 text-white'
                            : isCompletedDay
                            ? 'text-emerald-400'
                            : 'bg-white/10'
                        }"
                        dir="rtl"
                      >
                        ${isCurrentDay ? '📍 اليوم الحالي' : isCompletedDay ? '✅ تم' : 'اختر'}
                      </button>
                    </div>
                    <h4 class="text-xs sm:text-sm font-extrabold" dir="rtl">${escapeHtml(d.titleDarija)}</h4>
                    <div class="text-[11px] space-y-1 opacity-90" dir="rtl">
                      <div>🗣️ <strong>النطق:</strong> ${escapeHtml(d.pronunciationTask)}</div>
                      <div>🎯 <strong>الفراغات:</strong> ${escapeHtml(d.slotMemoryTask)}</div>
                      <div>🎙️ <strong>التطبيق:</strong> ${escapeHtml(d.speakingSimTask)}</div>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // MODULE: GERMAN JOB INTERVIEW (12 WIRTSCHAFT Q&AS) + LIVE AI EXAMINER
  // ====================================================================
  private renderCareerAndAiStudio(): string {
    return `
      <section class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left 7 Cols: 12 Wirtschaft Job Interview Q&As for Mohammed -->
          <div class="lg:col-span-7 space-y-4">
            <div class="studio-card rounded-2xl p-5 space-y-3 border-l-4 border-l-amber-500">
              <span class="px-2.5 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-300" dir="ltr">
                Karriere-Studio • Bachelor Wirtschaft • Fès ➔ Deutschland
              </span>
              <h2 class="text-xl sm:text-2xl font-extrabold" dir="rtl">
                💼 استوديو مقابلة العمل فـ ألمانيا (12 سؤال وجواب مخصص لمحمد الجبوري فـ الاقتصاد)
              </h2>
              <p class="text-xs opacity-85" dir="rtl">
                كل سؤال فيه جواب بسيط (A2/B1) وجواب احترافي قوي (B2 Business) كيربط ما بين الباك ديالك فـ الفيزيك والشيمي والإجازة فـ الاقتصاد!
              </p>
            </div>

            <div class="space-y-3.5">
              ${WIRTSCHAFT_JOB_INTERVIEW_12_QAS.map((qa) => {
                const useB2 = this.state.showB2InterviewVersion[qa.id] !== false;
                const answerText = useB2 ? qa.strongB2Answer : qa.simpleA2B1Answer;
                return `
                  <div class="studio-card rounded-2xl p-4 sm:p-5 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <h4 class="text-sm sm:text-base font-extrabold text-emerald-400" dir="ltr">
                        ${escapeHtml(qa.questionDe)}
                      </h4>
                      <div class="flex items-center gap-1.5">
                        <button
                          type="button"
                          data-action="toggle-interview-level"
                          data-id="${qa.id}"
                          aria-label="تبديل مستوى الجواب للسؤال ${qa.id}"
                          class="px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                            useB2
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }"
                          dir="ltr"
                        >
                          ${useB2 ? '⭐ B2 Business-Antwort' : '📘 A2/B1 Basis-Antwort'}
                        </button>
                        <button
                          type="button"
                          data-action="speak-text"
                          data-text="${escapeHtml(answerText)}"
                          aria-label="نطق الجواب ${qa.id}"
                          class="studio-elevated px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer"
                          dir="ltr"
                        >
                          🔊 اسمع
                        </button>
                      </div>
                    </div>

                    <div class="text-xs font-bold text-amber-300" dir="rtl">${escapeHtml(qa.questionDarija)}</div>

                    <div class="p-3.5 rounded-xl bg-black/25 border border-white/10 text-sm leading-relaxed" dir="ltr">
                      ${renderSentencesWithInlineAudioButtons(answerText)}
                    </div>

                    <div class="text-xs opacity-85" dir="rtl">
                      💡 <strong>نصيحة الكوتش بالدارجة:</strong> ${escapeHtml(qa.darijaCoachTip)}
                    </div>

                    <div class="flex flex-wrap gap-1.5 pt-1" dir="ltr">
                      ${qa.keyVocabulary
                        .map(
                          (kv) =>
                            `<span class="px-2 py-0.5 rounded text-[11px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">${escapeHtml(
                              kv.word
                            )} (${escapeHtml(kv.meaningDarija)})</span>`
                        )
                        .join('')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Right 5 Cols: Live AI Examiner & Partner Simulator + Live Voice Call Studio + Search Grounding -->
          <div class="lg:col-span-5 space-y-4">
            <div class="studio-card rounded-2xl p-5 space-y-4 lg:sticky lg:top-24 border-2 border-indigo-500/40">
              <!-- Simulator Header & Speaking Avatar Indicator -->
              <div class="flex flex-wrap items-center justify-between gap-2" dir="rtl">
                <div>
                  <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-300" dir="ltr">
                    Strict TELC B2 Prüfer • 2-Tier Real AI Engine
                  </span>
                  <h3 class="text-lg font-extrabold mt-1">
                    🎙️ المحاكي الصوتي المباشر والممتحن الصارم (60/60 Pkt.)
                  </h3>
                </div>
                ${
                  this.state.simPartnerIsSpeaking || this.state.callState === 'AI_SPEAKING'
                    ? `<div class="px-3 py-1.5 rounded-xl bg-emerald-500/25 border border-emerald-400 text-emerald-300 text-xs font-extrabold animate-pulse flex items-center gap-1.5" dir="rtl">
                        <span>🗣️</span>
                        <span>البارتنر كيهضر معاك دابا...</span>
                      </div>`
                    : `<span class="px-2.5 py-1 rounded-lg bg-black/30 text-[11px] font-mono-de text-amber-300" dir="ltr">
                        Ronde #${this.state.simRoundNumber}
                      </span>`
                }
              </div>

              <!-- PROMINENT TOP TOGGLE: [💬 وضع الشات والتدريب] | [📞 اتصال صوتي مباشر (Live Voice Call)] + Green Call Button -->
              <div class="space-y-2" dir="rtl">
                <div class="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/35 border border-white/15">
                  <button
                    type="button"
                    data-action="set-sim-submode"
                    data-submode="chat"
                    aria-label="وضع الشات والتدريب"
                    class="py-2.5 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      this.state.simSubMode === 'chat'
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'hover:bg-white/5 opacity-80'
                    }"
                  >
                    <span>💬</span>
                    <span>وضع الشات والتدريب</span>
                  </button>

                  <button
                    type="button"
                    data-action="set-sim-submode"
                    data-submode="call"
                    aria-label="اتصال صوتي مباشر Live Voice Call"
                    class="py-2.5 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      this.state.simSubMode === 'call'
                        ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400/60'
                        : 'hover:bg-white/5 opacity-80'
                    }"
                  >
                    <span>📞</span>
                    <span>اتصال صوتي مباشر (Live Voice Call)</span>
                  </button>
                </div>

                ${
                  this.state.simSubMode === 'chat'
                    ? `<button
                        type="button"
                        data-action="start-live-voice-call"
                        aria-label="اتصل بالممتحن أو البارتنر دابا"
                        class="w-full py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-white border border-emerald-300/60 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
                      >
                        <span>📞</span>
                        <span>اتصل بالممتحن / البارتنر دابا (Live AI Voice Call)</span>
                      </button>`
                    : ''
                }
              </div>

              ${
                this.state.simSubMode === 'call'
                  ? this.renderLiveVoiceCallStudio()
                  : `
              <!-- Large Hands-Free Voice Mode Button -->
              <button
                type="button"
                data-action="toggle-hands-free-mode"
                aria-label="وضع المحادثة الصوتية الحية Hands-Free Voice Mode"
                class="w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                  this.state.simHandsFreeMode || this.state.simIsListening
                    ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white border-2 border-white/60 animate-pulse'
                    : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white border border-emerald-400/50'
                }"
                dir="rtl"
              >
                <span class="text-base">${this.state.simIsListening ? '⏹️' : '🎙️'}</span>
                <span>
                  ${
                    this.state.simIsListening
                      ? 'وقف المحادثة الصوتية الحية وأرسل الجواب دابا'
                      : '🎙️ وضع المحادثة الصوتية الحية (Hands-Free Voice Mode)'
                  }
                </span>
              </button>

              <!-- Voice & Auto-Speak Toolbar -->
              <div class="p-3 rounded-xl studio-elevated space-y-2.5">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <!-- Language Toggle: DE vs Darija -->
                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      data-action="set-sim-speech-lang"
                      data-lang="de-DE"
                      aria-label="التعرف الصوتي بالألمانية de-DE"
                      class="px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                        this.state.simSpeechLang === 'de-DE'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-black/25 opacity-75'
                      }"
                      dir="rtl"
                    >
                      🇩🇪 الألمانية (de-DE)
                    </button>
                    <button
                      type="button"
                      data-action="set-sim-speech-lang"
                      data-lang="ar-MA"
                      aria-label="التعرف الصوتي بالدارجة المغربية ar-MA"
                      class="px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                        this.state.simSpeechLang === 'ar-MA'
                          ? 'bg-amber-500 text-black'
                          : 'bg-black/25 opacity-75'
                      }"
                      dir="rtl"
                    >
                      🇲🇦 الدارجة/العربية (ar-MA)
                    </button>
                  </div>

                  <!-- Auto-Send After Silence Toggle -->
                  <button
                    type="button"
                    data-action="toggle-sim-autosend"
                    aria-label="إرسال تلقائي بعد السكوت"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer border ${
                      this.state.simAutoSendAfterSilence
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-black/20 border-white/10 opacity-70'
                    }"
                    dir="rtl"
                  >
                    ⚡ إرسال تلقائي بعد السكوت: ${this.state.simAutoSendAfterSilence ? 'ON' : 'OFF'}
                  </button>
                </div>

                <!-- Auto-Speak Partner Reply Toggle & Speed Selector -->
                <div class="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-white/10">
                  <button
                    type="button"
                    data-action="toggle-sim-autospeak"
                    aria-label="نطق رد البارتنر تلقائياً"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer border ${
                      this.state.simAutoSpeakReply
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200'
                        : 'bg-black/20 border-white/10 opacity-70'
                    }"
                    dir="rtl"
                  >
                    🔊 نطق رد البارتنر تلقائياً (Auto-Speak Reply: ${this.state.simAutoSpeakReply ? 'ON' : 'OFF'})
                  </button>

                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      data-action="set-sim-speak-speed"
                      data-speed="0.85"
                      aria-label="سرعة نطق 0.85x بطيء وواضح"
                      class="px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                        this.state.simSpeakSpeed === 0.85 ? 'bg-amber-500 text-black' : 'bg-black/25 opacity-75'
                      }"
                      dir="rtl"
                    >
                      🐢 0.85x بطيء وواضح
                    </button>
                    <button
                      type="button"
                      data-action="set-sim-speak-speed"
                      data-speed="1"
                      aria-label="سرعة نطق 1.0x طبيعي"
                      class="px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                        this.state.simSpeakSpeed === 1.0 ? 'bg-emerald-600 text-white' : 'bg-black/25 opacity-75'
                      }"
                      dir="rtl"
                    >
                      ⚡ 1.0x طبيعي
                    </button>
                  </div>
                </div>
              </div>

              <!-- Simulator Mode & Persona Selectors -->
              <div class="grid grid-cols-2 gap-2">
                <select
                  data-action="change-ai-sim-mode"
                  aria-label="اختيار قسم المحاكاة"
                  class="studio-elevated px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  dir="rtl"
                >
                  <option value="teil2" ${this.state.aiSimMode === 'teil2' ? 'selected' : ''}>🏓 Teil 2: البينغ بونغ (Ronde 1➔6)</option>
                  <option value="teil3" ${this.state.aiSimMode === 'teil3' ? 'selected' : ''}>🤝 Teil 3: التخطيط المشترك (20 نقطة)</option>
                  <option value="teil1" ${this.state.aiSimMode === 'teil1' ? 'selected' : ''}>✈️ Teil 1: التقديم + بين الويدان</option>
                  <option value="interview" ${this.state.aiSimMode === 'interview' ? 'selected' : ''}>💼 مقابلة العمل (12 سؤال HR)</option>
                </select>

                <select
                  data-action="change-ai-persona"
                  aria-label="اختيار شخصية البارتنر"
                  class="studio-elevated px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  dir="rtl"
                >
                  <option value="friendly" ${this.state.aiPersona === 'friendly' ? 'selected' : ''}>😊 بارتنر متعاون وطبيعي</option>
                  <option value="shy" ${this.state.aiPersona === 'shy' ? 'selected' : ''}>😳 بارتنر مبلوكي (عطيه الأوكسجين!)</option>
                  <option value="dominant" ${this.state.aiPersona === 'dominant' ? 'selected' : ''}>🗣️ بارتنر كيهضر بزاف (قاطعو بأدب!)</option>
                </select>
              </div>

              <!-- Active Turn Target & Hint Box -->
              ${(() => {
                const turnCtx = this.buildCurrentSimulatorContext();
                const expected = getExpectedSentenceForTurn(turnCtx);
                return `
                  <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <span class="text-xs font-extrabold text-amber-300" dir="rtl">${escapeHtml(expected.roundLabelDarija)}</span>
                      <button
                        type="button"
                        data-action="show-sim-hint"
                        aria-label="عطيني بداية الجملة Hint"
                        class="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-amber-500/25 hover:bg-amber-500 text-amber-200 hover:text-black border border-amber-400/50 transition cursor-pointer"
                        dir="rtl"
                      >
                        💡 عطيني بداية الجملة (Hint)
                      </button>
                    </div>
                    ${
                      this.state.simHintVisible
                        ? `<div class="p-2.5 rounded-lg bg-black/40 border border-amber-400/40 space-y-1.5" dir="ltr">
                            <div class="text-xs font-mono-de text-amber-300 font-bold">
                              💡 Anfang (4 Wörter): „${escapeHtml(expected.hintFirst4Words)}“
                            </div>
                            <div class="text-xs opacity-90">
                              🎯 Ganze Musterlösung: „${renderClauseWithGoldVerb(expected.targetSentenceDe)}“
                            </div>
                            <div class="flex flex-wrap gap-2 pt-1">
                              <button
                                type="button"
                                data-action="speak-target-sentence-now"
                                data-sentence="${escapeHtml(expected.targetSentenceDe)}"
                                aria-label="هضر وقول هاد الجملة دابا"
                                class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 text-white cursor-pointer"
                                dir="rtl"
                              >
                                🎙️ هضر وقول هاد الجملة دابا
                              </button>
                              <button
                                type="button"
                                data-action="speak-text"
                                data-text="${escapeHtml(expected.targetSentenceDe)}"
                                aria-label="اسمع النطق الصحيح للجملة"
                                class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-600 text-white cursor-pointer"
                                dir="rtl"
                              >
                                🔊 اسمع النطق الصحيح
                              </button>
                            </div>
                          </div>`
                        : ''
                    }
                  </div>
                `;
              })()}

              <!-- Teil 3 Live Scratchpad Auto-Check Tracker (Visible in Teil 3 mode) -->
              ${
                this.state.aiSimMode === 'teil3'
                  ? `<div class="p-3 rounded-xl studio-elevated space-y-1.5">
                      <div class="text-xs font-extrabold text-emerald-400" dir="rtl">
                        📝 ورقة الوسخ التفاعلية (النقط لي هضرتي عليهم بصوتك كيتعلمو أوتوماتيكياً ✅):
                      </div>
                      <div class="flex flex-wrap gap-1" dir="ltr">
                        ${TEIL3_20_UNIVERSAL_POINTS.map((pt) => {
                          const done = this.state.teil3CheckedPointNumbers.includes(pt.number);
                          return `<span class="px-2 py-0.5 rounded text-[10px] font-mono-de border ${
                            done
                              ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 font-bold'
                              : 'bg-black/20 border-white/10 opacity-65'
                          }">${done ? '✅' : '⬜'} #${pt.number} ${escapeHtml(pt.titleDe.split('(')[0].trim())}</span>`;
                        }).join('')}
                      </div>
                    </div>`
                  : ''
              }

              <!-- Live Audio Waveform Visualizer When Microphone is Active -->
              ${
                this.state.simIsListening
                  ? `<div class="p-3.5 rounded-2xl bg-rose-950/60 border-2 border-rose-500 space-y-2 animate-pulse">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-extrabold text-rose-300" dir="rtl">
                          🔴 كنسمعك دابا... هضر بالألمانية بكل راحة!
                        </span>
                        <span class="text-[11px] font-mono-de text-emerald-300" dir="ltr">
                          MIC LIVE (${this.state.simSpeechLang})
                        </span>
                      </div>
                      <!-- Waveform Bars -->
                      <div class="flex items-end justify-center gap-1.5 h-7">
                        <span class="w-1.5 h-3 bg-rose-400 rounded-full animate-bounce"></span>
                        <span class="w-1.5 h-6 bg-emerald-400 rounded-full animate-pulse"></span>
                        <span class="w-1.5 h-4 bg-amber-400 rounded-full animate-bounce"></span>
                        <span class="w-1.5 h-7 bg-emerald-400 rounded-full animate-pulse"></span>
                        <span class="w-1.5 h-5 bg-rose-400 rounded-full animate-bounce"></span>
                        <span class="w-1.5 h-7 bg-indigo-400 rounded-full animate-pulse"></span>
                        <span class="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce"></span>
                      </div>
                    </div>`
                  : ''
              }

              <!-- Chat History -->
              <div class="space-y-3 max-h-96 overflow-y-auto p-3 rounded-xl bg-black/25 border border-white/10">
                ${this.state.aiConversation
                  .map((msg, msgIdx) =>
                    msg.sender === 'mohammed'
                      ? `
                        <div class="p-3 rounded-xl bg-emerald-600/25 border border-emerald-500/40 text-xs sm:text-sm space-y-1" dir="ltr">
                          <div class="flex items-center justify-between">
                            <span class="text-[11px] font-bold text-emerald-300">👤 Mohammed (Gesprochen / Geschrieben):</span>
                            <button
                              type="button"
                              data-action="speak-sim-bubble"
                              data-text="${escapeHtml(msg.textDe)}"
                              aria-label="إعادة سماع جملة محمد ${msgIdx + 1}"
                              class="px-2 py-0.5 rounded bg-black/30 text-[10px] font-bold text-emerald-200 cursor-pointer"
                              dir="rtl"
                            >
                              🔊 اسمع صوتك
                            </button>
                          </div>
                          <div>„${escapeHtml(msg.textDe)}“</div>
                        </div>
                      `
                      : `
                        <div class="p-3.5 rounded-xl ${
                          msg.isSanityRejected
                            ? 'bg-rose-950/60 border-2 border-rose-500'
                            : 'studio-elevated border border-indigo-500/30'
                        } space-y-2 text-xs sm:text-sm">
                          <div class="flex flex-wrap items-center justify-between gap-1.5">
                            <span class="text-[11px] font-bold text-indigo-300" dir="ltr">🤖 TELC B2 Prüfer & Partner:</span>
                            <div class="flex items-center gap-1.5">
                              ${
                                typeof msg.score === 'number'
                                  ? msg.isSanityRejected || msg.score === 0
                                    ? `<span class="px-2 py-0.5 rounded bg-rose-500/30 border border-rose-400 text-rose-200 text-[10px] font-extrabold" dir="rtl">0 / 60 Pkt. ❌ (جواب غير مقبول فـ الامتحان)</span>`
                                    : `<span class="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold" dir="ltr">${msg.score}/60 Pkt. • Niveau ${msg.cefrLevel || 'B2'}</span>`
                                  : ''
                              }
                              <button
                                type="button"
                                data-action="speak-sim-bubble"
                                data-text="${escapeHtml(msg.textDe)}"
                                aria-label="عاود سمع رد البارتنر ${msgIdx + 1}"
                                class="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold cursor-pointer"
                                dir="rtl"
                              >
                                🔊 عاود سمع رد البارتنر
                              </button>
                            </div>
                          </div>

                          <div class="font-medium leading-relaxed" dir="ltr">„${escapeHtml(msg.textDe)}“</div>

                          ${
                            msg.darijaTip
                              ? `<div class="text-xs ${
                                  msg.isSanityRejected ? 'text-rose-200 font-bold' : 'text-amber-300'
                                } pt-1.5 border-t border-white/10 leading-relaxed" dir="rtl">
                                  ${escapeHtml(msg.darijaTip)}
                                </div>`
                              : ''
                          }

                          ${
                            msg.correctedSentenceDe
                              ? `<div class="p-2.5 rounded-lg bg-black/35 border border-emerald-500/30 space-y-1.5" dir="ltr">
                                  <div class="text-[11px] font-bold text-emerald-400" dir="rtl">
                                    🎯 الجملة الألمانية المطلوبة فهاد الجولة (Verb am Ende):
                                  </div>
                                  <div class="text-xs leading-relaxed">
                                    „${renderClauseWithGoldVerb(msg.correctedSentenceDe)}“
                                  </div>
                                  <div class="flex flex-wrap items-center gap-2 pt-1">
                                    <button
                                      type="button"
                                      data-action="speak-target-sentence-now"
                                      data-sentence="${escapeHtml(msg.correctedSentenceDe)}"
                                      aria-label="هضر وقول هاد الجملة دابا"
                                      class="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                                      dir="rtl"
                                    >
                                      🎙️ هضر وقول هاد الجملة دابا
                                    </button>
                                    <button
                                      type="button"
                                      data-action="speak-text"
                                      data-text="${escapeHtml(msg.correctedSentenceDe)}"
                                      aria-label="اسمع النطق الصحيح"
                                      class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-600/80 hover:bg-indigo-500 text-white cursor-pointer"
                                      dir="rtl"
                                    >
                                      🔊 اسمع النطق الصحيح
                                    </button>
                                  </div>
                                </div>`
                              : ''
                          }

                          ${
                            msg.scorecard
                              ? `<div class="p-3 rounded-xl bg-emerald-950/60 border-2 border-emerald-400 space-y-2" dir="ltr">
                                  <div class="text-xs font-extrabold text-emerald-300 flex items-center justify-between">
                                    <span>🏆 Offizieller TELC B2 Mündlich Scorecard</span>
                                    <span>${msg.scorecard.totalOutOf60} / 60 Pkt. (${msg.scorecard.passed ? 'BESTANDEN ✅' : 'NICHT BESTANDEN ❌'})</span>
                                  </div>
                                  <div class="grid grid-cols-2 gap-1.5 text-[11px]">
                                    <div class="p-1.5 rounded bg-black/30">Ausdrucksfähigkeit: <strong>${msg.scorecard.ausdruck}/15</strong></div>
                                    <div class="p-1.5 rounded bg-black/30">Aufgabenbewältigung: <strong>${msg.scorecard.aufgabe}/15</strong></div>
                                    <div class="p-1.5 rounded bg-black/30">Formale Korrektheit: <strong>${msg.scorecard.korrektheit}/15</strong></div>
                                    <div class="p-1.5 rounded bg-black/30">Aussprache & Intonation: <strong>${msg.scorecard.aussprache}/15</strong></div>
                                  </div>
                                  <div class="text-xs text-amber-300 font-bold" dir="rtl">${escapeHtml(msg.scorecard.summaryDarija)}</div>
                                </div>`
                              : ''
                          }
                        </div>
                      `
                  )
                  .join('')}
              </div>

              <!-- 3 Convenient Speaking Controls Above Input -->
              <div class="flex flex-wrap items-center gap-1.5" dir="rtl">
                <button
                  type="button"
                  data-action="send-ai-chat"
                  aria-label="إرسال الجواب الصوتي"
                  class="flex-1 px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/40 transition cursor-pointer"
                >
                  ✅ إرسال الجواب الصوتي
                </button>
                <button
                  type="button"
                  data-action="restart-sim-mic"
                  aria-label="عاود التسجيل"
                  class="px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold studio-elevated hover:border-amber-400 cursor-pointer"
                >
                  🔄 عاود التسجيل
                </button>
                <button
                  type="button"
                  data-action="show-sim-hint"
                  aria-label="عطيني بداية الجملة Hint"
                  class="px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-black transition cursor-pointer"
                >
                  💡 عطيني بداية الجملة (Hint)
                </button>
              </div>

              <!-- Chat Input + Glowing Microphone Button ("🎙️ هضر بصوتك") -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  data-action="toggle-sim-mic"
                  aria-label="${this.state.simIsListening ? 'وقف وأرسل' : 'هضر بصوتك'}"
                  class="px-3.5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 shadow-lg transition ${
                    this.state.simIsListening
                      ? 'bg-rose-600 text-white ring-2 ring-rose-400 animate-pulse'
                      : 'bg-amber-500 hover:bg-amber-400 text-black'
                  }"
                  dir="rtl"
                >
                  <span>${this.state.simIsListening ? '⏹️ وقف وأرسل' : '🎙️ هضر بصوتك'}</span>
                </button>

                <input
                  type="text"
                  data-action="ai-chat-input"
                  value="${escapeHtml(this.state.aiUserMessage)}"
                  placeholder="هضر فـ المايك 🎙️ أو كتب جملتك بالألمانية هنا (مثلا: Der Text befasst sich mit...)..."
                  aria-label="رسالتك للممتحن الذكي"
                  class="studio-elevated flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm"
                  dir="ltr"
                />

                <button
                  type="button"
                  data-action="send-ai-chat"
                  aria-label="إرسال الجملة للممتحن الذكي"
                  class="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  dir="rtl"
                >
                  ${this.state.aiLoading ? '⏳...' : 'إرسال ➔'}
                </button>
              </div>
              `
              }

              <!-- Google Search Career Grounding Box -->
              <div class="pt-3 border-t border-white/10 space-y-2">
                <div class="text-xs font-bold text-sky-400" dir="rtl">
                  🌐 بحث مباشر فـ سوق الشغل الألماني (Google Search Grounding):
                </div>
                <div class="flex gap-2">
                  <input
                    type="text"
                    data-action="career-search-input"
                    value="${escapeHtml(this.state.careerSearchQuery)}"
                    aria-label="البحث عن فرص العمل في ألمانيا"
                    class="studio-elevated flex-1 px-3 py-2 rounded-xl text-xs"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    data-action="run-career-search"
                    aria-label="بحث في سوق العمل الألماني"
                    class="px-3 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white cursor-pointer"
                    dir="rtl"
                  >
                    ${this.state.careerSearchLoading ? '...' : '🔎 بحث'}
                  </button>
                </div>
                ${
                  this.state.careerSearchResult
                    ? `<div class="p-3 rounded-xl studio-elevated text-xs space-y-1.5" dir="rtl">
                        <div>${escapeHtml(this.state.careerSearchResult.text)}</div>
                      </div>`
                    : ''
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private renderLiveVoiceCallStudio(): string {
    const exam = this.getCurrentExam();
    const teil3Topic = this.getCurrentTeil3Topic();
    const turnCtx = this.buildCurrentSimulatorContext();
    const whisper = getTeleprompterWhisperLevels(turnCtx);

    const mins = Math.floor(this.state.callDurationSeconds / 60);
    const secs = this.state.callDurationSeconds % 60;
    const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const modeLabels: Record<'teil1' | 'teil2' | 'teil3' | 'interview', string> = {
      teil1: 'Teil 1: Bin el Ouidane',
      teil2: 'Teil 2: Ping-Pong Ronde 1–6',
      teil3: 'Teil 3: التخطيط 3 دقائق',
      interview: '💼 مقابلة العمل Wirtschaft'
    };
    const activeTopicTitle =
      this.state.aiSimMode === 'teil2'
        ? `#${exam.id} ${exam.titleDe}`
        : this.state.aiSimMode === 'teil3'
        ? `#${teil3Topic.id} ${teil3Topic.titleDe}`
        : this.state.aiSimMode === 'teil1'
        ? 'Mohammed El Jebouri • Reise nach Bin el Ouidane'
        : `Vorstellungsgespräch Q#${((this.state.simRoundNumber - 1) % 12) + 1}`;

    const avatarMeta: Record<
      'pruefer_markus' | 'partnerin_lisa' | 'hr_thomas',
      { emoji: string; nameDe: string; roleDarija: string }
    > = {
      pruefer_markus: {
        emoji: '👨‍🏫',
        nameDe: 'Prüfer Markus',
        roleDarija: 'ممتحن رسمي (TELC B2 Prüfer)'
      },
      partnerin_lisa: {
        emoji: '👩‍🎓',
        nameDe: 'Partnerin Lisa',
        roleDarija: 'بارتنر الامتحان الشفوي (Ping-Pong Partnerin)'
      },
      hr_thomas: {
        emoji: '👔',
        nameDe: 'HR-Manager Thomas',
        roleDarija: 'مدير شركة ألمانية (Wirtschaft & Controlling)'
      }
    };
    const activeAvatar = avatarMeta[this.state.callAvatarRole];

    const isCallActive =
      this.state.callState === 'AI_SPEAKING' ||
      this.state.callState === 'USER_LISTENING' ||
      this.state.callState === 'EVALUATING' ||
      this.state.callState === 'PAUSED';

    // Orb styling & status label by callState
    let orbOuterClass = 'border-slate-500/40 bg-slate-900/50';
    let orbInnerClass = 'border-slate-400/50 bg-slate-800';
    let statusBadgeText = '⚪ المكالمة واجدة — برك على "ابدأ المكالمة الصوتية" لتحت!';
    let statusBadgeColor = 'bg-slate-800 text-slate-200 border-slate-600';

    if (this.state.callState === 'AI_SPEAKING') {
      orbOuterClass = 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_45px_rgba(34,211,238,0.45)] animate-pulse';
      orbInnerClass = 'border-indigo-400 bg-gradient-to-br from-cyan-600 to-indigo-700';
      statusBadgeText = '🔵 🗣️ البارتنر كيهضر معاك دابا... اسمع مزيان!';
      statusBadgeColor = 'bg-cyan-950/90 text-cyan-200 border-cyan-400';
    } else if (this.state.callState === 'USER_LISTENING') {
      orbOuterClass = 'border-emerald-400 bg-emerald-500/25 shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-pulse';
      orbInnerClass = 'border-emerald-300 bg-gradient-to-br from-emerald-600 to-teal-700';
      statusBadgeText = this.state.callMicMuted
        ? '🔇 المايك مكتوم — حيد الكتم باش يسمعك البارتنر!'
        : '🟢 🎙️ نوبتك دابا! هضر بالألمانية (المايك محلول أوتوماتيكياً)...';
      statusBadgeColor = 'bg-emerald-950/90 text-emerald-200 border-emerald-400';
    } else if (this.state.callState === 'EVALUATING') {
      orbOuterClass = 'border-purple-400 bg-purple-500/25 shadow-[0_0_45px_rgba(168,85,247,0.5)] animate-spin';
      orbInnerClass = 'border-amber-400 bg-gradient-to-br from-purple-700 to-amber-600';
      statusBadgeText = '🟣 ⚡ كيحلل جوابك وكيوجد الرد الصوتي...';
      statusBadgeColor = 'bg-purple-950/90 text-purple-200 border-purple-400';
    } else if (this.state.callState === 'PAUSED') {
      orbOuterClass = 'border-amber-400/60 bg-amber-500/15';
      orbInnerClass = 'border-amber-300 bg-amber-900/60';
      statusBadgeText = '⏸️ المكالمة متوقفة مؤقتاً — برك على استئناف باش تكمل!';
      statusBadgeColor = 'bg-amber-950/90 text-amber-200 border-amber-400';
    }

    return `
      <div class="space-y-3.5" data-testid="live-voice-call-studio">
        <!-- A. TOP CALL STATUS HEADER -->
        <div class="p-3.5 rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950/80 to-emerald-950/70 border border-emerald-500/40 space-y-2.5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2" dir="rtl">
              <span class="px-2.5 py-1 rounded-full text-xs font-mono-de font-extrabold border ${
                isCallActive
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-white/10 border-white/20 text-slate-300'
              }">
                ${formattedTime} ${isCallActive ? '🟢 متصل دابا' : '⚪ جاهز'}
              </span>
              <span class="px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold bg-indigo-500/25 text-indigo-200 border border-indigo-400/30">
                ${escapeHtml(modeLabels[this.state.aiSimMode])}
              </span>
            </div>
            <span class="text-[11px] font-mono-de text-amber-300 font-bold" dir="ltr">
              Ronde #${this.state.simRoundNumber}
            </span>
          </div>

          <div class="text-xs font-bold text-emerald-200 truncate" dir="ltr">
            📌 ${escapeHtml(activeTopicTitle)}
          </div>

          <!-- Mode & Call Persona Selectors -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <select
              data-action="change-ai-sim-mode"
              aria-label="تغيير وضع الامتحان وسط المكالمة"
              class="studio-elevated px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer"
              dir="rtl"
            >
              <option value="teil2" ${this.state.aiSimMode === 'teil2' ? 'selected' : ''}>🏓 Teil 2: Ping-Pong Ronde 1–6</option>
              <option value="teil3" ${this.state.aiSimMode === 'teil3' ? 'selected' : ''}>🤝 Teil 3: التخطيط 3 دقائق</option>
              <option value="teil1" ${this.state.aiSimMode === 'teil1' ? 'selected' : ''}>✈️ Teil 1: Bin el Ouidane</option>
              <option value="interview" ${this.state.aiSimMode === 'interview' ? 'selected' : ''}>💼 مقابلة العمل Wirtschaft</option>
            </select>

            <select
              data-action="change-call-avatar-role"
              aria-label="اختيار شخصية المتصل في المكالمة"
              class="studio-elevated px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer"
              dir="rtl"
            >
              <option value="pruefer_markus" ${this.state.callAvatarRole === 'pruefer_markus' ? 'selected' : ''}>👨‍🏫 Prüfer Markus (ممتحن رسمي)</option>
              <option value="partnerin_lisa" ${this.state.callAvatarRole === 'partnerin_lisa' ? 'selected' : ''}>👩‍🎓 Partnerin Lisa (بارتنر الامتحان)</option>
              <option value="hr_thomas" ${this.state.callAvatarRole === 'hr_thomas' ? 'selected' : ''}>👔 HR-Manager Thomas (مدير شركة ألمانية)</option>
            </select>
          </div>

          <!-- CENTER ANIMATED AI AVATAR & DYNAMIC AUDIO ORB -->
          <div class="py-4 flex flex-col items-center justify-center text-center space-y-3 relative">
            <div class="relative flex items-center justify-center w-32 h-32">
              <!-- Outer Soundwave Ring -->
              <div class="absolute inset-0 rounded-full border-4 transition-all duration-300 ${orbOuterClass}"></div>
              <!-- Middle Harmonic Ring -->
              <div class="absolute inset-3 rounded-full border-2 border-white/25 transition-all duration-300"></div>
              <!-- Inner Avatar Core -->
              <div class="relative w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center shadow-2xl ${orbInnerClass}">
                <span class="text-3xl">${activeAvatar.emoji}</span>
              </div>
            </div>

            <div>
              <div class="text-sm font-extrabold text-white" dir="ltr">${escapeHtml(activeAvatar.nameDe)}</div>
              <div class="text-[11px] text-indigo-200" dir="rtl">${escapeHtml(activeAvatar.roleDarija)}</div>
            </div>

            <!-- Live Call State Pill -->
            <div class="px-3.5 py-1.5 rounded-full border text-xs font-extrabold ${statusBadgeColor}" dir="rtl">
              ${escapeHtml(statusBadgeText)}
            </div>

            <!-- Non-intrusive Instant Score Toast Card -->
            ${
              this.state.callInstantToast
                ? `<div class="w-full p-2.5 rounded-xl border ${
                    this.state.callInstantToast.isPositive
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                      : 'bg-rose-950/90 border-rose-400 text-rose-200'
                  } text-xs space-y-1 shadow-lg" dir="rtl">
                    <div class="font-extrabold">${escapeHtml(this.state.callInstantToast.badgeText)}</div>
                    <div class="text-[11px] opacity-90">${escapeHtml(this.state.callInstantToast.detailDarija)}</div>
                  </div>`
                : ''
            }

            <!-- What the AI Partner just said / asked -->
            <div class="w-full p-3 rounded-xl bg-black/45 border border-cyan-500/30 text-left space-y-1" dir="ltr">
              <div class="flex items-center justify-between text-[10px] text-cyan-300 font-bold">
                <span>🗣️ ${escapeHtml(activeAvatar.nameDe)} sagt:</span>
                <button
                  type="button"
                  data-action="call-repeat-last-ai"
                  aria-label="تكرار آخر جملة قالها البارتنر"
                  class="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 cursor-pointer"
                  dir="rtl"
                >
                  🔊 عاود سمع السؤال
                </button>
              </div>
              <div class="text-xs sm:text-sm font-medium leading-relaxed text-white">
                „${escapeHtml(this.state.callLastAiQuestionDe)}“
              </div>
            </div>

            <!-- Floating Live Captions Bar (محمد كيهضر دابا) + Manual Send / Retry Controls -->
            <div class="w-full p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 space-y-2">
              <div class="flex items-center justify-between text-[11px]" dir="rtl">
                <span class="font-extrabold text-emerald-300">
                  🎙️ Live Captions (كلامك المباشر بالألمانية):
                </span>
                <span class="text-[10px] text-amber-300">
                  ⚡ كيتصيفط أوتوماتيكياً مور 2.4 ثواني د السكوت
                </span>
              </div>

              <input
                type="text"
                data-action="call-live-caption-input"
                value="${escapeHtml(this.state.callLiveCaptionDe)}"
                placeholder="هضر بصوتك دابا أو كتب/عدل جملتك الألمانية هنا وسط المكالمة..."
                aria-label="الترجمة الحية لصوت محمد وسط المكالمة"
                class="w-full px-3 py-2 rounded-lg bg-black/50 border border-emerald-400/40 text-xs sm:text-sm text-white font-mono-de"
                dir="ltr"
              />

              <div class="flex flex-wrap items-center gap-2" dir="rtl">
                <button
                  type="button"
                  data-action="call-submit-turn"
                  aria-label="ساليت جملتي دوز للجولة الجاية"
                  class="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow"
                >
                  ✅ ساليت جملتي / دوز للجولة الجاية
                </button>
                <button
                  type="button"
                  data-action="call-retry-turn"
                  aria-label="عاود جملتي"
                  class="py-2 px-3 rounded-xl text-xs font-extrabold bg-amber-500/25 hover:bg-amber-500 text-amber-200 hover:text-black border border-amber-400/40 cursor-pointer"
                >
                  🔄 عاود جملتي
                </button>
              </div>
            </div>

            <!-- Start Call CTA button when IDLE or ENDED -->
            ${
              !isCallActive
                ? `<button
                    type="button"
                    data-action="start-live-voice-call"
                    aria-label="ابدأ المكالمة الصوتية Start Voice Call"
                    class="w-full py-3.5 px-5 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black shadow-xl flex items-center justify-center gap-2 cursor-pointer ring-2 ring-emerald-300"
                    dir="rtl"
                  >
                    <span class="text-lg">📞</span>
                    <span>📞 ابدأ المكالمة الصوتية (Start Voice Call)</span>
                  </button>`
                : ''
            }
          </div>
        </div>

        <!-- 2. SMART IN-CALL TELEPROMPTER & "WHISPER COACH" (المساعد السري وسط المكالمة) -->
        <div class="p-3.5 rounded-2xl studio-elevated border border-amber-500/40 space-y-2.5">
          <div class="flex items-center justify-between" dir="rtl">
            <button
              type="button"
              data-action="toggle-call-teleprompter"
              aria-label="فتح أو طي شاشة التلقين السريعة"
              class="text-xs font-extrabold text-amber-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span>👀 شاشة التلقين السريعة (Live Teleprompter / Whisper Hint)</span>
              <span>${this.state.callTeleprompterOpen ? '▲' : '▼'}</span>
            </button>
            <span class="text-[10px] opacity-75" dir="rtl">3 مستويات مساعدة</span>
          </div>

          ${
            this.state.callTeleprompterOpen
              ? `
                <!-- 3 Teleprompter Level Tabs -->
                <div class="grid grid-cols-3 gap-1.5" dir="rtl">
                  <button
                    type="button"
                    data-action="set-teleprompter-level"
                    data-level="1"
                    aria-label="المستوى 1 تلميح بالدارجة فقط"
                    class="py-1.5 px-2 rounded-lg text-[11px] font-extrabold cursor-pointer border ${
                      this.state.callTeleprompterLevel === 1
                        ? 'bg-amber-500 text-black border-amber-300'
                        : 'bg-black/30 border-white/10 text-amber-200'
                    }"
                  >
                    💡 1. تلميح بالدارجة
                  </button>
                  <button
                    type="button"
                    data-action="set-teleprompter-level"
                    data-level="2"
                    aria-label="المستوى 2 بداية الجملة البينغ بونغ"
                    class="py-1.5 px-2 rounded-lg text-[11px] font-extrabold cursor-pointer border ${
                      this.state.callTeleprompterLevel === 2
                        ? 'bg-indigo-600 text-white border-indigo-300'
                        : 'bg-black/30 border-white/10 text-indigo-200'
                    }"
                  >
                    🧩 2. بداية الجملة
                  </button>
                  <button
                    type="button"
                    data-action="set-teleprompter-level"
                    data-level="3"
                    aria-label="المستوى 3 الجملة كاملة قراها بصوتك"
                    class="py-1.5 px-2 rounded-lg text-[11px] font-extrabold cursor-pointer border ${
                      this.state.callTeleprompterLevel === 3
                        ? 'bg-emerald-600 text-white border-emerald-300'
                        : 'bg-black/30 border-white/10 text-emerald-200'
                    }"
                  >
                    📖 3. الجملة كاملة
                  </button>
                </div>

                <!-- Active Teleprompter Content -->
                <div class="p-3 rounded-xl bg-black/45 border border-white/10 space-y-2">
                  ${
                    this.state.callTeleprompterLevel === 1
                      ? `<div class="text-xs sm:text-sm font-bold text-amber-300 leading-relaxed" dir="rtl">
                          ${escapeHtml(whisper.level1Darija)}
                        </div>`
                      : this.state.callTeleprompterLevel === 2
                      ? `<div class="text-xs sm:text-sm font-mono-de text-indigo-200 leading-relaxed" dir="ltr">
                          „${escapeHtml(whisper.level2StarterDe)}“
                        </div>`
                      : `<div class="space-y-2" dir="ltr">
                          <div class="text-xs sm:text-sm leading-relaxed text-emerald-100">
                            „${renderClauseWithGoldVerb(whisper.level3FullDe)}“
                          </div>
                          <div class="flex flex-wrap gap-2" dir="rtl">
                            <button
                              type="button"
                              data-action="call-use-full-sentence"
                              data-sentence="${escapeHtml(whisper.level3FullDe)}"
                              aria-label="قول هاد الجملة فـ المكالمة دابا"
                              class="px-3 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                            >
                              🎙️ قول هاد الجملة فـ المكالمة دابا
                            </button>
                            <button
                              type="button"
                              data-action="speak-text"
                              data-text="${escapeHtml(whisper.level3FullDe)}"
                              aria-label="اسمع نطق الجملة كاملة"
                              class="px-3 py-1 rounded-lg text-[11px] font-bold bg-indigo-600 text-white cursor-pointer"
                            >
                              🔊 اسمع نطقها
                            </button>
                          </div>
                        </div>`
                  }
                </div>

                <!-- 🛟 زر الأوكسجين وسط المكالمة (Interrupt / Rescue Phrase) -->
                <div class="flex flex-wrap items-center gap-1.5 pt-1" dir="rtl">
                  <button
                    type="button"
                    data-action="call-use-rescue"
                    data-phrase="${escapeHtml(whisper.rescueInterruptPhraseDe)}"
                    aria-label="زر الأوكسجين قاطع البارتنر بأدب"
                    class="flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-extrabold bg-sky-500/20 hover:bg-sky-500 text-sky-200 hover:text-black border border-sky-400/40 cursor-pointer transition"
                  >
                    🛟 زر الأوكسجين: قاطع بأدب (Entschuldigung, darf ich...)
                  </button>
                  <button
                    type="button"
                    data-action="call-use-rescue"
                    data-phrase="${escapeHtml(whisper.rescuePartnerPhraseDe)}"
                    aria-label="زر الأوكسجين أنقذ البارتنر بسؤال"
                    class="py-1.5 px-2.5 rounded-xl text-[11px] font-extrabold bg-purple-500/20 hover:bg-purple-500 text-purple-200 hover:text-white border border-purple-400/40 cursor-pointer transition"
                  >
                    🛟 سول البارتنر (Wie siehst du das?)
                  </button>
                </div>
              `
              : ''
          }
        </div>

        <!-- 3. BOTTOM CALL DOCK (PHONE CALL CONTROLS) -->
        <div class="p-3 rounded-2xl bg-black/50 border border-white/15 space-y-2" dir="rtl">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              data-action="call-toggle-mute-mic"
              aria-label="كتم أو تشغيل المايكروفون"
              class="py-2 px-2.5 rounded-xl text-[11px] font-extrabold cursor-pointer border ${
                this.state.callMicMuted
                  ? 'bg-rose-600/30 border-rose-400 text-rose-200'
                  : 'studio-elevated hover:border-emerald-400'
              }"
            >
              ${this.state.callMicMuted ? '🔇 المايك مكتوم (Unmute)' : '🎙️ كتم المايك (Mute)'}
            </button>

            <button
              type="button"
              data-action="call-toggle-pause"
              aria-label="إيقاف مؤقت للمكالمة"
              class="py-2 px-2.5 rounded-xl text-[11px] font-extrabold cursor-pointer border ${
                this.state.callState === 'PAUSED'
                  ? 'bg-amber-500 text-black border-amber-300'
                  : 'studio-elevated hover:border-amber-400'
              }"
            >
              ${this.state.callState === 'PAUSED' ? '▶️ كمل المكالمة' : '⏸️ إيقاف مؤقت'}
            </button>

            <button
              type="button"
              data-action="call-toggle-speed"
              aria-label="سرعة صوت البارتنر"
              class="py-2 px-2.5 rounded-xl text-[11px] font-extrabold studio-elevated hover:border-indigo-400 cursor-pointer"
            >
              ${this.state.simSpeakSpeed === 0.85 ? '🐢 سرعة: 0.85x بطيء' : '⚡ سرعة: 1.0x طبيعي'}
            </button>

            <button
              type="button"
              data-action="call-repeat-last-ai"
              aria-label="تكرار آخر جملة قالها البارتنر"
              class="py-2 px-2.5 rounded-xl text-[11px] font-extrabold studio-elevated hover:border-cyan-400 cursor-pointer"
            >
              🔊 تكرار سؤال البارتنر
            </button>
          </div>

          <button
            type="button"
            data-action="call-end-and-report"
            aria-label="قطع المكالمة وعرض تقرير الامتحان"
            class="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-500 text-white shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <span>📵</span>
            <span>قطع المكالمة وعرض تقرير الامتحان الشفوي (End Call & Show Full Report)</span>
          </button>
        </div>

        <!-- POST-CALL DIAGNOSTIC REPORT CARD (تقرير المكالمة الشفوية) -->
        ${
          this.state.callReport
            ? `
              <div class="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-950 to-indigo-950/90 border-2 border-emerald-400 space-y-3" data-testid="post-call-report-card">
                <div class="flex flex-wrap items-center justify-between gap-2" dir="rtl">
                  <div>
                    <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">
                      Official TELC B2 Mündlich Call Report
                    </span>
                    <h4 class="text-sm sm:text-base font-extrabold text-white mt-0.5">
                      📊 تقرير المكالمة الشفوية وتصحيح الجمل (60/60 Pkt.)
                    </h4>
                  </div>
                  <span class="px-3 py-1 rounded-xl font-mono-de text-xs font-extrabold ${
                    this.state.callReport.passed
                      ? 'bg-emerald-500 text-black'
                      : 'bg-rose-600 text-white'
                  }" dir="ltr">
                    ${this.state.callReport.totalOutOf60} / 60 Pkt. (${this.state.callReport.passed ? 'BESTANDEN ✅' : 'NICHT BESTANDEN ❌'})
                  </span>
                </div>

                <!-- Call Duration & Fluency Metrics -->
                <div class="grid grid-cols-3 gap-2 text-center" dir="rtl">
                  <div class="p-2 rounded-xl bg-black/40 border border-white/10">
                    <div class="text-[10px] opacity-75">مدة المكالمة</div>
                    <div class="text-xs sm:text-sm font-extrabold text-emerald-300 font-mono-de" dir="ltr">${this.state.callReport.durationFormatted}</div>
                  </div>
                  <div class="p-2 rounded-xl bg-black/40 border border-white/10">
                    <div class="text-[10px] opacity-75">سرعة الطلاقة (Fluency)</div>
                    <div class="text-xs sm:text-sm font-extrabold text-amber-300 font-mono-de" dir="ltr">${this.state.callReport.fluencyWordsPerMinute} WPM</div>
                  </div>
                  <div class="p-2 rounded-xl bg-black/40 border border-white/10">
                    <div class="text-[10px] opacity-75">المستوى الشفوي</div>
                    <div class="text-xs sm:text-sm font-extrabold text-indigo-300 font-mono-de" dir="ltr">Niveau ${this.state.callReport.cefrOverall}</div>
                  </div>
                </div>

                <!-- 4 Official TELC B2 Criteria Out of 15 -->
                <div class="grid grid-cols-2 gap-1.5 text-[11px]" dir="ltr">
                  <div class="p-2 rounded-lg bg-black/35 border border-white/10">Ausdrucksfähigkeit: <strong>${this.state.callReport.ausdruck} / 15</strong></div>
                  <div class="p-2 rounded-lg bg-black/35 border border-white/10">Aufgabenbewältigung: <strong>${this.state.callReport.aufgabe} / 15</strong></div>
                  <div class="p-2 rounded-lg bg-black/35 border border-white/10">Formale Richtigkeit: <strong>${this.state.callReport.korrektheit} / 15</strong></div>
                  <div class="p-2 rounded-lg bg-black/35 border border-white/10">Aussprache & Intonation: <strong>${this.state.callReport.aussprache} / 15</strong></div>
                </div>

                <div class="text-xs font-bold text-amber-300 leading-relaxed" dir="rtl">
                  ${escapeHtml(this.state.callReport.summaryDarija)}
                </div>

                <!-- Sentence-by-Sentence Review -->
                ${
                  this.state.callReport.turnReviews.length > 0
                    ? `<div class="space-y-2 pt-2 border-t border-white/15">
                        <div class="text-xs font-extrabold text-emerald-300" dir="rtl">
                          🔍 مراجعة جملة بجملة (شنو قلتي فالمكالمة vs الجملة الألمانية 100% B2):
                        </div>
                        ${this.state.callReport.turnReviews
                          .map(
                            (tr) => `
                              <div class="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5 text-xs">
                                <div class="flex items-center justify-between" dir="ltr">
                                  <span class="font-bold text-emerald-300">Turn #${tr.turnIndex} (${tr.scoreOutOf60}/60 Pkt. • ${escapeHtml(tr.cefrLevel)})</span>
                                  <span class="text-[10px] ${tr.verbAtEndCorrect ? 'text-emerald-400' : 'text-rose-400'}">
                                    ${tr.verbAtEndCorrect ? '✅ Verb am Ende OK' : '⚠️ Verb am Ende prüfen'}
                                  </span>
                                </div>
                                <div class="text-[11px] text-slate-300" dir="ltr">
                                  <strong>🗣️ Du hast gesagt:</strong> „${escapeHtml(tr.userSaidDe)}“
                                </div>
                                <div class="text-[11px] text-emerald-200" dir="ltr">
                                  <strong>🎯 100% B2 Muster:</strong> „${renderClauseWithGoldVerb(tr.targetSentenceDe)}“
                                </div>
                                <div class="text-[11px] text-amber-300" dir="rtl">
                                  💡 ${escapeHtml(tr.darijaCritique)}
                                </div>
                              </div>
                            `
                          )
                          .join('')}
                      </div>`
                    : ''
                }
              </div>
            `
            : ''
        }
      </div>
    `;
  }

  // ====================================================================
  // MODULE: 3D XR PRÜFUNGSRAUM & BIOSCIENCE NEURO-BIOLOGY EXPLORER
  // ====================================================================
  private renderXr3dAndBioStudio(): string {
    const exam = this.getCurrentExam();
    const rounds = build6RoundsForExam(exam);
    const activeRound = rounds[this.state.xrRoundIndex % rounds.length];
    const bioItem = BIOSCIENCE_EXAM_LINKS.find((b) => b.id === this.state.selectedBioId) || BIOSCIENCE_EXAM_LINKS[0];
    const liveMeta = this.state.liveBioMetadata[bioItem.id];

    return `
      <section class="space-y-6">
        <!-- 3D Spatial Ping-Pong Arena Controls & HUD -->
        <div class="studio-card rounded-2xl p-5 space-y-4 border-l-4 border-l-emerald-500">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div dir="rtl">
              <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300" dir="ltr">
                XR Blocks v0.24 • Three.js Spatial Ping-Pong Arena
              </span>
              <h2 class="text-xl sm:text-2xl font-extrabold mt-1">
                🥽 قاعة الامتحان المكانية ثلاثية الأبعاد (3D TELC Ping-Pong Prüfungsraum)
              </h2>
              <p class="text-xs opacity-80">
                تحكم فـ طاولة البينغ بونغ ثلاثية الأبعاد والبطاقة المكانية (xb.UICard) وشوف الكرة الذهبية كتمشي وتجي مع كل جولة!
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                data-action="xr-prev-round"
                aria-label="الجولة السابقة في الفضاء ثلاثي الأبعاد"
                class="studio-elevated px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                dir="rtl"
              >
                ◀ الجولة السابقة
              </button>
              <button
                type="button"
                data-action="xr-speak-round"
                aria-label="نطق الجولة المكانية"
                class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white cursor-pointer"
                dir="rtl"
              >
                🏓 اضرب الكرة واسمع الجولة (${this.state.xrRoundIndex + 1}/6)
              </button>
              <button
                type="button"
                data-action="xr-next-round"
                aria-label="الجولة التالية في الفضاء ثلاثي الأبعاد"
                class="studio-elevated px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                dir="rtl"
              >
                الجولة التالية ▶
              </button>
            </div>
          </div>

          <!-- Visual 3D Ping-Pong Examination Arena Preview -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div class="lg:col-span-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-indigo-950/90 border border-emerald-500/40 relative overflow-hidden">
              <div class="flex items-center justify-between text-xs font-mono-de text-emerald-300 mb-3" dir="ltr">
                <span>👤 Mohammed (Du) [Fès 🇲🇦]</span>
                <span>👩‍⚖️ TELC Prüferin (60/60 Pkt.)</span>
                <span>🤝 Partner [Ronde ${activeRound.roundNumber}/6]</span>
              </div>

              <!-- Championship Table Visual -->
              <div class="relative h-36 rounded-xl bg-emerald-800/80 border-2 border-white/80 flex items-center justify-center shadow-inner">
                <!-- Center White Line -->
                <div class="absolute inset-x-0 top-1/2 h-0.5 bg-white/60"></div>
                <!-- Net -->
                <div class="absolute inset-y-0 left-1/2 w-1 bg-white/90 shadow"></div>

                <!-- Left Paddle (Mohammed) -->
                <div class="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div class="w-9 h-9 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-xs font-bold shadow-lg">
                    🏓
                  </div>
                  <span class="text-[10px] font-bold text-white mt-1" dir="ltr">Mohammed</span>
                </div>

                <!-- Right Paddle (Partner) -->
                <div class="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div class="w-9 h-9 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-xs font-bold shadow-lg">
                    🏓
                  </div>
                  <span class="text-[10px] font-bold text-white mt-1" dir="ltr">Partner</span>
                </div>

                <!-- Golden Verb-am-Ende Ping-Pong Ball Positioned by Active Speaker -->
                <div
                  class="verb-gold-badge px-3 py-1 rounded-full bg-amber-400 text-black font-extrabold text-xs font-mono-de shadow-xl transition-all duration-500 ${
                    activeRound.speaker === 'Mohammed (Du)' ? '-translate-x-14' : 'translate-x-14'
                  }"
                  dir="ltr"
                >
                  ⚡ ${escapeHtml(splitClauseFinalVerb(activeRound.slotContent).finalVerb || 'Verb')}
                </div>
              </div>
            </div>

            <div class="lg:col-span-6 p-4 rounded-xl bg-black/30 border border-emerald-500/30 space-y-2" dir="ltr">
              <div class="text-xs font-mono-de text-emerald-400">
                Active 3D Spatial Card • ${escapeHtml(exam.titleDe)} • ${escapeHtml(activeRound.titleDe)}
              </div>
              <div class="text-sm sm:text-base font-bold leading-relaxed">
                „${escapeHtml(activeRound.fixedTemplateBefore)}${renderClauseWithGoldVerb(activeRound.slotContent)}${escapeHtml(activeRound.fixedTemplateAfter)}“
              </div>
              <div class="text-xs text-amber-300" dir="rtl">
                🇲🇦 ${escapeHtml(activeRound.darijaTranslation)}
              </div>
            </div>
          </div>
        </div>

        <!-- Bioscience Neuro-Biology Explorer (Linking Physics/Chemistry Abitur to Teil 2 Topics) -->
        <div class="studio-card rounded-2xl p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div dir="rtl">
              <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-sky-500/20 text-sky-300" dir="ltr">
                AlphaFold DB • RCSB PDB • UniProt Integration
              </span>
              <h3 class="text-lg sm:text-xl font-extrabold mt-1">
                🧬 مختبر البيولوجيا العصبية والكيمياء لمواضيع Teil 2 (باك فيزيك وشيمي ديال محمد!)
              </h3>
              <p class="text-xs opacity-80">
                ربطنا ليك المواضيع العلمية ديال Teil 2 (#1 Fast Food، #6 Antibiotika، #8 Glückshormone، #18 Zweisprachigkeit) بالبنيات الجزيئية الحقيقية من مختبرات AlphaFold و RCSB PDB!
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              ${BIOSCIENCE_EXAM_LINKS.map((b) => {
                const active = b.id === bioItem.id;
                return `
                  <button
                    type="button"
                    data-action="select-bio-item"
                    data-bio-id="${b.id}"
                    aria-label="${b.examTitleDe}"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                      active ? 'bg-sky-600 text-white' : 'studio-elevated'
                    }"
                    dir="ltr"
                  >
                    ${escapeHtml(b.examTitleDe)}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div class="lg:col-span-7 space-y-3">
              <div class="flex flex-wrap items-center gap-2" dir="ltr">
                <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono-de font-bold">
                  UniProt: ${escapeHtml(bioItem.uniprotId)}
                </span>
                <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono-de font-bold">
                  PDB: ${escapeHtml(bioItem.pdbId)}
                </span>
                <span class="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-mono-de font-bold">
                  Gene: ${escapeHtml(bioItem.geneSymbol)}
                </span>
              </div>

              <h4 class="text-lg font-extrabold" dir="ltr">${escapeHtml(bioItem.proteinName)}</h4>
              <p class="text-xs sm:text-sm leading-relaxed" dir="ltr">${escapeHtml(bioItem.biologicalRoleDe)}</p>
              <p class="text-xs sm:text-sm font-semibold text-amber-300" dir="rtl">🇲🇦 ${escapeHtml(bioItem.biologicalRoleDarija)}</p>

              <div class="p-3 rounded-xl studio-elevated space-y-1" dir="ltr">
                <div class="text-xs font-bold text-emerald-400">💎 Satz für deine B2-Prüfung (Wissenschaftlicher Bonus):</div>
                <div class="text-xs sm:text-sm font-semibold">„${escapeHtml(bioItem.b2SpeakingHookDe)}“</div>
              </div>
            </div>

            <!-- Canonical 4-Band pLDDT Confidence & Live RCSB PDB Telemetry -->
            <div class="lg:col-span-5 studio-elevated rounded-2xl p-4 space-y-3" dir="ltr">
              <div class="text-xs font-mono-de uppercase text-sky-400 font-bold">
                Live Structural Biology Telemetry (AlphaFold pLDDT & PDB)
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2 rounded bg-black/25">
                  <span class="opacity-70 block">Organism</span>
                  <strong>${escapeHtml(bioItem.organism)}</strong>
                </div>
                <div class="p-2 rounded bg-black/25">
                  <span class="opacity-70 block">Sequence Length</span>
                  <strong>${liveMeta ? `${liveMeta.sequenceLength} aa` : '443 aa'}</strong>
                </div>
                <div class="p-2 rounded bg-black/25">
                  <span class="opacity-70 block">Resolution</span>
                  <strong>${liveMeta ? escapeHtml(liveMeta.resolution) : '2.40 Å'}</strong>
                </div>
                <div class="p-2 rounded bg-black/25">
                  <span class="opacity-70 block">Method</span>
                  <strong>${liveMeta ? escapeHtml(liveMeta.experimentalMethod) : 'X-RAY DIFFRACTION'}</strong>
                </div>
              </div>

              <!-- Canonical 4-Band pLDDT Bar -->
              <div class="space-y-1.5">
                <div class="text-xs font-semibold">AlphaFold pLDDT Confidence Distribution:</div>
                <div class="w-full h-3 rounded-full overflow-hidden flex">
                  <div style="width: ${bioItem.plddtSummary.veryHigh}%; background-color: #0053D6" title="Very high (>90)"></div>
                  <div style="width: ${bioItem.plddtSummary.confident}%; background-color: #65CBF3" title="Confident (70-90)"></div>
                  <div style="width: ${bioItem.plddtSummary.low}%; background-color: #FFDB13" title="Low (50-70)"></div>
                  <div style="width: ${bioItem.plddtSummary.veryLow}%; background-color: #FF7D45" title="Very low (<50)"></div>
                </div>
                <div class="flex flex-wrap justify-between text-[10px] font-mono-de opacity-85">
                  <span>🔵 >90: ${bioItem.plddtSummary.veryHigh}%</span>
                  <span>🩵 70-90: ${bioItem.plddtSummary.confident}%</span>
                  <span>🟡 50-70: ${bioItem.plddtSummary.low}%</span>
                  <span>🟠 <50: ${bioItem.plddtSummary.veryLow}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // MODALS: CERTIFICATION EXAM & PLACEMENT DIAGNOSTIC
  // ====================================================================
  private renderCertificationModal(cert: CertificationExam): string {
    return `
      <div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
        <div class="studio-card rounded-2xl max-w-2xl w-full p-6 space-y-5 border-2 border-emerald-500">
          <div class="flex items-center justify-between">
            <div dir="rtl">
              <span class="text-xs font-bold text-emerald-400">${cert.fromLevel} ➔ ${cert.toLevel}</span>
              <h3 class="text-lg sm:text-xl font-extrabold">${escapeHtml(cert.titleDarija)}</h3>
            </div>
            <button
              type="button"
              data-action="close-cert-modal"
              aria-label="إغلاق نافذة الامتحان"
              class="studio-elevated px-3 py-1 rounded-lg text-xs font-bold cursor-pointer"
            >
              ✕ إغلاق
            </button>
          </div>

          ${
            this.state.certResult
              ? `
                <div class="p-5 rounded-2xl ${
                  this.state.certResult.passed
                    ? 'bg-emerald-500/20 border-2 border-emerald-400'
                    : 'bg-amber-500/20 border-2 border-amber-400'
                } space-y-3 text-center" dir="rtl">
                  <div class="text-3xl font-extrabold">${this.state.certResult.score}%</div>
                  <p class="text-base font-bold">${escapeHtml(this.state.certResult.badgeText)}</p>
                </div>
              `
              : ''
          }

          <div class="space-y-4 max-h-96 overflow-y-auto pr-1">
            ${cert.questions
              .map(
                (q, qIdx) => `
                  <div class="studio-elevated rounded-xl p-4 space-y-2">
                    <div class="text-xs font-bold text-amber-300" dir="rtl">${qIdx + 1}. ${escapeHtml(q.promptDarija)}</div>
                    <div class="text-xs opacity-80" dir="ltr">${escapeHtml(q.promptDe)}</div>
                    <div class="space-y-1.5 pt-1">
                      ${q.options
                        .map((opt, oIdx) => {
                          const selected = this.state.certAnswers[q.id] === oIdx;
                          return `
                            <button
                              type="button"
                              data-action="select-cert-option"
                              data-qid="${q.id}"
                              data-oidx="${oIdx}"
                              aria-label="اختيار الجواب ${oIdx + 1}"
                              class="w-full text-left p-2.5 rounded-lg text-xs font-semibold border cursor-pointer transition ${
                                selected
                                  ? 'bg-emerald-600 text-white border-emerald-400'
                                  : 'bg-black/25 border-white/10 hover:border-emerald-500/40'
                              }"
                              dir="ltr"
                            >
                              ${escapeHtml(opt)}
                            </button>
                          `;
                        })
                        .join('')}
                    </div>
                  </div>
                `
              )
              .join('')}
          </div>

          <div class="flex justify-end gap-3 pt-2 border-t border-white/10">
            <button
              type="button"
              data-action="submit-cert-exam"
              aria-label="تأكيد وإرسال أجوبة الامتحان"
              class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
              dir="rtl"
            >
              🏆 صحح الامتحان وخذ الشهادة
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private renderDiagnosticModal(): string {
    return `
      <div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div class="studio-card rounded-2xl max-w-xl w-full p-6 space-y-4 border-2 border-amber-400" dir="rtl">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-extrabold text-amber-400">🧭 تحديد المستوى السريع لمحمد الجبوري (Placement Test)</h3>
            <button
              type="button"
              data-action="close-diagnostic"
              aria-label="إغلاق تحديد المستوى"
              class="studio-elevated px-3 py-1 rounded-lg text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div class="space-y-3">
            ${PLACEMENT_DIAGNOSTIC_QUESTIONS.map(
              (dq, idx) => `
                <div class="studio-elevated p-3.5 rounded-xl space-y-2">
                  <div class="text-xs font-bold">${idx + 1}. ${escapeHtml(dq.questionDarija)}</div>
                  <div class="grid grid-cols-1 gap-1.5">
                    ${dq.options
                      .map((opt, oIdx) => {
                        const chosen = this.state.diagnosticAnswers[dq.id] === opt.score;
                        return `
                          <button
                            type="button"
                            data-action="select-diag-option"
                            data-dqid="${dq.id}"
                            data-score="${opt.score}"
                            aria-label="${opt.label}"
                            class="p-2 rounded-lg text-xs font-bold text-right border cursor-pointer ${
                              chosen ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-black/20 border-white/10'
                            }"
                          >
                            ${oIdx === 0 ? '🔹' : '✅'} ${escapeHtml(opt.label)}
                          </button>
                        `;
                      })
                      .join('')}
                  </div>
                </div>
              `
            ).join('')}
          </div>

          <button
            type="button"
            data-action="finish-diagnostic"
            aria-label="اعتماد المستوى المناسب"
            class="w-full py-2.5 rounded-xl text-sm font-extrabold bg-emerald-600 text-white cursor-pointer"
          >
            🎯 حدد مستواي وابدأ الخطة المناسبة
          </button>
        </div>
      </div>
    `;
  }

  private renderFooter(): string {
    return `
      <footer class="studio-card border-t px-4 sm:px-6 py-4 mt-8 text-xs opacity-75">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div dir="ltr">
            <strong>TELC B2 Mündlich & Karriere Master Pro</strong> • Engineered for Mohammed El Jebouri (Fès 🇲🇦 ➔ Deutschland 🇩🇪)
          </div>
          <div dir="rtl">
            100% البيانات الكاملة: عرض بين الويدان + 46 امتحان Teil 2 + 48 موضوع Teil 3 + 20 جوكر + 12 سؤال اقتصاد
          </div>
        </div>
      </footer>
    `;
  }

  // ====================================================================
  // EVENT HANDLING & INTERACTIONS
  // ====================================================================
  private attachDelegatedEvents(): void {
    this.root.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
      if (!target) return;
      const action = target.dataset.action;
      if (!action) return;

      switch (action) {
        case 'switch-tab': {
          const tab = target.dataset.tab as MainTab;
          if (tab) {
            this.state.activeTab = tab;
            this.render();
          }
          break;
        }
        case 'toggle-plan-duration': {
          this.state.progress.planDuration = (this.state.progress.planDuration === 45 ? 60 : 45) as PlanDuration;
          this.addXpAndSync(5);
          this.render();
          break;
        }
        case 'toggle-mute': {
          sfx.muted = !sfx.muted;
          this.render();
          break;
        }
        case 'firebase-login': {
          void signInWithGoogle();
          break;
        }
        case 'firebase-logout': {
          void logOutFirebase();
          break;
        }
        case 'select-cefr-level': {
          const lvl = target.dataset.level as CEFRLevel;
          if (lvl) {
            this.state.progress.currentLevel = lvl;
            this.addXpAndSync(10);
            this.render();
          }
          break;
        }
        case 'open-diagnostic': {
          this.state.showDiagnosticModal = true;
          this.render();
          break;
        }
        case 'close-diagnostic': {
          this.state.showDiagnosticModal = false;
          this.render();
          break;
        }
        case 'select-diag-option': {
          const dqid = target.dataset.dqid;
          const score = Number(target.dataset.score || 0);
          if (dqid) {
            this.state.diagnosticAnswers[dqid] = score;
            this.render();
          }
          break;
        }
        case 'finish-diagnostic': {
          const total = Object.values(this.state.diagnosticAnswers).reduce((a, b) => a + b, 0);
          const recommended: CEFRLevel = total === 0 ? 'A0/A1' : total === 1 ? 'A2' : total === 2 ? 'B1' : 'B2';
          this.state.progress.currentLevel = recommended;
          this.state.showDiagnosticModal = false;
          sfx.playFanfare();
          this.addXpAndSync(30);
          this.render();
          break;
        }

        // Teil 2 Navigation & Slot Builder
        case 'prev-teil2-exam': {
          const prevId = this.state.selectedTeil2Id > 1 ? this.state.selectedTeil2Id - 1 : 46;
          this.selectTeil2Exam(prevId);
          break;
        }
        case 'next-teil2-exam': {
          const nextId = this.state.selectedTeil2Id < 46 ? this.state.selectedTeil2Id + 1 : 1;
          this.selectTeil2Exam(nextId);
          break;
        }
        case 'select-teil2-pill': {
          const id = Number(target.dataset.id);
          if (id >= 1 && id <= 46) {
            this.selectTeil2Exam(id);
          }
          break;
        }
        case 'switch-slot-mode': {
          const mode = target.dataset.mode as SlotInteractionMode;
          if (mode) {
            this.state.slotMode = mode;
            this.state.distractorErrorMsg = null;
            this.render();
          }
          break;
        }
        case 'fill-all-slots-exam': {
          const ex = this.getCurrentExam();
          this.state.filledSlotsByExam[ex.id] = {
            slot1: ex.slot1Theme,
            slot2: ex.slot2Point1,
            slot3: ex.slot3Point2,
            slot4: ex.slot4Advantage,
            slot5: ex.slot5Disadvantage,
            slot6: ex.slot6Morocco
          };
          this.state.distractorErrorMsg = null;
          sfx.playVerbGoldChime();
          this.addXpAndSync(20);
          this.render();
          break;
        }
        case 'clear-all-slots-exam': {
          const ex = this.getCurrentExam();
          this.state.filledSlotsByExam[ex.id] = {};
          this.state.distractorErrorMsg = null;
          this.render();
          break;
        }
        case 'click-bank-card': {
          const isTrap = target.dataset.isTrap === '1';
          const slotKey = target.dataset.slotKey || '';
          const text = target.dataset.text || '';
          const ex = this.getCurrentExam();

          if (isTrap) {
            sfx.playErrorBuzz();
            this.state.distractorErrorMsg =
              '⚠️ رد البال يا محمد! هاد البطاقة فخ نحوي حيت الفعل المصرف جا فـ الوسط وماشي فـ آخر الجملة مورا dass!';
            this.render();
            return;
          }

          this.state.distractorErrorMsg = null;
          if (!this.state.filledSlotsByExam[ex.id]) {
            this.state.filledSlotsByExam[ex.id] = {};
          }
          this.state.filledSlotsByExam[ex.id][slotKey] = text;
          sfx.playPingPongHit();
          sfx.playVerbGoldChime();
          speakGermanText(text, 1.0);
          this.spatialScene?.triggerRallyPulse();
          this.addXpAndSync(15);
          this.render();
          break;
        }
        case 'quick-fill-slot': {
          const slotKey = target.dataset.slotKey || '';
          const ex = this.getCurrentExam();
          const map: Record<string, string> = {
            slot1: ex.slot1Theme,
            slot2: ex.slot2Point1,
            slot3: ex.slot3Point2,
            slot4: ex.slot4Advantage,
            slot5: ex.slot5Disadvantage,
            slot6: ex.slot6Morocco
          };
          if (map[slotKey]) {
            if (!this.state.filledSlotsByExam[ex.id]) {
              this.state.filledSlotsByExam[ex.id] = {};
            }
            this.state.filledSlotsByExam[ex.id][slotKey] = map[slotKey];
            sfx.playVerbGoldChime();
            speakGermanText(map[slotKey], 1.0);
            this.spatialScene?.triggerRallyPulse();
            this.addXpAndSync(10);
            this.render();
          }
          break;
        }
        case 'toggle-ronde6-joker': {
          this.state.useUniversalJokerRonde6 = !this.state.useUniversalJokerRonde6;
          this.render();
          break;
        }
        case 'toggle-ronde5-morocco-joker': {
          this.state.useUniversalMoroccoJokerRonde5 = !this.state.useUniversalMoroccoJokerRonde5;
          sfx.playVerbGoldChime();
          this.render();
          break;
        }
        case 'toggle-verbatim-paper-mode': {
          this.state.useVerbatimPaperPhotocopyMode = !this.state.useVerbatimPaperPhotocopyMode;
          sfx.playVerbGoldChime();
          this.render();
          break;
        }
        case 'set-laser-slot-filter': {
          const filter = (target.dataset.filter || 'ALL') as 'ALL' | LaserSlotKey;
          this.state.laserActiveSlotFilter = filter;
          const ex = this.getCurrentExam();
          if (filter !== 'ALL' && ex.surgicalSlots[filter]) {
            speakGermanText(ex.surgicalSlots[filter].origSub, 1.0);
          }
          this.render();
          break;
        }
        case 'speak-single-round':
        case 'speak-single-round-slow': {
          const rNum = Number(target.dataset.round || 1);
          const rate = action === 'speak-single-round-slow' ? 0.8 : 1.0;
          const ex = this.getCurrentExam();
          const rounds = build6RoundsForExam(ex, {
            useUniversalMoroccoJoker: this.state.useUniversalMoroccoJokerRonde5,
            useVerbatimPaperClauses: this.state.useVerbatimPaperPhotocopyMode,
          });
          const r = rounds.find((item) => item.roundNumber === rNum);
          if (r) {
            const full = r.slot2Content
              ? `${r.fixedTemplateBefore}${r.slotContent}${r.fixedTemplateMiddle}${r.slot2Content}${r.fixedTemplateAfter}`
              : `${r.fixedTemplateBefore}${r.slotContent}${r.fixedTemplateAfter}`;
            speakGermanText(full, rate);
          }
          break;
        }
        case 'speak-full-pingpong':
        case 'speak-full-pingpong-slow': {
          const rate = action === 'speak-full-pingpong-slow' ? 0.8 : 1.0;
          const ex = this.getCurrentExam();
          const rounds = build6RoundsForExam(ex, {
            useUniversalMoroccoJoker: this.state.useUniversalMoroccoJokerRonde5,
            useVerbatimPaperClauses: this.state.useVerbatimPaperPhotocopyMode,
          });
          const allText = rounds
            .map((r) =>
              r.slot2Content
                ? `${r.fixedTemplateBefore}${r.slotContent}${r.fixedTemplateMiddle}${r.slot2Content}${r.fixedTemplateAfter}`
                : `${r.fixedTemplateBefore}${r.slotContent}${r.fixedTemplateAfter}`
            )
            .join(' ');
          speakGermanText(allText, rate);
          break;
        }
        case 'mark-exam-completed': {
          const id = Number(target.dataset.id);
          if (!this.state.progress.completedTeil2Exams.includes(id)) {
            this.state.progress.completedTeil2Exams.push(id);
            sfx.playFanfare();
            this.addXpAndSync(50);
            void recordPracticeSession({
              moduleType: 'teil2',
              topicTitle: this.getCurrentExam().titleDe,
              score: 95,
              feedbackSummary: 'Completed all 6 Ping-Pong rounds.'
            });
            this.render();
          }
          break;
        }
        case 'laser-scan-sound': {
          sfx.playLaserBeam();
          speakGermanText(
            `In meinem Text geht es um das Thema ${this.getCurrentExam().slot1Theme}. Der Autor erwähnt, dass ${this.getCurrentExam().slot2Point1}. Was steht in deinem Text?`,
            1.0
          );
          break;
        }
        case 'toggle-blur-slot': {
          const slotId = target.dataset.slotId;
          if (slotId) {
            this.state.revealedBlurSlots[slotId] = !this.state.revealedBlurSlots[slotId];
            this.render();
          }
          break;
        }
        case 'reveal-all-blur': {
          const ex = this.getCurrentExam();
          for (let i = 1; i <= 6; i++) {
            this.state.revealedBlurSlots[`${ex.id}-s${i}`] = true;
          }
          this.render();
          break;
        }
        case 'hide-all-blur': {
          const ex = this.getCurrentExam();
          for (let i = 1; i <= 6; i++) {
            this.state.revealedBlurSlots[`${ex.id}-s${i}`] = false;
          }
          this.render();
          break;
        }
        case 'mark-slot-mastered': {
          const slotId = target.dataset.slotId;
          if (slotId) {
            if (!this.state.progress.masteredSlotIds.includes(slotId)) {
              this.state.progress.masteredSlotIds.push(slotId);
            }
            this.state.progress.reviewSlotIds = this.state.progress.reviewSlotIds.filter((s) => s !== slotId);
            this.state.revealedBlurSlots[slotId] = true;
            sfx.playVerbGoldChime();
            this.addXpAndSync(25);
            this.render();
          }
          break;
        }
        case 'mark-slot-review': {
          const slotId = target.dataset.slotId;
          if (slotId) {
            if (!this.state.progress.reviewSlotIds.includes(slotId)) {
              this.state.progress.reviewSlotIds.push(slotId);
            }
            this.state.revealedBlurSlots[slotId] = true;
            this.addXpAndSync(5);
            this.render();
          }
          break;
        }
        case 'select-voice-round': {
          this.state.voiceActiveRound = Number(target.dataset.round || 1);
          this.state.voiceFeedback = null;
          this.render();
          break;
        }
        case 'toggle-voice-recording': {
          this.handleVoiceRecordingToggle();
          break;
        }
        case 'grade-voice-slot': {
          void this.handleGradeVoiceSlot();
          break;
        }

        // Teil 3 Actions
        case 'filter-teil3-cat': {
          this.state.selectedTeil3Category = target.dataset.cat || 'ALL';
          this.render();
          break;
        }
        case 'select-teil3-pill': {
          const id = Number(target.dataset.id);
          if (id >= 1 && id <= 48) {
            this.state.selectedTeil3Id = id;
            this.render();
          }
          break;
        }
        case 'toggle-indirect-transformer': {
          this.state.indirectTransformerActive = !this.state.indirectTransformerActive;
          sfx.playVerbGoldChime();
          this.render();
          break;
        }
        case 'speak-teil3-plan': {
          const t = this.getCurrentTeil3Topic();
          const text = `Wie du weißt, planen wir ja zusammen ${t.dkhlaSlotAccusative}. Hast du dir dazu schon ein paar Gedanken gemacht? Zuerst würde ich vorschlagen, dass wir ${t.herzPoint1De} Außerdem wäre es sinnvoll, wenn wir ${t.herzPoint2De} Super, das wird ${t.khatimaSlotNominative}!`;
          speakGermanText(text, 1.0);
          break;
        }
        case 'toggle-prep-timer': {
          this.togglePrepTimer();
          break;
        }

        // Generic TTS & Individual Sentence Audio
        case 'play-single-sentence': {
          const sentence = target.dataset.sentence || '';
          if (sentence) {
            playGermanSelection(sentence, 1.0, 1);
          }
          break;
        }
        case 'speak-text': {
          const txt = target.dataset.text || '';
          playGermanSelection(txt, 1.0, 1);
          break;
        }
        case 'speak-text-slow': {
          const txt = target.dataset.text || '';
          playGermanSelection(txt, 0.8, 1);
          break;
        }

        // Global Smart Selection & Pronunciation Studio Actions
        case 'sel-open-word': {
          const word = target.dataset.word || '';
          if (word) {
            void this.openSelectionStudio(word);
          }
          break;
        }
        case 'sel-close-popup': {
          stopGermanAudio();
          this.state.selectionPopup.visible = false;
          this.state.selectionPopup.playingTag = null;
          this.render();
          break;
        }
        case 'sel-play-audio': {
          const rate = Number(target.dataset.rate || 1.0);
          const repeat = Number(target.dataset.repeat || 1);
          const tag = target.dataset.tag || `${rate}x`;
          const textToPlay = target.dataset.text || this.state.selectionPopup.selectedText;
          if (textToPlay) {
            this.state.selectionPopup.playingTag = tag;
            this.render();
            playGermanSelection(textToPlay, rate, repeat, (isPlaying) => {
              if (!isPlaying && this.state.selectionPopup.playingTag === tag) {
                this.state.selectionPopup.playingTag = null;
                this.render();
              }
            });
          }
          break;
        }
        case 'sel-stop-audio': {
          stopGermanAudio();
          this.state.selectionPopup.playingTag = null;
          this.render();
          break;
        }
        case 'sel-word-by-word': {
          void this.handleWordByWordBreakdown();
          break;
        }
        case 'sel-toggle-record': {
          void this.handleToggleQuickPopupRecord();
          break;
        }
        case 'sel-play-compare': {
          this.handlePlayQuickComparison();
          break;
        }
        case 'sel-save-hard-word': {
          const p = this.state.selectionPopup;
          if (p.selectedText) {
            this.state.hardWordsBank = saveHardWordToBank({
              de: p.selectedText,
              ar: p.translationAr || 'ترجمة محفوظة للتدريب الشفوي',
              syllables: p.syllables || p.selectedText
            });
            this.state.selectionPopup.savedToBank = true;
            sfx.playVerbGoldChime();
            this.addXpAndSync(10);
            this.render();
          }
          break;
        }
        case 'open-hard-words-modal': {
          this.state.hardWordsBank = loadHardWordsBank();
          this.state.showHardWordsModal = true;
          this.render();
          break;
        }
        case 'close-hard-words-modal': {
          this.state.showHardWordsModal = false;
          this.render();
          break;
        }
        case 'remove-hard-word': {
          const deWord = target.dataset.word || '';
          if (deWord) {
            this.state.hardWordsBank = removeHardWordFromBank(deWord);
            if (this.state.selectionPopup.selectedText.toLowerCase() === deWord.toLowerCase()) {
              this.state.selectionPopup.savedToBank = false;
            }
            this.render();
          }
          break;
        }

        // Levels & Certifications
        case 'start-cert-exam': {
          const certId = target.dataset.certId;
          const found = LEVEL_CERTIFICATION_EXAMS.find((c) => c.id === certId);
          if (found) {
            this.state.activeCertExam = found;
            this.state.certAnswers = {};
            this.state.certResult = null;
            this.render();
          }
          break;
        }
        case 'close-cert-modal': {
          this.state.activeCertExam = null;
          this.render();
          break;
        }
        case 'select-cert-option': {
          const qid = target.dataset.qid;
          const oidx = Number(target.dataset.oidx || 0);
          if (qid) {
            this.state.certAnswers[qid] = oidx;
            this.render();
          }
          break;
        }
        case 'submit-cert-exam': {
          this.handleSubmitCertExam();
          break;
        }
        case 'filter-study-plan': {
          const lvl = target.dataset.level as CEFRLevel | 'ALL';
          if (lvl) {
            this.state.selectedStudyLevelFilter = lvl;
            this.render();
          }
          break;
        }
        case 'set-current-day': {
          const day = Number(target.dataset.day || 1);
          this.state.progress.currentDay = day;
          this.addXpAndSync(15);
          this.render();
          break;
        }

        // Career & AI Simulator
        case 'toggle-interview-level': {
          const id = Number(target.dataset.id);
          this.state.showB2InterviewVersion[id] = this.state.showB2InterviewVersion[id] === false;
          this.render();
          break;
        }
        case 'toggle-hands-free-mode': {
          this.state.simHandsFreeMode = !this.state.simHandsFreeMode;
          if (this.state.simHandsFreeMode) {
            this.startSimulatorMic();
          } else {
            this.stopSimulatorMicAndOptionallySend(true);
          }
          break;
        }
        case 'toggle-sim-mic': {
          if (this.state.simIsListening) {
            this.stopSimulatorMicAndOptionallySend(true);
          } else {
            this.startSimulatorMic();
          }
          break;
        }
        case 'restart-sim-mic': {
          this.stopSimulatorMicAndOptionallySend(false);
          this.state.aiUserMessage = '';
          this.startSimulatorMic();
          break;
        }
        case 'show-sim-hint': {
          this.state.simHintVisible = !this.state.simHintVisible;
          if (this.state.simHintVisible) {
            const expected = getExpectedSentenceForTurn(this.buildCurrentSimulatorContext());
            const firstFour = expected.hintFirst4Words.replace(' ...', '');
            if (!this.state.aiUserMessage.trim()) {
              this.state.aiUserMessage = `${firstFour} `;
            }
          }
          this.render();
          break;
        }
        case 'set-sim-speech-lang': {
          const lang = target.dataset.lang as 'de-DE' | 'ar-MA';
          if (lang === 'de-DE' || lang === 'ar-MA') {
            this.state.simSpeechLang = lang;
            if (this.state.simIsListening) {
              this.stopSimulatorMicAndOptionallySend(false);
              this.startSimulatorMic();
            } else {
              this.render();
            }
          }
          break;
        }
        case 'toggle-sim-autosend': {
          this.state.simAutoSendAfterSilence = !this.state.simAutoSendAfterSilence;
          this.render();
          break;
        }
        case 'toggle-sim-autospeak': {
          this.state.simAutoSpeakReply = !this.state.simAutoSpeakReply;
          this.render();
          break;
        }
        case 'set-sim-speak-speed': {
          const sp = Number(target.dataset.speed);
          this.state.simSpeakSpeed = sp === 0.85 ? 0.85 : 1.0;
          this.render();
          break;
        }
        case 'speak-sim-bubble': {
          const txt = target.dataset.text || '';
          this.speakPartnerReply(txt, true);
          break;
        }
        case 'speak-target-sentence-now': {
          const sentence = target.dataset.sentence || '';
          if (sentence) {
            this.state.aiUserMessage = sentence;
            this.state.simHintVisible = true;
            this.speakPartnerReply(sentence, true);
            this.render();
          }
          break;
        }
        case 'send-ai-chat': {
          void this.handleSendAiChat();
          break;
        }
        case 'run-career-search': {
          void this.handleRunCareerSearch();
          break;
        }

        // Live AI Voice Call Studio actions
        case 'set-sim-submode': {
          const sub = target.dataset.submode as 'chat' | 'call';
          if (sub === 'chat' || sub === 'call') {
            if (sub === 'chat' && this.state.callState !== 'IDLE' && this.state.callState !== 'ENDED') {
              this.pauseCallDevices();
            }
            this.state.simSubMode = sub;
            this.render();
          }
          break;
        }
        case 'start-live-voice-call': {
          this.startLiveVoiceCall();
          break;
        }
        case 'call-submit-turn': {
          void this.handleVoiceCallTurnSubmit();
          break;
        }
        case 'call-retry-turn': {
          this.state.callLiveCaptionDe = '';
          this.startCallListeningMic();
          this.render();
          break;
        }
        case 'toggle-call-teleprompter': {
          this.state.callTeleprompterOpen = !this.state.callTeleprompterOpen;
          this.render();
          break;
        }
        case 'set-teleprompter-level': {
          const lvl = Number(target.dataset.level) as 1 | 2 | 3;
          if (lvl === 1 || lvl === 2 || lvl === 3) {
            this.state.callTeleprompterLevel = lvl;
            this.render();
          }
          break;
        }
        case 'call-use-full-sentence': {
          const sentence = target.dataset.sentence || '';
          if (sentence) {
            this.state.callLiveCaptionDe = sentence;
            void this.handleVoiceCallTurnSubmit();
          }
          break;
        }
        case 'call-use-rescue': {
          const phrase = target.dataset.phrase || '';
          if (phrase) {
            this.state.callLiveCaptionDe = phrase;
            this.render();
          }
          break;
        }
        case 'call-toggle-mute-mic': {
          this.state.callMicMuted = !this.state.callMicMuted;
          if (this.state.callMicMuted) {
            this.stopCallListeningMic();
          } else if (this.state.callState === 'USER_LISTENING') {
            this.startCallListeningMic();
          }
          this.render();
          break;
        }
        case 'call-toggle-pause': {
          if (this.state.callState === 'PAUSED') {
            this.state.callState = 'USER_LISTENING';
            this.startCallTimerInterval();
            if (!this.state.callMicMuted) {
              this.startCallListeningMic();
            }
          } else if (
            this.state.callState === 'AI_SPEAKING' ||
            this.state.callState === 'USER_LISTENING' ||
            this.state.callState === 'EVALUATING'
          ) {
            this.pauseCallDevices();
            this.state.callState = 'PAUSED';
          }
          this.render();
          break;
        }
        case 'call-toggle-speed': {
          this.state.simSpeakSpeed = this.state.simSpeakSpeed === 0.85 ? 1.0 : 0.85;
          this.render();
          break;
        }
        case 'call-repeat-last-ai': {
          if (this.state.callLastAiQuestionDe) {
            this.speakCallAiTurnAndHandoffToMic(this.state.callLastAiQuestionDe);
          }
          break;
        }
        case 'call-end-and-report': {
          this.endLiveVoiceCallAndBuildReport();
          break;
        }

        // 3D XR & Bioscience
        case 'xr-prev-round': {
          this.state.xrRoundIndex = (this.state.xrRoundIndex + 5) % 6;
          this.spatialScene?.stepRound(-1);
          this.render();
          break;
        }
        case 'xr-next-round': {
          this.state.xrRoundIndex = (this.state.xrRoundIndex + 1) % 6;
          this.spatialScene?.stepRound(1);
          this.render();
          break;
        }
        case 'xr-speak-round': {
          this.spatialScene?.triggerRallyPulse();
          this.spatialScene?.speakCurrentRound();
          break;
        }
        case 'select-bio-item': {
          const bioId = target.dataset.bioId;
          if (bioId) {
            this.state.selectedBioId = bioId;
            void this.loadBioDataFor(bioId);
            this.render();
          }
          break;
        }
      }
    });

    this.root.addEventListener('change', (e) => {
      const target = e.target as HTMLElement;
      const action = target.dataset.action;
      if (!action) return;

      if (action === 'change-theme') {
        const theme = (target as HTMLSelectElement).value as StudioTheme;
        this.state.progress.theme = theme;
        this.applyThemeToDocument(theme);
        void syncProgressToFirestore(this.state.progress);
        this.render();
      } else if (action === 'select-teil2-dropdown') {
        const id = Number((target as HTMLSelectElement).value);
        this.selectTeil2Exam(id);
      } else if (action === 'select-teil3-dropdown') {
        const id = Number((target as HTMLSelectElement).value);
        this.state.selectedTeil3Id = id;
        this.render();
      } else if (action === 'change-ai-sim-mode') {
        const nextMode = (target as HTMLSelectElement).value as 'teil1' | 'teil2' | 'teil3' | 'interview';
        this.switchSimulatorMode(nextMode);
      } else if (action === 'change-ai-persona') {
        this.state.aiPersona = (target as HTMLSelectElement).value as PartnerPersona;
        this.render();
      } else if (action === 'change-call-avatar-role') {
        const role = (target as HTMLSelectElement).value as 'pruefer_markus' | 'partnerin_lisa' | 'hr_thomas';
        this.state.callAvatarRole = role;
        this.render();
      }
    });

    this.root.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      const action = target.dataset.action;
      if (!action) return;

      if (action === 'search-teil2') {
        this.state.teil2Search = target.value;
        this.render();
      } else if (action === 'search-teil3') {
        this.state.teil3Search = target.value;
        this.render();
      } else if (action === 'voice-text-input') {
        this.state.voiceTranscript = target.value;
      } else if (action === 'update-scratchpad') {
        this.state.progress.scratchpadNotes = target.value;
        void syncProgressToFirestore(this.state.progress);
      } else if (action === 'ai-chat-input') {
        this.state.aiUserMessage = target.value;
      } else if (action === 'call-live-caption-input') {
        this.state.callLiveCaptionDe = target.value;
      } else if (action === 'career-search-input') {
        this.state.careerSearchQuery = target.value;
      }
    });

    // Global Mouse/Touch Selection & Double-Click Word Listener for Pronunciation & Translation Studio
    const handleGlobalTextSelection = (ev: Event) => {
      const rawTarget = ev.target as Node | null;
      const targetEl =
        rawTarget instanceof Element ? rawTarget : rawTarget?.parentElement ?? null;
      // Ignore clicks/selections inside the floating studio popup itself or inside form inputs
      if (
        targetEl?.closest('[data-testid="selection-studio-popup"]') ||
        targetEl?.closest('[data-testid="hard-words-modal"]') ||
        targetEl?.closest('button[data-action]') ||
        targetEl?.tagName === 'INPUT' ||
        targetEl?.tagName === 'TEXTAREA' ||
        targetEl?.tagName === 'SELECT'
      ) {
        return;
      }

      window.setTimeout(() => {
        const sel = window.getSelection();
        const raw = sel ? sel.toString().trim() : '';
        // Clean quotes and UI symbols
        const cleaned = raw
          .replace(/[„“"«»🔊🐢🔬🔁🎙️⭐🎯📄💡✅❌]/gu, '')
          .replace(/\s+/g, ' ')
          .trim();

        // Must be at least 2 characters, up to 320 characters, and contain at least 1 Latin/German letter
        if (cleaned.length >= 2 && cleaned.length <= 320 && /[A-Za-zÄÖÜäöüß]/.test(cleaned)) {
          if (
            !this.state.selectionPopup.visible ||
            this.state.selectionPopup.selectedText !== cleaned
          ) {
            void this.openSelectionStudio(cleaned);
          }
        }
      }, 40);
    };

    document.addEventListener('mouseup', handleGlobalTextSelection);
    document.addEventListener('touchend', handleGlobalTextSelection);
    document.addEventListener('dblclick', handleGlobalTextSelection);
  }

  private async openSelectionStudio(rawSelectedText: string): Promise<void> {
    const cleaned = rawSelectedText
      .replace(/[„“"«»🔊🐢🔬🔁🎙️⭐🎯📄💡]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleaned.length < 2) return;

    const breakdowns = buildSelectionSyllableBreakdown(cleaned);
    const syllables =
      breakdowns.length > 0
        ? breakdowns.map((b) => b.syllables).join('  •  ')
        : splitGermanWordIntoSyllables(cleaned);
    const alreadySaved = isWordInHardBank(cleaned);

    this.state.selectionPopup = {
      visible: true,
      selectedText: cleaned,
      syllables,
      translationAr: '',
      translationLoading: true,
      wordByWordList: [],
      wordByWordLoading: false,
      playingTag: null,
      isRecordingVoice: false,
      hasRecordedClip: false,
      savedToBank: alreadySaved
    };
    this.render();

    const translated = await translateDeToAr(cleaned);
    // Guard against race conditions if user selected another word while translating
    if (this.state.selectionPopup.selectedText === cleaned) {
      this.state.selectionPopup.translationAr = translated;
      this.state.selectionPopup.translationLoading = false;
      this.render();
    }
  }

  private async handleWordByWordBreakdown(): Promise<void> {
    const text = this.state.selectionPopup.selectedText;
    if (!text || this.state.selectionPopup.wordByWordLoading) return;

    const words = extractCleanWordsFromSelection(text);
    if (words.length === 0) return;

    this.state.selectionPopup.wordByWordLoading = true;
    this.render();

    const results: Array<{ wordDe: string; syllables: string; meaningAr: string }> = [];
    for (const w of words) {
      const ar = await translateDeToAr(w);
      results.push({
        wordDe: w,
        syllables: splitGermanWordIntoSyllables(w),
        meaningAr: ar
      });
    }

    if (this.state.selectionPopup.selectedText === text) {
      this.state.selectionPopup.wordByWordList = results;
      this.state.selectionPopup.wordByWordLoading = false;
      this.render();
    }
  }

  private async handleToggleQuickPopupRecord(): Promise<void> {
    if (this.state.selectionPopup.isRecordingVoice) {
      this.quickRecorder.stopRecording();
      this.state.selectionPopup.isRecordingVoice = false;
      this.state.selectionPopup.hasRecordedClip = Boolean(this.quickRecorder.recordedAudioUrl);
      this.render();
      return;
    }

    this.state.selectionPopup.isRecordingVoice = true;
    this.render();

    await this.quickRecorder.startRecording(
      () => {
        this.state.selectionPopup.isRecordingVoice = this.quickRecorder.isRecording;
        this.state.selectionPopup.hasRecordedClip = Boolean(this.quickRecorder.recordedAudioUrl);
        this.render();
      },
      () => {
        this.state.selectionPopup.isRecordingVoice = false;
        this.render();
      }
    );
  }

  private handlePlayQuickComparison(): void {
    const targetWord = this.state.selectionPopup.selectedText;
    if (!targetWord) return;

    this.state.selectionPopup.playingTag = 'compare';
    this.render();
    void this.quickRecorder.playRecordedThenOriginal(targetWord).finally(() => {
      if (this.state.selectionPopup.playingTag === 'compare') {
        this.state.selectionPopup.playingTag = null;
        this.render();
      }
    });
  }

  private renderSelectionStudioPopup(): string {
    const p = this.state.selectionPopup;
    if (!p.visible || !p.selectedText) return '';

    const wordsInSelection = extractCleanWordsFromSelection(p.selectedText);
    const hasLongSyllableBreakdown = p.syllables.includes('•');

    return `
      <aside
        data-testid="selection-studio-popup"
        aria-label="مختبر نطق وترجمة الكلمة أو الجملة المحددة"
        class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[96vw] max-w-3xl rounded-2xl bg-zinc-950/95 border-2 border-emerald-500/70 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl p-4 sm:p-5 space-y-3.5 text-zinc-100"
      >
        <!-- Top Bar: Studio Title + Save to Hard Words Bank + Close -->
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div class="flex items-center gap-2" dir="rtl">
            <span class="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-extrabold">
              🎙️ مختبر نطق وترجمة الكلمة/الجملة المحددة
            </span>
            <span class="text-[11px] text-zinc-400 hidden sm:inline">
              (سيلكسيوني أي كلمة أو جملة فـ الموقع باش تسمع نطقها بوحدها بـ 4 سرعات!)
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              data-action="sel-save-hard-word"
              aria-label="احفظ للتدريب على النطق"
              class="px-3 py-1 rounded-xl text-xs font-extrabold cursor-pointer transition border ${
                p.savedToBank
                  ? 'bg-amber-500 text-black border-amber-300'
                  : 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border-amber-400/50'
              }"
              dir="rtl"
            >
              ${p.savedToBank ? '⭐ محفوظة في بنك كلماتي الصعبة ✓' : '⭐ احفظ للتدريب على النطق'}
            </button>

            <button
              type="button"
              data-action="sel-close-popup"
              aria-label="إغلاق نافذة النطق والترجمة"
              class="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-rose-600 text-xs font-extrabold cursor-pointer transition"
              dir="rtl"
            >
              ✕ إغلاق
            </button>
          </div>
        </div>

        <!-- 1. Selected German Text + Silben-Splitter (تقطيع الكلمات الطويلة لسهولة النطق) -->
        <div class="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5" dir="ltr">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-[11px] font-mono-de uppercase tracking-wider text-emerald-400">
              🇩🇪 Ausgewählter Text / Wort
            </span>
            ${
              hasLongSyllableBreakdown
                ? `<span class="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[11px] font-mono-de" dir="rtl">
                    🔬 تقطيع المقاطع الصوتية (Silben-Splitter) مفعل أوتوماتيكياً
                  </span>`
                : ''
            }
          </div>

          <div class="text-base sm:text-xl font-extrabold text-white tracking-wide break-words" data-testid="selection-german-text">
            ${escapeHtml(p.selectedText)}
          </div>

          ${
            hasLongSyllableBreakdown
              ? `<div class="pt-1 text-xs sm:text-sm font-mono-de text-amber-300 font-bold tracking-wider" data-testid="selection-syllables">
                  🗣️ تقطيع النطق: <span class="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/30">${escapeHtml(p.syllables)}</span>
                </div>`
              : ''
          }
        </div>

        <!-- 2. 4-Speed Isolated Instant Pronunciation Controls -->
        <div class="space-y-1.5" dir="rtl">
          <div class="text-xs font-bold text-emerald-300 flex items-center justify-between">
            <span>🔊 نطق فوري معزول بـ 4 سرعات للتدريب (Shadowing):</span>
            ${
              p.playingTag
                ? `<button
                    type="button"
                    data-action="sel-stop-audio"
                    class="px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold cursor-pointer"
                  >⏹️ إيقاف الصوت</button>`
                : ''
            }
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              data-action="sel-play-audio"
              data-rate="1"
              data-repeat="1"
              data-tag="1x"
              aria-label="نطق عادي 1x"
              class="py-2 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                p.playingTag === '1x'
                  ? 'bg-emerald-500 text-black border-white ring-2 ring-emerald-300'
                  : 'bg-emerald-600/25 hover:bg-emerald-600/45 text-emerald-200 border-emerald-500/40'
              }"
            >
              <span>🔊</span>
              <span>نطق عادي (1x)</span>
            </button>

            <button
              type="button"
              data-action="sel-play-audio"
              data-rate="0.75"
              data-repeat="1"
              data-tag="0.75x"
              aria-label="نطق بطيء للتدريب 0.75x"
              class="py-2 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                p.playingTag === '0.75x'
                  ? 'bg-amber-400 text-black border-white ring-2 ring-amber-200'
                  : 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 border-amber-500/40'
              }"
            >
              <span>🐢</span>
              <span>نطق بطيء للتدريب (0.75x)</span>
            </button>

            <button
              type="button"
              data-action="sel-play-audio"
              data-rate="0.55"
              data-repeat="1"
              data-tag="0.55x"
              aria-label="نطق مقطع ببطء شديد 0.55x"
              class="py-2 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                p.playingTag === '0.55x'
                  ? 'bg-indigo-400 text-black border-white ring-2 ring-indigo-200'
                  : 'bg-indigo-500/25 hover:bg-indigo-500/45 text-indigo-200 border-indigo-500/40'
              }"
            >
              <span>🔬</span>
              <span>نطق مقطع ببطء شديد (0.55x)</span>
            </button>

            <button
              type="button"
              data-action="sel-play-audio"
              data-rate="1"
              data-repeat="3"
              data-tag="3x"
              aria-label="تكرار النطق 3 مرات Loop 3x"
              class="py-2 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                p.playingTag === '3x'
                  ? 'bg-teal-400 text-black border-white ring-2 ring-teal-200'
                  : 'bg-teal-500/20 hover:bg-teal-500/40 text-teal-200 border-teal-500/40'
              }"
            >
              <span>🔁</span>
              <span>تكرار النطق 3 مرات (Loop 3x)</span>
            </button>
          </div>
        </div>

        <!-- 3. Live Arabic Translation + Word-by-Word Breakdown -->
        <div class="p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/40 space-y-2" dir="rtl">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="text-xs font-bold text-indigo-300">
              🌐 الترجمة العربية الفورية (مخزنة أوفلاين فـ الكاش):
            </div>

            ${
              wordsInSelection.length > 1
                ? `<button
                    type="button"
                    data-action="sel-word-by-word"
                    aria-label="تفكيك الجملة كلمة بكلمة"
                    class="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-extrabold cursor-pointer transition"
                  >
                    ${p.wordByWordLoading ? '⏳ جاري التفكيك...' : '🔍 تفكيك الجملة كلمة بكلمة'}
                  </button>`
                : ''
            }
          </div>

          <div class="text-sm sm:text-base font-extrabold text-amber-300" data-testid="selection-arabic-translation">
            ${p.translationLoading ? '⏳ جاري ترجمة النص المحدد...' : escapeHtml(p.translationAr)}
          </div>

          ${
            p.wordByWordList.length > 0
              ? `<div class="pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2" dir="ltr">
                  ${p.wordByWordList
                    .map(
                      (item) => `
                        <div class="p-2 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between gap-1">
                          <div class="flex items-center justify-between gap-1">
                            <span class="text-xs font-extrabold text-emerald-300 truncate">${escapeHtml(item.wordDe)}</span>
                            <button
                              type="button"
                              data-action="sel-play-audio"
                              data-text="${escapeHtml(item.wordDe)}"
                              data-rate="0.85"
                              data-repeat="1"
                              class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] cursor-pointer"
                            >🔊</button>
                          </div>
                          ${
                            item.syllables.includes('•')
                              ? `<div class="text-[10px] font-mono-de text-amber-200">${escapeHtml(item.syllables)}</div>`
                              : ''
                          }
                          <div class="text-xs text-amber-300 font-bold" dir="rtl">${escapeHtml(item.meaningAr)}</div>
                        </div>
                      `
                    )
                    .join('')}
                </div>`
              : ''
          }
        </div>

        <!-- 4. Quick 5-Second Voice Practice Inside the Popup -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-1" dir="rtl">
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-action="sel-toggle-record"
              aria-label="سجل نطقك لهذه الكلمة"
              class="px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition flex items-center gap-1.5 ${
                p.isRecordingVoice
                  ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-300'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-500/40'
              }"
            >
              <span>${p.isRecordingVoice ? '⏹️ وقف التسجيل (5 ثواني)' : '🎙️ سجل نطقك لهذه الكلمة'}</span>
            </button>

            <button
              type="button"
              data-action="sel-play-compare"
              aria-label="اسمع صوتك ثم اسمع النطق الأصلي"
              class="px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition flex items-center gap-1.5 ${
                p.hasRecordedClip
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/10'
              }"
            >
              <span>▶️ اسمع صوتك ثم اسمع النطق الأصلي</span>
            </button>
          </div>

          <span class="text-[11px] text-zinc-400">
            💡 قارن النطق ديالك مباشرة مع النطق الألماني الأصلي!
          </span>
        </div>
      </aside>
    `;
  }

  private renderHardWordsBankModal(): string {
    const list = this.state.hardWordsBank;
    return `
      <div
        data-testid="hard-words-modal"
        class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      >
        <div class="studio-card rounded-2xl max-w-3xl w-full p-5 sm:p-6 space-y-4 max-h-[88vh] overflow-y-auto border-2 border-amber-500/60">
          <div class="flex items-center justify-between border-b border-zinc-700 pb-3" dir="rtl">
            <div>
              <span class="text-xs font-bold text-amber-400">My Mündlich Hard Words Bank • محرك التدريب الشخصي</span>
              <h3 class="text-lg sm:text-xl font-extrabold">
                📚 بنك كلماتي الصعبة في النطق الشفوي (${list.length})
              </h3>
            </div>
            <button
              type="button"
              data-action="close-hard-words-modal"
              aria-label="إغلاق بنك الكلمات الصعبة"
              class="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
            >
              ✕ إغلاق
            </button>
          </div>

          <p class="text-xs sm:text-sm opacity-85" dir="rtl">
            هنا كتلقى جميع الكلمات المركبة أو الجمل الصعبة لي حفظتيها باش تراجع نطقها ببطء (0.75x / 0.55x) أو بالتكرار (Loop 3x) قبل ما تدخل عند الممتحن:
          </p>

          ${
            list.length === 0
              ? `<div class="p-8 rounded-2xl studio-elevated text-center space-y-2" dir="rtl">
                  <div class="text-2xl">🎙️</div>
                  <div class="text-sm font-bold text-amber-300">مازال ما حفظتي حتى كلمة فـ البنك ديالك!</div>
                  <div class="text-xs opacity-75">
                    سيلكسيوني أي كلمة ألمانية فـ الموقع أو كليكي على الكلمات الطويلة الفوق وبرك على <strong>"⭐ احفظ للتدريب على النطق"</strong>.
                  </div>
                </div>`
              : `<div class="space-y-3">
                  ${list
                    .map(
                      (item) => `
                        <div class="p-3.5 rounded-xl studio-elevated border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div class="space-y-1" dir="ltr">
                            <div class="text-base font-extrabold text-emerald-300">${escapeHtml(item.de)}</div>
                            ${
                              item.syllables && item.syllables.includes('•')
                                ? `<div class="text-xs font-mono-de text-amber-300">🗣️ ${escapeHtml(item.syllables)}</div>`
                                : ''
                            }
                            <div class="text-xs sm:text-sm font-bold text-white" dir="rtl">🇲🇦 ${escapeHtml(item.ar)}</div>
                          </div>

                          <div class="flex flex-wrap items-center gap-1.5" dir="rtl">
                            <button
                              type="button"
                              data-action="sel-play-audio"
                              data-text="${escapeHtml(item.de)}"
                              data-rate="1"
                              data-repeat="1"
                              class="px-2.5 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white text-xs font-bold cursor-pointer"
                            >
                              🔊 1x
                            </button>
                            <button
                              type="button"
                              data-action="sel-play-audio"
                              data-text="${escapeHtml(item.de)}"
                              data-rate="0.75"
                              data-repeat="1"
                              class="px-2.5 py-1.5 rounded-lg bg-amber-500/25 hover:bg-amber-500 text-amber-200 hover:text-black text-xs font-bold cursor-pointer"
                            >
                              🐢 0.75x
                            </button>
                            <button
                              type="button"
                              data-action="sel-play-audio"
                              data-text="${escapeHtml(item.de)}"
                              data-rate="0.55"
                              data-repeat="1"
                              class="px-2.5 py-1.5 rounded-lg bg-indigo-500/25 hover:bg-indigo-500 text-indigo-200 hover:text-white text-xs font-bold cursor-pointer"
                            >
                              🔬 0.55x
                            </button>
                            <button
                              type="button"
                              data-action="sel-play-audio"
                              data-text="${escapeHtml(item.de)}"
                              data-rate="1"
                              data-repeat="3"
                              class="px-2.5 py-1.5 rounded-lg bg-teal-500/25 hover:bg-teal-500 text-teal-200 hover:text-black text-xs font-bold cursor-pointer"
                            >
                              🔁 3x
                            </button>
                            <button
                              type="button"
                              data-action="remove-hard-word"
                              data-word="${escapeHtml(item.de)}"
                              aria-label="حذف الكلمة من البنك"
                              class="px-2.5 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white text-xs font-bold cursor-pointer"
                            >
                              🗑️ حذف
                            </button>
                          </div>
                        </div>
                      `
                    )
                    .join('')}
                </div>`
          }
        </div>
      </div>
    `;
  }

  private buildCurrentSimulatorContext(userMsg = ''): SimulatorTurnContext {
    const exam = this.getCurrentExam();
    const teil3Topic = this.getCurrentTeil3Topic();
    const interviewIdx = ((this.state.simRoundNumber - 1) % WIRTSCHAFT_JOB_INTERVIEW_12_QAS.length + WIRTSCHAFT_JOB_INTERVIEW_12_QAS.length) % WIRTSCHAFT_JOB_INTERVIEW_12_QAS.length;
    const currentQa = WIRTSCHAFT_JOB_INTERVIEW_12_QAS[interviewIdx];
    const nextQa = WIRTSCHAFT_JOB_INTERVIEW_12_QAS[(interviewIdx + 1) % WIRTSCHAFT_JOB_INTERVIEW_12_QAS.length];

    return {
      mode: this.state.aiSimMode,
      roundNumber: this.state.simRoundNumber,
      userMessage: userMsg,
      teil2Exam: {
        id: exam.id,
        titleDe: exam.titleDe,
        titleDarija: exam.titleDarija,
        slot1Theme: exam.slot1Theme,
        slot2Point1: exam.slot2Point1,
        slot3Point2: exam.slot3Point2,
        slot4Advantage: exam.slot4Advantage,
        slot5Disadvantage: exam.slot5Disadvantage,
        slot6Morocco: exam.slot6Morocco,
        slot2Darija: exam.slot2Darija,
        slot4Darija: exam.slot4Darija,
        slot6Darija: exam.slot6Darija
      },
      teil3Topic,
      teil3AllPoints: TEIL3_20_UNIVERSAL_POINTS,
      teil3VisitedPoints: this.state.teil3CheckedPointNumbers,
      interviewQuestion: currentQa,
      nextInterviewQuestion: nextQa,
      previousTurnScores: this.state.simTurnScores
    };
  }

  private switchSimulatorMode(mode: 'teil1' | 'teil2' | 'teil3' | 'interview'): void {
    this.stopSimulatorMicAndOptionallySend(false);
    this.state.aiSimMode = mode;
    this.state.simRoundNumber = 1;
    this.state.simTurnScores = [];
    this.state.simHintVisible = false;

    if (mode === 'interview') {
      this.state.callAvatarRole = 'hr_thomas';
    } else if (mode === 'teil1') {
      this.state.callAvatarRole = 'pruefer_markus';
    } else {
      this.state.callAvatarRole = 'partnerin_lisa';
    }

    const ctx = this.buildCurrentSimulatorContext();
    const expected = getExpectedSentenceForTurn(ctx);
    const callGreeting = getVoiceCallOpeningGreeting(ctx);
    this.state.callLastAiQuestionDe = callGreeting;

    let openingDe = '';
    let openingDarija = '';

    if (mode === 'teil2') {
      const ex = this.getCurrentExam();
      openingDe = `Hallo Mohammed! Lass uns mit Teil 2 (Thema #${ex.id}: ${ex.titleDe}) starten. Bitte sprich deine Ronde 1 (Einleitung + Fikra 1 aus dem Text)!`;
      openingDarija = `🏓 برك على "🎙️ هضر بصوتك" وقول الجولة 1 ديال موضوع „${ex.titleDe}“!`;
    } else if (mode === 'teil1') {
      openingDe =
        'Guten Tag, Mohammed! Willkommen zur mündlichen Prüfung Teil 1. Bitte stelle dich zuerst kurz vor (Name, Alter, Herkunft aus Fès, Abitur & Bachelor in Wirtschaft).';
      openingDarija = '✈️ برك على المايك وقدم راسك بالألمانية (محمد الجبوري، 22 سنة، من فاس، إجازة اقتصاد)!';
    } else if (mode === 'teil3') {
      const t3 = this.getCurrentTeil3Topic();
      openingDe = `Hallo Mohammed! In Teil 3 planen wir gemeinsam: „${t3.titleDe}“. Beginne bitte mit der Einleitung (Dkhla) und deinem ersten Vorschlag!`;
      openingDarija = `🤝 ابدأ التخطيط لموضوع „${t3.titleDarija}“! أي نقطة من الـ 20 هضرتي عليها غادي تتعلم أوتوماتيكياً فـ ورقة الوسخ ✅`;
    } else {
      const firstQa = WIRTSCHAFT_JOB_INTERVIEW_12_QAS[0];
      openingDe = `Guten Tag, Herr El Jebouri! Willkommen zum Vorstellungsgespräch im Bereich Wirtschaft. Erste Frage: ${firstQa.questionDe}`;
      openingDarija = `💼 سؤال الموارد البشرية #1: ${firstQa.questionDarija} — جاوب بصوتك بالألمانية!`;
    }

    this.state.aiConversation = [
      {
        sender: 'partner',
        textDe: openingDe,
        darijaTip: openingDarija,
        correctedSentenceDe: expected.targetSentenceDe
      }
    ];

    if (this.state.simSubMode === 'call' && this.state.callState !== 'IDLE') {
      this.speakCallAiTurnAndHandoffToMic(callGreeting);
    } else {
      this.speakPartnerReply(openingDe, false);
      this.render();
    }
  }

  private startLiveVoiceCall(): void {
    this.stopSimulatorMicAndOptionallySend(false);
    this.pauseCallDevices();

    this.state.simSubMode = 'call';
    this.state.simRoundNumber = 1;
    this.state.simTurnScores = [];
    this.state.callDurationSeconds = 0;
    this.state.callLiveCaptionDe = '';
    this.state.callInstantToast = null;
    this.state.callTurnsLog = [];
    this.state.callReport = null;

    if (this.state.aiSimMode === 'interview') {
      this.state.callAvatarRole = 'hr_thomas';
    } else if (this.state.aiSimMode === 'teil1') {
      this.state.callAvatarRole = 'pruefer_markus';
    } else {
      this.state.callAvatarRole = 'partnerin_lisa';
    }

    const turnCtx = this.buildCurrentSimulatorContext();
    const expected = getExpectedSentenceForTurn(turnCtx);
    const greetingDe = getVoiceCallOpeningGreeting(turnCtx);
    this.state.callLastAiQuestionDe = greetingDe;

    // Also sync the call opening to the Chat transcript!
    this.state.aiConversation.push({
      sender: 'partner',
      textDe: `📞 [Live Voice Call gestartet] ${greetingDe}`,
      darijaTip: '📞 اتصلتي بالبارتنر/الممتحن! اسمع السؤال وجاوب بصوتك أوتوماتيكياً بلا ما تبرك على حتى زر.',
      correctedSentenceDe: expected.targetSentenceDe
    });

    // Play 1-second phone connection sound
    sfx.playPhoneConnectRing();
    this.startCallTimerInterval();
    this.speakCallAiTurnAndHandoffToMic(greetingDe);
  }

  private startCallTimerInterval(): void {
    if (this.callTimerInterval) {
      window.clearInterval(this.callTimerInterval);
    }
    this.callTimerInterval = window.setInterval(() => {
      if (
        this.state.callState === 'AI_SPEAKING' ||
        this.state.callState === 'USER_LISTENING' ||
        this.state.callState === 'EVALUATING'
      ) {
        this.state.callDurationSeconds += 1;
        this.render();
      }
    }, 1000);
  }

  private speakCallAiTurnAndHandoffToMic(aiTextDe: string): void {
    this.stopCallListeningMic();
    this.state.callLastAiQuestionDe = aiTextDe;
    this.state.callState = 'AI_SPEAKING';
    this.render();

    speakGermanText(aiTextDe, this.state.simSpeakSpeed, (isSpeaking) => {
      if (!isSpeaking && this.state.callState === 'AI_SPEAKING') {
        // Automatic Mic Handoff: AI_SPEAKING -> USER_LISTENING
        sfx.playListeningReadyChime();
        this.state.callState = 'USER_LISTENING';
        if (!this.state.callMicMuted) {
          this.startCallListeningMic();
        }
        this.render();
      }
    });
  }

  private startCallListeningMic(): void {
    this.stopCallListeningMic();
    if (this.state.callMicMuted) return;

    this.callSpeechRec = startBrowserSpeechRecognition(
      (transcript) => {
        this.state.callLiveCaptionDe = transcript;
        const capInput = this.root.querySelector<HTMLInputElement>('[data-action="call-live-caption-input"]');
        if (capInput) {
          capInput.value = transcript;
        }

        // Smart 2400ms silence auto-submit timer
        if (this.callSilenceTimer) {
          window.clearTimeout(this.callSilenceTimer);
        }
        this.callSilenceTimer = window.setTimeout(() => {
          if (this.state.callState === 'USER_LISTENING' && this.state.callLiveCaptionDe.trim()) {
            void this.handleVoiceCallTurnSubmit();
          }
        }, 2400);
      },
      () => {
        // Keep USER_LISTENING active so user can still use the Live Captions input or Teleprompter button
      },
      () => {
        // Speech recognition ended
      },
      {
        lang: 'de-DE',
        continuous: true
      }
    );
  }

  private stopCallListeningMic(): void {
    if (this.callSilenceTimer) {
      window.clearTimeout(this.callSilenceTimer);
      this.callSilenceTimer = null;
    }
    this.callSpeechRec?.stop();
    this.callSpeechRec = null;
  }

  private pauseCallDevices(): void {
    this.stopCallListeningMic();
    stopGermanSpeech();
    if (this.callTimerInterval) {
      window.clearInterval(this.callTimerInterval);
      this.callTimerInterval = null;
    }
  }

  private async handleVoiceCallTurnSubmit(): Promise<void> {
    const userMsg = this.state.callLiveCaptionDe.trim();
    if (!userMsg || this.state.callState === 'EVALUATING') return;

    this.stopCallListeningMic();
    this.state.callState = 'EVALUATING';
    this.state.callLiveCaptionDe = '';
    this.render();

    const turnCtx = this.buildCurrentSimulatorContext(userMsg);
    const expectedBeforeEval = getExpectedSentenceForTurn(turnCtx);

    const topicTitle =
      this.state.aiSimMode === 'teil2'
        ? this.getCurrentExam().titleDe
        : this.state.aiSimMode === 'teil3'
        ? this.getCurrentTeil3Topic().titleDe
        : this.state.aiSimMode === 'teil1'
        ? 'Reise nach Bin el Ouidane'
        : 'Vorstellungsgespräch Bachelor Wirtschaft';

    // Sync Mohammed's spoken turn to Chat Transcript
    this.state.aiConversation.push({
      sender: 'mohammed',
      textDe: userMsg
    });

    const result = await evaluateTurnWithStrictExaminer({
      ...turnCtx,
      persona: this.state.aiPersona,
      topicTitle
    });

    if (result.isSanityRejected) {
      sfx.playErrorBuzz();
      this.state.callInstantToast = {
        badgeText: '0 / 60 Pkt. ❌ (جواب غير مقبول فـ الامتحان)',
        isPositive: false,
        detailDarija: result.pronunciationAndGrammarFeedbackDarija
      };
    } else {
      sfx.playPingPongHit();
      this.state.simTurnScores.push(result.scoreOutOf60);
      this.state.simRoundNumber = result.nextRoundNumber;
      this.addXpAndSync(30);
      this.state.callInstantToast = {
        badgeText: `+${result.scoreOutOf60}/60 Pkt. • Niveau ${result.cefrLevel} ${
          result.verbAtEndCorrect ? '✅ (Verb am Ende OK)' : '⚠️ (انتبه للفعل فاللخر)'
        }`,
        isPositive: true,
        detailDarija: result.pronunciationAndGrammarFeedbackDarija
      };
    }

    // Log turn for Post-Call Diagnostic Report Card
    this.state.callTurnsLog.push({
      userSaidDe: userMsg,
      targetSentenceDe: expectedBeforeEval.targetSentenceDe,
      scoreOutOf60: result.scoreOutOf60,
      cefrLevel: result.cefrLevel,
      darijaCritique: result.pronunciationAndGrammarFeedbackDarija,
      verbAtEndCorrect: result.verbAtEndCorrect
    });

    // If Teil 3 planning point was detected, check it off on the Scratchpad!
    if (result.detectedTeil3PointNumber) {
      if (!this.state.teil3CheckedPointNumbers.includes(result.detectedTeil3PointNumber)) {
        this.state.teil3CheckedPointNumbers.push(result.detectedTeil3PointNumber);
      }
      const ptObj = TEIL3_20_UNIVERSAL_POINTS.find((p) => p.number === result.detectedTeil3PointNumber);
      if (ptObj && !this.state.progress.scratchpadNotes.includes(`✅ #${ptObj.number}`)) {
        this.state.progress.scratchpadNotes = `${this.state.progress.scratchpadNotes}\n✅ #${ptObj.number} ${ptObj.titleDe}: besprochen`.trim();
        void syncProgressToFirestore(this.state.progress);
      }
    }

    // Sync AI Examiner reply & critique to Chat Transcript (`💬 وضع الشات`)
    this.state.aiConversation.push({
      sender: 'partner',
      textDe: result.partnerGermanReply,
      darijaTip: result.pronunciationAndGrammarFeedbackDarija,
      score: result.scoreOutOf60,
      cefrLevel: result.cefrLevel,
      isSanityRejected: result.isSanityRejected,
      correctedSentenceDe: result.isSanityRejected
        ? result.correctedGermanSentence
        : result.targetSentenceForCurrentOrNextTurn,
      sauerstoff: result.sauerstoffHintIfNeeded,
      scorecard: result.completedScorecard
    });

    // If a full Teil 2 scorecard was completed on Ronde 5, also build the Post-Call Report automatically
    if (result.completedScorecard) {
      this.state.callReport = buildPostCallDiagnosticReport({
        durationSeconds: Math.max(15, this.state.callDurationSeconds),
        turns: this.state.callTurnsLog
      });
    }

    // Transition EVALUATING -> AI_SPEAKING -> USER_LISTENING
    this.speakCallAiTurnAndHandoffToMic(result.partnerGermanReply);
  }

  private endLiveVoiceCallAndBuildReport(): void {
    this.pauseCallDevices();
    this.state.callState = 'ENDED';
    this.state.callReport = buildPostCallDiagnosticReport({
      durationSeconds: Math.max(10, this.state.callDurationSeconds),
      turns: this.state.callTurnsLog
    });
    if (this.state.callReport.passed) {
      sfx.playFanfare();
    }
    this.render();
  }

  private speakPartnerReply(textDe: string, forceSpeak = false): void {
    if (!forceSpeak && !this.state.simAutoSpeakReply) return;
    speakGermanText(textDe, this.state.simSpeakSpeed, (isSpeaking) => {
      if (this.state.simPartnerIsSpeaking !== isSpeaking) {
        this.state.simPartnerIsSpeaking = isSpeaking;
        this.render();
      }
    });
  }

  private startSimulatorMic(): void {
    this.simSpeechRec?.stop();
    if (this.simSilenceTimer) {
      window.clearTimeout(this.simSilenceTimer);
      this.simSilenceTimer = null;
    }

    this.state.simIsListening = true;
    this.render();

    this.simSpeechRec = startBrowserSpeechRecognition(
      (transcript) => {
        this.state.aiUserMessage = transcript;
        // Update input box immediately in DOM without losing focus
        const inputEl = this.root.querySelector<HTMLInputElement>('[data-action="ai-chat-input"]');
        if (inputEl) {
          inputEl.value = transcript;
        }

        if (this.state.simAutoSendAfterSilence) {
          if (this.simSilenceTimer) window.clearTimeout(this.simSilenceTimer);
          this.simSilenceTimer = window.setTimeout(() => {
            if (this.state.simIsListening && this.state.aiUserMessage.trim()) {
              this.stopSimulatorMicAndOptionallySend(true);
            }
          }, 2500);
        }
      },
      (errMsg) => {
        this.state.simIsListening = false;
        this.state.simHandsFreeMode = false;
        this.state.aiConversation.push({
          sender: 'partner',
          textDe: 'Hinweis zum Mikrofon: Bitte prüfe die Mikrofon-Berechtigung im Browser oder nutze das Textfeld.',
          darijaTip: errMsg
        });
        this.render();
      },
      () => {
        this.state.simIsListening = false;
        this.render();
      },
      {
        lang: this.state.simSpeechLang,
        continuous: true
      }
    );
  }

  private stopSimulatorMicAndOptionallySend(shouldSend: boolean): void {
    if (this.simSilenceTimer) {
      window.clearTimeout(this.simSilenceTimer);
      this.simSilenceTimer = null;
    }
    this.simSpeechRec?.stop();
    this.simSpeechRec = null;
    this.state.simIsListening = false;
    this.state.simHandsFreeMode = false;
    this.render();

    if (shouldSend && this.state.aiUserMessage.trim()) {
      void this.handleSendAiChat();
    }
  }

  private selectTeil2Exam(id: number): void {
    this.state.selectedTeil2Id = id;
    const exam = this.getCurrentExam();
    if (!this.state.filledSlotsByExam[id]) {
      this.state.filledSlotsByExam[id] = {
        slot1: exam.slot1Theme,
        slot2: exam.slot2Point1,
        slot3: exam.slot3Point2,
        slot4: exam.slot4Advantage,
        slot5: exam.slot5Disadvantage,
        slot6: exam.slot6Morocco
      };
    }
    this.state.distractorErrorMsg = null;
    this.spatialScene?.syncExamTopic(id, 0);
    this.render();
  }

  private handleVoiceRecordingToggle(): void {
    if (this.state.voiceIsRecording) {
      this.activeSpeechRec?.stop();
      this.state.voiceIsRecording = false;
      this.render();
      return;
    }

    this.state.voiceIsRecording = true;
    this.render();
    this.activeSpeechRec = startBrowserSpeechRecognition(
      (transcript) => {
        this.state.voiceTranscript = transcript;
        const inputEl = this.root.querySelector<HTMLInputElement>('[data-action="voice-text-input"]');
        if (inputEl) inputEl.value = transcript;
      },
      (errMsg) => {
        this.state.voiceIsRecording = false;
        this.state.voiceFeedback = {
          score: 0,
          verbOk: false,
          corrected: '',
          darija: errMsg
        };
        this.render();
      },
      () => {
        this.state.voiceIsRecording = false;
        this.render();
      },
      { lang: 'de-DE', continuous: false }
    );
  }

  private async handleGradeVoiceSlot(): Promise<void> {
    const exam = this.getCurrentExam();
    const rounds = build6RoundsForExam(exam);
    const activeRoundObj = rounds.find((r) => r.roundNumber === this.state.voiceActiveRound) || rounds[0];
    const targetClause = activeRoundObj.slot2Content || activeRoundObj.slotContent;
    const userTxt = this.state.voiceTranscript.trim();

    const localEval = evaluateSlotSimilarity(userTxt, targetClause);
    const grade = await fastGradeSlotSubmission({
      userTranscript: userTxt,
      targetSlot: targetClause,
      roundNumber: activeRoundObj.roundNumber,
      topicTitle: exam.titleDe
    });

    this.state.voiceFeedback = {
      score: grade.score,
      verbOk: grade.verbAtEndCorrect && localEval.verbAtEnd,
      corrected: grade.correctedGerman || targetClause,
      darija: grade.darijaFeedback
    };
    if (grade.score > 0) {
      sfx.playVerbGoldChime();
      this.addXpAndSync(25);
    } else {
      sfx.playErrorBuzz();
    }
    this.render();
  }

  private togglePrepTimer(): void {
    if (this.state.prepTimerRunning) {
      if (this.prepInterval) window.clearInterval(this.prepInterval);
      this.prepInterval = null;
      this.state.prepTimerRunning = false;
      this.render();
      return;
    }

    this.state.prepTimerRunning = true;
    this.prepInterval = window.setInterval(() => {
      if (this.state.prepTimerSeconds > 0) {
        this.state.prepTimerSeconds -= 1;
        this.render();
      } else {
        if (this.prepInterval) window.clearInterval(this.prepInterval);
        this.state.prepTimerRunning = false;
        sfx.playFanfare();
        this.render();
      }
    }, 1000);
    this.render();
  }

  private handleSubmitCertExam(): void {
    const cert = this.state.activeCertExam;
    if (!cert) return;
    let correctCount = 0;
    for (const q of cert.questions) {
      if (this.state.certAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    }
    const score = Math.round((correctCount / cert.questions.length) * 100);
    const passed = score >= cert.passingScore;
    if (passed) {
      this.state.progress.currentLevel = cert.toLevel;
      if (!this.state.progress.unlockedCertificates.includes(cert.id)) {
        this.state.progress.unlockedCertificates.push(cert.id);
      }
      sfx.playFanfare();
      this.addXpAndSync(100);
    } else {
      sfx.playErrorBuzz();
    }
    this.state.certResult = {
      score,
      passed,
      badgeText: passed
        ? cert.certificateBadgeDarija
        : `جبتي ${score}%. خاصك على الأقل ${cert.passingScore}% باش تنجح. راجع الأجوبة وعاود جرب!`
    };
    this.render();
  }

  private async handleSendAiChat(): Promise<void> {
    const msg = this.state.aiUserMessage.trim();
    if (!msg || this.state.aiLoading) return;

    if (this.state.simIsListening) {
      this.simSpeechRec?.stop();
      this.simSpeechRec = null;
      this.state.simIsListening = false;
    }

    this.state.aiConversation.push({ sender: 'mohammed', textDe: msg });
    this.state.aiUserMessage = '';
    this.state.aiLoading = true;
    this.render();

    const topicTitle =
      this.state.aiSimMode === 'teil2'
        ? this.getCurrentExam().titleDe
        : this.state.aiSimMode === 'teil3'
        ? this.getCurrentTeil3Topic().titleDe
        : this.state.aiSimMode === 'teil1'
        ? 'Reise nach Bin el Ouidane'
        : 'Vorstellungsgespräch Bachelor Wirtschaft';

    const turnCtx = this.buildCurrentSimulatorContext(msg);
    const result = await evaluateTurnWithStrictExaminer({
      ...turnCtx,
      persona: this.state.aiPersona,
      topicTitle
    });

    if (result.isSanityRejected) {
      sfx.playErrorBuzz();
    } else {
      sfx.playPingPongHit();
      this.state.simTurnScores.push(result.scoreOutOf60);
      this.state.simRoundNumber = result.nextRoundNumber;
      this.addXpAndSync(25);
    }

    // If Teil 3 planning point was detected, check it off on the Scratchpad!
    if (result.detectedTeil3PointNumber) {
      if (!this.state.teil3CheckedPointNumbers.includes(result.detectedTeil3PointNumber)) {
        this.state.teil3CheckedPointNumbers.push(result.detectedTeil3PointNumber);
      }
      const ptObj = TEIL3_20_UNIVERSAL_POINTS.find((p) => p.number === result.detectedTeil3PointNumber);
      if (ptObj && !this.state.progress.scratchpadNotes.includes(`✅ #${ptObj.number}`)) {
        this.state.progress.scratchpadNotes = `${this.state.progress.scratchpadNotes}\n✅ #${ptObj.number} ${ptObj.titleDe}: besprochen`.trim();
        void syncProgressToFirestore(this.state.progress);
      }
    }

    this.state.aiConversation.push({
      sender: 'partner',
      textDe: result.partnerGermanReply,
      darijaTip: result.pronunciationAndGrammarFeedbackDarija,
      score: result.scoreOutOf60,
      cefrLevel: result.cefrLevel,
      isSanityRejected: result.isSanityRejected,
      correctedSentenceDe: result.isSanityRejected
        ? result.correctedGermanSentence
        : result.targetSentenceForCurrentOrNextTurn,
      sauerstoff: result.sauerstoffHintIfNeeded,
      scorecard: result.completedScorecard
    });

    this.state.aiLoading = false;
    this.speakPartnerReply(result.partnerGermanReply, false);
    this.render();
  }

  private async handleRunCareerSearch(): Promise<void> {
    if (this.state.careerSearchLoading) return;
    this.state.careerSearchLoading = true;
    this.render();
    const res = await queryGermanCareerSearch(this.state.careerSearchQuery);
    this.state.careerSearchResult = res;
    this.state.careerSearchLoading = false;
    this.render();
  }
}
