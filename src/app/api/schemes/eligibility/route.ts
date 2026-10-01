import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_SCHEMES } from '@/data/verifiedSchemes';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { schemeId, answers } = body as {
      schemeId: string;
      answers: Record<string, boolean | number | string>;
    };

    const scheme = VERIFIED_SCHEMES.find((s) => s.id === schemeId);
    if (!scheme) {
      return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    }

    // Check all eligibility rules
    let isEligible = true;
    const feedback: string[] = [];

    for (const q of scheme.eligibilityQuestions) {
      const ans = answers[q.id];
      if (q.type === 'boolean' && ans !== true) {
        isEligible = false;
        feedback.push(`Condition not met for: ${q.id}`);
      }
    }

    return NextResponse.json({
      success: true,
      schemeId,
      isEligible,
      isPreliminary: true,
      officialDisclaimer:
        'This is only a preliminary eligibility guidance check. The final decision is made by the relevant government department upon document submission.',
      requiredDocuments: scheme.requiredDocuments,
      stepsToApply: scheme.stepsToApply,
      whereToApply: scheme.whereToApply,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Eligibility check failed' }, { status: 500 });
  }
}
