import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function GET() {
  const start = performance.now();
  
  try {
    const payload = await getPayload({ config });
    
    // Simple query to test latency
    await payload.db.drizzle.execute('SELECT 1');
    
    const end = performance.now();
    const latency = Math.round(end - start);
    
    return NextResponse.json({
      success: true,
      latency: `${latency}ms`,
      database: process.env.DATABASE_URI?.includes('supabase') ? 'Supabase' : 'Vercel Postgres',
      region: process.env.VERCEL_REGION || 'local'
    });
  } catch (error) {
    const end = performance.now();
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      latency: `${Math.round(end - start)}ms`
    }, { status: 500 });
  }
}
