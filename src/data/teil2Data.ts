import { Teil2Exam } from '../types';
import { TEIL2_TOPICS_PART1 } from './teil2Part1';
import { TEIL2_TOPICS_PART2 } from './teil2Part2';

export interface VerbatimSurgicalSlot {
  caseNum: 1 | 2 | 3;
  caseBadge: string;
  origSub: string;
  origVerb: string;
  bodyAfterDass: string;
  finalVerb: string;
  dassClause: string;
  dassClauseDe: string;
  arMeaning: string;
  surgicalDetail: string;
}

export interface VerbatimMoroccoSlot {
  dassClause: string;
  finalVerb: string;
  arMeaning: string;
  specificMoroccoDe: string;
  specificMoroccoAr: string;
}

export interface VerbatimTeil2Topic {
  id: number;
  title: string;
  paperTitle: string;
  pdfPage: number;
  originalText: string;
  slot1_smiya: string;
  slot2_fikra1: Omit<VerbatimSurgicalSlot, 'dassClauseDe'>;
  slot3_fikra2: Omit<VerbatimSurgicalSlot, 'dassClauseDe'>;
  slot4_ijabia: Omit<VerbatimSurgicalSlot, 'dassClauseDe'>;
  slot5_salbia: Omit<VerbatimSurgicalSlot, 'dassClauseDe'>;
  slot6_marokko: VerbatimMoroccoSlot;
  trapCards: [string, string];
}

/**
 * 100% Verbatim TELC B2 Mündlich Teil 2 Dataset (All 46 Topics from Sprechen_B2_2026.pdf)
 */
export const TEIL2_TOPICS: VerbatimTeil2Topic[] = [
  ...(TEIL2_TOPICS_PART1 as VerbatimTeil2Topic[]),
  ...(TEIL2_TOPICS_PART2 as VerbatimTeil2Topic[]),
];

export const UNIVERSAL_MOROCCO_JOKER = {
  dassClauseDe:
    'dieses Thema heute sehr aktuell ist und die Menschen viel darüber sprechen',
  finalVerb: 'sprechen',
  arMeaning:
    'هذا الموضوع اليوم راهني ومهم جداً والناس كيهضرو عليه بزاف (جملة جوكر موحدة لجميع الـ 46 موضوع بلا حفاظة!)',
};

export const TEIL2_RONDE6_UNIVERSAL_JOKER = {
  de: 'Ehrlich gesagt, habe ich persönlich keine direkte Erfahrung damit. Aber in meinem Freundeskreis ist das ein großes Thema. Ein guter Freund von mir hat das ausprobiert und mir viel darüber erzählt. Außerdem merke ich, dass dieses Thema auch in Marokko immer wichtiger wird.',
  darija:
    'الصراحة ما عنديش تجربة شخصية مباشرة مع هادشي، ولكن فـ دائرة الأصدقاء ديالي هاد الموضوع كبير بزاف. واحد صاحبي جربو وعاود ليا عليه بزاف، ولاحظت بلي هاد الموضوع غادي وكيولي مهم حتى فـ المغرب.',
};

