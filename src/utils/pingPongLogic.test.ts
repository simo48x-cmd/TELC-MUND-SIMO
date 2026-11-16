import test from 'node:test';
import assert from 'node:assert/strict';
import {
  splitClauseFinalVerb,
  convertMainSentenceToDassClause,
  upgradeDirectToIndirectQuestion,
  calculateTelcOralScore,
  evaluateSlotAttempt,
  analyzeGermanInputSanity,
  evaluateSimulatorTurnDeterministically,
  detectTeil3PlanningPoint,
  extractFirstFourWordsHint,
  getVoiceCallOpeningGreeting,
  getTeleprompterWhisperLevels,
  buildPostCallDiagnosticReport,
  splitGermanWordIntoSyllables,
  buildSelectionSyllableBreakdown,
  splitGermanTextIntoSentences,
  extractCleanWordsFromSelection,
  segmentExamPaperForLaserScanner
} from './pingPongLogic';
import { TEIL2_TOPICS, TEIL2_EXAMS, build6RoundsForExam, UNIVERSAL_MOROCCO_JOKER } from '../data/teil2Data';

test('splitClauseFinalVerb extracts the conjugated verb at the end of a dass-clause and never highlights trailing example nouns like Couscous', () => {
  const res = splitClauseFinalVerb(
    'dieses Essen sehr ungesund ist und zu Übergewicht sowie Krankheiten führt'
  );
  assert.equal(res.finalVerb, 'führt');
  assert.equal(
    res.body,
    'dieses Essen sehr ungesund ist und zu Übergewicht sowie Krankheiten'
  );

  const resMultiVerb = splitClauseFinalVerb(
    'übermäßiger Konsum von kalorienreicher Nahrung suchtähnliche Reaktionen im Gehirn auslösen kann',
    'auslösen kann'
  );
  assert.equal(resMultiVerb.finalVerb, 'auslösen kann');
  assert.equal(
    resMultiVerb.body,
    'übermäßiger Konsum von kalorienreicher Nahrung suchtähnliche Reaktionen im Gehirn'
  );

  const resMoroccoJoker = splitClauseFinalVerb(
    'dieses Thema heute sehr aktuell ist und die Menschen viel darüber sprechen',
    'sprechen'
  );
  assert.equal(resMoroccoJoker.finalVerb, 'sprechen');

  const resCouscous = splitClauseFinalVerb(
    'fast alle Familien jeden Tag frisch zu Hause kochen, zum Beispiel Tajine oder Couscous'
  );
  assert.equal(resCouscous.finalVerb, 'kochen');
  assert.notEqual(resCouscous.finalVerb, 'Couscous');
});

test('convertMainSentenceToDassClause kicks the conjugated verb to the end', () => {
  const clause = convertMainSentenceToDassClause(
    'Fast Food',
    'macht',
    'schnell süchtig'
  );
  assert.equal(clause, 'dass Fast Food schnell süchtig macht');
});

test('upgradeDirectToIndirectQuestion builds a B2 indirect question with verb at end', () => {
  const indirect = upgradeDirectToIndirectQuestion(
    'Ich möchte wissen',
    'wann',
    'das Sportfest stattfinden',
    'soll'
  );
  assert.equal(indirect, 'Ich möchte wissen, wann das Sportfest stattfinden soll.');
});

test('calculateTelcOralScore enforces 36/60 pass threshold and maps CEFR level', () => {
  const high = calculateTelcOralScore({
    teil1Points: 15,
    teil2Points: 15,
    teil3Points: 14,
    languagePoints: 14,
  });
  assert.equal(high.total, 58);
  assert.equal(high.passed, true);
  assert.equal(high.cefrEstimate, 'B2');

  const low = calculateTelcOralScore({
    teil1Points: 8,
    teil2Points: 8,
    teil3Points: 9,
    languagePoints: 8,
  });
  assert.equal(low.total, 33);
  assert.equal(low.passed, false);
  assert.equal(low.cefrEstimate, 'B1');
});

test('evaluateSlotAttempt checks verb at end and returns high score for matching clause', () => {
  const target = 'neue Medikamente dadurch für den Menschen viel sicherer werden';
  const good = evaluateSlotAttempt(
    'neue Medikamente dadurch für den Menschen viel sicherer werden',
    target
  );
  assert.equal(good.verbAtEndCorrect, true);
  assert.equal(good.scoreOutOf60, 60);
});

