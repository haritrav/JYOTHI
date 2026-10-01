import { NextRequest, NextResponse } from 'next/server';
import { get_local_updates } from '@/server/tools';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district') || undefined;
    const block = searchParams.get('block') || undefined;
    const village = searchParams.get('village') || undefined;

    const data = await get_local_updates({ district, block, village });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve updates' }, { status: 500 });
  }
}
