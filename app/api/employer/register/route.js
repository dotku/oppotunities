import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'companyName', 'contactName', 'email', 'industry', 
      'companySize', 'location', 'description', 'jobPostingNeeds', 
      'urgency', 'agreedToTerms'
    ];
    
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    if (!body.agreedToTerms) {
      return NextResponse.json(
        { error: 'You must agree to the terms of service' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create registration record
    const registration = {
      id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      companyName: body.companyName,
      contactName: body.contactName,
      email: body.email,
      phone: body.phone || null,
      website: body.website || null,
      industry: body.industry,
      companySize: body.companySize,
      location: body.location,
      description: body.description,
      jobPostingNeeds: body.jobPostingNeeds,
      urgency: body.urgency,
      status: 'pending_review',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      approvedAt: null,
      notes: null
    };

    // In a real application, you would save this to a database
    // For now, we'll just log it and simulate success
    console.log('📝 New Employer Registration:', {
      company: registration.companyName,
      contact: registration.contactName,
      email: registration.email,
      industry: registration.industry,
      urgency: registration.urgency,
      id: registration.id
    });

    // Simulate saving to database
    // await saveEmployerRegistration(registration);

    // Send notification email (simulated)
    console.log('📧 Sending notification emails...');
    console.log(`✉️  Welcome email sent to: ${registration.email}`);
    console.log(`✉️  Admin notification sent to: recruiter@jytech.us`);

    // You could integrate with email services here
    // await sendWelcomeEmail(registration.email, registration);
    // await sendAdminNotification('recruiter@jytech.us', registration);

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully',
      registrationId: registration.id,
      status: 'pending_review',
      estimatedReviewTime: '24-48 hours'
    });

  } catch (error) {
    console.error('❌ Employer registration error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: 'Failed to process registration. Please try again later.',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Helper function to simulate database save (for demo purposes)
async function saveEmployerRegistration(registration) {
  // In a real app, this would save to your database
  // For example, with Supabase:
  /*
  const { supabase } = await import('../../../../lib/supabase.js');
  
  if (supabase) {
    const { data, error } = await supabase
      .from('employer_registrations')
      .insert([registration]);
    
    if (error) throw error;
    return data;
  }
  */
  
  // For demo, just simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(registration);
    }, 100);
  });
}

// Helper function to send welcome email (for demo purposes)
async function sendWelcomeEmail(email, registration) {
  // In a real app, integrate with email service like SendGrid, AWS SES, etc.
  console.log(`📧 Welcome email template sent to ${email}:
  
Subject: Welcome to JobMatching - Registration Received

Dear ${registration.contactName},

Thank you for registering ${registration.companyName} with JobMatching!

We've received your employer registration and our team is reviewing your application. 
You can expect to hear from us within 24-48 hours.

Registration Details:
- Company: ${registration.companyName}
- Industry: ${registration.industry}
- Registration ID: ${registration.id}

Next Steps:
1. Our team will review your company information
2. We'll send you account setup instructions
3. You'll get access to our employer dashboard
4. Start posting jobs and finding great candidates!

If you have any questions, please don't hesitate to contact us at recruiter@jytech.us.

Best regards,
The JobMatching Team
  `);
}

// Helper function to send admin notification
async function sendAdminNotification(adminEmail, registration) {
  console.log(`📧 Admin notification sent to ${adminEmail}:
  
Subject: New Employer Registration - ${registration.companyName}

New employer registration received:

Company: ${registration.companyName}
Contact: ${registration.contactName}
Email: ${registration.email}
Industry: ${registration.industry}
Size: ${registration.companySize}
Location: ${registration.location}
Urgency: ${registration.urgency}

Registration ID: ${registration.id}
Submitted: ${registration.submittedAt}

Please review and approve this registration in the admin dashboard.
  `);
}