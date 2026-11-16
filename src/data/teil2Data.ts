import { Teil2Exam } from '../types';
import { TEIL2_EXAMS_PART1 } from './teil2ExamsPart1';
import { TEIL2_EXAMS_PART2 } from './teil2ExamsPart2';
import {
  SurgicalExamPaperData,
  SurgicalPaperSlot,
  TEIL2_SURGICAL_PAPER_PART1,
  UNIVERSAL_MOROCCO_JOKER,
} from './teil2SurgicalPaperDataPart1';
import { TEIL2_SURGICAL_PAPER_PART2 } from './teil2SurgicalPaperDataPart2';

export { UNIVERSAL_MOROCCO_JOKER };
export type { SurgicalExamPaperData, SurgicalPaperSlot };

const ALL_SURGICAL_PAPER_DATA: Record<number, SurgicalExamPaperData> = {
  ...TEIL2_SURGICAL_PAPER_PART1,
  ...TEIL2_SURGICAL_PAPER_PART2,
};

export interface EnrichedTeil2Exam extends Teil2Exam {
  titleDe: string;
  titleDarija: string;
  slot1Theme: string;
  slot1Darija: string;
  slot2Point1: string;
  slot3Point2: string;
  slot4Advantage: string;
  slot5Disadvantage: string;
  slot6Morocco: string;
  pdfPage: number;
  paperTitle: string;
  originalArticleDe: string;
  surgicalSlots: {
    slot2: SurgicalPaperSlot;
    slot3: SurgicalPaperSlot;
    slot4: SurgicalPaperSlot;
    slot5: SurgicalPaperSlot;
  };
  moroccoUniversalJokerDe: string;
  moroccoUniversalJokerAr: string;
}

export const TEIL2_EXAMS: EnrichedTeil2Exam[] = [
  ...TEIL2_EXAMS_PART1,
  ...TEIL2_EXAMS_PART2,
].map((exam) => {
  const surgical = ALL_SURGICAL_PAPER_DATA[exam.id];
  return {
    ...exam,
    titleDe: `${exam.id}. ${exam.title}`,
    titleDarija: `${exam.category} — ${exam.slot1Smiya}`,
    slot1Theme: exam.slot1Smiya,
    slot1Darija: `الموضوع: ${exam.slot1Smiya}`,
    slot2Point1: exam.slot2Fikra1,
    slot3Point2: exam.slot3Fikra2,
    slot4Advantage: exam.slot4Ijabia,
    slot5Disadvantage: exam.slot5Salbia,
    slot6Morocco: exam.slot6Maghrib,
    pdfPage: surgical?.pdfPage ?? exam.id + 15,
    paperTitle: surgical?.paperTitle ?? exam.title,
    originalArticleDe:
      surgical?.originalArticleDe ?? exam.paperTextDe.join(' '),
    surgicalSlots: {
      slot2: surgical.slot2_fikra1,
      slot3: surgical.slot3_fikra2,
      slot4: surgical.slot4_ijabia,
      slot5: surgical.slot5_salbia,
    },
    moroccoUniversalJokerDe: UNIVERSAL_MOROCCO_JOKER.de,
    moroccoUniversalJokerAr: UNIVERSAL_MOROCCO_JOKER.ar,
  };
});

export const TEIL2_RONDE6_UNIVERSAL_JOKER = {
  de: 'Ehrlich gesagt, habe ich persönlich keine direkte Erfahrung damit. Aber in meinem Freundeskreis ist das ein großes Thema. Ein guter Freund von mir hat das ausprobiert und mir viel darüber erzählt. Außerdem merke ich, dass dieses Thema auch in Marokko immer wichtiger wird.',
  darija:
    'إلا نسيتي الفكرة ديال المغرب أو تلف ليك الحساب، هاد الجوكر الذهبي خدام مع كاع الـ 46 موضوع بلا استثناء!',
};

