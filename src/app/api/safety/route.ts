import { NextRequest, NextResponse } from 'next/server';
import { get_emergency_contacts, get_support_centres, get_legal_support } from '@/server/tools';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district') || undefined;

    const [emergencyContacts, supportCentres, legalSupport] = await Promise.all([
      get_emergency_contacts(),
      get_support_centres({ district }),
      get_legal_support()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        emergencyContacts,
        supportCentres,
        legalSupport
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve safety data' }, { status: 500 });
  }
}
