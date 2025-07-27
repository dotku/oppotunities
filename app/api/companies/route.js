import { NextResponse } from 'next/server';
import { opportunitiesAPI } from '../../../lib/supabase.js';

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const companies = await opportunitiesAPI.getCompanies();
    return NextResponse.json(companies);
    
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}