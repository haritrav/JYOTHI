import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_VACCINATIONS } from '@/data/verifiedHealth';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: VERIFIED_VACCINATIONS,
    medicalDisclaimer: 'Always bring your MCP Card (தாய்-சேய் நல அட்டை) to the vaccination session. The ASHA / ANM health worker will confirm the appropriate vaccine schedule for your child.',
  });
}
