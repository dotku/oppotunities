const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Supabase database...')

    // Read the opportunities data
    const opportunitiesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'api', 'opportunities.json'), 'utf8')
    )

    console.log('📊 Creating categories table...')
    // First, let's try to create the categories
    const { error: categoriesError } = await supabase
      .from('categories')
      .upsert(opportunitiesData.categories, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })

    if (categoriesError) {
      console.log('Categories might not exist yet, that\'s okay:', categoriesError.message)
    } else {
      console.log('✅ Categories inserted successfully')
    }

    console.log('💼 Creating opportunities table...')
    // Insert opportunities data
    const { error: opportunitiesError } = await supabase
      .from('opportunities')
      .upsert(opportunitiesData.opportunities, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })

    if (opportunitiesError) {
      console.log('Opportunities might not exist yet, that\'s okay:', opportunitiesError.message)
    } else {
      console.log('✅ Opportunities inserted successfully')
    }

    console.log('🎉 Database setup completed!')
    console.log(`📈 Total opportunities: ${opportunitiesData.opportunities.length}`)
    console.log(`📂 Total categories: ${opportunitiesData.categories.length}`)

  } catch (error) {
    console.error('❌ Error setting up database:', error)
    process.exit(1)
  }
}

// SQL Schema for reference
const createTablesSQL = `
-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  subcategories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Opportunities table  
CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL REFERENCES categories(id),
  subcategory TEXT,
  salary_range TEXT,
  type TEXT,
  url TEXT,
  location TEXT,
  skills TEXT[],
  experience TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_company ON opportunities(company);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_skills ON opportunities USING GIN(skills);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY IF NOT EXISTS "Public read access for categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Public read access for opportunities" ON opportunities
  FOR SELECT USING (true);
`

console.log('📋 SQL Schema to run in Supabase SQL Editor:')
console.log(createTablesSQL)
console.log('\n🔧 Run this script after creating the tables:')
console.log('node scripts/setup-database.js')

// If this is run directly, execute the setup
if (require.main === module) {
  setupDatabase()
}