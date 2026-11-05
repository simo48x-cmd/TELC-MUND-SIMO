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
  extractFirstFourWordsHint
} from './pingPongLogic';

test('splitClauseFinalVerb extracts the conjugated verb at the end of a dass-clause', () => {
  const res = splitClauseFinalVerb(
    'dieses Essen sehr ungesund ist und zu Übergewicht sowie Krankheiten führt'
  );
  assert.equal(res.finalVerb, 'führt');
  assert.equal(
    res.body,
    'dieses Essen sehr ungesund ist und zu Übergewicht sowie Krankheiten'
  );
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
    analyzeGermanInputSanity('Der Text befasst sich mit dem Thema Fast Food').isValidGermanAttempt,
    true
  );
});

test('evaluateSimulatorTurnDeterministically returns 0/60 on invalid input and advances Ronde 1 -> 3 -> 5 on valid German', () => {
  const mockExam = {
    id: 1,
    titleDe: 'Fast Food',
    titleDarija: 'الأكل السريع',
    slot1Theme: 'Fast Food',
    slot2Point1: 'dass immer mehr Menschen heute Fast Food essen.',
    slot3Point2: 'dass diese Mahlzeiten sehr viele Kalorien enthalten.',
    slot4Advantage: 'dass Fast Food sehr schnell geht und im Alltag viel Zeit spart.',
    slot5Disadvantage: 'dass dieses Essen ungesund ist und zu Krankheiten führt.',
    slot6Morocco: 'dass junge Leute in großen Städten wie Fès oder Casablanca gerne Tacos essen.'
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
      'Der Text befasst sich mit dem Thema Fast Food. Zuerst wird beschrieben, dass immer mehr Menschen heute Fast Food essen. Welche Informationen hast du noch gefunden?',
    teil2Exam: mockExam
  });
  assert.equal(r1Res.isSanityRejected, false);
  assert.ok(r1Res.scoreOutOf60 >= 50);
  assert.equal(r1Res.nextRoundNumber, 3);
  assert.ok(r1Res.partnerGermanReply.includes('Außerdem wird im Text noch erwähnt'));

  // 3. Accepts Ronde 5 and generates completed 60-point scorecard
  const r5Res = evaluateSimulatorTurnDeterministically({
    mode: 'teil2',
    roundNumber: 5,
    userMessage:
      'Persönlich habe ich keine direkte Erfahrung, aber in meinem Heimatland Marokko ist es oft so, dass junge Leute in großen Städten wie Fès oder Casablanca gerne Tacos essen.',
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
    extractFirstFourWordsHint('Der Text befasst sich mit dem Thema Fast Food.'),
    'Der Text befasst sich ...'
  );
});