test('analyzeGermanInputSanity strictly rejects < 4 words, slang, profanity, or English', () => {
  assert.equal(analyzeGermanInputSanity('hey').isValidGermanAttempt, false);
  assert.equal(analyzeGermanInputSanity('fuck').isValidGermanAttempt, false);
  assert.equal(analyzeGermanInputSanity('hallo wie gehts').isValidGermanAttempt, false);
  assert.equal(
    analyzeGermanInputSanity('this is a test sentence in english').isValidGermanAttempt,
    false
  );
  assert.equal(
    analyzeGermanInputSanity('In meinem Text geht es um das Thema Fast Food').isValidGermanAttempt,
    true
  );
});

test('evaluateSimulatorTurnDeterministically returns 0/60 on invalid input and advances Ronde 1 -> 3 -> 5 on valid German', () => {
  const mockExam = {
    id: 1,
    titleDe: 'Fast Food kann süchtig machen',
    titleDarija: 'الأكل السريع',
    slot1Theme: 'Fast Food kann süchtig machen',
    slot2Point1: 'in dem Experiment Ratten zunehmend die Kontrolle über ihr Verhalten verloren',
    slot3Point2: 'US-Forscher exzessives Essen stark fetthaltiger Speisen inzwischen mit Drogenkonsum vergleichen',
    slot4Advantage: 'der Konsum das Belohnungssystem des Gehirns aktiviert',
    slot5Disadvantage: 'übermäßiger Konsum von kalorienreicher Nahrung suchtähnliche Reaktionen im Gehirn auslösen kann',
    slot6Morocco: 'dieses Thema heute sehr aktuell ist und die Menschen viel darüber sprechen'
  };

  // 1. Rejects "hey" with 0/60 and does not advance round
  const badRes = evaluateSimulatorTurnDeterministically({
    mode: 'teil2',
    roundNumber: 1,
    userMessage: 'hey',
    teil2Exam: mockExam
  });
  assert.equal(badRes.scoreOutOf60, 0);
  assert.equal(badRes.cefrLevel, '0');
  assert.equal(badRes.isSanityRejected, true);
  assert.equal(badRes.nextRoundNumber, 1);

  // 2. Accepts Ronde 1 and advances to Ronde 3 with Partner speaking Ronde 2
  const r1Res = evaluateSimulatorTurnDeterministically({
    mode: 'teil2',
    roundNumber: 1,
    userMessage:
      'In meinem Text geht es um das Thema Fast Food kann süchtig machen. Der Autor erwähnt, dass in dem Experiment Ratten zunehmend die Kontrolle über ihr Verhalten verloren. Was steht in deinem Text?',
    teil2Exam: mockExam
  });
  assert.equal(r1Res.isSanityRejected, false);
  assert.ok(r1Res.scoreOutOf60 >= 50);
  assert.equal(r1Res.nextRoundNumber, 3);
  assert.ok(r1Res.partnerGermanReply.includes('In meinem Artikel steht auch, dass'));

  // 3. Accepts Ronde 5 and generates completed 60-point scorecard
  const r5Res = evaluateSimulatorTurnDeterministically({
    mode: 'teil2',
    roundNumber: 5,
    userMessage:
      'Persönlich habe ich keine direkte Erfahrung, aber ein Freund von mir hat das gemacht und fand es super. In meinem Heimatland Marokko ist es so, dass dieses Thema heute sehr aktuell ist und die Menschen viel darüber sprechen. Hast du ähnliche Erfahrungen?',
    teil2Exam: mockExam,
    previousTurnScores: [56, 54]
  });
  assert.equal(r5Res.isSanityRejected, false);
  assert.ok(r5Res.completedScorecard);
  assert.equal(r5Res.completedScorecard?.passed, true);
});

test('detectTeil3PlanningPoint detects planning points from spoken German and extractFirstFourWordsHint extracts 4 words', () => {
  assert.equal(
    detectTeil3PlanningPoint('Ich möchte wissen, was wir für das Essen und Trinken am Buffet planen.'),
    11
  );
  assert.equal(
    extractFirstFourWordsHint('In meinem Text geht es um das Thema Fast Food.'),
    'In meinem Text geht ...'
  );
});

