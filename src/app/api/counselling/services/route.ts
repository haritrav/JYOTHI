import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_COUNSELLING_SERVICES } from '@/data/verifiedCounselling';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: VERIFIED_COUNSELLING_SERVICES,
    teleManasNotice: 'Tele-MANAS is a 24x7 free mental health support initiative of the Government of India.',
  });
}
