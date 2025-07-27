'use client';

import styles from './page.module.css';

export default function Privacy() {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className={styles.lastUpdated}>Last updated: January 1, 2025</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>
              When you use JobMatching, we may collect personal information that you voluntarily provide, including:
            </p>
            <ul>
              <li>Name and contact information (email address, phone number)</li>
              <li>Professional information (resume, work experience, skills)</li>
              <li>Account credentials and preferences</li>
              <li>Communication history with our platform</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>
              We automatically collect certain information when you use our platform:
            </p>
            <ul>
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Usage patterns and interaction data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve our job matching services</li>
              <li>Match you with relevant job opportunities</li>
              <li>Communicate with you about our services</li>
              <li>Send notifications about new job matches</li>
              <li>Analyze and improve platform performance</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Information Sharing</h2>
            <h3>With Employers</h3>
            <p>
              When you apply for jobs through our platform, we share relevant professional 
              information with potential employers, including your resume, skills, and experience.
            </p>

            <h3>Service Providers</h3>
            <p>
              We may share information with trusted third-party service providers who help us 
              operate our platform, such as hosting services, analytics providers, and communication tools.
            </p>

            <h3>Legal Requirements</h3>
            <p>
              We may disclose information when required by law, court order, or to protect our 
              rights and the safety of our users.
            </p>

            <h3>We Do Not Sell Your Data</h3>
            <p>
              JobMatching does not sell, rent, or trade your personal information to third parties 
              for marketing purposes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction:
            </p>
            <ul>
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure hosting infrastructure</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Your Rights and Choices</h2>
            <h3>Access and Control</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Access and review your personal information</li>
              <li>Update or correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Download your data in a portable format</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h3>Cookie Preferences</h3>
            <p>
              You can control cookie settings through your browser preferences. Note that 
              disabling certain cookies may affect platform functionality.
            </p>

            <h3>Communication Preferences</h3>
            <p>
              You can manage your email preferences and unsubscribe from promotional 
              communications at any time through your account settings.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services 
              and fulfill the purposes outlined in this policy:
            </p>
            <ul>
              <li>Active accounts: Information retained while account is active</li>
              <li>Inactive accounts: Information may be retained for up to 3 years</li>
              <li>Legal compliance: Some information may be retained longer as required by law</li>
              <li>Analytics data: Aggregated, anonymized data may be retained indefinitely</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Children's Privacy</h2>
            <p>
              JobMatching is not intended for use by children under 16 years of age. We do not 
              knowingly collect personal information from children under 16. If we become aware 
              that we have collected such information, we will take steps to delete it promptly.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. International Data Transfers</h2>
            <p>
              Your information may be processed and stored in countries other than your own. 
              We ensure that such transfers comply with applicable data protection laws and 
              implement appropriate safeguards.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              material changes by posting the new policy on our platform and updating the 
              "Last Updated" date. Your continued use of JobMatching after such changes 
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> <a href="mailto:recruiter@jytech.us">recruiter@jytech.us</a></p>
              <p><strong>Subject:</strong> Privacy Policy Inquiry</p>
            </div>
          </section>

          <div className={styles.summary}>
            <h2>Summary</h2>
            <p>
              JobMatching is committed to protecting your privacy. We collect information to provide 
              better job matching services, share it only when necessary for our services or as 
              required by law, and give you control over your data. We implement strong security 
              measures and are transparent about our practices.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h4>For Developers</h4>
              <a href="/docs/api" className={styles.footerLink}>
                API Documentation
              </a>
            </div>
            <div className={styles.footerSection}>
              <h4>Company</h4>
              <a href="/about" className={styles.footerLink}>About Us</a>
              <a href="/contact" className={styles.footerLink}>Contact</a>
            </div>
            <div className={styles.footerSection}>
              <h4>Support</h4>
              <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
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