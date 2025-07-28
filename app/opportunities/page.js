'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, Clock, DollarSign, Building, ChevronRight } from 'lucide-react';
import styles from './opportunities.module.css';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [opportunities, searchTerm, selectedCategory, selectedType, selectedCompany]);

  const loadData = async () => {
    try {
      const [oppResponse, catResponse, compResponse] = await Promise.all([
        fetch('/api/opportunities'),
        fetch('/api/categories'),
        fetch('/api/companies')
      ]);

      const [oppData, catData, compData] = await Promise.all([
        oppResponse.json(),
        catResponse.json(),
        compResponse.json()
      ]);

      setOpportunities(oppData.opportunities || []);
      setCategories(catData || []);
      setCompanies(compData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...opportunities];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(opp =>
        opp.title.toLowerCase().includes(search) ||
        opp.company.toLowerCase().includes(search) ||
        opp.description.toLowerCase().includes(search) ||
        (opp.skills && opp.skills.some(skill => 
          skill.toLowerCase().includes(search)
        ))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(opp => opp.category === selectedCategory);
    }

    if (selectedType) {
      filtered = filtered.filter(opp => opp.type === selectedType);
    }

    if (selectedCompany) {
      filtered = filtered.filter(opp => opp.company === selectedCompany);
    }

    setFilteredOpportunities(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedType('');
    setSelectedCompany('');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'full-time': return '#28a745';
      case 'part-time': return '#17a2b8';
      case 'contract': return '#ffc107';
      case 'commission-based': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'tech': return '#007bff';
      case 'career': return '#28a745';
      case 'education': return '#fd7e14';
      case 'managers': return '#6f42c1';
      case 'non-tech': return '#20c997';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading opportunities...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>All Opportunities</h1>
          <p className={styles.subtitle}>
            Discover {opportunities.length} amazing job opportunities from top companies
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.filterSection}>
            <div className={styles.filterHeader}>
              <Filter size={20} />
              <span>Filters</span>
              {(searchTerm || selectedCategory || selectedType || selectedCompany) && (
                <button onClick={clearFilters} className={styles.clearBtn}>
                  Clear All
                </button>
              )}
            </div>

            <div className={styles.searchBox}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Job Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="commission-based">Commission Based</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Company</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Companies</option>
                {companies.map(company => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsCount}>
              Showing {filteredOpportunities.length} of {opportunities.length} opportunities
            </div>
          </div>

          <div className={styles.opportunitiesList}>
            {filteredOpportunities.map((opp) => (
              <div key={opp.id} className={styles.opportunityCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.titleSection}>
                    <h3 className={styles.jobTitle}>{opp.title}</h3>
                    <div className={styles.companyInfo}>
                      <Building size={16} />
                      <span>{opp.company}</span>
                    </div>
                  </div>
                  <div className={styles.badges}>
                    <span 
                      className={styles.typeBadge}
                      style={{ backgroundColor: getTypeColor(opp.type) }}
                    >
                      {opp.type}
                    </span>
                    <span 
                      className={styles.categoryBadge}
                      style={{ backgroundColor: getCategoryColor(opp.category) }}
                    >
                      {opp.category}
                    </span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.jobMeta}>
                    <div className={styles.metaItem}>
                      <MapPin size={16} />
                      <span>{opp.location}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Clock size={16} />
                      <span>{opp.experience}</span>
                    </div>
                    {opp.salaryRange && (
                      <div className={styles.metaItem}>
                        <DollarSign size={16} />
                        <span>{opp.salaryRange}</span>
                      </div>
                    )}
                  </div>

                  <p className={styles.description}>
                    {opp.description.length > 150 
                      ? opp.description.substring(0, 150) + '...' 
                      : opp.description
                    }
                  </p>

                  {opp.skills && opp.skills.length > 0 && (
                    <div className={styles.skills}>
                      {opp.skills.slice(0, 4).map((skill, index) => (
                        <span key={index} className={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                      {opp.skills.length > 4 && (
                        <span className={styles.skillMore}>
                          +{opp.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <a 
                    href={opp.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.applyBtn}
                  >
                    Apply Now
                    <ChevronRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredOpportunities.length === 0 && (
            <div className={styles.noResults}>
              <h3>No opportunities found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className={styles.resetBtn}>
                Reset Filters
              </button>
            </div>
          )}
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
  );
}