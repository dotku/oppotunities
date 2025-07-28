"use client";

import { useState } from "react";
import {
  Building,
  Users,
  MapPin,
  Mail,
  Phone,
  Globe,
  FileText,
  Send,
  CheckCircle,
} from "lucide-react";
import styles from "./page.module.css";

export default function EmployerRegister() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    companySize: "",
    location: "",
    description: "",
    jobPostingNeeds: "",
    urgency: "",
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/employer/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          companyName: "",
          contactName: "",
          email: "",
          phone: "",
          website: "",
          industry: "",
          companySize: "",
          location: "",
          description: "",
          jobPostingNeeds: "",
          urgency: "",
          agreedToTerms: false,
        });
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        "There was an error submitting your registration. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Employer Registration</h1>
          <p className={styles.subtitle}>
            Join JobMatching to connect with top talent. Submit your company
            details and we'll contact you to enable job posting features.
          </p>
        </div>

        <div className={styles.content}>
          {submitted ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>
                <CheckCircle size={64} />
              </div>
              <h2>Registration Submitted Successfully!</h2>
              <p>
                Thank you for your interest in JobMatching. We've received your
                employer registration and our team will review your application
                within 24-48 hours.
              </p>
              <p>
                You'll receive an email at{" "}
                <strong>{formData.email || "your registered email"}</strong>{" "}
                with next steps and account setup instructions.
              </p>
              <div className={styles.nextSteps}>
                <h3>What happens next?</h3>
                <ul>
                  <li>Our team reviews your company information</li>
                  <li>We'll send you account setup instructions</li>
                  <li>You'll get access to our employer dashboard</li>
                  <li>Start posting jobs and finding great candidates!</li>
                </ul>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className={styles.newRegistrationBtn}
              >
                Register Another Company
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.registrationForm}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Building size={24} />
                  Company Information
                </h2>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="companyName">Company Name *</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      placeholder="Your company name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="industry">Industry *</label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select industry</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                      <option value="consulting">Consulting</option>
                      <option value="startup">Startup</option>
                      <option value="non-profit">Non-Profit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="companySize">Company Size *</label>
                    <select
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select company size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="location">Company Location *</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      placeholder="City, State/Country"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="website">Company Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.yourcompany.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description">Company Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Brief description of your company, what you do, and your mission..."
                  ></textarea>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Users size={24} />
                  Contact Information
                </h2>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="contactName">Contact Person *</label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      placeholder="Full name of primary contact"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Business Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="contact@yourcompany.com"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <FileText size={24} />
                  Hiring Needs
                </h2>

                <div className={styles.formGroup}>
                  <label htmlFor="jobPostingNeeds">
                    What type of positions are you looking to fill? *
                  </label>
                  <textarea
                    id="jobPostingNeeds"
                    name="jobPostingNeeds"
                    value={formData.jobPostingNeeds}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="Describe the roles you're hiring for (e.g., Software Engineers, Sales Representatives, etc.)"
                  ></textarea>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="urgency">Hiring Timeline *</label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select timeline</option>
                    <option value="immediate">
                      Immediate (within 2 weeks)
                    </option>
                    <option value="short-term">Short-term (1-2 months)</option>
                    <option value="medium-term">
                      Medium-term (2-6 months)
                    </option>
                    <option value="long-term">Long-term (6+ months)</option>
                    <option value="ongoing">Ongoing hiring needs</option>
                  </select>
                </div>
              </div>

              <div className={styles.termsSection}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
                    required
                  />
                  <span>
                    I agree to the{" "}
                    <a href="/privacy" target="_blank">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="/terms" target="_blank">
                      Terms of Service
                    </a>
                    , and confirm that the information provided is accurate. I
                    understand that JobMatching will review my application and
                    contact me with next steps.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting || !formData.agreedToTerms}
              >
                {isSubmitting ? (
                  <>
                    <div className={styles.spinner}></div>
                    Submitting Registration...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit Registration
                  </>
                )}
              </button>
            </form>
          )}
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
            <a href="/terms" className={styles.footerLink}>Terms of Service</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 JobMatching Platform</p>
        </div>
      </footer>
    </div>
  );
}
