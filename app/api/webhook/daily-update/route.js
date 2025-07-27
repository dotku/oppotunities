import { NextResponse } from 'next/server';
import { opportunitiesAPI } from '../../../../lib/supabase.js';

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    // Verify webhook secret
    const webhookSecret = request.headers.get('x-webhook-secret');
    const expectedSecret = process.env.WEBHOOK_SECRET;
    
    if (expectedSecret && webhookSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const source = body.source || 'webhook';
    
    console.log('📞 Daily update webhook called from:', source);

    // Generate new sample opportunities
    const newOpportunities = generateSampleOpportunities();
    
    // If we have Supabase connection, try to update database
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const { supabase } = await import('../../../../lib/supabase.js');
        
        if (supabase) {
          // Insert new opportunities
          const { data, error } = await supabase
            .from('opportunities')
            .upsert(newOpportunities);

          if (error) {
            console.error('Database update error:', error);
          } else {
            console.log(`✅ Updated ${newOpportunities.length} opportunities in database`);
          }

          // Log the update
          const logEntry = {
            id: `webhook_${Date.now()}`,
            action: 'webhook_daily_update',
            opportunities_updated: newOpportunities.length,
            status: error ? 'error' : 'success',
            error_message: error?.message || null,
            details: {
              source: source,
              timestamp: new Date().toISOString(),
              opportunities_count: newOpportunities.length
            }
          };

          await supabase.from('update_logs').insert([logEntry]);
        }
      } catch (dbError) {
        console.warn('Database operation failed, webhook still successful:', dbError.message);
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Daily update webhook processed successfully',
      opportunities_updated: newOpportunities.length,
      timestamp: new Date().toISOString(),
      source: source
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

function generateSampleOpportunities() {
  const companies = ['TechCorp', 'InnovateLabs', 'FutureStack', 'CodeCraft', 'DataDrive', 'CloudWorks'];
  const positions = [
    'Senior Full Stack Developer',
    'Product Manager',
    'Data Scientist',
    'DevOps Engineer', 
    'UX/UI Designer',
    'Backend Engineer',
    'Frontend Developer',
    'Machine Learning Engineer'
  ];
  
  const categories = [
    { name: 'tech', subcategories: ['it', 'ai', 'data'] },
    { name: 'career', subcategories: ['software', 'internship'] },
    { name: 'managers', subcategories: ['general', 'operations'] }
  ];
  
  const types = ['full-time', 'contract', 'part-time'];
  const locations = ['Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA'];
  
  const skillSets = [
    ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    ['Python', 'Django', 'PostgreSQL', 'AWS'],
    ['Java', 'Spring Boot', 'MySQL', 'Docker'],
    ['React', 'Vue.js', 'CSS', 'HTML'],
    ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
    ['Kubernetes', 'Docker', 'CI/CD', 'AWS'],
    ['Figma', 'Adobe XD', 'CSS', 'JavaScript']
  ];
  
  const newJobs = [];
  const currentDate = new Date().toISOString();
  
  // Generate 2-4 new jobs
  const jobCount = Math.floor(Math.random() * 3) + 2;
  
  for (let i = 0; i < jobCount; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subcategory = category.subcategories[Math.floor(Math.random() * category.subcategories.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const skills = skillSets[Math.floor(Math.random() * skillSets.length)];
    
    const salaryBase = Math.floor(Math.random() * 80) + 80; // 80-160k base
    const salaryTop = salaryBase + Math.floor(Math.random() * 40) + 20; // +20-60k
    
    newJobs.push({
      id: `webhook_${Date.now()}_${i}`,
      company: company,
      title: position,
      category: category.name,
      subcategory: subcategory,
      salaryRange: `$${salaryBase}k - $${salaryTop}k`,
      type: type,
      url: `https://jobs.${company.toLowerCase().replace(/\s+/g, '')}.com/position-${Date.now()}-${i}`,
      location: location,
      skills: skills,
      experience: `${Math.floor(Math.random() * 5) + 1}+ years`,
      description: `Join ${company} as a ${position} and help build innovative solutions. Work with cutting-edge technologies and a talented team in a collaborative environment. This is an excellent opportunity to grow your career and make a significant impact.`,
      created_at: currentDate,
      updated_at: currentDate
    });
  }
  
  console.log(`Generated ${newJobs.length} new opportunities:`, 
    newJobs.map(job => `${job.company} - ${job.title}`));
  
  return newJobs;
}

// Handle GET requests for webhook verification
export async function GET(request) {
  return NextResponse.json({
    message: 'Daily update webhook endpoint is active',
    timestamp: new Date().toISOString(),
    status: 'ready'
  });
}