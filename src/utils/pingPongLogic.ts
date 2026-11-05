import { IdeaCardItem, Teil2Exam, Teil3PlanningPoint, Teil3Topic, JobInterviewQuestion } from '../types';

/**
 * Extracts the final word (conjugated verb in a German dass-clause)
 * and the preceding body of the clause for visual gold verb-end highlighting.
 */
export function splitClauseFinalVerb(clause: string): {
  body: string;
  prefix: string;
  finalVerb: string;
  punctuation: string;
} {
  const raw = clause.trim();
  const punctMatch = raw.match(/([.!?]+)$/);
  const punctuation = punctMatch ? punctMatch[1] : '';
  const trimmed = raw.replace(/[.!?]+$/, '');
  const parts = trimmed.split(/\s+/);
  if (parts.length <= 1) {
    return { body: '', prefix: '', finalVerb: trimmed, punctuation };
  }
  const finalVerb = parts[parts.length - 1];
  const body = parts.slice(0, -1).join(' ');
  return { body, prefix: body, finalVerb, punctuation };
}

export function checkVerbAtEnd(clause: string, expectedClause: string): boolean {
  const actual = splitClauseFinalVerb(clause).finalVerb.toLowerCase();
  const expected = splitClauseFinalVerb(expectedClause).finalVerb.toLowerCase();
  return Boolean(actual && expected && actual === expected);
}

export function buildDistractorWithMiddleVerb(validClause: string): string {
  const { body, finalVerb } = splitClauseFinalVerb(validClause);
  const words = body.split(/\s+/);
  if (words.length < 2) {
    return `${finalVerb} ${body}`;
  }
  return `${words[0]} ${finalVerb} ${words.slice(1).join(' ')}`;
}

export function transformDirectToIndirectQuestion(directQ: string): string {
  return `Ich möchte gerne wissen, ${directQ.toLowerCase()}`;
}

/**
 * Strict Sanity & Non-German Filter (Zero Free Points!).
 * Rejects inputs with fewer than 4 words, English/slang/profanity/testing words,
 * or inputs that contain no recognizable German words/verbs.
 */
const SLANG_OR_INVALID_SINGLE_TOKENS = new Set([
  'hey',
  'hi',
  'hello',
  'fuck',
  'shit',
  'wtf',
  'test',
  'testing',
  'hallo',
  'salam',
  'slm',
  'ok',
  'okay',
  'yes',
  'no',
  'ja',
  'nein',
  'yo',
  'bro',
  'haha',
  'lol',
  'asdf',
  'qwer',
  '123',
  '1234'
]);

const GERMAN_CORE_MARKERS = new Set([
  'der', 'die', 'das', 'dem', 'den', 'des', 'ein', 'eine', 'einer', 'einem', 'einen',
  'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sich', 'mir', 'dir', 'uns', 'mein', 'meine', 'meinem', 'meiner',
  'mit', 'dass', 'weil', 'wenn', 'ob', 'wie', 'was', 'wo', 'wann', 'wer', 'warum', 'welche', 'welcher', 'welches',
  'im', 'in', 'auf', 'für', 'von', 'zu', 'zum', 'zur', 'bei', 'nach', 'über', 'unter', 'vor', 'hinter', 'durch', 'ohne', 'um', 'als',
  'und', 'oder', 'aber', 'denn', 'sondern', 'auch', 'noch', 'schon', 'sehr', 'viel', 'viele', 'mehr', 'oft', 'immer', 'heute', 'dort', 'hier',
  'nicht', 'kein', 'keine', 'keinen', 'keinem',
  'ist', 'sind', 'war', 'waren', 'wird', 'werden', 'wurde', 'wurden', 'hat', 'haben', 'hatte', 'hatten',
  'kann', 'können', 'könnte', 'könnten', 'muss', 'müssen', 'müsste', 'soll', 'sollen', 'sollte', 'sollten',
  'will', 'wollen', 'wollte', 'darf', 'dürfen', 'möchte', 'möchten', 'würde', 'würden', 'gibt', 'geht', 'steht', 'macht', 'machen',
  'text', 'thema', 'befasst', 'beschrieben', 'erwähnt', 'meinung', 'ansicht', 'vorteil', 'nachteil', 'erfahrung', 'erfahrungen',
  'marokko', 'heimatland', 'freund', 'menschen', 'leute', 'kinder', 'alltag', 'zeit', 'geld', 'kosten', 'reise', 'studium', 'wirtschaft',
  'zuerst', 'außerdem', 'persönlich', 'zusammen', 'planen', 'organisieren', 'vorschlagen', 'stimme', 'denke', 'finde', 'glaube'
]);

const ENGLISH_STOPWORDS = new Set([
  'the', 'this', 'that', 'these', 'those', 'what', 'where', 'when', 'why', 'how', 'who',
  'you', 'your', 'they', 'their', 'our', 'with', 'from', 'about', 'into', 'have', 'has', 'had',
  'would', 'could', 'should', 'want', 'need', 'speak', 'speaking', 'english', 'please', 'thank', 'thanks',
  'fuck', 'fucking', 'shit', 'bitch', 'asshole'
]);

