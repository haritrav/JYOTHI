import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_RATION_UPDATES } from '@/data/verifiedUpdates';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: VERIFIED_RATION_UPDATES,
    disclaimer: 'Verified from Civil Supplies portal. Live stock status is updated by Fair Price shop supervisors.',
  });
}
