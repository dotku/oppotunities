import { NextResponse } from 'next/server';
import { opportunitiesAPI } from '../../../../lib/supabase.js';

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const opportunity = await opportunitiesAPI.getById(id);
    
    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(opportunity);
    
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}