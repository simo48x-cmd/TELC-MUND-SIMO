import express from 'express';
import { createServer as createHttpServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer, WebSocket } from 'ws';
import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  ThinkingLevel,
  Type,
} from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || 'MISSING_KEY',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  app.use(express.json({ limit: '25mb' }));

  // 1. Low-Latency Slot & Speaking Grader (gemini-3.1-flash-lite)
  app.post('/api/gemini/fast-grade', async (req, res) => {
    try {
      const { userTranscript, spokenText, targetSlot, targetClause, roundNumber, topicTitle } = req.body;
      const actualSpoken = String(userTranscript || spokenText || '').trim();
      const actualTarget = String(targetSlot || targetClause || '').trim();

      const words = actualSpoken.replace(/[.,!?"„“”]/g, '').split(/\s+/).filter(Boolean);
      if (words.length < 3) {
        res.json({
          score: 0,
          verbAtEndCorrect: false,
          correctedGerman: actualTarget,
          darijaFeedback: `⚠️ قلتي غير '${actualSpoken || '...'}'! راه فـ الامتحان ما غاديش تاخد نقط على كلمة وحدة. قول الجملة كاملة بالألمانية وحط الفعل فاللخر!`
        });
        return;
      }

      const ai = getGenAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `Du bist ein strenger, fairer TELC B2 Prüfer für Mohammed El Jebouri (22, aus Fès, Bachelor Wirtschaft).
Thema: "${topicTitle || 'Allgemein'}" (Ronde ${roundNumber || 1}).
Erwarteter Ziel-Satz (mit Verb am Ende nach "dass"): "${actualTarget}"
Gesprochener Text von Mohammed: "${actualSpoken}"

Prüfe streng:
1. Wenn der Text kein Deutsch ist oder weniger als 4 Wörter hat, gib score = 0!
2. Steht das konjugierte Verb korrekt am Ende des Nebensatzes (Verb-Endstellung nach dass/weil/ob/wann)?
3. Gib ehrliches Feedback auf Marokkanischer Darija (arabische Schrift).
Antworte im JSON-Format.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              verbAtEndCorrect: { type: Type.BOOLEAN },
              correctedGerman: { type: Type.STRING },
              darijaFeedback: { type: Type.STRING },
            },
            required: [
              'score',
              'verbAtEndCorrect',
              'correctedGerman',
              'darijaFeedback',
            ],
          },
        },
      });
      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // 2. Strict AI Examiner & Conversational Partner (gemini-3.8-flash)
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const {
        mode,
        persona,
        topicTitle,
        userMessage,
        roundNumber,
        targetSentenceDe,
        nextPartnerTemplateDe,
      } = req.body;

      const rawMsg = String(userMessage || '').trim();
      const words = rawMsg.replace(/[.,!?"„“”]/g, '').split(/\s+/).filter(Boolean);
      if (words.length < 4) {
        res.json({
          scoreOutOf60: 0,
          cefrLevel: '0',
          verbAtEndCorrect: false,
          pronunciationAndGrammarFeedbackDarija: `⚠️ قلتي غير '${rawMsg}'! راه فـ الامتحان الحقيقي ما غاديش تاخد نقط على كلمة وحدة أو كلمة خارج الموضوع 😄 برك على المايك 🎙️ وقول هاد الجملة كاملة بالألمانية:`,
          correctedGermanSentence: String(targetSentenceDe || ''),
          partnerGermanReply:
            'Entschuldigung Mohammed, aber das war kein vollständiger deutscher Satz zu unserem Thema! Bitte sprich oder schreib einen ganzen Satz auf Deutsch.',
          sauerstoffHintIfNeeded: String(targetSentenceDe || ''),
        });
        return;
      }

      const ai = getGenAIClient();
      const systemInstruction = `Du bist ein strenger, zertifizierter TELC B2 Mündlich Prüfer & Gesprächspartner für Mohammed El Jebouri (22, aus Fès, Marokko; Abitur in Physik & Chemie; Bachelor in Wirtschaft).
Modus: ${mode || 'teil2'} | Partner-Persona: ${persona || 'friendly'} | Thema: ${topicTitle || 'TELC B2'} | Aktuelle Runde: ${roundNumber || 1}.
Erwarteter Ziel-Satz in dieser Runde: "${targetSentenceDe || ''}"
Vorgeschlagene nächste Partner-Antwort (Ronde ${(Number(roundNumber) || 1) + 1}): "${nextPartnerTemplateDe || ''}"

WICHTIGE PRÜFUNGSREGELN (KEINE GRATIS-PUNKTE!):
1. Wenn Mohammeds Eingabe kein echtes Deutsch ist, Englisch/Slang ist oder das Thema komplett verfehlt: scoreOutOf60 = 0, cefrLevel = "0".
2. Prüfe genau, ob er die Ping-Pong-Vorlage genutzt hat und ob das konjugierte Verb nach "dass", "weil", "ob", "wenn" am Ende steht (verbAtEndCorrect).
3. Gib in "pronunciationAndGrammarFeedbackDarija" eine ehrliche, konkrete Kritik auf Marokkanischer Darija (arabische Schrift): was war richtig, welches Verb oder Wort fehlte.
4. Gib in "correctedGermanSentence" den idealen B2-Satz für Mohammeds aktuelle Runde.
5. Gib in "partnerGermanReply" die nächste Antwort des Partners auf Deutsch (nutze gerne "${nextPartnerTemplateDe || ''}" als Basis), die das Gespräch in die nächste Runde führt.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Mohammed hat gesagt: "${rawMsg}"`,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scoreOutOf60: { type: Type.INTEGER },
              cefrLevel: { type: Type.STRING },
              verbAtEndCorrect: { type: Type.BOOLEAN },
              pronunciationAndGrammarFeedbackDarija: { type: Type.STRING },
              correctedGermanSentence: { type: Type.STRING },
              partnerGermanReply: { type: Type.STRING },
              sauerstoffHintIfNeeded: { type: Type.STRING },
            },
            required: [
              'scoreOutOf60',
              'cefrLevel',
              'verbAtEndCorrect',
              'pronunciationAndGrammarFeedbackDarija',
              'correctedGermanSentence',
              'partnerGermanReply',
              'sauerstoffHintIfNeeded',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // 3. Text-to-Speech (gemini-3.8-flash-tts)
  app.post('/api/gemini/tts', async (req, res) => {
    try {
      const { text, voiceName, dualSpeaker } = req.body;
      const ai = getGenAIClient();
      if (dualSpeaker) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: String(text || 'Mohammed: Hallo! Partner: Guten Tag!'),
                  speechMetadata: {
                    speaker: 'Mohammed',
                    style: 'Clear, confident German B2 speaker',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: 'Mohammed',
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
                  },
                  {
                    speaker: 'Partner',
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                  },
                ],
              },
            },
          },
        });
        const base64Audio =
          response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        res.json({ audioBase64: base64Audio ?? null, mimeType: 'audio/wav' });
        return;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: String(text || 'Der Text befasst sich mit dem Thema.'),
                speechMetadata: {
                  style: 'Clear, natural German pronunciation for TELC B2 exam',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
            },
          },
        },
      });
      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      res.json({ audioBase64: base64Audio ?? null, mimeType: 'audio/wav' });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // 4. Audio Transcription (gemini-3.5-transcribe)
  app.post('/api/gemini/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      const ai = getGenAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'audio/webm',
                data: String(audioBase64 || ''),
              },
            },
            {
              text: 'Transcribe this spoken German audio accurately.',
            },
          ],
        },
      });
      res.json({ transcript: response.text ?? '' });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // 5. Google Search Grounding for German Career & TELC Updates (gemini-3.8-flash)
  app.post('/api/gemini/search-grounding', async (req, res) => {
    try {
      const { query } = req.body;
      const ai = getGenAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: String(
          query ||
            'Aktuelle Jobchancen in Deutschland für Bachelor Wirtschaft Absolventen mit Deutsch B2'
        ),
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      const chunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      res.json({
        text: response.text ?? '',
        groundingChunks: chunks,
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // 6. Google Maps Grounding for German Universities, TELC Centers & Employers (gemini-3.8-flash)
  app.post('/api/gemini/maps-grounding', async (req, res) => {
    try {
      const { query, latitude, longitude } = req.body;
      const ai = getGenAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: String(
          query || 'TELC Prüfungszentren und Wirtschaftsunternehmen in Frankfurt am Main'
        ),
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: typeof latitude === 'number' ? latitude : 50.1109,
                longitude: typeof longitude === 'number' ? longitude : 8.6821,
              },
            },
          },
        },
      });
      const chunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      res.json({
        text: response.text ?? '',
        groundingChunks: chunks,
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // 7. Multimodal Image & Video Analyzer for Exam Sheets & Practice Clips (gemini-3.8-flash)
  app.post('/api/gemini/analyze-media', async (req, res) => {
    try {
      const { base64Data, mimeType, prompt } = req.body;
      const ai = getGenAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/png',
                data: String(base64Data || ''),
              },
            },
            {
              text:
                prompt ||
                'Extrahiere aus diesem Bild/Video die 6 Ping-Pong-Slots (Smiya, Fikra 1, Fikra 2, Vorteil, Nachteil, Erfahrung in Marokko) für TELC B2 Mündlich mit Erklärung auf Marokkanischer Darija.',
            },
          ],
        },
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        },
      });
      res.json({ text: response.text ?? '' });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // 8. Gemini Live API WebSocket Bridge (gemini-3.8-live)
  const wss = new WebSocketServer({ noServer: true });
  httpServer.on('upgrade', (request, socket, head) => {
    if (request.url?.startsWith('/live')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', async (clientWs: WebSocket) => {
    let sessionPromise: ReturnType<GoogleGenAI['live']['connect']> | null = null;
    try {
      const ai = getGenAIClient();
      sessionPromise = ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction:
            'Du bist der freundliche TELC B2 Mündlich Prüfungspartner für Mohammed El Jebouri aus Fès. Sprich klares Deutsch auf B2-Niveau im Ping-Pong-Stil.',
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            if (clientWs.readyState !== WebSocket.OPEN) return;
            const content = message.serverContent;
            if (content?.inputTranscription?.text) {
              clientWs.send(
                JSON.stringify({ inputTranscript: content.inputTranscription.text })
              );
            }
            if (content?.outputTranscription?.text) {
              clientWs.send(
                JSON.stringify({ outputTranscript: content.outputTranscription.text })
              );
            }
            for (const part of content?.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
              }
            }
            if (content?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onerror: (err: unknown) => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(
                JSON.stringify({
                  error: err instanceof Error ? err.message : 'Live session error',
                })
              );
            }
          },
        },
      });
    } catch (err) {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            error: err instanceof Error ? err.message : 'Could not connect Live API',
          })
        );
      }
    }

    clientWs.on('message', (raw) => {
      try {
        const payload = JSON.parse(raw.toString());
        if (payload.audio && sessionPromise) {
          sessionPromise
            .then((session) => {
              session.sendRealtimeInput({
                audio: { data: payload.audio, mimeType: 'audio/pcm;rate=16000' },
              });
            })
            .catch(() => {});
        }
      } catch {
        // ignore malformed frame
      }
    });

    clientWs.on('close', () => {
      if (sessionPromise) {
        sessionPromise.then((s) => s.close()).catch(() => {});
      }
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`TELC B2 Mündlich & Karriere Master Pro server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
