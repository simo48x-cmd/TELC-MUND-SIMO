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

export function stopGermanSpeech(): void {
  if (activeSpeechFallbackTimer !== null && typeof window !== 'undefined') {
    window.clearTimeout(activeSpeechFallbackTimer);
    activeSpeechFallbackTimer = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export function speakGermanText(
  text: string,
  rate: 0.8 | 0.85 | 1.0 = 1.0,
  onSpeechStateChange?: (isSpeaking: boolean) => void
): void {
  if (activeSpeechFallbackTimer !== null && typeof window !== 'undefined') {
    window.clearTimeout(activeSpeechFallbackTimer);
    activeSpeechFallbackTimer = null;
  }

  if (sfx.muted || typeof window === 'undefined') {
    onSpeechStateChange?.(false);
    return;
  }
  const cleanText = text.replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();
  if (!cleanText) {
    onSpeechStateChange?.(false);
    return;
  }

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

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'de-DE';
      utterance.rate = rate;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const germanVoice = voices.find((v) => v.lang.toLowerCase().startsWith('de'));
      if (germanVoice) {
        utterance.voice = germanVoice;
      }
      utterance.onstart = () => {
        onSpeechStateChange?.(true);
      };
      utterance.onend = () => {
        finishOnce();
      };
      utterance.onerror = () => {
        finishOnce();
      };
      onSpeechStateChange?.(true);
      window.speechSynthesis.speak(utterance);

      // Reliable fallback timer in case browser speechSynthesis doesn't fire onend
      const estimatedMs = Math.min(7500, Math.max(1200, Math.round((cleanText.length * 42) / rate)));
      activeSpeechFallbackTimer = window.setTimeout(() => {
        finishOnce();
      }, estimatedMs);
      return;
    } catch (e) {
      console.warn('Browser speechSynthesis fallback error:', e);
      finishOnce();
    }
  } else {
    finishOnce();
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