export interface BuiltPingPongRound {
  roundNumber: 1 | 2 | 3 | 4 | 5 | 6;
  speaker: 'Mohammed (Du)' | 'Partner';
  titleDe: string;
  titleDarija: string;
  darijaCoachingPill: string;
  fixedTemplateBefore: string;
  slotLabel: string;
  slotContent: string;
  darijaTranslation: string;
  fixedTemplateMiddle?: string;
  slot2Label?: string;
  slot2Content?: string;
  slot2DarijaTranslation?: string;
  fixedTemplateAfter: string;
  surgicalMeta?: SurgicalPaperSlot;
}

export function build6RoundsForExam(
  exam: EnrichedTeil2Exam,
  options?: {
    useUniversalMoroccoJoker?: boolean;
    useVerbatimPaperClauses?: boolean;
  }
): BuiltPingPongRound[] {
  const usePaper = Boolean(options?.useVerbatimPaperClauses);
  const useMoroccoJoker = Boolean(options?.useUniversalMoroccoJoker);

  const slot1Val = usePaper ? exam.paperTitle : exam.slot1Smiya;
  const slot2Val = usePaper
    ? exam.surgicalSlots.slot2.dassClauseDe
    : exam.slot2Fikra1;
  const slot2Ar = usePaper
    ? exam.surgicalSlots.slot2.arMeaning
    : exam.slot2Darija;

  const slot3Val = usePaper
    ? exam.surgicalSlots.slot3.dassClauseDe
    : exam.slot3Fikra2;
  const slot3Ar = usePaper
    ? exam.surgicalSlots.slot3.arMeaning
    : exam.slot3Darija;

  const slot4Val = usePaper
    ? exam.surgicalSlots.slot4.dassClauseDe
    : exam.slot4Ijabia;
  const slot4Ar = usePaper
    ? exam.surgicalSlots.slot4.arMeaning
    : exam.slot4Darija;

  const slot5Val = usePaper
    ? exam.surgicalSlots.slot5.dassClauseDe
    : exam.slot5Salbia;
  const slot5Ar = usePaper
    ? exam.surgicalSlots.slot5.arMeaning
    : exam.slot5Darija;

  const slot6Val = useMoroccoJoker
    ? exam.moroccoUniversalJokerDe
    : exam.slot6Maghrib;
  const slot6Ar = useMoroccoJoker
    ? exam.moroccoUniversalJokerAr
    : exam.slot6Darija;

  return [
    {
      roundNumber: 1,
      speaker: 'Mohammed (Du)',
      titleDe: 'RONDE 1: Einleitung & Textstelle 1',
      titleDarija: 'الجولة 1: نتا (الدخلة + الفكرة 1) — [100% من الورقة]',
      darijaCoachingPill:
        'ملي كتشد الورقة فـ 20 دقيقة د التحضير، سطر على سمية الموضوع (Überschrift) وسطّر على السطر الأول ديال الكاتب وحطهم فهاد جوج فراغات:',
      fixedTemplateBefore: 'Der Text befasst sich mit dem Thema „',
      slotLabel: 'SLOT 1: Smiya mn lwarqa',
      slotContent: slot1Val,
      darijaTranslation: exam.slot1Darija,
      fixedTemplateMiddle: '“. Zuerst wird beschrieben, dass ',
      slot2Label: 'SLOT 2: Fikra 1 mn lwarqa',
      slot2Content: slot2Val,
      slot2DarijaTranslation: slot2Ar,
      fixedTemplateAfter: '. Welche Informationen hast du noch gefunden?',
      surgicalMeta: exam.surgicalSlots.slot2,
    },
    {
      roundNumber: 2,
      speaker: 'Partner',
      titleDe: 'RONDE 2: Textstelle 2 & Meinungsfrage',
      titleDarija: 'الجولة 2: صاحبك (الفكرة 2 من الورقة)',
      darijaCoachingPill:
        'صاحبك كيكمل الفكرة الثانية لي بقات فـ النص وكيسولك على رأيك:',
      fixedTemplateBefore: 'Außerdem wird im Text noch erwähnt, dass ',
      slotLabel: 'SLOT 3: Fikra 2 mn lwarqa',
      slotContent: slot3Val,
      darijaTranslation: slot3Ar,
      fixedTemplateAfter: '. Was ist deine persönliche Meinung zu diesem Thema?',
      surgicalMeta: exam.surgicalSlots.slot3,
    },
    {
      roundNumber: 3,
      speaker: 'Mohammed (Du)',
      titleDe: 'RONDE 3: Eigene Meinung & Vorteil (Ijabia)',
      titleDarija: 'الجولة 3: نتا (رأيك + الإيجابية)',
      darijaCoachingPill:
        'كتعطي رأيك + إيجابية وحدة (Vorteil). إلا لقيتيها فـ النص سرقها بذكاء بالحالات الجراحية 1/2/3، وإلا ما لقيتيهاش حط هادي لي واجدة:',
      fixedTemplateBefore:
        'Ich bin der Ansicht, dass das ein wichtiges Thema ist. Ein großer Vorteil ist meiner Meinung nach, dass ',
      slotLabel: 'SLOT 4: Ijabia (Vorteil)',
      slotContent: slot4Val,
      darijaTranslation: slot4Ar,
      fixedTemplateAfter: '. Wie siehst du das?',
      surgicalMeta: exam.surgicalSlots.slot4,
    },
    {
      roundNumber: 4,
      speaker: 'Partner',
      titleDe: 'RONDE 4: Zustimmung & Nachteil (Salbia)',
      titleDarija: 'الجولة 4: صاحبك (متافق + السلبية)',
      darijaCoachingPill:
        'صاحبك كيتفق معاك وكيجبد سلبية وحدة (Nachteil) وكيسولك على التجربة:',
      fixedTemplateBefore:
        'Da stimme ich dir zu. Ein wichtiger Nachteil ist aber zum Beispiel, dass ',
      slotLabel: 'SLOT 5: Salbia (Nachteil)',
      slotContent: slot5Val,
      darijaTranslation: slot5Ar,
      fixedTemplateAfter:
        '. Hast du vielleicht schon Erfahrungen damit gemacht?',
      surgicalMeta: exam.surgicalSlots.slot5,
    },
    {
      roundNumber: 5,
      speaker: 'Mohammed (Du)',
      titleDe: 'RONDE 5: Erfahrung & Situation in Marokko',
      titleDarija: 'الجولة 5: نتا (التجربة والجوكر فـ المغرب) — [100% من دماغك]',
      darijaCoachingPill:
        'رد بالك تجبد التجربة من الورقة! تقدر تخدم بالجوكر المغربي الموحد (0 حفاظة لـ 46 موضوع) أو الجملة الخاصة بالموضوع فـ المغرب:',
      fixedTemplateBefore:
        'Persönlich habe ich keine direkte Erfahrung, aber ein Freund von mir hat das gemacht und fand es super. In meinem Heimatland Marokko ist es auch oft so, dass ',
      slotLabel: 'SLOT 6: Kifach dayr lhal f Lmaghrib',
      slotContent: slot6Val,
      darijaTranslation: slot6Ar,
      fixedTemplateAfter: '. Hast du ähnliche Erfahrungen?',
    },
    {
      roundNumber: 6,
      speaker: 'Partner',
      titleDe: 'RONDE 6: Abschluss & Universal-Backup-Joker',
      titleDarija: 'الجولة 6: الخاتمة والجوكر الشامل للإنقاذ',
      darijaCoachingPill: TEIL2_RONDE6_UNIVERSAL_JOKER.darija,
      fixedTemplateBefore:
        'Das klingt sehr interessant! Ich denke, dass jeder Mensch selbst entscheiden sollte, was für ihn am besten passt, solange man auf eine gesunde Balance im Alltag achtet.',
      slotLabel: 'Universal-Joker',
      slotContent: 'man auf eine gesunde Balance im Alltag achtet',
      darijaTranslation:
        'كل واحد يقرر شنو كيناسبو مع الحفاظ على التوازن فـ الحياة اليومية.',
      fixedTemplateAfter: '',
    },
  ];
}
