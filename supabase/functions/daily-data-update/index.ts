import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Sample data - in production, this would fetch from external APIs
    const updatedOpportunities = [
      {
        id: 'daily_' + Date.now(),
        company: 'TechCorp',
        title: 'Senior Full Stack Developer',
        category: 'tech',
        subcategory: 'it',
        salary_range: '$120k - $160k',
        type: 'full-time',
        url: 'https://example.com/job',
        location: 'Remote',
        skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
        experience: '5+ years',
        description: 'Join our team as a Senior Full Stack Developer and work on cutting-edge projects.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'daily_ai_' + Date.now(),
        company: 'AI Innovations',
        title: 'Machine Learning Engineer',
        category: 'tech',
        subcategory: 'ai',
        salary_range: '$140k - $180k',
        type: 'full-time',
        url: 'https://example.com/job-ai',
        location: 'San Francisco, CA',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
        experience: '3+ years',
        description: 'Build and deploy machine learning models at scale.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    // Update opportunities table
    const { data, error } = await supabaseClient
      .from('opportunities')
      .upsert(updatedOpportunities)

    if (error) {
      console.error('Error updating opportunities:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Log the update
    const logEntry = {
      id: 'log_' + Date.now(),
      action: 'daily_update',
      opportunities_updated: updatedOpportunities.length,
      timestamp: new Date().toISOString(),
      status: 'success'
    }

    await supabaseClient
      .from('update_logs')
      .insert([logEntry])

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated ${updatedOpportunities.length} opportunities`,
        updated_at: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})