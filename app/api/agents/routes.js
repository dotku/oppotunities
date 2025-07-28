import { NextResponse } from 'next/server';
import { opportunitiesAPI } from '../../../lib/supabase.js';

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json([
      name: "蒸汽教育",
      tags: ["应届生"]
    ]);
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
