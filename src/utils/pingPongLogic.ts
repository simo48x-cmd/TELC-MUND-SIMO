import { IdeaCardItem, Teil2Exam } from '../types';

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
  const cleanAttempt = attemptText
    .toLowerCase()
    .replace(/[.,!?"]/g, '')
    .trim();
  const cleanTarget = targetClause
    .toLowerCase()
    .replace(/[.,!?"]/g, '')
    .trim();

  if (!cleanAttempt) {
    return {
      verbAtEndCorrect: false,
      keywordMatchRatio: 0,
      scoreOutOf60: 0,
      feedbackDarija: 'مازال ما قلتي والو! جرب تقرا الجملة بصوتك وحط الفعل فاللخر.',
    };
  }

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
    keywordMatchRatio * 42 + (verbAtEndCorrect ? 18 : 6)
  );
  const scoreOutOf60 = Math.max(12, Math.min(60, rawScore));

  const feedbackDarija = verbAtEndCorrect
    ? `تبارك الله عليك! حطيتي الفعل المصرف (${expectedFinalVerb}) فاللخر د الجملة 100% صحيح!`
    : `رد بالك للقاعدة الذهبية: مور dass خاص الفعل المصرف (${expectedFinalVerb}) يمشي للخر د الجملة!`;

  return {
    verbAtEndCorrect,
    keywordMatchRatio,
    scoreOutOf60,
    feedbackDarija,
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
