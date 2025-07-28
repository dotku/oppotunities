'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadStats();
    loadFeaturedOpportunities();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadFeaturedOpportunities = async () => {
    try {
      const response = await fetch('/api/opportunities');
      const data = await response.json();
      setOpportunities(data.opportunities.slice(0, 6)); // Show first 6 as featured
    } catch (error) {
      console.error('Error loading opportunities:', error);
    }
  };

  const searchOpportunities = async () => {
    if (!searchTerm.trim() && !selectedCategory) return;
    
    setLoading(true);
    
    // Redirect to search page
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.append('q', searchTerm);
    }
    if (selectedCategory) {
      params.append('category', selectedCategory);
    }
    
    window.location.href = `/search?${params.toString()}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchOpportunities();
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>JobMatching - Find Your Perfect Match</h1>
          <p className={styles.heroSubtitle}>
            Intelligent job matching that connects the right talent with the right opportunities. 
            Powered by smart algorithms to find your perfect career match.
          </p>
          
          <div className={styles.searchSection}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search jobs by title, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.searchInput}
              />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.categorySelect}
              >
                <option value="">All Categories</option>
                <option value="tech">Technology</option>
                <option value="career">Career</option>
                <option value="education">Education</option>
                <option value="managers">Management</option>
                <option value="non-tech">Non-Technical</option>
              </select>
              <button 
                onClick={searchOpportunities} 
                className={styles.searchBtn}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Jobs'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className={styles.statsSection}>
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.totalOpportunities}+</div>
              <div className={styles.statLabel}>Active Jobs</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.totalCompanies}+</div>
              <div className={styles.statLabel}>Companies Hiring</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.totalCategories}+</div>
              <div className={styles.statLabel}>Job Categories</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>Remote+</div>
              <div className={styles.statLabel}>Locations</div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Opportunities */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Featured Opportunities</h2>
          <div className={styles.opportunitiesGrid}>
            {opportunities.map((opp, index) => (
              <div key={index} className={styles.opportunityCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.jobTitle}>{opp.title}</h3>
                  <div className={styles.jobType}>{opp.type}</div>
                </div>
                <div className={styles.companyInfo}>
                  <p className={styles.company}>{opp.company}</p>
                  <p className={styles.location}>📍 {opp.location}</p>
                </div>
                <div className={styles.jobDetails}>
                  <span className={styles.category}>{opp.category}</span>
                  <span className={styles.experience}>{opp.experience}</span>
                </div>
                {opp.salaryRange && <div className={styles.salary}>💰 {opp.salaryRange}</div>}
                <p className={styles.jobDescription}>
                  {opp.description.length > 120 
                    ? opp.description.substring(0, 120) + '...' 
                    : opp.description
                  }
                </p>
                <button className={styles.applyBtn}>View Details</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Sections */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaIcon}>👤</div>
            <h3>For Job Seekers</h3>
            <p>Discover thousands of opportunities from top companies. Create your profile and get matched with your ideal role.</p>
            <Link href="/opportunities">
              <button className={styles.ctaBtn}>Browse Jobs</button>
            </Link>
          </div>
          <div className={styles.ctaCard}>
            <div className={styles.ctaIcon}>🏢</div>
            <h3>For Employers</h3>
            <p>Find the perfect candidates for your team. Register your company to start posting jobs.</p>
            <Link href="/employer/register">
              <button className={styles.ctaBtn}>Register Company</button>
            </Link>
          </div>
        </div>
      </section>

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
