import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_ELECTRICITY_UPDATES } from '@/data/verifiedUpdates';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: VERIFIED_ELECTRICITY_UPDATES,
    disclaimer: 'Verified from official State Discom bulletin. Unverified schedules are never displayed.',
  });
}
