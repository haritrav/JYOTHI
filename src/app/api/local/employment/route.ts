import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_EMPLOYMENT_UPDATES } from '@/data/verifiedUpdates';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: VERIFIED_EMPLOYMENT_UPDATES,
    disclaimer: 'Verified MGNREGS and DRDA rural employment work notices.',
  });
}
