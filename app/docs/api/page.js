'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function ApiDocs() {
  const [stats, setStats] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTest, setActiveTest] = useState(null);

  useEffect(() => {
    loadStats();
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

  const testEndpoint = async (endpoint, testId) => {
    setLoading(true);
    setActiveTest(testId);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setOpportunities(data.opportunities || []);
    } catch (error) {
      console.error('Error testing endpoint:', error);
      setOpportunities([]);
    }
    setLoading(false);
  };

  const searchOpportunities = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setActiveTest('search');
    try {
      const response = await fetch(`/api/opportunities?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setOpportunities(data.opportunities || []);
    } catch (error) {
      console.error('Error searching opportunities:', error);
      setOpportunities([]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchOpportunities();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>🚀 JobMatching API Documentation</h1>
          <p className={styles.subtitle}>Developer documentation and testing interface for the JobMatching API</p>
        </div>
        
        {stats && (
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.totalOpportunities}</div>
              <div className={styles.statLabel}>Total Opportunities</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.totalCategories}</div>
              <div className={styles.statLabel}>Categories</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.totalCompanies}</div>
              <div className={styles.statLabel}>Companies</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.totalLocations}</div>
              <div className={styles.statLabel}>Locations</div>
            </div>
          </div>
        )}

        <div className={styles.searchSection}>
          <h2>🔍 Test Search Functionality</h2>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search by title, company, description, category, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.searchInput}
            />
            <button onClick={searchOpportunities} className={styles.searchBtn}>
              Search
            </button>
          </div>
        </div>

        <div className={styles.endpoints}>
          <h2>📋 Available API Endpoints</h2>
          
          <div className={styles.endpoint}>
            <h3><span className={styles.method}>GET</span> Get All Opportunities</h3>
            <div className={styles.url}>/api/opportunities</div>
            <p className={styles.description}>Retrieve all job opportunities with optional filtering parameters.</p>
            <button 
              className={styles.testBtn} 
              onClick={() => testEndpoint('/api/opportunities', 'all')}
              disabled={loading}
            >
              {loading && activeTest === 'all' ? 'Loading...' : 'Test'}
            </button>
          </div>

          <div className={styles.endpoint}>
            <h3><span className={styles.method}>GET</span> Get Statistics</h3>
            <div className={styles.url}>/api/stats</div>
            <p className={styles.description}>Get aggregated statistics about opportunities, categories, companies, and locations.</p>
            <button 
              className={styles.testBtn} 
              onClick={() => testEndpoint('/api/stats', 'stats')}
              disabled={loading}
            >
              {loading && activeTest === 'stats' ? 'Loading...' : 'Test'}
            </button>
          </div>

          <div className={styles.endpoint}>
            <h4>Filter Examples:</h4>
            <div className={styles.filterExample}>
              <div className={styles.url}>/api/opportunities?category=tech</div>
              <p className={styles.description}>Filter by category (tech, healthcare, finance, etc.)</p>
              <button 
                className={styles.testBtn} 
                onClick={() => testEndpoint('/api/opportunities?category=tech', 'tech')}
                disabled={loading}
              >
                {loading && activeTest === 'tech' ? 'Loading...' : 'Test'}
              </button>
            </div>

            <div className={styles.filterExample}>
              <div className={styles.url}>/api/opportunities?category=tech&type=contract</div>
              <p className={styles.description}>Combine multiple filters (category + employment type)</p>
              <button 
                className={styles.testBtn} 
                onClick={() => testEndpoint('/api/opportunities?category=tech&type=contract', 'filtered')}
                disabled={loading}
              >
                {loading && activeTest === 'filtered' ? 'Loading...' : 'Test'}
              </button>
            </div>
          </div>

          <div className={styles.parameters}>
            <h3>Query Parameters</h3>
            <ul>
              <li><code>category</code> - Filter by job category</li>
              <li><code>subcategory</code> - Filter by job subcategory</li>
              <li><code>type</code> - Filter by employment type (full-time, part-time, contract)</li>
              <li><code>experience</code> - Filter by experience level</li>
              <li><code>salaryMin</code> - Minimum salary filter</li>
              <li><code>salaryMax</code> - Maximum salary filter</li>
              <li><code>search</code> - Search across title, company, description, etc.</li>
            </ul>
          </div>
        </div>

        {opportunities.length > 0 && (
          <div className={styles.results}>
            <h3>API Response ({opportunities.length} opportunities)</h3>
            <div className={styles.opportunitiesList}>
              {opportunities.slice(0, 5).map((opp, index) => (
                <div key={index} className={styles.opportunityCard}>
                  <h4>{opp.title}</h4>
                  <p><strong>Company:</strong> {opp.company}</p>
                  <p><strong>Location:</strong> {opp.location}</p>
                  <p><strong>Category:</strong> {opp.category} - {opp.subcategory}</p>
                  <p><strong>Type:</strong> {opp.type}</p>
                  <p><strong>Experience:</strong> {opp.experience}</p>
                  {opp.salary && <p><strong>Salary:</strong> {opp.salary}</p>}
                  <p className={styles.description}>{opp.description}</p>
                </div>
              ))}
              {opportunities.length > 5 && (
                <p className={styles.moreResults}>
                  ... and {opportunities.length - 5} more results (showing first 5 for demo)
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
