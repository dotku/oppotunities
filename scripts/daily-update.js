const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simulated data sources - in production, these would be real APIs
const dataSources = [
  {
    name: 'TechJobs API',
    url: 'https://api.example.com/tech-jobs',
    category: 'tech'
  },
  {
    name: 'Remote Work API',
    url: 'https://api.example.com/remote-jobs',
    category: 'remote'
  },
  {
    name: 'Startup Jobs API',
    url: 'https://api.example.com/startup-jobs',
    category: 'startup'
  }
];

// Generate sample new opportunities
function generateNewOpportunities() {
  const companies = ['TechCorp', 'InnovateLabs', 'FutureStack', 'CodeCraft', 'DataDrive'];
  const positions = ['Senior Developer', 'Product Manager', 'Data Scientist', 'DevOps Engineer', 'UX Designer'];
  const types = ['full-time', 'contract', 'part-time'];
  const locations = ['Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA'];
  
  const newJobs = [];
  const currentDate = new Date().toISOString();
  
  // Generate 2-5 new jobs daily
  const jobCount = Math.floor(Math.random() * 4) + 2;
  
  for (let i = 0; i < jobCount; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    newJobs.push({
      id: `daily_${Date.now()}_${i}`,
      company: company,
      title: position,
      category: 'tech',
      subcategory: 'it',
      salary_range: `$${(Math.floor(Math.random() * 80) + 80)}k - $${(Math.floor(Math.random() * 100) + 120)}k`,
      type: type,
      url: `https://jobs.${company.toLowerCase().replace(/\s+/g, '')}.com/position-${i + 1}`,
      location: location,
      skills: getRandomSkills(),
      experience: `${Math.floor(Math.random() * 5) + 1}+ years`,
      description: `Join ${company} as a ${position} and help build the future of technology. Work with cutting-edge tools and technologies in a collaborative environment.`,
      is_active: true,
      created_at: currentDate,
      updated_at: currentDate
    });
  }
  
  return newJobs;
}

function getRandomSkills() {
  const allSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS', 
    'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis',
    'GraphQL', 'REST APIs', 'Microservices', 'CI/CD', 'Git'
  ];
  
  const skillCount = Math.floor(Math.random() * 4) + 3; // 3-6 skills
  const shuffled = allSkills.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, skillCount);
}

async function fetchExternalData() {
  console.log('🔄 Fetching data from external sources...');
  
  // Simulate API calls to external job boards
  const promises = dataSources.map(async (source) => {
    try {
      console.log(`📡 Fetching from ${source.name}...`);
      
      // In production, this would be:
      // const response = await fetch(source.url);
      // const data = await response.json();
      
      // For demo, we simulate the response
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      return {
        source: source.name,
        jobs: generateNewOpportunities().slice(0, 2), // 2 jobs per source
        success: true
      };
    } catch (error) {
      console.error(`❌ Error fetching from ${source.name}:`, error.message);
      return {
        source: source.name,
        jobs: [],
        success: false,
        error: error.message
      };
    }
  });
  
  const results = await Promise.all(promises);
  return results;
}

async function updateDatabase(newOpportunities) {
  console.log(`💾 Updating database with ${newOpportunities.length} opportunities...`);
  
  try {
    // Insert new opportunities
    const { data, error } = await supabase
      .from('opportunities')
      .upsert(newOpportunities, { onConflict: 'id' });
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ Successfully updated ${newOpportunities.length} opportunities`);
    return newOpportunities.length;
  } catch (error) {
    console.error('❌ Database update error:', error.message);
    throw error;
  }
}

async function cleanupOldJobs() {
  console.log('🧹 Cleaning up old opportunities...');
  
  try {
    // Deactivate opportunities older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data, error } = await supabase
      .from('opportunities')
      .update({ is_active: false })
      .lt('created_at', thirtyDaysAgo.toISOString())
      .eq('is_active', true);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Cleanup completed');
    return data?.length || 0;
  } catch (error) {
    console.error('❌ Cleanup error:', error.message);
    return 0;
  }
}

async function logUpdate(opportunitiesUpdated, status, errorMessage = null) {
  const logEntry = {
    id: `daily_${Date.now()}`,
    action: 'daily_update',
    opportunities_updated: opportunitiesUpdated,
    status: status,
    error_message: errorMessage,
    details: {
      timestamp: new Date().toISOString(),
      source: 'github_actions',
      version: '1.0.0'
    }
  };
  
  try {
    await supabase.from('update_logs').insert([logEntry]);
    console.log(`📝 Update logged with status: ${status}`);
  } catch (error) {
    console.error('❌ Failed to log update:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting daily opportunities update...');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  
  let totalUpdated = 0;
  let status = 'success';
  let errorMessage = null;
  
  try {
    // Step 1: Fetch data from external sources
    const fetchResults = await fetchExternalData();
    
    // Step 2: Aggregate all new opportunities
    const allNewJobs = [];
    fetchResults.forEach(result => {
      if (result.success) {
        allNewJobs.push(...result.jobs);
        console.log(`✅ ${result.source}: ${result.jobs.length} jobs`);
      } else {
        console.log(`❌ ${result.source}: Failed (${result.error})`);
      }
    });
    
    // Step 3: Update database
    if (allNewJobs.length > 0) {
      totalUpdated = await updateDatabase(allNewJobs);
    } else {
      console.log('ℹ️ No new opportunities to update');
    }
    
    // Step 4: Cleanup old jobs
    const cleanedUp = await cleanupOldJobs();
    if (cleanedUp > 0) {
      console.log(`🧹 Deactivated ${cleanedUp} old opportunities`);
    }
    
    // Step 5: Update statistics
    const { data: stats } = await supabase
      .from('opportunities')
      .select('id', { count: 'exact' })
      .eq('is_active', true);
    
    console.log(`📊 Total active opportunities: ${stats?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Daily update failed:', error.message);
    status = 'error';
    errorMessage = error.message;
    totalUpdated = 0;
  }
  
  // Log the update
  await logUpdate(totalUpdated, status, errorMessage);
  
  if (status === 'success') {
    console.log('🎉 Daily update completed successfully!');
    console.log(`📈 Updated ${totalUpdated} opportunities`);
  } else {
    console.log('💥 Daily update failed');
    process.exit(1);
  }
}

// Run the daily update
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { main, generateNewOpportunities, fetchExternalData };