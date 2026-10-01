import { NextRequest, NextResponse } from 'next/server';
import { AuditLog } from '@/types';

const mockAuditLogs: AuditLog[] = [
  {
    id: 'LOG-1092',
    adminEmail: 'health.officer@madurai.gov.in',
    action: 'PUBLISH',
    entity: 'HEALTH_CAMP',
    entityId: 'camp-001',
    timestamp: '2026-10-01T09:30:00Z',
    details: 'Published Free Women Special Health & Anaemia Screening Camp at Vadipatti PHC',
  },
  {
    id: 'LOG-1091',
    adminEmail: 'eb.supervisor@tangedco.gov.in',
    action: 'CREATE',
    entity: 'ELECTRICITY_UPDATE',
    entityId: 'elec-001',
    timestamp: '2026-10-01T08:15:00Z',
    details: 'Scheduled power interruption notice for Vadipatti Sub-station maintenance on Oct 5',
  },
  {
    id: 'LOG-1090',
    adminEmail: 'wcd.admin@sakhi.gov.in',
    action: 'UPDATE',
    entity: 'SUPPORT_CENTRE',
    entityId: 'osc-madurai',
    timestamp: '2026-09-29T11:20:00Z',
    details: 'Verified Sakhi One Stop Centre 24x7 phone number and temporary shelter bed availability',
  },
];

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    total: mockAuditLogs.length,
    data: mockAuditLogs,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { adminEmail, action, entity, entityId, details } = body;

    const newLog: AuditLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      adminEmail: adminEmail || 'admin@jyothi.gov.in',
      action: action || 'CREATE',
      entity: entity || 'GENERAL',
      entityId: entityId || 'GEN-01',
      timestamp: new Date().toISOString(),
      details: details || 'Administrative action performed',
    };

    mockAuditLogs.unshift(newLog);

    return NextResponse.json({
      success: true,
      log: newLog,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to record audit log' }, { status: 500 });
  }
}
