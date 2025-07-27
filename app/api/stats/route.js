import { NextResponse } from 'next/server';
import { opportunitiesAPI } from '../../../lib/supabase.js';

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const stats = await opportunitiesAPI.getStats();
    return NextResponse.json(stats);
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
