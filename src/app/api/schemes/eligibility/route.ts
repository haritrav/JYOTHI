import { NextRequest, NextResponse } from 'next/server';
import { check_preliminary_eligibility } from '@/server/tools';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { schemeId, gender = 'female', age = 30, annualIncome, landAcres } = body;

    const result = await check_preliminary_eligibility({
      schemeId,
      gender,
      age: Number(age),
      annualIncome: annualIncome ? Number(annualIncome) : undefined,
      landAcres: landAcres ? Number(landAcres) : undefined
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Eligibility check failed' }, { status: 500 });
  }
}