const TOPIC_DARIJA_TITLES: Record<number, string> = {
  1: 'الفاست فود يقدر يسبب الإدمان',
  2: 'الطياب فالدار بنين وأحسن',
  3: 'التجارب على الحيوانات (مع وضد)',
  4: 'واش الماكلة الجاهزة صحية؟ (Convenience Food)',
  5: 'واش خاص عمليات التجميل تمنع؟',
  6: 'المضادات الحيوية (Antibiotika) — واش كاين بدائل؟',
  7: 'الرياضة الاحترافية والصحة',
  8: 'صحة جيدة بفضل الضحك والجري',
  9: 'السولاريوم (التسمير الاصطناعي) فـ الشتاء',
  10: 'كيفاش غادي يتطور النظام الغذائي فـ المستقبل؟',
  11: 'إنقاذ الحياة بالتبرع بالدم والأعضاء',
  12: 'الأطفال الصغار باغيين يتعلمو من الصغر',
  13: 'الإنجليزية كلغة عالمية',
  14: 'واش الرحلات المدرسية باقا صالحة فـ وقتنا؟',
  15: 'الواجبات المنزلية (التمارين) — مفيدة ولا لا؟',
  16: 'نصائح عملية وتقنيات للتعلم والمراجعة',
  17: 'المدرسة طيلة اليوم (Ganztagsschule)',
  18: 'ثنائية اللغة (Zweisprachigkeit)',
  19: 'اللباس الموحد فـ المدرسة (Die Schuluniform)',
  20: 'واش جودة التعليم والمدارس كيتقاسو؟',
  21: 'واش خاص التعليم الرقمي يدخل للمدارس؟',
  22: 'مدارس خاصة للأطفال الموهوبين (Hochbegabte)',
  23: 'التربية بعدة لغات فـ الدار (Mehrsprachige Erziehung)',
  24: 'واش التلفزة كتثقف؟ (Fernsehen bildet)',
  25: 'سيمانة بلا أنترنيت وبلا سمارتفون',
  26: 'منع ألعاب الفيديو العنيفة (Gewaltspiele)',
  27: 'الأطفال ومخاطر الهاتف والأنترنيت',
  28: 'التلفزة كتخلي الواحد كسول وتزيد فـ الوزن',
  29: 'أنماط العيش والسكن البديلة (السكن المشترك)',
  30: 'إعطاء البقشيش (Trinkgeld geben)',
  31: 'الخدمة حتى لـ 75 عام — واش واقعية؟',
  32: 'السعادة بلا فلوس (Glücklich ohne Geld)',
  33: 'الحسابات البنكية للأطفال والتعامل الذكي مع الفلوس',
  34: 'حساب التوفير للأطفال (Sparkonto für Kinder)',
  35: 'واش من حقنا نحكمو على ربات البيوت؟ والعمل المنزلي',
  36: 'شقة فـ المدينة أو دار فـ البادية؟',
  37: 'فين يقدر الواحد يسكن فـ العطلة أو ملي يكبر؟',
  38: 'العرس غير بجوج (بدون حفلة كبيرة)؟',
  39: 'الحيوانات الأليفة — واش علاج زوين؟',
  40: 'تبادل المنازل فـ العطلة (Haustausch)',
  41: 'تبادل المنازل: عطلة بطريقة مختلفة',
  42: 'العمل بدوام جزئي (Teilzeit) حتى للمديرين والرجال؟',
  43: 'واش من حقك تحتافظ بالحاجة لي لقيتيها طايحة؟',
  44: 'شحال د الوقت مسموح للأطفال يبقاو برا؟',
  45: 'الوشم (Tattoo) — زينة ولا خطيئة؟',
  46: 'زيارة طبيب الأسنان بلا خوف بفضل كاسك ضد الصداع',
};

export interface ExtendedTeil2Exam extends Teil2Exam {
  titleDe: string;
  titleDarija: string;
  paperTitle: string;
  pdfPage: number;
  originalText: string;
  originalArticleDe: string;
  slot1_smiya: string;
  slot2_fikra1: VerbatimSurgicalSlot;
  slot3_fikra2: VerbatimSurgicalSlot;
  slot4_ijabia: VerbatimSurgicalSlot;
  slot5_salbia: VerbatimSurgicalSlot;
  slot6_marokko: VerbatimMoroccoSlot;
  trapCards: [string, string];
  slot1Theme: string;
  slot2Point1: string;
  slot3Point2: string;
  slot4Advantage: string;
  slot5Disadvantage: string;
  slot6Morocco: string;
  moroccoUniversalJokerDe: string;
  moroccoUniversalJokerAr: string;
  ronde6Summary: string;
  ronde6Darija: string;
  surgicalSlots: {
    slot2: VerbatimSurgicalSlot;
    slot3: VerbatimSurgicalSlot;
    slot4: VerbatimSurgicalSlot;
    slot5: VerbatimSurgicalSlot;
  };
}

function enrichSlot(
  slot: Omit<VerbatimSurgicalSlot, 'dassClauseDe'>
): VerbatimSurgicalSlot {
  return {
    ...slot,
    dassClauseDe: slot.dassClause,
  };
}

