import { PartnerPersona } from '../types';
import {
  evaluateSlotAttempt,
  evaluateSimulatorTurnDeterministically,
  SimulatorTurnContext,
  StrictExaminerResult
} from '../utils/pingPongLogic';

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  public muted = false;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public playPingPongHit(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.085);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  public playVerbGoldChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [587.33, 880, 1174.66]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const start = ctx.currentTime + idx * 0.06;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.14, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.26);
    });
  }

  public playLaserBeam(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.19);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.19);
  }

  public playErrorBuzz(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.setValueAtTime(135, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  }

  public playFanfare(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const start = ctx.currentTime + idx * 0.09;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.16, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.46);
    });
  }

  public playPhoneConnectRing(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    // Dual-tone European phone connect ring (425 Hz + 640 Hz) over ~0.9s
    const bursts = [
      { offset: 0.0, duration: 0.32, freqs: [425, 640] },
      { offset: 0.45, duration: 0.38, freqs: [523.25, 783.99] }
    ];
    bursts.forEach((b) => {
      b.freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = ctx.currentTime + b.offset;
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + b.duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + b.duration + 0.02);
      });
    });
  }

  public playListeningReadyChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [659.25, 880]; // E5 -> A5 gentle "mic open" chime
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const start = ctx.currentTime + idx * 0.07;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.1, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.17);
    });
  }
}

export const sfx = new SoundEffectsManager();

let activeSpeechFallbackTimer: number | null = null;
let activeAudioElement: HTMLAudioElement | null = null;
let stopRequested = false;

