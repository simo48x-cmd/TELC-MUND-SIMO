import test from 'node:test';
import assert from 'node:assert/strict';
import {
  splitClauseFinalVerb,
  convertMainSentenceToDassClause,
  upgradeDirectToIndirectQuestion,
  calculateTelcOralScore,
  evaluateSlotAttempt,
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
