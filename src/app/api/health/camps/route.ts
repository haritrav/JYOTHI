import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_HEALTH_CAMPS } from '@/data/verifiedHealth';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: VERIFIED_HEALTH_CAMPS,
    medicalDisclaimer: 'Health camp listings are verified public health announcements. JYOTHI does not provide medical diagnoses or replace physician consultations.',
  });
}