test('getVoiceCallOpeningGreeting, getTeleprompterWhisperLevels, and buildPostCallDiagnosticReport work accurately', () => {
  const ctx = {
    mode: 'teil2' as const,
    roundNumber: 1,
    userMessage: '',
    teil2Exam: {
      id: 1,
      titleDe: 'Fast Food kann süchtig machen',
      titleDarija: 'الأكل السريع',
      slot1Theme: 'Fast Food kann süchtig machen',
      slot2Point1: 'in dem Experiment Ratten zunehmend die Kontrolle über ihr Verhalten verloren',
      slot3Point2: 'US-Forscher exzessives Essen stark fetthaltiger Speisen inzwischen mit Drogenkonsum vergleichen',
      slot4Advantage: 'der Konsum das Belohnungssystem des Gehirns aktiviert',
      slot5Disadvantage: 'übermäßiger Konsum von kalorienreicher Nahrung suchtähnliche Reaktionen im Gehirn auslösen kann',
      slot6Morocco: 'dieses Thema heute sehr aktuell ist und die Menschen viel darüber sprechen',
      slot2Darija: 'فالتجربة فقدو الفئران بالتدريج السيطرة على السلوك ديالهم فالأكل'
    }
  };

  const greeting = getVoiceCallOpeningGreeting(ctx);
  assert.ok(greeting.includes('Fast Food kann süchtig machen'));
  assert.ok(greeting.includes('Ronde 1'));

  const whisper = getTeleprompterWhisperLevels(ctx);
  assert.ok(whisper.level1Darija.includes('فالتجربة فقدو الفئران'));
  assert.ok(whisper.level2StarterDe.includes('In meinem Text geht es um das Thema'));
  assert.ok(whisper.level3FullDe.includes('Verhalten verloren'));
  assert.ok(whisper.rescueInterruptPhraseDe.includes('Entschuldigung'));

  const report = buildPostCallDiagnosticReport({
    durationSeconds: 65,
    turns: [
      {
        userSaidDe:
          'In meinem Text geht es um das Thema Fast Food kann süchtig machen. Der Autor erwähnt, dass in dem Experiment Ratten zunehmend die Kontrolle über ihr Verhalten verloren.',
        targetSentenceDe: whisper.level3FullDe,
        scoreOutOf60: 54,
        cefrLevel: 'B2',
        darijaCritique: 'ممتاز!',
        verbAtEndCorrect: true
      }
    ]
  });
  assert.equal(report.durationFormatted, '01:05');
  assert.ok(report.totalOutOf60 >= 50);
  assert.equal(report.passed, true);
  assert.equal(report.turnReviews.length, 1);
});

test('splitGermanWordIntoSyllables, buildSelectionSyllableBreakdown, splitGermanTextIntoSentences, and extractCleanWordsFromSelection work accurately', () => {
  assert.equal(splitGermanWordIntoSyllables('Sehenswürdigkeiten'), 'Se•hens•wür•dig•kei•ten');
  assert.equal(splitGermanWordIntoSyllables('Umweltverschmutzung'), 'Um•welt•ver•schmut•zung');
  assert.equal(
    splitGermanWordIntoSyllables('Verantwortungsbewusstsein'),
    'Ver•ant•wor•tungs•be•wusst•sein'
  );
  assert.equal(splitGermanWordIntoSyllables('Haus'), 'Haus');

  const breakdown = buildSelectionSyllableBreakdown(
    'Die Sehenswürdigkeiten und Umweltverschmutzung sind wichtig.'
  );
  assert.equal(breakdown.length, 2);
  assert.equal(breakdown[0].syllables, 'Se•hens•wür•dig•kei•ten');
  assert.equal(breakdown[1].syllables, 'Um•welt•ver•schmut•zung');

  const sentences = splitGermanTextIntoSentences(
    'In meinem Text geht es um das Thema Fast Food. Der Autor erwähnt, dass es ungesund ist! Was steht in deinem Text?'
  );
  assert.equal(sentences.length, 3);
  assert.equal(sentences[0], 'In meinem Text geht es um das Thema Fast Food.');

  const words = extractCleanWordsFromSelection('Der Autor erwähnt!');
  assert.deepEqual(words, ['Der', 'Autor', 'erwähnt']);
});