export const TEIL2_EXAMS: ExtendedTeil2Exam[] = TEIL2_TOPICS.map((t) => {
  const s2 = enrichSlot(t.slot2_fikra1);
  const s3 = enrichSlot(t.slot3_fikra2);
  const s4 = enrichSlot(t.slot4_ijabia);
  const s5 = enrichSlot(t.slot5_salbia);
  const titleDarija = TOPIC_DARIJA_TITLES[t.id] || t.slot2_fikra1.arMeaning;

  return {
    id: t.id,
    title: t.title,
    titleDe: `${t.id}. ${t.title}`,
    titleDarija,
    paperTitle: t.paperTitle,
    pdfPage: t.pdfPage,
    originalText: t.originalText,
    originalArticleDe: t.originalText,
    category: 'Sprechen_B2_2026.pdf',

    slot1_smiya: t.slot1_smiya,
    slot2_fikra1: s2,
    slot3_fikra2: s3,
    slot4_ijabia: s4,
    slot5_salbia: s5,
    slot6_marokko: t.slot6_marokko,
    trapCards: t.trapCards,

    // Legacy & simulator compatibility fields
    slot1Smiya: t.paperTitle,
    slot2Fikra1: s2.dassClause,
    slot2Darija: s2.arMeaning,
    slot3Fikra2: s3.dassClause,
    slot3Darija: s3.arMeaning,
    slot4Ijabia: s4.dassClause,
    slot4Darija: s4.arMeaning,
    slot5Salbia: s5.dassClause,
    slot5Darija: s5.arMeaning,
    slot6Maghrib: t.slot6_marokko.dassClause,
    slot6Darija: t.slot6_marokko.arMeaning,
    paperTextDe: [s2.origSub, s3.origSub, s4.origSub, s5.origSub],

    slot1Theme: t.paperTitle,
    slot2Point1: s2.dassClause,
    slot3Point2: s3.dassClause,
    slot4Advantage: s4.dassClause,
    slot5Disadvantage: s5.dassClause,
    slot6Morocco: t.slot6_marokko.dassClause,
    moroccoUniversalJokerDe: t.slot6_marokko.dassClause,
    moroccoUniversalJokerAr: t.slot6_marokko.arMeaning,
    ronde6Summary: TEIL2_RONDE6_UNIVERSAL_JOKER.de,
    ronde6Darija: TEIL2_RONDE6_UNIVERSAL_JOKER.darija,

    surgicalSlots: {
      slot2: s2,
      slot3: s3,
      slot4: s4,
      slot5: s5,
    },
  };
});

export interface PingPongRoundView {
  roundNumber: 1 | 2 | 3 | 4 | 5 | 6;
  speaker: 'Mohammed (Du)' | 'Partner/in';
  titleDarija: string;
  titleDe: string;
  fixedTemplateBefore: string;
  slotLabel: string;
  slotContent: string;
  bodyAfterDass?: string;
  finalVerb?: string;
  darijaTranslation: string;
  fixedTemplateMiddle?: string;
  slot2Label?: string;
  slot2Content?: string;
  slot2BodyAfterDass?: string;
  slot2FinalVerb?: string;
  slot2DarijaTranslation?: string;
  fixedTemplateAfter: string;
  darijaCoachingPill: string;
  paperOriginalSentenceDe?: string;
  surgicalMeta?: VerbatimSurgicalSlot;
}

/**
 * Builds the exact 6-Round Ping-Pong Dialogue matching the student's memorized exam sheet:
 * - Ronde 1 (Du): In meinem Text geht es um das Thema „{paperTitle}“. Der Autor erwähnt, dass {bodyAfterDass} [{finalVerb}]. Was steht in deinem Text?
 * - Ronde 2 (Partner): In meinem Artikel steht auch, dass {bodyAfterDass} [{finalVerb}]. Was denkst du darüber?
 * - Ronde 3 (Du): Ich bin der Ansicht, dass das ein wichtiges Thema ist. Ein großer Vorteil ist meiner Meinung nach, dass {bodyAfterDass} [{finalVerb}]. Wie siehst du das?
 * - Ronde 4 (Partner): Da stimme ich dir zu. Ein wichtiger Nachteil ist aber zum Beispiel, dass {bodyAfterDass} [{finalVerb}]. Hast du vielleicht schon Erfahrungen damit gemacht?
 * - Ronde 5 (Du): Persönlich habe ich keine direkte Erfahrung, aber ein Freund von mir hat das gemacht und fand es super. In meinem Heimatland Marokko ist es so, dass {dassClause}. Hast du ähnliche Erfahrungen?
 * - Ronde 6 (Partner): Ehrlich gesagt, habe ich persönlich keine direkte Erfahrung damit. Aber in meinem Freundeskreis ist das ein großes Thema. Ein guter Freund von mir hat das ausprobiert und mir viel darüber erzählt. Außerdem merke ich, dass dieses Thema auch in Marokko immer wichtiger wird.
 */
