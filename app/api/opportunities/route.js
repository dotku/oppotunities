import { NextResponse } from 'next/server';
import { opportunitiesAPI } from '../../../lib/supabase.js';

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let opportunities;
    
    // If search parameter is provided, use search API
    if (search) {
      opportunities = await opportunitiesAPI.search(search);
    } else {
      // Otherwise get all with filters
      const filters = {
        category: searchParams.get('category'),
        subcategory: searchParams.get('subcategory'),
        type: searchParams.get('type'),
        company: searchParams.get('company')
      };
      
      // Remove null values
      Object.keys(filters).forEach(key => {
        if (filters[key] === null) delete filters[key];
      });
      
      opportunities = await opportunitiesAPI.getAll(filters);
    }
    
    return NextResponse.json({
      opportunities,
      total: opportunities.length,
      filters: Object.fromEntries(searchParams)
    });
    
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}