export function analyzeGermanInputSanity(userInput: string): {
  isValidGermanAttempt: boolean;
  wordCount: number;
  germanWordCount: number;
  reasonCode: 'empty' | 'too_short' | 'profanity_or_slang' | 'not_german' | 'valid';
} {
  const cleaned = userInput
    .toLowerCase()
    .replace(/[.,!?"„“”'()[\]:;-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return { isValidGermanAttempt: false, wordCount: 0, germanWordCount: 0, reasonCode: 'empty' };
  }

  const words = cleaned.split(' ').filter(Boolean);
  const wordCount = words.length;

  // Check for profanity or pure slang tokens anywhere in short inputs
  const hasProfanity = words.some((w) => ['fuck', 'fucking', 'shit', 'bitch', 'wtf'].includes(w));
  if (hasProfanity) {
    return { isValidGermanAttempt: false, wordCount, germanWordCount: 0, reasonCode: 'profanity_or_slang' };
  }

  if (wordCount < 4) {
    const isSlang = words.every((w) => SLANG_OR_INVALID_SINGLE_TOKENS.has(w));
    return {
      isValidGermanAttempt: false,
      wordCount,
      germanWordCount: 0,
      reasonCode: isSlang ? 'profanity_or_slang' : 'too_short'
    };
  }

  let germanWordCount = 0;
  let englishWordCount = 0;

  for (const w of words) {
    if (GERMAN_CORE_MARKERS.has(w) || /[äöüß]/.test(w)) {
      germanWordCount++;
    }
    if (ENGLISH_STOPWORDS.has(w)) {
      englishWordCount++;
    }
  }

  if (englishWordCount >= 2 && englishWordCount >= germanWordCount) {
    return { isValidGermanAttempt: false, wordCount, germanWordCount, reasonCode: 'not_german' };
  }

  if (germanWordCount === 0) {
    return { isValidGermanAttempt: false, wordCount, germanWordCount: 0, reasonCode: 'not_german' };
  }

  return {
    isValidGermanAttempt: true,
    wordCount,
    germanWordCount,
    reasonCode: 'valid'
  };
}

export function extractFirstFourWordsHint(sentenceDe: string): string {
  const words = sentenceDe.replace(/[„“"]/g, '').trim().split(/\s+/).filter(Boolean);
  return `${words.slice(0, 4).join(' ')} ...`;
}

export function evaluateSlotSimilarity(
  attemptText: string,
  targetClause: string
): {
  similarityPercent: number;
  verbAtEnd: boolean;
} {
  const res = evaluateSlotAttempt(attemptText, targetClause);
  return {
    similarityPercent: Math.min(100, Math.round((res.scoreOutOf60 / 60) * 100)),
    verbAtEnd: res.verbAtEndCorrect
  };
}

/**
 * Converts a simple A1/A2 SVO sentence (where the conjugated verb is at position 2)
 * into a B1/B2 subordinate "dass"-clause with the conjugated verb kicked to the end.
 */
export function convertMainSentenceToDassClause(
  subject: string,
  conjugatedVerb: string,
  restOfSentence: string
): string {
  const cleanSubj = subject.trim();
  const cleanVerb = conjugatedVerb.trim();
  const cleanRest = restOfSentence.trim().replace(/[.!?]+$/, '');
  if (!cleanRest) {
    return `dass ${cleanSubj} ${cleanVerb}`;
  }
  return `dass ${cleanSubj} ${cleanRest} ${cleanVerb}`;
}

/**
 * Upgrades a direct A2 question into a polite B1/B2 Indirekte Frage
 * with the conjugated verb placed at the end of the clause.
 */
export function upgradeDirectToIndirectQuestion(
  starter: string,
  questionWordOrOb: string,
  subjectAndMiddle: string,
  finalConjugatedVerb: string
): string {
  const s = starter.trim().replace(/[,?]+$/, '');
  const q = questionWordOrOb.trim();
  const mid = subjectAndMiddle.trim();
  const v = finalConjugatedVerb.trim().replace(/[.?]+$/, '');
  const isQuestionStarter =
    /^(hast du|weißt du|kannst du|könntest du|würdest du)/i.test(s);
  const punctuation = isQuestionStarter ? '?' : '.';
  return `${s}, ${q} ${mid} ${v}${punctuation}`;
}

/**
 * Calculates the official TELC B2 Mündlich score out of 60 points.
 */
export function calculateTelcOralScore(input: {
  teil1Points: number;
  teil2Points: number;
  teil3Points: number;
  languagePoints: number;
}): {
  total: number;
  maxPoints: 60;
  passed: boolean;
  gradeLabelDe: string;
  cefrEstimate: 'A1' | 'A2' | 'B1' | 'B2';
} {
  const clamp15 = (n: number) => Math.max(0, Math.min(15, Math.round(n)));
  const t1 = clamp15(input.teil1Points);
  const t2 = clamp15(input.teil2Points);
  const t3 = clamp15(input.teil3Points);
  const lang = clamp15(input.languagePoints);
  const total = t1 + t2 + t3 + lang;
  const passed = total >= 36;

  let gradeLabelDe = 'Nicht bestanden (< 36 Pkt.)';
  if (total >= 54) gradeLabelDe = 'Sehr gut (1) — Bestanden';
  else if (total >= 48) gradeLabelDe = 'Gut (2) — Bestanden';
  else if (total >= 42) gradeLabelDe = 'Befriedigend (3) — Bestanden';
  else if (total >= 36) gradeLabelDe = 'Ausreichend (4) — Bestanden';

  let cefrEstimate: 'A1' | 'A2' | 'B1' | 'B2' = 'A1';
  if (total >= 45) cefrEstimate = 'B2';
  else if (total >= 32) cefrEstimate = 'B1';
  else if (total >= 18) cefrEstimate = 'A2';

  return {
    total,
    maxPoints: 60,
    passed,
    gradeLabelDe,
    cefrEstimate,
  };
}

/**
 * Evaluates a user's spoken or typed slot attempt against the target slot text.
 * Enforces strict sanity checking so non-German or <4 word attempts get 0 points.
 */
export function evaluateSlotAttempt(
  attemptText: string,
  targetClause: string
): {
  verbAtEndCorrect: boolean;
  keywordMatchRatio: number;
  scoreOutOf60: number;
  feedbackDarija: string;
} {
  const sanity = analyzeGermanInputSanity(attemptText);
  if (!sanity.isValidGermanAttempt) {
    return {
      verbAtEndCorrect: false,
      keywordMatchRatio: 0,
      scoreOutOf60: 0,
      feedbackDarija:
        sanity.reasonCode === 'empty'
          ? 'مازال ما قلتي والو! برك على المايك 🎙️ وقول الجملة كاملة بالألمانية.'
          : `⚠️ قلتي غير '${attemptText.trim()}'! جواب غير مقبول فـ الامتحان (0/60). قول الجملة كاملة بالألمانية وحط الفعل المصرف فـ اللخر!`
    };
  }

  const cleanAttempt = attemptText
    .toLowerCase()
    .replace(/[.,!?"„“”]/g, '')
    .trim();
  const cleanTarget = targetClause
    .toLowerCase()
    .replace(/[.,!?"„“”]/g, '')
    .trim();

  const targetWords = cleanTarget.split(/\s+/).filter((w) => w.length > 2);
  const attemptWords = cleanAttempt.split(/\s+/);
  const expectedFinalVerb = cleanTarget.split(/\s+/).pop() || '';
  const actualFinalWord = attemptWords[attemptWords.length - 1] || '';

  const verbAtEndCorrect =
    actualFinalWord === expectedFinalVerb ||
    attemptWords.slice(-2).includes(expectedFinalVerb);

  let matchedCount = 0;
  for (const w of targetWords) {
    if (cleanAttempt.includes(w)) matchedCount++;
  }
  const keywordMatchRatio =
    targetWords.length > 0 ? matchedCount / targetWords.length : 1;

  const rawScore = Math.round(
    keywordMatchRatio * 42 + (verbAtEndCorrect ? 18 : 4)
  );
  const scoreOutOf60 = Math.max(0, Math.min(60, rawScore));

  const feedbackDarija = verbAtEndCorrect
    ? `تبارك الله عليك! حطيتي الفعل المصرف (${expectedFinalVerb}) فاللخر د الجملة 100% صحيح! (${scoreOutOf60}/60 Pkt.)`
    : `رد بالك للقاعدة الذهبية: مور dass خاص الفعل المصرف (${expectedFinalVerb}) يمشي للخر د الجملة! (${scoreOutOf60}/60 Pkt.)`;

  return {
    verbAtEndCorrect,
    keywordMatchRatio,
    scoreOutOf60,
    feedbackDarija,
  };
}

/**
 * Detects which of the 20 Universal Teil 3 Planning Points the user spoke about.
 */
const TEIL3_POINT_KEYWORD_MAP: Array<{ pointNumber: number; keywords: string[] }> = [
  { pointNumber: 1, keywords: ['wann', 'tag', 'wochenende', 'samstag', 'sonntag', 'uhr', 'datum', 'zeitpunkt', 'monat'] },
  { pointNumber: 2, keywords: ['wo', 'ort', 'platz', 'raum', 'halle', 'park', 'garten', 'stadt', 'location', 'stattfinden'] },
  { pointNumber: 3, keywords: ['genehmigung', 'erlaubnis', 'rathaus', 'behörde', 'offiziell', 'verwaltung', 'anmelden'] },
  { pointNumber: 4, keywords: ['wer', 'zielgruppe', 'gäste', 'teilnehmer', 'einladen', 'publikum', 'nachbarn', 'studenten', 'kollegen'] },
  { pointNumber: 5, keywords: ['aufgaben', 'aufteilen', 'wer macht', 'organisation', 'verantwortlich', 'zuständig', 'übernehme'] },
  { pointNumber: 6, keywords: ['material', 'ausrüstung', 'tische', 'stühle', 'zelt', 'dekoration', 'technik', 'beamer', 'mikrofon'] },
  { pointNumber: 7, keywords: ['programm', 'ablauf', 'aktivitäten', 'plan', 'anfangen', 'beginnen', 'reihenfolge'] },
  { pointNumber: 8, keywords: ['werbung', 'einladung', 'flyer', 'plakate', 'social media', 'whatsapp', 'instagram', 'informieren', 'bekannt'] },
  { pointNumber: 9, keywords: ['kosten', 'budget', 'geld', 'finanzieren', 'preis', 'bezahlen', 'eintritt', 'spenden', 'kasse'] },
  { pointNumber: 10, keywords: ['transport', 'fahren', 'bus', 'zug', 'auto', 'fahrgemeinschaft', 'parkplatz', 'abholen', 'verkehr'] },
  { pointNumber: 11, keywords: ['essen', 'trinken', 'verpflegung', 'getränke', 'buffet', 'grillen', 'kuchen', 'wasser', 'kaffee', 'catering'] },
  { pointNumber: 12, keywords: ['musik', 'unterhaltung', 'spiele', 'band', 'dj', 'wettbewerb', 'quiz', 'stimmung', 'programm'] },
  { pointNumber: 13, keywords: ['kinder', 'kinderbetreuung', 'spielplatz', 'schminken', 'familien', 'malen', 'kleinen'] },
  { pointNumber: 14, keywords: ['fotos', 'videos', 'kamera', 'fotografieren', 'erinnerung', 'dokumentieren', 'aufnehmen'] },
  { pointNumber: 15, keywords: ['kleidung', 'wetter', 'regen', 'sonne', 'drinnen', 'draußen', 'jacke', 'sportkleidung'] },
  { pointNumber: 16, keywords: ['aufräumen', 'putzen', 'müll', 'sauber', 'müllsäcke', 'danach', 'ende'] },
  { pointNumber: 17, keywords: ['geschenk', 'dankeschön', 'überraschung', 'gutschein', 'blumen', 'karte', 'andenken'] },
  { pointNumber: 18, keywords: ['helfer', 'freiwillige', 'unterstützung', 'team', 'mithelfen', 'freunde fragen'] },
  { pointNumber: 19, keywords: ['schilder', 'beschilderung', 'wegweiser', 'orientierung', 'eingang', 'plakat'] },
  { pointNumber: 20, keywords: ['sicherheit', 'erste hilfe', 'notfall', 'verbandskasten', 'arzt', 'versicherung', 'aufpassen'] }
];

export function detectTeil3PlanningPoint(userText: string): number | null {
  const lower = userText.toLowerCase();
  let bestPoint: number | null = null;
  let bestHits = 0;

  for (const entry of TEIL3_POINT_KEYWORD_MAP) {
    let hits = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        hits++;
      }
    }
    if (hits > bestHits) {
      bestHits = hits;
      bestPoint = entry.pointNumber;
    }
  }
  return bestPoint;
}

export interface SimulatorTurnContext {
  mode: 'teil1' | 'teil2' | 'teil3' | 'interview';
  roundNumber: number; // Teil 2: 1, 3, 5; Teil 1: 1..4; Teil 3: 1..6; Interview: 1..12
  userMessage: string;
  teil2Exam?: {
    id: number;
    titleDe: string;
    titleDarija: string;
    slot1Theme: string;
    slot2Point1: string;
    slot3Point2: string;
    slot4Advantage: string;
    slot5Disadvantage: string;
    slot6Morocco: string;
  };
  teil3Topic?: Teil3Topic;
  teil3AllPoints?: Teil3PlanningPoint[];
  teil3VisitedPoints?: number[];
  interviewQuestion?: JobInterviewQuestion;
  nextInterviewQuestion?: JobInterviewQuestion;
  previousTurnScores?: number[];
}

export interface StrictExaminerResult {
  scoreOutOf60: number;
  cefrLevel: '0' | 'A1' | 'A2' | 'B1' | 'B2';
  isSanityRejected: boolean;
  verbAtEndCorrect: boolean;
  pronunciationAndGrammarFeedbackDarija: string;
  correctedGermanSentence: string;
  partnerGermanReply: string;
  sauerstoffHintIfNeeded: string;
  nextRoundNumber: number;
  targetSentenceForCurrentOrNextTurn: string;
  hintFirst4Words: string;
  detectedTeil3PointNumber?: number;
  completedScorecard?: {
    ausdruck: number;
    aufgabe: number;
    korrektheit: number;
    aussprache: number;
    totalOutOf60: number;
    passed: boolean;
    summaryDarija: string;
  };
}

function formatDassClause(clause: string): string {
  const trimmed = clause.trim().replace(/[.!?]+$/, '');
  const withDass = /^dass\b/i.test(trimmed) ? trimmed : `dass ${trimmed}`;
  return `${withDass}.`;
}

export function getExpectedSentenceForTurn(ctx: SimulatorTurnContext): {
  targetSentenceDe: string;
  roundLabelDarija: string;
  hintFirst4Words: string;
} {
  if (ctx.mode === 'teil2' && ctx.teil2Exam) {
    const ex = ctx.teil2Exam;
    if (ctx.roundNumber <= 1) {
      const s = `Der Text befasst sich mit dem Thema „${ex.slot1Theme}“. Zuerst wird beschrieben, ${formatDassClause(ex.slot2Point1)} Welche Informationen hast du noch gefunden?`;
      return {
        targetSentenceDe: s,
        roundLabelDarija: '🏓 الجولة 1 (نتا): الدخلة + الفكرة 1 من الورقة + سؤال للبارتنر',
        hintFirst4Words: extractFirstFourWordsHint(s)
      };
    }
    if (ctx.roundNumber === 3) {
      const s = `Ich bin der Ansicht, dass dieses Thema sehr wichtig ist. Ein großer Vorteil ist meiner Meinung nach, ${formatDassClause(ex.slot4Advantage)} Wie siehst du das?`;
      return {
        targetSentenceDe: s,
        roundLabelDarija: '🏓 الجولة 3 (نتا): رأيك الشخصي + الإيجابية (Vorteil) + سؤال للبارتنر',
        hintFirst4Words: extractFirstFourWordsHint(s)
      };
    }
    const s = `Persönlich habe ich keine direkte Erfahrung, aber ein Freund von mir hat mir davon erzählt. In meinem Heimatland Marokko ist es oft so, ${formatDassClause(ex.slot6Morocco)}`;
    return {
      targetSentenceDe: s,
      roundLabelDarija: '🏓 الجولة 5 (نتا): الجوكر ديال التجربة والواقع فـ المغرب (SLOT 6)',
      hintFirst4Words: extractFirstFourWordsHint(s)
    };
  }

  if (ctx.mode === 'teil1') {
    if (ctx.roundNumber <= 1) {
      const s =
        'Guten Tag! Mein Name ist Mohammed El Jebouri, ich bin 22 Jahre alt und komme aus Fès in Marokko. Ich habe mein Abitur in Physik und Chemie gemacht und danach meinen Bachelor in Wirtschaft abgeschlossen.';
      return {
        targetSentenceDe: s,
        roundLabelDarija: '✈️ المرحلة 1: التقديم الشخصي (محمد الجبوري، 22 سنة، فاس، إجازة اقتصاد)',
        hintFirst4Words: extractFirstFourWordsHint(s)
      };
    }
    if (ctx.roundNumber === 2) {
      const s =
        'Ich möchte heute über meine unvergessliche Reise nach Bin el Ouidane sprechen. Dort habe ich mit meinen Freunden in der Natur gezeltet, wir haben eine Bootstour auf dem blauen See gemacht und uns vom Stress des Wirtschaftsstudiums erholt.';
      return {
        targetSentenceDe: s,
        roundLabelDarija: '✈️ المرحلة 2: عرض رحلة بين الويدان (Bin el Ouidane)',
        hintFirst4Words: extractFirstFourWordsHint(s)
      };
    }
    if (ctx.roundNumber === 3) {
      const s =
        'Ich habe dort ein ganzes Wochenende, also drei Tage, mit meinen engsten Studienfreunden verbracht, weil wir nach den Prüfungen eine Pause brauchten.';
      return {
        targetSentenceDe: s,
        roundLabelDarija: '✈️ المرحلة 3: جواب السؤال 1 للممتحن (شحال جلستي فـ بين الويدان؟)',
        hintFirst4Words: extractFirstFourWordsHint(s)
      };
    }
    const s =
      'Nein, die Reise war überhaupt nicht teuer. Da wir zusammen mit dem Bus gefahren sind, im Zelt übernachtet und selbst gekocht haben, waren die Kosten für uns Studenten sehr günstig.';
    return {
      targetSentenceDe: s,
      roundLabelDarija: '✈️ المرحلة 4: جواب السؤال 2 للممتحن (واش الرحلة كانت غالية؟)',
      hintFirst4Words: extractFirstFourWordsHint(s)
    };
  }

  if (ctx.mode === 'teil3' && ctx.teil3Topic) {
    const t = ctx.teil3Topic;
    const points = ctx.teil3AllPoints || [];
    const visited = ctx.teil3VisitedPoints || [];
    if (ctx.roundNumber <= 1) {
      const s = `Wie du weißt, planen wir ja zusammen ${t.dkhlaSlotAccusative}. Hast du dir dazu schon ein paar Gedanken gemacht? Zuerst würde ich vorschlagen, dass wir ${t.herzPoint1De}`;
      return {
        targetSentenceDe: s,
        roundLabelDarija: `🤝 التخطيط (${t.titleDarija}): الدخلة + النقطة الخاصة بالموضوع`,
        hintFirst4Words: extractFirstFourWordsHint(s)
      };
    }
    const nextPoint = points.find((p) => !visited.includes(p.number)) || points[0];
    const s = nextPoint
      ? `${nextPoint.indirectB2Question} ${nextPoint.strongB2Answer}`
      : `Super, dann haben wir jetzt alle wichtigen Punkte besprochen. Das wird bestimmt ${t.khatimaSlotNominative}!`;
    return {
      targetSentenceDe: s,
      roundLabelDarija: nextPoint
        ? `🤝 جوكر التخطيط #${nextPoint.number}: ${nextPoint.titleDarija}`
        : '🤝 الخاتمة ديال التخطيط (Khatima)',
      hintFirst4Words: extractFirstFourWordsHint(s)
    };
  }

  // Interview mode
  const qa = ctx.interviewQuestion;
  const s = qa
    ? qa.strongB2Answer
    : 'Mein Name ist Mohammed El Jebouri. Durch mein Abitur in Physik und Chemie sowie meinen Bachelor in Wirtschaft verbinde ich analytisches Denken mit fundiertem Fachwissen im Bereich Controlling und Finanzen.';
  return {
    targetSentenceDe: s,
    roundLabelDarija: qa ? `💼 سؤال الموارد البشرية #${qa.id}: ${qa.questionDarija}` : '💼 مقابلة العمل فـ الاقتصاد',
    hintFirst4Words: extractFirstFourWordsHint(s)
  };
}

/**
 * Tier 2 Strict Deterministic German Linguistic & Turn-State Evaluator.
 * Works 100% offline or without an API key, never returning a fake static 57/60 message.
 */
export function evaluateSimulatorTurnDeterministically(ctx: SimulatorTurnContext): StrictExaminerResult {
  const currentTarget = getExpectedSentenceForTurn(ctx);
  const sanity = analyzeGermanInputSanity(ctx.userMessage);

  // 1. STRICT SANITY & NON-GERMAN FILTER (Zero Free Points!)
  if (!sanity.isValidGermanAttempt) {
    return {
      scoreOutOf60: 0,
      cefrLevel: '0',
      isSanityRejected: true,
      verbAtEndCorrect: false,
      pronunciationAndGrammarFeedbackDarija: `⚠️ قلتي غير '${ctx.userMessage.trim() || '...'}'! راه فـ الامتحان الحقيقي ما غاديش تاخد نقط على كلمة وحدة أو كلمة خارج الموضوع 😄 برك على المايك 🎙️ وقول هاد الجملة كاملة بالألمانية:`,
      correctedGermanSentence: currentTarget.targetSentenceDe,
      partnerGermanReply:
        'Entschuldigung Mohammed, aber das war kein vollständiger deutscher Satz zu unserem Thema! Bitte sprich oder schreib einen ganzen Satz auf Deutsch.',
      sauerstoffHintIfNeeded: currentTarget.targetSentenceDe,
      nextRoundNumber: ctx.roundNumber,
      targetSentenceForCurrentOrNextTurn: currentTarget.targetSentenceDe,
      hintFirst4Words: currentTarget.hintFirst4Words
    };
  }

  const lowerInput = ctx.userMessage.toLowerCase();

  // 2. TEIL 2 PING-PONG TURN-BY-TURN EVALUATOR (Ronde 1 -> Ronde 3 -> Ronde 5 -> Scorecard)
  if (ctx.mode === 'teil2' && ctx.teil2Exam) {
    const ex = ctx.teil2Exam;

    if (ctx.roundNumber <= 1) {
      // Evaluate Ronde 1 (Dkhla + Fikra 1)
      const hasEinleitung =
        lowerInput.includes('befasst sich') ||
        lowerInput.includes('thema') ||
        lowerInput.includes('beschrieben') ||
        lowerInput.includes('geht es um');
      const slotEval = evaluateSlotAttempt(ctx.userMessage, ex.slot2Point1);
      const hasQuestionToPartner =
        lowerInput.includes('welche informationen') ||
        lowerInput.includes('hast du') ||
        lowerInput.includes('was steht') ||
        ctx.userMessage.includes('?');

      let score = Math.round(
        (hasEinleitung ? 18 : 8) +
          slotEval.keywordMatchRatio * 20 +
          (slotEval.verbAtEndCorrect ? 14 : 5) +
          (hasQuestionToPartner ? 8 : 2)
      );
      score = Math.max(18, Math.min(60, score));
      const cefr: 'A1' | 'A2' | 'B1' | 'B2' = score >= 48 ? 'B2' : score >= 36 ? 'B1' : 'A2';

      const partnerRonde2Reply = `Außerdem wird im Text noch erwähnt, ${formatDassClause(ex.slot3Point2)} Was ist deine persönliche Meinung zu diesem Thema?`;
      const nextCtx: SimulatorTurnContext = { ...ctx, roundNumber: 3 };
      const nextTarget = getExpectedSentenceForTurn(nextCtx);

      const feedbackParts: string[] = [];
      feedbackParts.push(
        hasEinleitung
          ? '✅ برافو! بديتي بالدخلة الأكاديمية (Der Text befasst sich mit...).'
          : '⚠️ نسيتي الدخلة الثابتة (Der Text befasst sich mit dem Thema... Zuerst wird beschrieben, dass...).'
      );
      feedbackParts.push(
        slotEval.verbAtEndCorrect
          ? '✅ الفعل المصرف جا فـ آخر الجملة مورا dass بشكل ممتاز!'
          : `⚠️ رد البال لترتيب الفعل فـ آخر الجملة مورا dass (${splitClauseFinalVerb(ex.slot2Point1).finalVerb}).`
      );
      if (!hasQuestionToPartner) {
        feedbackParts.push('💡 ما تنساش تسول صاحبك فاللخر: Welche Informationen hast du noch gefunden?');
      }
      feedbackParts.push('🏓 دابا البارتنر جاوبك بالجولة 2 وسولك على رأيك — نطق الجولة 3 (الرأي + الإيجابية)!');

      return {
        scoreOutOf60: score,
        cefrLevel: cefr,
        isSanityRejected: false,
        verbAtEndCorrect: slotEval.verbAtEndCorrect,
        pronunciationAndGrammarFeedbackDarija: feedbackParts.join(' '),
        correctedGermanSentence: currentTarget.targetSentenceDe,
        partnerGermanReply: partnerRonde2Reply,
        sauerstoffHintIfNeeded: nextTarget.targetSentenceDe,
        nextRoundNumber: 3,
        targetSentenceForCurrentOrNextTurn: nextTarget.targetSentenceDe,
        hintFirst4Words: nextTarget.hintFirst4Words
      };
    }

    if (ctx.roundNumber === 3) {
      // Evaluate Ronde 3 (Ra2yek + Vorteil)
      const hasOpinionMarker =
        lowerInput.includes('ansicht') ||
        lowerInput.includes('meinung') ||
        lowerInput.includes('vorteil') ||
        lowerInput.includes('denke') ||
        lowerInput.includes('finde');
      const slotEval = evaluateSlotAttempt(ctx.userMessage, ex.slot4Advantage);
      const hasPartnerQuestion =
        lowerInput.includes('wie siehst du') ||
        lowerInput.includes('was meinst du') ||
        ctx.userMessage.includes('?');

      let score = Math.round(
        (hasOpinionMarker ? 18 : 8) +
          slotEval.keywordMatchRatio * 20 +
          (slotEval.verbAtEndCorrect ? 14 : 5) +
          (hasPartnerQuestion ? 8 : 2)
      );
      score = Math.max(18, Math.min(60, score));
      const cefr: 'A1' | 'A2' | 'B1' | 'B2' = score >= 48 ? 'B2' : score >= 36 ? 'B1' : 'A2';

      const partnerRonde4Reply = `Da stimme ich dir zu. Ein wichtiger Nachteil ist aber zum Beispiel, ${formatDassClause(ex.slot5Disadvantage)} Hast du vielleicht schon Erfahrungen damit gemacht?`;
      const nextCtx: SimulatorTurnContext = { ...ctx, roundNumber: 5 };
      const nextTarget = getExpectedSentenceForTurn(nextCtx);

      const feedbackParts: string[] = [];
      feedbackParts.push(
        hasOpinionMarker
          ? '✅ استعملتي عبارة الرأي والإيجابية (Ich bin der Ansicht / Ein großer Vorteil ist...).'
          : '⚠️ حاول تبدا بـ: Ich bin der Ansicht, dass... Ein großer Vorteil ist meiner Meinung nach, dass...'
      );
      feedbackParts.push(
        slotEval.verbAtEndCorrect
          ? '✅ حطيتي الفعل المصرف فـ آخر الجملة 100% صحيح!'
          : `⚠️ الفعل المصرف (${splitClauseFinalVerb(ex.slot4Advantage).finalVerb}) خاصو يكون فـ اللخر د الجملة.`
      );
      feedbackParts.push('🏓 البارتنر عطاك السلبية فالجولة 4 وسولك على التجربة — دابا ضرب الجوكر ديال المغرب فالجولة 5!');

      return {
        scoreOutOf60: score,
        cefrLevel: cefr,
        isSanityRejected: false,
        verbAtEndCorrect: slotEval.verbAtEndCorrect,
        pronunciationAndGrammarFeedbackDarija: feedbackParts.join(' '),
        correctedGermanSentence: currentTarget.targetSentenceDe,
        partnerGermanReply: partnerRonde4Reply,
        sauerstoffHintIfNeeded: nextTarget.targetSentenceDe,
        nextRoundNumber: 5,
        targetSentenceForCurrentOrNextTurn: nextTarget.targetSentenceDe,
        hintFirst4Words: nextTarget.hintFirst4Words
      };
    }

    // Evaluate Ronde 5 (Marokko-Joker) & Complete 6-Round Scorecard
    const hasMarokkoJoker =
      lowerInput.includes('marokko') ||
      lowerInput.includes('heimatland') ||
      lowerInput.includes('erfahrung') ||
      lowerInput.includes('freund') ||
      lowerInput.includes('persönlich');
    const slotEval = evaluateSlotAttempt(ctx.userMessage, ex.slot6Morocco);

    let score = Math.round(
      (hasMarokkoJoker ? 22 : 10) +
        slotEval.keywordMatchRatio * 22 +
        (slotEval.verbAtEndCorrect ? 16 : 6)
    );
    score = Math.max(20, Math.min(60, score));
    const cefr: 'A1' | 'A2' | 'B1' | 'B2' = score >= 48 ? 'B2' : score >= 36 ? 'B1' : 'A2';

    const partnerRonde6Reply =
      'Das ist wirklich interessant zu hören, wie das in Marokko ist! Zusammenfassend lässt sich sagen, dass dieses Thema sowohl Vorteile als auch Nachteile hat, aber für unsere Gesellschaft sehr wichtig bleibt.';
    const allScores = [...(ctx.previousTurnScores || []), score];
    const avgScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
    const quarter = Math.round(avgScore / 4);
    const total60 = Math.min(60, Math.max(15, avgScore));

    const nextCtx: SimulatorTurnContext = { ...ctx, roundNumber: 1 };
    const nextTarget = getExpectedSentenceForTurn(nextCtx);

    return {
      scoreOutOf60: score,
      cefrLevel: cefr,
      isSanityRejected: false,
      verbAtEndCorrect: slotEval.verbAtEndCorrect,
      pronunciationAndGrammarFeedbackDarija: `🏆 برافو يا محمد! كملتي الـ 6 جولات ديال البينغ بونغ كاملة فموضوع „${ex.titleDe}“! المجموع النهائي ديالك فهاد الحوار هو ${total60}/60 (${total60 >= 36 ? 'ناجح بامتياز ✅' : 'تحتاج لمزيد من التدريب 🔁'}).`,
      correctedGermanSentence: currentTarget.targetSentenceDe,
      partnerGermanReply: partnerRonde6Reply,
      sauerstoffHintIfNeeded: nextTarget.targetSentenceDe,
      nextRoundNumber: 1,
      targetSentenceForCurrentOrNextTurn: nextTarget.targetSentenceDe,
      hintFirst4Words: nextTarget.hintFirst4Words,
      completedScorecard: {
        ausdruck: Math.min(15, quarter + 1),
        aufgabe: Math.min(15, quarter),
        korrektheit: Math.min(15, slotEval.verbAtEndCorrect ? quarter + 1 : Math.max(5, quarter - 1)),
        aussprache: Math.min(15, quarter),
        totalOutOf60: total60,
        passed: total60 >= 36,
        summaryDarija:
          total60 >= 48
            ? 'مستوى B2 ممتاز! احترمتي منهجية البينغ بونغ وركلتي الأفعال لآخر الجملة.'
            : total60 >= 36
            ? 'ناجح فـ Teil 2! زيد ركز على وضع الفعل المصرف فـ آخر الجملة باش توصل لـ 60/60.'
            : 'عاود تدرب على الجولات الـ 3 ديالك (الدخلة، الإيجابية، والجوكر د المغرب) بصوتك!'
      }
    };
  }

  // 3. TEIL 1 TURN-BY-TURN EVALUATOR (Intro -> Bin el Ouidane -> Examiner Q1 -> Examiner Q2)
  if (ctx.mode === 'teil1') {
    const slotEval = evaluateSlotAttempt(ctx.userMessage, currentTarget.targetSentenceDe);
    const score = Math.max(24, Math.min(60, slotEval.scoreOutOf60 + 8));
    const cefr: 'A1' | 'A2' | 'B1' | 'B2' = score >= 46 ? 'B2' : score >= 35 ? 'B1' : 'A2';

    if (ctx.roundNumber <= 1) {
      const nextCtx = { ...ctx, roundNumber: 2 };
      const nextT = getExpectedSentenceForTurn(nextCtx);
      return {
        scoreOutOf60: score,
        cefrLevel: cefr,
        isSanityRejected: false,
        verbAtEndCorrect: slotEval.verbAtEndCorrect,
        pronunciationAndGrammarFeedbackDarija:
          '✅ تقديم شخصي ممتاز يا محمد! ذكرتي فاس، الباك فـ الفيزيك والشيمي، والإجازة فـ الاقتصاد. دابا الممتحن طلب منك تبدا العرض ديال رحلة بين الويدان (Bin el Ouidane)!',
        correctedGermanSentence: currentTarget.targetSentenceDe,
        partnerGermanReply:
          'Vielen Dank für die sympathische Vorstellung, Mohammed! Bitte beginne jetzt mit deiner Präsentation über deine Reise nach Bin el Ouidane.',
        sauerstoffHintIfNeeded: nextT.targetSentenceDe,
        nextRoundNumber: 2,
        targetSentenceForCurrentOrNextTurn: nextT.targetSentenceDe,
        hintFirst4Words: nextT.hintFirst4Words
      };
    }

    if (ctx.roundNumber === 2) {
      const nextCtx = { ...ctx, roundNumber: 3 };
      const nextT = getExpectedSentenceForTurn(nextCtx);
      return {
        scoreOutOf60: score,
        cefrLevel: cefr,
        isSanityRejected: false,
        verbAtEndCorrect: slotEval.verbAtEndCorrect,
        pronunciationAndGrammarFeedbackDarija:
          '✅ عرض رائع لرحلة بين الويدان! دابا الممتحن كيسولك السؤال الأول: شحال جلستي تما ومع من مشيتي؟ جاوبو بصوتك!',
        correctedGermanSentence: currentTarget.targetSentenceDe,
        partnerGermanReply:
          'Vielen Dank, Mohammed! Das klingt nach einem tollen Ausflug. Wie lange warst du dort in Bin el Ouidane und mit wem bist du gereist?',
        sauerstoffHintIfNeeded: nextT.targetSentenceDe,
        nextRoundNumber: 3,
        targetSentenceForCurrentOrNextTurn: nextT.targetSentenceDe,
        hintFirst4Words: nextT.hintFirst4Words
      };
    }

    if (ctx.roundNumber === 3) {
      const nextCtx = { ...ctx, roundNumber: 4 };
      const nextT = getExpectedSentenceForTurn(nextCtx);
      return {
        scoreOutOf60: score,
        cefrLevel: cefr,
        isSanityRejected: false,
        verbAtEndCorrect: slotEval.verbAtEndCorrect,
        pronunciationAndGrammarFeedbackDarija:
          '✅ جواب مقنع وواضح! دابا السؤال الثاني والأخير ديال الممتحن فـ Teil 1: واش الرحلة كانت غالية عليك كطالب؟',
        correctedGermanSentence: currentTarget.targetSentenceDe,
        partnerGermanReply:
          'Verstehe! War die Reise nach Bin el Ouidane eigentlich teuer für dich als Student?',
        sauerstoffHintIfNeeded: nextT.targetSentenceDe,
        nextRoundNumber: 4,
        targetSentenceForCurrentOrNextTurn: nextT.targetSentenceDe,
        hintFirst4Words: nextT.hintFirst4Words
      };
    }

    const nextCtx = { ...ctx, roundNumber: 1 };
    const nextT = getExpectedSentenceForTurn(nextCtx);
    return {
      scoreOutOf60: score,
      cefrLevel: cefr,
      isSanityRejected: false,
      verbAtEndCorrect: slotEval.verbAtEndCorrect,
      pronunciationAndGrammarFeedbackDarija:
        '🏆 تبارك الله عليك يا محمد! ساليتي Teil 1 كامل بنجاح (التقديم + عرض بين الويدان + أجوبة الممتحن بجوج) بـ 15/15 فـ هاد الجزء!',
      correctedGermanSentence: currentTarget.targetSentenceDe,
      partnerGermanReply:
        'Super beantwortet, Mohammed! Damit haben wir Teil 1 erfolgreich abgeschlossen. Du hast sehr flüssig und strukturiert gesprochen!',
      sauerstoffHintIfNeeded: nextT.targetSentenceDe,
      nextRoundNumber: 1,
      targetSentenceForCurrentOrNextTurn: nextT.targetSentenceDe,
      hintFirst4Words: nextT.hintFirst4Words
    };
  }

  // 4. TEIL 3 PLANNING TURN-BY-TURN EVALUATOR (Detects 20 Planning Points & Auto-Checks Scratchpad)
  if (ctx.mode === 'teil3' && ctx.teil3Topic) {
    const topic = ctx.teil3Topic;
    const allPoints = ctx.teil3AllPoints || [];
    const visited = new Set(ctx.teil3VisitedPoints || []);
    const detectedPointNum = detectTeil3PlanningPoint(ctx.userMessage);
    if (detectedPointNum) {
      visited.add(detectedPointNum);
    }

    const matchedPointObj =
      allPoints.find((p) => p.number === detectedPointNum) ||
      allPoints.find((p) => !visited.has(p.number)) ||
      allPoints[0];

    if (matchedPointObj) {
      visited.add(matchedPointObj.number);
    }

    const nextUnvisitedPoint =
      allPoints.find((p) => topic.recommendedJokerNumbers.includes(p.number) && !visited.has(p.number)) ||
      allPoints.find((p) => !visited.has(p.number)) ||
      allPoints[0];

    const hasIndirectOrB2 =
      lowerInput.includes('vorschlagen') ||
      lowerInput.includes('wäre es') ||
      lowerInput.includes('weißt du') ||
      lowerInput.includes('überlegen') ||
      lowerInput.includes('sollten wir') ||
      lowerInput.includes('könnten wir') ||
      lowerInput.includes('planen');

    const slotEval = evaluateSlotAttempt(ctx.userMessage, currentTarget.targetSentenceDe);
    const score = Math.min(60, Math.max(25, slotEval.scoreOutOf60 + (hasIndirectOrB2 ? 14 : 6)));
    const cefr: 'A1' | 'A2' | 'B1' | 'B2' = score >= 46 ? 'B2' : score >= 35 ? 'B1' : 'A2';

    const partnerAnswer = matchedPointObj
      ? matchedPointObj.strongB2Answer
      : `Das ist ein super Vorschlag für ${topic.titleDe}!`;
    const partnerNextQuestion = nextUnvisitedPoint
      ? nextUnvisitedPoint.indirectB2Question
      : `Super, dann haben wir alles für ${topic.dkhlaSlotAccusative} geplant!`;

    const partnerReply = `${partnerAnswer} ${partnerNextQuestion}`;
    const nextSentence = nextUnvisitedPoint
      ? `${nextUnvisitedPoint.strongB2Answer} ${nextUnvisitedPoint.indirectB2Question}`
      : `Perfekt, ich übernehme das gerne! Das wird bestimmt ${topic.khatimaSlotNominative}!`;

    return {
      scoreOutOf60: score,
      cefrLevel: cefr,
      isSanityRejected: false,
      verbAtEndCorrect: true,
      pronunciationAndGrammarFeedbackDarija: detectedPointNum
        ? `✅ برافو! هضرتي على النقطة #${detectedPointNum} (${matchedPointObj?.titleDarija || ''}) وتم التعليم عليها أوتوماتيكياً فـ ورقة الوسخ! دابا البارتنر جاوبك وسولك على: ${nextUnvisitedPoint?.titleDarija || 'الخاتمة'}.`
        : `✅ اقتراح زوين فـ التخطيط! دابا جاوب البارتنر أو سولو على النقطة الجاية: ${nextUnvisitedPoint?.titleDarija || ''}.`,
      correctedGermanSentence: currentTarget.targetSentenceDe,
      partnerGermanReply: partnerReply,
      sauerstoffHintIfNeeded: nextSentence,
      nextRoundNumber: ctx.roundNumber + 1,
      targetSentenceForCurrentOrNextTurn: nextSentence,
      hintFirst4Words: extractFirstFourWordsHint(nextSentence),
      detectedTeil3PointNumber: detectedPointNum || matchedPointObj?.number
    };
  }

  // 5. JOB INTERVIEW (VORSTELLUNGSGESPRÄCH) TURN-BY-TURN EVALUATOR
  const currentQa = ctx.interviewQuestion;
  const nextQa = ctx.nextInterviewQuestion || currentQa;
  const evalInterview = evaluateSlotAttempt(ctx.userMessage, currentTarget.targetSentenceDe);
  const hasBusinessKeywords =
    lowerInput.includes('wirtschaft') ||
    lowerInput.includes('studium') ||
    lowerInput.includes('analytisch') ||
    lowerInput.includes('physik') ||
    lowerInput.includes('unternehmen') ||
    lowerInput.includes('team') ||
    lowerInput.includes('erfahrung') ||
    lowerInput.includes('deutschland');

  const interviewScore = Math.min(60, Math.max(22, evalInterview.scoreOutOf60 + (hasBusinessKeywords ? 12 : 4)));
  const interviewCefr: 'A1' | 'A2' | 'B1' | 'B2' =
    interviewScore >= 46 ? 'B2' : interviewScore >= 35 ? 'B1' : 'A2';

  const hrNextPrompt = nextQa
    ? `Vielen Dank für diese überzeugende Antwort, Herr El Jebouri! Meine nächste Frage an Sie lautet: ${nextQa.questionDe}`
    : 'Vielen Dank für das ausgezeichnete Vorstellungsgespräch, Herr El Jebouri!';
  const nextTargetSentence = nextQa ? nextQa.strongB2Answer : currentTarget.targetSentenceDe;

  return {
    scoreOutOf60: interviewScore,
    cefrLevel: interviewCefr,
    isSanityRejected: false,
    verbAtEndCorrect: evalInterview.verbAtEndCorrect,
    pronunciationAndGrammarFeedbackDarija: currentQa
      ? `💼 تقييم مدير الموارد البشرية (${interviewScore}/60 • ${interviewCefr}): ${currentQa.darijaCoachTip} — دابا سمع السؤال الجاي وجاوب عليه بصوتك!`
      : '💼 جواب احترافي ممتاز! كمل بنفس الثقة.',
    correctedGermanSentence: currentTarget.targetSentenceDe,
    partnerGermanReply: hrNextPrompt,
    sauerstoffHintIfNeeded: nextTargetSentence,
    nextRoundNumber: (ctx.roundNumber % 12) + 1,
    targetSentenceForCurrentOrNextTurn: nextTargetSentence,
    hintFirst4Words: extractFirstFourWordsHint(nextTargetSentence)
  };
}

export function buildIdeaBankForExam(exam: Teil2Exam): IdeaCardItem[] {
  const slots: Array<{
    idx: 1 | 2 | 3 | 4 | 5 | 6;
    badge: string;
    text: string;
    darija: string;
  }> = [
    {
      idx: 1,
      badge: '🎯 SLOT 1: Smiya mn lwarqa',
      text: exam.slot1Smiya,
      darija: 'سمية الموضوع من العنوان د الورقة',
    },
    {
      idx: 2,
      badge: '📄 SLOT 2: Fikra 1 mn lwarqa',
      text: exam.slot2Fikra1,
      darija: exam.slot2Darija,
    },
    {
      idx: 3,
      badge: '📄 SLOT 3: Fikra 2 mn lwarqa',
      text: exam.slot3Fikra2,
      darija: exam.slot3Darija,
    },
    {
      idx: 4,
      badge: '🟢 SLOT 4: Ijabia (Vorteil)',
      text: exam.slot4Ijabia,
      darija: exam.slot4Darija,
    },
    {
      idx: 5,
      badge: '🔴 SLOT 5: Salbia (Nachteil)',
      text: exam.slot5Salbia,
      darija: exam.slot5Darija,
    },
    {
      idx: 6,
      badge: '🇲🇦 SLOT 6: Hal f Lmaghrib',
      text: exam.slot6Maghrib,
      darija: exam.slot6Darija,
    },
  ];

  const validCards: IdeaCardItem[] = slots.map((s) => {
    const { finalVerb } = splitClauseFinalVerb(s.text);
    return {
      id: `exam-${exam.id}-slot-${s.idx}`,
      slotIndex: s.idx,
      labelBadge: s.badge,
      germanClause: s.text,
      darijaHint: s.darija,
      finalVerb,
      isDistractor: false,
    };
  });

  const distractorCards: IdeaCardItem[] = [
    {
      id: `exam-${exam.id}-distractor-1`,
      slotIndex: 0,
      labelBadge: '⚠️ فخ غرامير (فعل فوسط الجملة)',
      germanClause: 'dieses Thema hat überhaupt keine Bedeutung im Alltag',
      darijaHint: 'فخ! الفعل (hat) جا فـ الوسط وماشي فاللخر د الجملة مور dass',
      finalVerb: 'Alltag',
      isDistractor: true,
    },
    {
      id: `exam-${exam.id}-distractor-2`,
      slotIndex: 0,
      labelBadge: '⚠️ فخ غرامير (فعل ماشي فاللخر)',
      germanClause: 'viele Menschen interessieren sich überhaupt nicht dafür heute',
      darijaHint: 'فخ! الفعل (interessieren) خاصو يكون فاللخر د الجملة',
      finalVerb: 'heute',
      isDistractor: true,
    },
  ];

  return [
    validCards[2],
    validCards[0],
    distractorCards[0],
    validCards[4],
    validCards[1],
    validCards[5],
    distractorCards[1],
    validCards[3],
  ];
}
