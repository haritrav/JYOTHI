import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_SUPPORT_CENTRES } from '@/data/verifiedSafety';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get('district');

  let centres = VERIFIED_SUPPORT_CENTRES;
  if (district) {
    centres = centres.filter((c) => c.district.toLowerCase() === district.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    total: centres.length,
    data: centres,
  });
}