test('all 46 TEIL2_TOPICS and TEIL2_EXAMS have 100% verbatim Sprechen_B2_2026.pdf originalText, origSub, caseBadge, and 6-round templates', () => {
  assert.equal(TEIL2_TOPICS.length, 46);
  assert.equal(TEIL2_EXAMS.length, 46);

  // Verify Topic 1 and Topic 2 exact verbatim openings from Sprechen_B2_2026.pdf
  assert.ok(
    TEIL2_EXAMS[0].originalText.startsWith(
      'Unappetitliches Ergebnis eines Tierversuchs: Fettiges Essen kann offenbar ebenso süchtig machen wie Drogen.'
    )
  );
  assert.ok(
    TEIL2_EXAMS[1].originalText.startsWith(
      'Kochen am eigenen Herd liegt im Trend: „Selbst gekocht schmeckt besser, und ich weiß, was drin ist.“'
    )
  );

  for (const exam of TEIL2_EXAMS) {
    assert.ok(exam.originalArticleDe.length > 200, `Exam #${exam.id} missing full originalArticleDe`);
    assert.ok(exam.pdfPage >= 0, `Exam #${exam.id} missing pdfPage`);
    assert.ok(exam.paperTitle.length > 2, `Exam #${exam.id} missing paperTitle`);
    assert.equal(exam.trapCards.length, 2, `Exam #${exam.id} missing trapCards`);

    // Check that all 4 origSub substrings exist in originalText
    for (const key of ['slot2', 'slot3', 'slot4', 'slot5'] as const) {
      const slot = exam.surgicalSlots[key];
      assert.ok(
        exam.originalText.toLowerCase().includes(slot.origSub.toLowerCase()),
        `Exam #${exam.id} (${exam.titleDe}) ${key} origSub not found in originalText: ${slot.origSub}`
      );
      assert.ok(slot.caseBadge.startsWith('الحالة '), `Exam #${exam.id} ${key} missing caseBadge`);
    }

    const rounds = build6RoundsForExam(exam, {
      useUniversalMoroccoJoker: true,
      useVerbatimPaperClauses: true,
    });
    assert.equal(rounds.length, 6);
    assert.equal(rounds[0].fixedTemplateBefore, 'In meinem Text geht es um das Thema „');
    assert.equal(rounds[0].fixedTemplateMiddle, '“. Der Autor erwähnt, dass ');
    assert.equal(rounds[0].fixedTemplateAfter, '. Was steht in deinem Text?');
    assert.equal(rounds[1].fixedTemplateBefore, 'In meinem Artikel steht auch, dass ');
    assert.equal(rounds[1].fixedTemplateAfter, '. Was denkst du darüber?');
    assert.equal(
      rounds[2].fixedTemplateBefore,
      'Ich bin der Ansicht, dass das ein wichtiges Thema ist. Ein großer Vorteil ist meiner Meinung nach, dass '
    );
    assert.equal(rounds[2].fixedTemplateAfter, '. Wie siehst du das?');
    assert.equal(
      rounds[3].fixedTemplateBefore,
      'Da stimme ich dir zu. Ein wichtiger Nachteil ist aber zum Beispiel, dass '
    );
    assert.equal(rounds[3].fixedTemplateAfter, '. Hast du vielleicht schon Erfahrungen damit gemacht?');
    assert.equal(
      rounds[4].fixedTemplateBefore,
      'Persönlich habe ich keine direkte Erfahrung, aber ein Freund von mir hat das gemacht und fand es super. In meinem Heimatland Marokko ist es so, dass '
    );
    assert.equal(rounds[4].slotContent, UNIVERSAL_MOROCCO_JOKER.dassClauseDe);
    assert.equal(rounds[4].finalVerb, 'sprechen');
    assert.equal(rounds[4].fixedTemplateAfter, '. Hast du ähnliche Erfahrungen?');
    assert.ok(
      rounds[5].fixedTemplateBefore.startsWith(
        'Ehrlich gesagt, habe ich persönlich keine direkte Erfahrung damit.'
      )
    );
  }
});



