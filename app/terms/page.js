'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function Terms() {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.subtitle}>
            Please read these terms carefully before using JobMatching services.
          </p>
          <p className={styles.lastUpdated}>Last updated: January 1, 2025</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using JobMatching ("the Platform"), you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Description of Service</h2>
            <p>
              JobMatching is a job matching platform that connects job seekers with employers. 
              We provide:
            </p>
            <ul>
              <li>Job listing and search functionality</li>
              <li>Employer registration and job posting services</li>
              <li>Career matching and recommendation services</li>
              <li>API access for developers</li>
              <li>Related career services and resources</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. User Accounts and Registration</h2>
            <h3>For Job Seekers</h3>
            <ul>
              <li>You may browse jobs without creating an account</li>
              <li>Some features may require registration</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must provide accurate and current information</li>
            </ul>

            <h3>For Employers</h3>
            <ul>
              <li>Employer registration requires review and approval</li>
              <li>You must be authorized to represent your company</li>
              <li>All job postings must be legitimate opportunities</li>
              <li>You agree to comply with employment laws</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Acceptable Use Policy</h2>
            <p>You agree not to use the Platform to:</p>
            <ul>
              <li>Post false, misleading, or fraudulent job listings</li>
              <li>Discriminate based on protected characteristics</li>
              <li>Spam or send unsolicited communications</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Upload malicious code or interfere with platform operation</li>
              <li>Harvest user data for unauthorized purposes</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Job Postings and Content</h2>
            <h3>Employer Responsibilities</h3>
            <ul>
              <li>Job postings must be accurate and for actual positions</li>
              <li>Salary ranges should be realistic and in good faith</li>
              <li>Equal opportunity employment practices must be followed</li>
              <li>Job descriptions must not contain discriminatory language</li>
            </ul>

            <h3>Content Moderation</h3>
            <ul>
              <li>We reserve the right to review and remove content</li>
              <li>Content that violates these terms may be removed without notice</li>
              <li>Repeated violations may result in account suspension</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our <Link href="/privacy">Privacy Policy</Link> 
              to understand how we collect, use, and protect your information.
            </p>
            <ul>
              <li>We comply with applicable data protection laws</li>
              <li>User data is used only for platform functionality</li>
              <li>We do not sell personal information to third parties</li>
              <li>You have rights regarding your personal data</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Intellectual Property</h2>
            <h3>Platform Content</h3>
            <ul>
              <li>JobMatching owns all platform design, code, and features</li>
              <li>Our trademarks and logos are protected</li>
              <li>You may not copy or reproduce platform elements</li>
            </ul>

            <h3>User Content</h3>
            <ul>
              <li>You retain ownership of content you submit</li>
              <li>You grant us license to use submitted content for platform operation</li>
              <li>You warrant that you have rights to submitted content</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Payment and Fees</h2>
            <p>
              Currently, JobMatching is free for job seekers. For employers:
            </p>
            <ul>
              <li>Basic job posting may be free or paid based on plan</li>
              <li>Premium features may require payment</li>
              <li>All fees will be clearly disclosed before charging</li>
              <li>Refund policies will be provided with paid services</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>9. Disclaimers and Limitations</h2>
            <h3>Service Availability</h3>
            <ul>
              <li>Platform is provided "as is" without warranties</li>
              <li>We do not guarantee continuous service availability</li>
              <li>We may modify or discontinue features with notice</li>
            </ul>

            <h3>Job Matching</h3>
            <ul>
              <li>We do not guarantee job placement or hiring outcomes</li>
              <li>Employment decisions are solely between employers and candidates</li>
              <li>We are not responsible for employer-candidate interactions</li>
            </ul>

            <h3>Limitation of Liability</h3>
            <p>
              JobMatching's liability is limited to the maximum extent permitted by law. 
              We are not liable for indirect, incidental, or consequential damages.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Termination</h2>
            <p>
              Either party may terminate these terms at any time:
            </p>
            <ul>
              <li>You may stop using the platform at any time</li>
              <li>We may suspend accounts for terms violations</li>
              <li>Upon termination, certain provisions survive (privacy, intellectual property)</li>
              <li>Account data may be retained per our privacy policy</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>11. Governing Law</h2>
            <p>
              These terms are governed by the laws of the jurisdiction where JobMatching operates. 
              Disputes will be resolved through binding arbitration or in appropriate courts.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Changes to Terms</h2>
            <p>
              We may modify these terms from time to time. We will notify users of material changes:
            </p>
            <ul>
              <li>Updated terms will be posted on this page</li>
              <li>The "Last Updated" date will be revised</li>
              <li>Continued use constitutes acceptance of new terms</li>
              <li>Significant changes may require explicit consent</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>13. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> <a href="mailto:recruiter@jytech.us">recruiter@jytech.us</a></p>
              <p><strong>Subject:</strong> Terms of Service Inquiry</p>
            </div>
          </section>

          <div className={styles.summary}>
            <h2>Summary</h2>
            <p>
              These terms ensure fair use of JobMatching for all users. By using our platform, 
              you agree to use it responsibly, respect other users, and comply with applicable laws. 
              We're committed to providing a safe, effective job matching service while protecting 
              user rights and privacy.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h4>For Developers</h4>
              <Link href="/docs/api" className={styles.footerLink}>
                API Documentation
              </Link>
            </div>
            <div className={styles.footerSection}>
              <h4>Company</h4>
              <Link href="/about" className={styles.footerLink}>About Us</Link>
              <Link href="/contact" className={styles.footerLink}>Contact</Link>
            </div>
            <div className={styles.footerSection}>
              <h4>Support</h4>
              <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
              <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2025 JobMatching Platform</p>
          </div>
        </footer>
      </div>
    </div>
  );
}