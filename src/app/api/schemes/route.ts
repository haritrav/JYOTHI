import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_SCHEMES } from '@/data/verifiedSchemes';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  let schemes = VERIFIED_SCHEMES;
  if (category && category !== 'all') {
    schemes = schemes.filter((s) => s.category === category);
  }

  return NextResponse.json({
    success: true,
    total: schemes.length,
    data: schemes,
  });
}
