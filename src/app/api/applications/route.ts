import { NextRequest, NextResponse } from 'next/server';
import { get_user_applications } from '@/server/tools';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;

    const apps = await get_user_applications(userId);
    return NextResponse.json({ success: true, count: apps.length, data: apps });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve applications' }, { status: 500 });
  }
}
