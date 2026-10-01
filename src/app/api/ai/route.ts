import { NextRequest, NextResponse } from 'next/server';
import { processAIQuery } from '@/utils/aiCompanion';
import { SupportedLanguage } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, language = 'ta', village } = body as {
      query: string;
      language: SupportedLanguage;
      village?: string;
    };

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey) {
      try {
        const systemPrompt = `You are JYOTHI (also called SAKHI), a warm, empathetic, respectful AI digital companion for rural women in India.
Language: ${language} (support: ta = Tamil, hi = Hindi, te = Telugu, ml = Malayalam).
Rules:
1. Always be calm, gentle, encouraging, and respectful.
2. NEVER blame the woman, never shame her, never tell her abuse is her fault.
3. If immediate danger is indicated, prioritize 112 (Emergency) and 181 (Women Helpline).
4. NEVER invent electricity cuts, ration stock, medical diagnosis, or legal verdicts.
5. Provide concise, clear answers that can be easily spoken aloud in ${language}.
Answer the user's query: "${query}"`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }]
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            // Also run rule matcher for UI action card triggering
            const localResult = processAIQuery(query, language, village);
            return NextResponse.json({
              intent: localResult.intent,
              responseText: generatedText,
              audioSpeechText: generatedText.slice(0, 250),
              actionType: localResult.actionType,
              matchedData: localResult.matchedData,
              suggestedFollowUps: localResult.suggestedFollowUps,
              source: 'gemini_verified'
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call fell back to local verified intent engine:', geminiError);
      }
    }

    // Default verified local engine
    const localResult = processAIQuery(query, language, village);
    return NextResponse.json({
      ...localResult,
      source: 'local_verified'
    });
  } catch (error) {
    console.error('Error in /api/ai:', error);
    return NextResponse.json(
      { error: 'Internal server error in AI processing' },
      { status: 500 }
    );
  }
}
