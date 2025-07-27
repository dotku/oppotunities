'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Users } from 'lucide-react';
import styles from './page.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Get in touch with our team. We're here to help you succeed in your career journey.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <Mail className={styles.icon} />
              </div>
              <h3>Email Us</h3>
              <p>For recruitment inquiries and general questions</p>
              <a href="mailto:recruiter@jytech.us" className={styles.contactLink}>
                recruiter@jytech.us
              </a>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <Clock className={styles.icon} />
              </div>
              <h3>Response Time</h3>
              <p>We typically respond within</p>
              <span className={styles.highlight}>24 hours</span>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <Users className={styles.icon} />
              </div>
              <h3>Support Team</h3>
              <p>Dedicated recruitment specialists ready to help</p>
              <span className={styles.highlight}>Expert guidance</span>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>Send us a Message</h2>
            
            {submitted ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className={styles.newMessageBtn}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="job-inquiry">Job Inquiry</option>
                    <option value="recruitment">Recruitment Services</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="general">General Question</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className={styles.spinner}></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className={styles.additionalInfo}>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h4>How quickly can I expect a response?</h4>
              <p>We respond to all inquiries within 24 hours during business days.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>Do you offer personalized career guidance?</h4>
              <p>Yes, our recruitment specialists provide personalized career advice and job matching services.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>Is JobMatching free for job seekers?</h4>
              <p>Absolutely! Our platform is completely free for job seekers to use and explore opportunities.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>Can employers post jobs directly?</h4>
              <p>Yes, we offer employer services. Contact us at recruiter@jytech.us for partnership opportunities.</p>
            </div>
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