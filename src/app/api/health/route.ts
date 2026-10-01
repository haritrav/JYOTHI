import { NextRequest, NextResponse } from 'next/server';
import { get_health_camps, get_vaccination_sessions } from '@/server/tools';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const district = searchParams.get('district') || undefined;

    const [healthCamps, vaccinationSessions] = await Promise.all([
      get_health_camps({ category, district }),
      get_vaccination_sessions()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        healthCamps,
        vaccinationSessions
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve health data' }, { status: 500 });
  }
}
