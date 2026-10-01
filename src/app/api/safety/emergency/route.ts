import { NextRequest, NextResponse } from 'next/server';
import { EMERGENCY_NUMBERS } from '@/data/verifiedSafety';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: EMERGENCY_NUMBERS,
    importantNotice: 'In case of immediate danger, dial 112 directly from any mobile phone even without SIM or internet connection.',
  });
}
