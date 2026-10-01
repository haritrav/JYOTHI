import { NextRequest, NextResponse } from 'next/server';
import { search_schemes } from '@/server/tools';
import { SupportedLanguage } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const query = searchParams.get('query') || undefined;
    const language = (searchParams.get('language') as SupportedLanguage) || 'ta';

    const schemes = await search_schemes({ category, query, language });
    return NextResponse.json({ success: true, count: schemes.length, data: schemes });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve schemes' }, { status: 500 });
  }
}
