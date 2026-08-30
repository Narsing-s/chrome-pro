import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const started = Date.now();
  return NextResponse.json({
    status: 'ok',
    service: 'chrome-pro',
    version: '1.1.0',
    uptime: 'healthy',
    searchConfigured: Boolean(process.env.SEARCH_ENGINE_URL),
    timestamp: new Date().toISOString(),
    responseMs: Date.now() - started,
  }, { headers: { 'Cache-Control': 'no-store' } });
}