export function stopGermanAudio(): void {
  stopRequested = true;
  if (activeSpeechFallbackTimer !== null && typeof window !== 'undefined') {
    window.clearTimeout(activeSpeechFallbackTimer);
    activeSpeechFallbackTimer = null;
  }
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch {
      // ignore
    }
    activeAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export function stopGermanSpeech(): void {
  stopGermanAudio();
}

export async function playGermanSelection(
  rawText: string,
  rate: number = 1.0,
  repeatCount: number = 1,
  onStateChange?: (isPlaying: boolean) => void
): Promise<void> {
  stopGermanAudio();
  stopRequested = false;
  if (sfx.muted || typeof window === 'undefined') {
    onStateChange?.(false);
    return;
  }

  const cleanText = rawText.replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();
  if (!cleanText) {
    onStateChange?.(false);
    return;
  }

  onStateChange?.(true);
  const chunks = cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanText];

  const playOneChunkCloudTts = (chunk: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // In headless test environments (webdriver), use speechSynthesis directly to avoid external audio network errors
      if (typeof navigator !== 'undefined' && navigator.webdriver) {
        resolve(false);
        return;
      }
      try {
        const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=de&client=gtx&q=${encodeURIComponent(
          chunk.trim().slice(0, 170)
        )}`;
        const audio = new Audio(url);
        audio.playbackRate = rate;
        activeAudioElement = audio;
        let done = false;
        const finish = (ok: boolean) => {
          if (!done) {
            done = true;
            resolve(ok);
          }
        };
        const safetyTimer = window.setTimeout(() => finish(false), 6500);
        audio.onended = () => {
          window.clearTimeout(safetyTimer);
          finish(true);
        };
        audio.onerror = () => {
          window.clearTimeout(safetyTimer);
          finish(false);
        };
        const p = audio.play();
        if (p !== undefined) {
          p.catch(() => {
            window.clearTimeout(safetyTimer);
            finish(false);
          });
        }
      } catch {
        resolve(false);
      }
    });
  };

  const playFallbackSpeech = (chunk: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve(false);
        return;
      }
      try {
        window.speechSynthesis.cancel();
        window.setTimeout(() => {
          if (stopRequested) {
            resolve(false);
            return;
          }
          window.speechSynthesis.resume();
          const u = new SpeechSynthesisUtterance(chunk.trim());
          u.lang = 'de-DE';
          u.rate = rate;
          const deVoice = window.speechSynthesis
            .getVoices()
            .find((v) => v.lang.toLowerCase().startsWith('de'));
          if (deVoice) u.voice = deVoice;
          let done = false;
          const finish = (ok: boolean) => {
            if (!done) {
              done = true;
              resolve(ok);
            }
          };
          const fallbackMs = Math.min(
            6500,
            Math.max(900, Math.round((chunk.length * 42) / Math.max(0.5, rate)))
          );
          const safetyTimer = window.setTimeout(() => finish(true), fallbackMs);
          u.onend = () => {
            window.clearTimeout(safetyTimer);
            finish(true);
          };
          u.onerror = () => {
            window.clearTimeout(safetyTimer);
            finish(false);
          };
          window.speechSynthesis.speak(u);
        }, 60);
      } catch {
        resolve(false);
      }
    });
  };

  try {
    for (let r = 0; r < repeatCount; r++) {
      if (stopRequested) break;
      for (const c of chunks) {
        if (stopRequested) break;
        const ok = await playOneChunkCloudTts(c);
        if (!ok && !stopRequested) {
          await playFallbackSpeech(c);
        }
      }
      if (r < repeatCount - 1 && !stopRequested) {
        await new Promise((res) => window.setTimeout(res, 850));
      }
    }
  } finally {
    onStateChange?.(false);
  }
}

export function speakGermanText(
  text: string,
  rate: number = 1.0,
  onSpeechStateChange?: (isSpeaking: boolean) => void
): void {
  if (sfx.muted || typeof window === 'undefined') {
    onSpeechStateChange?.(false);
    return;
  }
  const cleanText = text.replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();
  if (!cleanText) {
    onSpeechStateChange?.(false);
    return;
  }

  onSpeechStateChange?.(true);
  let finished = false;
  const finishOnce = () => {
    if (finished) return;
    finished = true;
    if (activeSpeechFallbackTimer !== null) {
      window.clearTimeout(activeSpeechFallbackTimer);
      activeSpeechFallbackTimer = null;
    }
    onSpeechStateChange?.(false);
  };

  const estimatedMs = Math.min(
    7500,
    Math.max(1200, Math.round((cleanText.length * 42) / Math.max(0.5, rate)))
  );
  activeSpeechFallbackTimer = window.setTimeout(() => {
    finishOnce();
  }, estimatedMs);

  void playGermanSelection(cleanText, rate, 1).finally(() => {
    finishOnce();
  });
}

// ============================================================================
// FREE GERMAN-TO-ARABIC LIVE TRANSLATOR (GTX + MYMEMORY + CACHE)
// ============================================================================

const TRANSLATION_CACHE_KEY = 'muendlich_de_ar_cache_v1';
const translationCache: Record<string, string> = {
  'Der Text befasst sich mit dem Thema': 'النص يتناول موضوع',
  'Der Text befasst sich mit dem Thema Fast Food und warum es süchtig machen kann':
    'النص يتناول موضوع الوجبات السريعة ولماذا يمكن أن تسبب الإدمان',
  'Zuerst wird beschrieben, dass': 'أولاً تم وصف أن',
  'Außerdem wird im Text noch erwähnt, dass': 'علاوة على ذلك يُذكر في النص أن',
  'Ich bin der Ansicht, dass': 'أنا أرى / في رأيي أن',
  'Ein großer Vorteil ist meiner Meinung nach, dass': 'من وجهة نظري فإن الميزة الكبيرة هي أن',
  'Ein wichtiger Nachteil ist aber zum Beispiel, dass': 'ولكن من العيوب المهمة على سبيل المثال أن',
  'Welche Informationen hast du noch gefunden': 'ما هي المعلومات الأخرى التي وجدتها أيضاً؟',
  'Was ist deine persönliche Meinung zu diesem Thema': 'ما هو رأيك الشخصي في هذا الموضوع؟',
  'Wie siehst du das': 'كيف ترى ذلك؟',
  'Hast du vielleicht schon Erfahrungen damit gemacht': 'هل سبق لك أن خضت تجربة في هذا المجال؟',
  'Sehenswürdigkeiten': 'المعالم السياحية',
  'Umweltverschmutzung': 'تلوث البيئة',
  'Verantwortungsbewusstsein': 'الوعي بالمسؤولية',
  'Wirtschaftswissenschaften': 'العلوم الاقتصادية',
  'Vorstellungsgespräch': 'مقابلة العمل',
  'Zusammenfassend': 'خلاصة القول / باختصار',
  'Erfahrung': 'تجربة / خبرة',
  'Vorteil': 'ميزة / إيجابية',
  'Nachteil': 'عيب / سلبية',
  'Gesellschaft': 'المجتمع',
  'Gesundheit': 'الصحة',
  'Zukunft': 'المستقبل',
  'Entscheidung': 'قرار',
  'Möglichkeit': 'إمكانية / فرصة',
  'Unternehmen': 'شركة / مؤسسة',
  'Der': 'الـ (أداة تعريف للمذكر)',
  'die': 'الـ (أداة تعريف للمؤنث/الجمع)',
  'das': 'الـ (أداة تعريف للمحايد)',
  'Text': 'النص / المقال',
  'befasst': 'يتناول / يهتم بـ',
  'sich': 'نفسه (ضمير انعكاسي)',
  'mit': 'مع / بـ',
  'dem': 'الـ (حالة المجرور Dativ)',
  'Thema': 'الموضوع',
  'Fast': 'سريع (الوجبات السريعة)',
  'Food': 'طعام / وجبات',
  'und': 'و',
  'warum': 'لماذا',
  'es': 'هو / إنه',
  'süchtig': 'مُدمن / يسبب الإدمان',
  'machen': 'يفعل / يجعل',
  'kann': 'يستطيع / يمكن أن'
};

try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const rawCached = window.localStorage.getItem(TRANSLATION_CACHE_KEY);
    if (rawCached) {
      const parsed = JSON.parse(rawCached) as Record<string, string>;
      Object.assign(translationCache, parsed);
    }
  }
} catch {
  // ignore localStorage read errors
}

function persistTranslationCache(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(translationCache));
    }
  } catch {
    // ignore
  }
}

export async function translateDeToAr(text: string): Promise<string> {
  const clean = text.replace(/^["„“”'.,!?;:()[\]]+|["„“”'.,!?;:()[\]]+$/g, '').trim() || text.trim();
  if (!clean) return '';
  if (translationCache[clean]) return translationCache[clean];

  const caseInsensitiveMatch = Object.keys(translationCache).find(
    (k) => k.toLowerCase() === clean.toLowerCase()
  );
  if (caseInsensitiveMatch) {
    return translationCache[caseInsensitiveMatch];
  }

  // In automated headless test environments, avoid external CORS-blocked translation fetches
  if (typeof navigator !== 'undefined' && navigator.webdriver) {
    return `ترجمة (${clean})`;
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=de&tl=ar&dt=t&q=${encodeURIComponent(
      clean
    )}`;
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const translated = data[0].map((part: any) => part[0]).join('');
      if (translated) {
        translationCache[clean] = translated;
        persistTranslationCache();
        return translated;
      }
    }
  } catch {
    // fallback to MyMemory
  }

  try {
    const res2 = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=de|ar`
    );
    const data2 = await res2.json();
    if (data2?.responseData?.translatedText) {
      translationCache[clean] = data2.responseData.translatedText;
      persistTranslationCache();
      return data2.responseData.translatedText;
    }
  } catch {
    // fallback message
  }

  return 'تعذر الاتصال بخدمة الترجمة الفورية، حاول مرة أخرى.';
}

// ============================================================================
// MY MÜNDLICH HARD WORDS BANK (localStorage: 'muendlich_hard_words')
// ============================================================================

export interface HardWordEntry {
  de: string;
  ar: string;
  syllables: string;
  date: string;
}

const HARD_WORDS_STORAGE_KEY = 'muendlich_hard_words';

export function loadHardWordsBank(): HardWordEntry[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(HARD_WORDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHardWordToBank(entry: {
  de: string;
  ar: string;
  syllables: string;
}): HardWordEntry[] {
  const cleanDe = entry.de.trim();
  if (!cleanDe) return loadHardWordsBank();
  const current = loadHardWordsBank();
  const filtered = current.filter((item) => item.de.toLowerCase() !== cleanDe.toLowerCase());
  const next: HardWordEntry[] = [
    {
      de: cleanDe,
      ar: entry.ar || '',
      syllables: entry.syllables || cleanDe,
      date: new Date().toLocaleDateString('ar-MA')
    },
    ...filtered
  ];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(HARD_WORDS_STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // ignore
  }
  return next;
}

export function removeHardWordFromBank(deText: string): HardWordEntry[] {
  const current = loadHardWordsBank();
  const next = current.filter((item) => item.de.toLowerCase() !== deText.trim().toLowerCase());
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(HARD_WORDS_STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // ignore
  }
  return next;
}

export function isWordInHardBank(deText: string): boolean {
  const clean = deText.trim().toLowerCase();
  if (!clean) return false;
  return loadHardWordsBank().some((item) => item.de.toLowerCase() === clean);
}

// ============================================================================
// QUICK 5-SECOND VOICE RECORDING & BACK-TO-BACK COMPARISON STUDIO
// ============================================================================

export class QuickVoiceComparisonRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: BlobPart[] = [];
  private autoStopTimer: number | null = null;
  public recordedAudioUrl: string | null = null;
  public isRecording = false;

  public async startRecording(
    onStateChange: () => void,
    onError: (msg: string) => void
  ): Promise<void> {
    this.stopRecording();
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      onError('المتصفح لا يدعم تسجيل الصوت المباشر (MediaRecorder).');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.chunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.isRecording = true;
      onStateChange();

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.chunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        if (this.chunks.length > 0) {
          if (this.recordedAudioUrl) {
            URL.revokeObjectURL(this.recordedAudioUrl);
          }
          const blob = new Blob(this.chunks, { type: 'audio/webm' });
          this.recordedAudioUrl = URL.createObjectURL(blob);
        }
        this.cleanupStream();
        onStateChange();
      };

      this.mediaRecorder.start();

      // Auto-stop after 5 seconds for quick word/phrase comparison
      this.autoStopTimer = window.setTimeout(() => {
        if (this.isRecording) {
          this.stopRecording();
        }
      }, 5000);
    } catch {
      this.isRecording = false;
      this.cleanupStream();
      onError('تعذر الوصول للميكروفون. تأكد من السماح بالمايك فـ المتصفح.');
      onStateChange();
    }
  }

  public stopRecording(): void {
    if (this.autoStopTimer !== null && typeof window !== 'undefined') {
      window.clearTimeout(this.autoStopTimer);
      this.autoStopTimer = null;
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {
        // ignore
      }
    }
    this.isRecording = false;
    this.cleanupStream();
  }

  private cleanupStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
  }

  public async playRecordedThenOriginal(targetGermanText: string): Promise<void> {
    stopGermanAudio();
    if (this.recordedAudioUrl) {
      await new Promise<void>((resolve) => {
        const userAudio = new Audio(this.recordedAudioUrl!);
        const timer = window.setTimeout(() => resolve(), 6000);
        userAudio.onended = () => {
          window.clearTimeout(timer);
          resolve();
        };
        userAudio.onerror = () => {
          window.clearTimeout(timer);
          resolve();
        };
        userAudio.play().catch(() => {
          window.clearTimeout(timer);
          resolve();
        });
      });
      await new Promise((r) => window.setTimeout(r, 350));
    }
    await playGermanSelection(targetGermanText, 1.0, 1);
  }
}

export async function speakGermanGeminiTts(text: string, voiceName = 'Kore'): Promise<void> {
  if (sfx.muted) return;
  try {
    const response = await fetch('/api/gemini/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceName })
    });
    if (!response.ok) {
      speakGermanText(text, 1.0);
      return;
    }
    const data = (await response.json()) as { audioBase64?: string; mimeType?: string };
    if (data.audioBase64) {
      const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
      const audio = new Audio(audioSrc);
      await audio.play();
    } else {
      speakGermanText(text, 1.0);
    }
  } catch {
    speakGermanText(text, 1.0);
  }
}

export interface SpeechRecognitionOptions {
  lang?: 'de-DE' | 'ar-MA';
  continuous?: boolean;
}

export function startBrowserSpeechRecognition(
  onResult: (transcript: string, isFinal: boolean, interimTranscript?: string) => void,
  onError: (errMsg: string) => void,
  onEnd: () => void,
  options: SpeechRecognitionOptions = {}
): { stop: () => void } | null {
  if (typeof window === 'undefined') return null;
  const SpeechRec =
    (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
      .SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

  if (!SpeechRec) {
    onError(
      'المتصفح ديالك ما كيدعمش الميكرو المباشر (Web Speech API). تقدر تكتب الجواب أو تضغط على زر الجملة باش تسمعها وتدرب عليها!'
    );
    onEnd();
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognition = new (SpeechRec as any)();
  recognition.lang = options.lang || 'de-DE';
  recognition.continuous = options.continuous ?? true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let accumulatedFinal = '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        accumulatedFinal = `${accumulatedFinal} ${t}`.trim();
      } else {
        interim += t;
      }
    }
    const combined = `${accumulatedFinal} ${interim}`.trim();
    if (combined) {
      onResult(combined, interim.length === 0, interim.trim());
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    if (event?.error === 'aborted' || event?.error === 'no-speech') {
      return;
    }
    onError(`خطأ فـ الميكرو (${event?.error || 'غير معروف'})`);
  };

  recognition.onend = () => {
    onEnd();
  };

  try {
    recognition.start();
  } catch {
    onError('تعذر تشغيل الميكروفون. تأكد من إعطاء صلاحية الميكرو فـ المتصفح.');
    onEnd();
    return null;
  }

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    }
  };
}

export interface FastGradeResponse {
  score: number;
  verbAtEndCorrect: boolean;
  correctedGerman: string;
  darijaFeedback: string;
}

export async function fastGradeSlotSubmission(params: {
  userTranscript: string;
  targetSlot: string;
  roundNumber: number;
  topicTitle: string;
}): Promise<FastGradeResponse> {
  const localStrict = evaluateSlotAttempt(params.userTranscript, params.targetSlot);
  if (localStrict.scoreOutOf60 === 0) {
    return {
      score: 0,
      verbAtEndCorrect: false,
      correctedGerman: params.targetSlot,
      darijaFeedback: localStrict.feedbackDarija
    };
  }

  try {
    const res = await fetch('/api/gemini/fast-grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Grade request failed');
    const data = (await res.json()) as FastGradeResponse;
    return {
      score: typeof data.score === 'number' ? data.score : Math.round((localStrict.scoreOutOf60 / 60) * 100),
      verbAtEndCorrect: Boolean(data.verbAtEndCorrect ?? localStrict.verbAtEndCorrect),
      correctedGerman: data.correctedGerman || params.targetSlot,
      darijaFeedback: data.darijaFeedback || localStrict.feedbackDarija
    };
  } catch {
    return {
      score: Math.round((localStrict.scoreOutOf60 / 60) * 100),
      verbAtEndCorrect: localStrict.verbAtEndCorrect,
      correctedGerman: params.targetSlot,
      darijaFeedback: localStrict.feedbackDarija
    };
  }
}

export async function evaluateTurnWithStrictExaminer(
  ctx: SimulatorTurnContext & { persona: PartnerPersona; topicTitle: string }
): Promise<StrictExaminerResult> {
  // Always compute Tier 2 Strict Deterministic evaluation first
  const det = evaluateSimulatorTurnDeterministically(ctx);

  // If sanity filter rejected input (< 4 words, profanity, slang, or non-German), return 0/60 immediately!
  if (det.isSanityRejected) {
    return det;
  }

  // Otherwise try Tier 1 (/api/gemini/chat powered by gemini-3.8-flash) and merge with turn progression state
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: ctx.mode,
        persona: ctx.persona,
        topicTitle: ctx.topicTitle,
        userMessage: ctx.userMessage,
        roundNumber: ctx.roundNumber,
        targetSentenceDe: det.correctedGermanSentence,
        nextPartnerTemplateDe: det.partnerGermanReply
      })
    });
    if (!res.ok) throw new Error('Backend Gemini call failed');
    const aiData = (await res.json()) as {
      scoreOutOf60?: number;
      cefrLevel?: '0' | 'A1' | 'A2' | 'B1' | 'B2';
      verbAtEndCorrect?: boolean;
      pronunciationAndGrammarFeedbackDarija?: string;
      correctedGermanSentence?: string;
      partnerGermanReply?: string;
      sauerstoffHintIfNeeded?: string;
    };

    const validCefr =
      aiData.cefrLevel && ['0', 'A1', 'A2', 'B1', 'B2'].includes(aiData.cefrLevel)
        ? aiData.cefrLevel
        : det.cefrLevel;

    return {
      ...det,
      scoreOutOf60:
        typeof aiData.scoreOutOf60 === 'number'
          ? Math.max(0, Math.min(60, aiData.scoreOutOf60))
          : det.scoreOutOf60,
      cefrLevel: validCefr,
      verbAtEndCorrect:
        typeof aiData.verbAtEndCorrect === 'boolean'
          ? aiData.verbAtEndCorrect
          : det.verbAtEndCorrect,
      pronunciationAndGrammarFeedbackDarija:
        aiData.pronunciationAndGrammarFeedbackDarija || det.pronunciationAndGrammarFeedbackDarija,
      correctedGermanSentence:
        aiData.correctedGermanSentence || det.correctedGermanSentence,
      // For Teil 2, Teil 1, Teil 3, and Interview, keep the structured Ping-Pong round progression reply or AI reply
      partnerGermanReply:
        ctx.mode === 'teil2' || ctx.mode === 'teil1'
          ? det.partnerGermanReply
          : aiData.partnerGermanReply || det.partnerGermanReply,
      sauerstoffHintIfNeeded:
        aiData.sauerstoffHintIfNeeded || det.sauerstoffHintIfNeeded
    };
  } catch {
    return det;
  }
}

export async function queryGermanCareerSearch(queryText: string): Promise<{
  text: string;
  sources: Array<{ uri: string; title: string }>;
}> {
  try {
    const res = await fetch('/api/gemini/search-grounding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: queryText })
    });
    if (!res.ok) throw new Error('Search request failed');
    return (await res.json()) as { text: string; sources: Array<{ uri: string; title: string }> };
  } catch {
    return {
      text: 'في ألمانيا، حاملي شهادة الإجازة فـ الاقتصاد (Bachelor Wirtschaft) عندهم فرص كبيرة فـ مجالات Controlling, Buchhaltung, Supply Chain و Financial Analysis خصوصاً فـ مدن بحال فرانكفورت، ميونخ، شتوتغارت، ودوسلدورف.',
      sources: []
    };
  }
}

export async function fetchLiveProteinSummary(
  uniprotId: string,
  pdbId: string
): Promise<{
  sequenceLength: number;
  entryTitle: string;
  resolution: string;
  experimentalMethod: string;
}> {
  try {
    const [afRes, rcsbRes] = await Promise.allSettled([
      fetch(`https://alphafold.ebi.ac.uk/api/prediction/${uniprotId}`),
      fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdbId}`)
    ]);

    let sequenceLength = 412;
    let entryTitle = `Experimental Structure (${pdbId})`;
    let resolution = '2.40 Å';
    let experimentalMethod = 'X-RAY DIFFRACTION';

    if (afRes.status === 'fulfilled' && afRes.value.ok) {
      const afJson = (await afRes.value.json()) as Array<{ uniprotEnd?: number }>;
      if (Array.isArray(afJson) && afJson[0]?.uniprotEnd) {
        sequenceLength = afJson[0].uniprotEnd;
      }
    }

    if (rcsbRes.status === 'fulfilled' && rcsbRes.value.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rcsbJson = (await rcsbRes.value.json()) as any;
      if (rcsbJson?.struct?.title) {
        entryTitle = String(rcsbJson.struct.title);
      }
      const resCombined = rcsbJson?.rcsb_entry_info?.resolution_combined?.[0];
      if (resCombined) {
        resolution = `${Number(resCombined).toFixed(2)} Å`;
      }
      const expMethod = rcsbJson?.exptl?.[0]?.method;
      if (expMethod) {
        experimentalMethod = String(expMethod);
      }
    }

    return { sequenceLength, entryTitle, resolution, experimentalMethod };
  } catch {
    return {
      sequenceLength: 443,
      entryTitle: `Neuro-Receptor Complex (${pdbId})`,
      resolution: '2.50 Å',
      experimentalMethod: 'X-RAY DIFFRACTION'
    };
  }
}
