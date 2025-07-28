const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config();

// Define the SQL schema first to avoid hoisting issues
const normalizedSchemaSQL = `
-- Companies table (normalized)
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_visa_sponsor BOOLEAN DEFAULT false,
  average_salary INTEGER,
  rank INTEGER,
  website TEXT,
  industry TEXT,
  company_size TEXT,
  headquarters TEXT,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- LCA Records table (Labor Condition Application data by year)
CREATE TABLE IF NOT EXISTS lca_records (
  id SERIAL PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  lca_count INTEGER NOT NULL DEFAULT 0,
  average_salary INTEGER,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(company_id, year)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_rank ON companies(rank);
CREATE INDEX IF NOT EXISTS idx_companies_salary ON companies(average_salary);
CREATE INDEX IF NOT EXISTS idx_companies_sponsor ON companies(is_visa_sponsor);
CREATE INDEX IF NOT EXISTS idx_lca_records_company ON lca_records(company_id);
CREATE INDEX IF NOT EXISTS idx_lca_records_year ON lca_records(year);
CREATE INDEX IF NOT EXISTS idx_lca_records_count ON lca_records(lca_count);

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE lca_records ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY IF NOT EXISTS "Public read access for companies" ON companies
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Public read access for lca_records" ON lca_records
  FOR SELECT USING (true);

-- Create views for easy querying
CREATE OR REPLACE VIEW sponsor_companies_current AS
SELECT 
  c.id,
  c.name,
  c.is_visa_sponsor,
  c.rank,
  c.average_salary,
  c.website,
  c.industry,
  c.company_size,
  c.headquarters,
  lr.lca_count,
  lr.year
FROM companies c
LEFT JOIN lca_records lr ON c.id = lr.company_id AND lr.year = EXTRACT(YEAR FROM NOW())
WHERE c.is_visa_sponsor = true
ORDER BY c.rank ASC NULLS LAST;

-- View for all companies with their latest LCA data
CREATE OR REPLACE VIEW companies_with_lca AS
SELECT 
  c.*,
  lr.lca_count,
  lr.year as lca_year
FROM companies c
LEFT JOIN lca_records lr ON c.id = lr.company_id 
  AND lr.year = (
    SELECT MAX(year) 
    FROM lca_records lr2 
    WHERE lr2.company_id = c.id
  )
ORDER BY c.name;
`;

// Check for Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("⚠️  Supabase credentials not found in environment variables");
  console.log("📋 SQL Schema to run manually in Supabase SQL Editor:");
  console.log(normalizedSchemaSQL);
  console.log(
    "\n🔧 After running the SQL, you can run this script again with proper credentials to import data"
  );
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupNormalizedSchema() {
  try {
    console.log("🚀 Setting up normalized database schema...");

    // Execute the SQL to create normalized tables
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: normalizedSchemaSQL,
    });

    if (error) {
      console.error("❌ Error creating normalized schema:", error);
      console.log("📋 Please run this SQL manually in Supabase SQL Editor:");
      console.log(normalizedSchemaSQL);
      return;
    }

    console.log("✅ Normalized schema created successfully!");

    // Now migrate existing data and import sponsor data
    await migrateAndImportData();
  } catch (error) {
    console.error("❌ Error setting up normalized schema:", error);
    console.log("📋 Please run this SQL manually in Supabase SQL Editor:");
    console.log(normalizedSchemaSQL);
  }
}

async function migrateAndImportData() {
  try {
    console.log(
      "📊 Migrating existing opportunities and importing sponsor data..."
    );

    // Step 1: Get existing opportunities to extract companies
    const { data: existingOpportunities, error: oppError } = await supabase
      .from("opportunities")
      .select("company");

    if (oppError) {
      console.error("❌ Error fetching existing opportunities:", oppError);
      return;
    }

    // Step 2: Load sponsor data
    const dataPath = path.join(
      process.cwd(),
      "public/data/processed-rankings.json"
    );
    let sponsorData = { rankings: [] };

    if (fs.existsSync(dataPath)) {
      sponsorData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
      console.log(
        `📋 Found ${sponsorData.rankings?.length || 0} sponsor companies`
      );
    }

    // Step 3: Create unified companies list
    const allCompanies = new Map();

    // Add companies from existing opportunities
    if (existingOpportunities) {
      existingOpportunities.forEach((opp) => {
        if (opp.company) {
          const companyId = opp.company
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_");
          allCompanies.set(companyId, {
            id: companyId,
            name: opp.company,
            is_visa_sponsor: false,
            average_salary: null,
            rank: null,
          });
        }
      });
    }

    // Add/update with sponsor data
    if (sponsorData.rankings) {
      sponsorData.rankings.forEach((company) => {
        const companyId = company.company
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_");
        allCompanies.set(companyId, {
          id: companyId,
          name: company.company,
          is_visa_sponsor: true,
          average_salary: company.averageSalary,
          rank: company.rank,
          website: null,
          industry: null,
          company_size: null,
          headquarters: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      });
    }

    const companiesArray = Array.from(allCompanies.values());
    console.log(`📋 Total unique companies: ${companiesArray.length}`);

    // Step 4: Insert companies
    console.log("💾 Inserting companies...");
    const { data: companiesData, error: companiesError } = await supabase
      .from("companies")
      .upsert(companiesArray, { onConflict: "id" });

    if (companiesError) {
      console.error("❌ Error inserting companies:", companiesError);
      return;
    }

    console.log(`✅ Inserted ${companiesArray.length} companies`);

    // Step 5: Create LCA records for sponsor companies
    const currentYear = new Date().getFullYear();
    const lcaRecords = [];

    if (sponsorData.rankings) {
      sponsorData.rankings.forEach((company) => {
        const companyId = company.company
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_");
        lcaRecords.push({
          company_id: companyId,
          year: currentYear,
          lca_count: company.lcaCount,
          average_salary: company.averageSalary,
          rank: company.rank,
          created_at: new Date().toISOString(),
        });
      });

      console.log("💾 Inserting LCA records...");
      const { data: lcaData, error: lcaError } = await supabase
        .from("lca_records")
        .upsert(lcaRecords, { onConflict: "company_id,year" });

      if (lcaError) {
        console.error("❌ Error inserting LCA records:", lcaError);
        return;
      }

      console.log(`✅ Inserted ${lcaRecords.length} LCA records`);
    }

    console.log("🎉 Data migration and import completed successfully!");
    console.log(
      "⚠️  Note: You may need to update existing opportunities to reference company_id instead of company name"
    );
  } catch (error) {
    console.error("❌ Error migrating data:", error);
  }
}

// If this is run directly, execute the setup
if (require.main === module) {
  setupNormalizedSchema()
    .then(() => {
      console.log("🎉 Normalized schema setup completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Normalized schema setup failed:", error);
      process.exit(1);
    });
}

module.exports = { setupNormalizedSchema, normalizedSchemaSQL };