export function build6RoundsForExam(
  exam: ExtendedTeil2Exam,
  options?: {
    useUniversalMoroccoJoker?: boolean;
    useVerbatimPaperClauses?: boolean;
  }
): PingPongRoundView[] {
  const useJoker = options?.useUniversalMoroccoJoker ?? true;

  const s2 = exam.slot2_fikra1;
  const s3 = exam.slot3_fikra2;
  const s4 = exam.slot4_ijabia;
  const s5 = exam.slot5_salbia;
  const s6 = exam.slot6_marokko;

  const r5Clause = useJoker ? s6.dassClause : s6.specificMoroccoDe;
  const r5Verb = useJoker ? s6.finalVerb : undefined;
  const r5Darija = useJoker ? s6.arMeaning : s6.specificMoroccoAr;

  return [
    {
      roundNumber: 1,
      speaker: 'Mohammed (Du)',
      titleDarija:
        'الجولة 1 (نتا): الدخلة + العنوان + الفكرة 1 من الورقة + سؤال للبارتنر',
      titleDe: 'Ronde 1: Einleitung & Hauptaussage 1',
      fixedTemplateBefore: 'In meinem Text geht es um das Thema „',
      slotLabel: 'SLOT 1: Smiya mn lwarqa',
      slotContent: exam.paperTitle,
      darijaTranslation: `موضوع النص من العنوان: ${exam.titleDarija}`,
      fixedTemplateMiddle: '“. Der Autor erwähnt, dass ',
      slot2Label: 'SLOT 2: Fikra 1 mn lwarqa',
      slot2Content: s2.dassClause,
      slot2BodyAfterDass: s2.bodyAfterDass,
      slot2FinalVerb: s2.finalVerb,
      slot2DarijaTranslation: s2.arMeaning,
      fixedTemplateAfter: '. Was steht in deinem Text?',
      darijaCoachingPill:
        'حط عنوان الورقة فـ الفراغ 1، وفـ الفراغ 2 قرا الجملة من الورقة وحط الفعل فـ اللخر، وسول صاحبك: Was steht in deinem Text?',
      paperOriginalSentenceDe: s2.origSub,
      surgicalMeta: s2,
    },
    {
      roundNumber: 2,
      speaker: 'Partner/in',
      titleDarija:
        'الجولة 2 (البارتنر): الفكرة 2 من الورقة + كيسولك على رأيك',
      titleDe: 'Ronde 2: Zweite Information & Meinungsfrage',
      fixedTemplateBefore: 'In meinem Artikel steht auch, dass ',
      slotLabel: 'SLOT 3: Fikra 2 mn lwarqa',
      slotContent: s3.dassClause,
      bodyAfterDass: s3.bodyAfterDass,
      finalVerb: s3.finalVerb,
      darijaTranslation: s3.arMeaning,
      fixedTemplateAfter: '. Was denkst du darüber?',
      darijaCoachingPill:
        'البارتنر كيزيد معلومة ثانية مسروقة من الورقة وكيرمي ليك الكرة بسؤال: Was denkst du darüber?',
      paperOriginalSentenceDe: s3.origSub,
      surgicalMeta: s3,
    },
    {
      roundNumber: 3,
      speaker: 'Mohammed (Du)',
      titleDarija:
        'الجولة 3 (نتا): رأيك الشخصي + الإيجابية (Vorteil) + سؤال للبارتنر',
      titleDe: 'Ronde 3: Eigene Meinung & Vorteil (Ijabia)',
      fixedTemplateBefore:
        'Ich bin der Ansicht, dass das ein wichtiges Thema ist. Ein großer Vorteil ist meiner Meinung nach, dass ',
      slotLabel: 'SLOT 4: Ijabia (Vorteil)',
      slotContent: s4.dassClause,
      bodyAfterDass: s4.bodyAfterDass,
      finalVerb: s4.finalVerb,
      darijaTranslation: s4.arMeaning,
      fixedTemplateAfter: '. Wie siehst du das?',
      darijaCoachingPill:
        'عطي الإيجابية من الورقة (مع الفعل فاللخر مورا dass) وسولو: Wie siehst du das?',
      paperOriginalSentenceDe: s4.origSub,
      surgicalMeta: s4,
    },
    {
      roundNumber: 4,
      speaker: 'Partner/in',
      titleDarija:
        'الجولة 4 (البارتنر): كيتافق معاك + كيعطي السلبية (Nachteil) + كيسولك على التجربة',
      titleDe: 'Ronde 4: Zustimmung, Nachteil (Salbia) & Erfahrungsfrage',
      fixedTemplateBefore:
        'Da stimme ich dir zu. Ein wichtiger Nachteil ist aber zum Beispiel, dass ',
      slotLabel: 'SLOT 5: Salbia (Nachteil)',
      slotContent: s5.dassClause,
      bodyAfterDass: s5.bodyAfterDass,
      finalVerb: s5.finalVerb,
      darijaTranslation: s5.arMeaning,
      fixedTemplateAfter:
        '. Hast du vielleicht schon Erfahrungen damit gemacht?',
      darijaCoachingPill:
        'البارتنر كيجبد السلبية من الورقة وكيسولك واش فايت ليك جربتي هادشي.',
      paperOriginalSentenceDe: s5.origSub,
      surgicalMeta: s5,
    },
    {
      roundNumber: 5,
      speaker: 'Mohammed (Du)',
      titleDarija:
        'الجولة 5 (نتا): جوكر الصديق + الجوكر ديال المغرب (SLOT 6) + سؤال للبارتنر',
      titleDe: 'Ronde 5: Erfahrung & Marokko-Joker',
      fixedTemplateBefore:
        'Persönlich habe ich keine direkte Erfahrung, aber ein Freund von mir hat das gemacht und fand es super. In meinem Heimatland Marokko ist es so, dass ',
      slotLabel: 'SLOT 6: Hal f Lmaghrib',
      slotContent: r5Clause,
      finalVerb: r5Verb,
      darijaTranslation: r5Darija,
      fixedTemplateAfter: '. Hast du ähnliche Erfahrungen?',
      darijaCoachingPill: useJoker
        ? '🃏 الجوكر المغربي الموحد خدام 100% مع كاع الـ 46 موضوع بلا ما تحفظ حتى جملة جديدة!'
        : '🇲🇦 جملة خاصة بالمغرب لهاد الموضوع (تقدر تبدلها للجوكر الموحد بضغطة زر الفوق!).',
      paperOriginalSentenceDe: `Marokko-Joker (Thema #${exam.id})`,
    },
    {
      roundNumber: 6,
      speaker: 'Partner/in',
      titleDarija:
        'الجولة 6 (البارتنر): الجوكر الاحتياطي الموحد للختام (Universal-Backup-Joker)',
      titleDe: 'Ronde 6: Universal-Backup-Joker & Abschluss',
      fixedTemplateBefore: TEIL2_RONDE6_UNIVERSAL_JOKER.de,
      slotLabel: 'Ronde 6: Universal-Backup-Joker',
      slotContent: '',
      darijaTranslation: TEIL2_RONDE6_UNIVERSAL_JOKER.darija,
      fixedTemplateAfter: '',
      darijaCoachingPill:
        'ختام ذهبي موحد بـ 60/60 كيسد الحوار بأناقة فـ جميع الـ 46 موضوع!',
      paperOriginalSentenceDe: 'Fazit & Universal-Backup-Joker',
    },
  ];
}
