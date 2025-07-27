import { NextResponse } from 'next/server';
import { opportunitiesAPI } from '../../../../../lib/supabase.js';

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  try {
    const { category } = params;
    const opportunities = await opportunitiesAPI.getByCategory(category);
    
    return NextResponse.json({
      category,
      opportunities,
      total: opportunities.length
    });
    
  } catch (error) {
    console.error('Error fetching opportunities by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities by category' },
      { status: 500 }
    );
  }
}