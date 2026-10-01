import { NextRequest, NextResponse } from 'next/server';
import { processAIQuery } from '@/utils/aiCompanion';
import { SupportedLanguage } from '@/types';
import {
  search_schemes,
  check_preliminary_eligibility,
  get_local_updates,
  get_electricity_updates,
  get_ration_updates,
  get_work_opportunities,
  get_health_camps,
  get_vaccination_sessions,
  get_support_centres,
  get_one_stop_centres,
  get_legal_support,
  get_counselling_services,
  get_emergency_contacts,
  get_women_helpline
} from '@/server/tools';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, language = 'ta', village, actionTool } = body as {
      query: string;
      language: SupportedLanguage;
      village?: string;
      actionTool?: string;
    };

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Direct Tool Invocation if requested
    if (actionTool) {
      if (actionTool === 'search_schemes') {
        const schemes = await search_schemes({ language });
        return NextResponse.json({ success: true, tool: actionTool, data: schemes });
      }
      if (actionTool === 'get_electricity') {
        const updates = await get_electricity_updates({ village });
        return NextResponse.json({ success: true, tool: actionTool, data: updates });
      }
      if (actionTool === 'get_emergency') {
        const emergency = await get_emergency_contacts();
        return NextResponse.json({ success: true, tool: actionTool, data: emergency });
      }
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey) {
      try {
        const systemPrompt = `You are JYOTHI (also known as SAKHI), a warm, supportive, gentle AI digital companion for rural and underserved women in India.
Language: ${language} (ta: Tamil, hi: Hindi, te: Telugu, ml: Malayalam).
CORE RULES:
1. ALWAYS be calm, gentle, respectful, and encouraging. Never blame the woman or pressure her.
2. If immediate danger or domestic violence is indicated, prioritize 112 Emergency and 181 Women Helpline immediately.
3. NEVER invent power outages, ration stock, medical diagnoses, or legal verdicts.
4. Output concise answers that sound natural when read aloud via Text-to-Speech in ${language}.
Answer the user query: "${query}"`;

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
        console.warn('Gemini API fallback to verified local tools:', geminiError);
      }
    }

    // Default verified local tool execution
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
