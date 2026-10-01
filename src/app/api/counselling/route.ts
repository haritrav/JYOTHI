import { NextRequest, NextResponse } from 'next/server';
import { get_counselling_services, request_counselling } from '@/server/tools';
import { SupportedLanguage } from '@/types';

export async function GET() {
  try {
    const services = await get_counselling_services();
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve counselling services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userName, preferredLanguage = 'ta', ageRange, preferredMode = 'phone', preferredTime, notes } = body;

    const result = await request_counselling({
      userName: userName || 'Sister',
      preferredLanguage: preferredLanguage as SupportedLanguage,
      ageRange: ageRange || '25-40',
      preferredMode,
      preferredTime: preferredTime || 'Morning 10-12',
      notes
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to register counselling' }, { status: 500 });
  }
}
