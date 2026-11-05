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
      const { spokenText, targetClause, contextType, topicTitle } = req.body;
      const ai = getGenAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `Du bist ein zertifizierter TELC B2 Prüfer für Mohammed El Jebouri (22, aus Fès, Bachelor Wirtschaft).
Kontext: ${contextType || 'Teil 2 Ping-Pong Slot'} — Thema: "${topicTitle || 'Allgemein'}".
Ziel-Nebensatz (mit Verb am Ende nach "dass"): "${targetClause}"
Gesprochener Text von Mohammed: "${spokenText}"

Prüfe:
1. Steht das konjugierte Verb korrekt am Ende des Nebensatzes (Verb-Endstellung nach dass/weil/ob/wann)?
2. Ist der Inhalt verständlich und auf B2-Niveau?
Antworte im JSON-Format.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scoreOutOf60: { type: Type.INTEGER },
              cefrLevel: { type: Type.STRING },
              verbAtEndCorrect: { type: Type.BOOLEAN },
              correctedGerman: { type: Type.STRING },
              darijaCoaching: { type: Type.STRING },
              praiseDe: { type: Type.STRING },
            },
            required: [
              'scoreOutOf60',
              'cefrLevel',
              'verbAtEndCorrect',
              'correctedGerman',
              'darijaCoaching',
              'praiseDe',
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

  // 2. Multi-Turn Conversational Partner & Deep Thinking Coach (gemini-3.8-flash)
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { messages, roleMode, topicTitle, highThinking } = req.body;
      const ai = getGenAIClient();
      const systemInstruction = `Du bist der interaktive TELC B2 Mündlich & Karriere Partner für Mohammed El Jebouri (22 Jahre alt, aus Fès, Marokko, Abitur in Physik & Chemie, Bachelor in Wirtschaft, Hobbys: Sport, Zeichnen, Videospiele).
Aktueller Modus: ${roleMode || 'Teil 2 Ping-Pong Partner'} | Thema: ${topicTitle || 'TELC B2'}.
Regeln:
- Antworte zuerst auf natürlichem, klarem Deutsch (Niveau B2, 2-4 Sätze) passend zur Ping-Pong-Methodik.
- Gib danach in einer neuen Zeile einen kurzen Coaching-Tipp auf Marokkanischer Darija (arabische Schrift) und eine geschätzte Punktzahl (z.B. 58/60 Punkte • Niveau B2).`;

      const contents = Array.isArray(messages)
        ? messages.map((m: { role: string; text: string }) => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: String(m.text || '') }],
          }))
        : [{ role: 'user', parts: [{ text: String(req.body.prompt || 'Hallo!') }] }];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: highThinking ? ThinkingLevel.HIGH : ThinkingLevel.LOW,
          },
        },
      });

      res.json({ text: response.text ?? '' });
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
