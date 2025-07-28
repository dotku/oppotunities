'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  ChevronRight, 
  Lightbulb,
  TrendingUp,
  Heart,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import styles from './search.module.css';

// Separate component that uses useSearchParams
function SearchContent() {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalResults, setTotalResults] = useState(0);

  // Extract search parameters
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const type = searchParams.get('type') || '';
  const company = searchParams.get('company') || '';

  useEffect(() => {
    if (query || category || type || company) {
      performSearch();
    }
    loadPopularSearches();
    setSearchTerm(query);
  }, [query, category, type, company]);

  const performSearch = async () => {
    setLoading(true);
    try {
      // Build search URL
      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (category) params.append('category', category);
      if (type) params.append('type', type);
      if (company) params.append('company', company);

      const response = await fetch(`/api/opportunities?${params.toString()}`);
      const data = await response.json();
      
      setSearchResults(data.opportunities || []);
      setTotalResults(data.total || 0);

      // If no results, get recommendations
      if (data.opportunities.length === 0) {
        await loadRecommendations();
      } else {
        await loadRelatedJobs(data.opportunities[0]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      await loadRecommendations();
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      // Get popular categories and recent jobs as recommendations
      const [categoriesResponse, allJobsResponse] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/opportunities')
      ]);

      const categories = await categoriesResponse.json();
      const allJobs = await allJobsResponse.json();

      // Get trending jobs (mix of different categories)
      const trending = allJobs.opportunities
        .filter(job => ['tech', 'career'].includes(job.category))
        .slice(0, 6);

      setRecommendations(trending);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const loadRelatedJobs = async (baseJob) => {
    try {
      const response = await fetch(`/api/opportunities?category=${baseJob.category}`);
      const data = await response.json();
      
      // Filter out the current search results and get related jobs
      const related = data.opportunities
        .filter(job => !searchResults.find(result => result.id === job.id))
        .slice(0, 4);
      
      setRelatedJobs(related);
    } catch (error) {
      console.error('Error loading related jobs:', error);
    }
  };

  const loadPopularSearches = () => {
    // Popular search terms based on our data
    const popular = [
      { term: 'python', count: 4 },
      { term: 'javascript', count: 3 },
      { term: 'data science', count: 5 },
      { term: 'remote', count: 20 },
      { term: 'senior', count: 8 },
      { term: 'machine learning', count: 3 },
      { term: 'full-time', count: 15 },
      { term: 'contract', count: 12 }
    ];
    setPopularSearches(popular);
  };

  const getSearchSuggestions = () => {
    const suggestions = [];
    
    if (query) {
      // Suggest related terms
      if (query.toLowerCase().includes('python')) {
        suggestions.push('javascript', 'data science', 'machine learning');
      } else if (query.toLowerCase().includes('javascript')) {
        suggestions.push('python', 'react', 'node.js');
      } else if (query.toLowerCase().includes('data')) {
        suggestions.push('analytics', 'python', 'statistics');
      } else {
        suggestions.push('python', 'javascript', 'remote');
      }
    } else {
      suggestions.push('python', 'javascript', 'data science', 'remote');
    }
    
    return suggestions.slice(0, 4);
  };

  const handleSuggestionClick = (suggestion) => {
    const params = new URLSearchParams();
    params.append('q', suggestion);
    window.location.href = `/search?${params.toString()}`;
  };

  const getSearchTitle = () => {
    if (query && category) return `"${query}" in ${category}`;
    if (query) return `"${query}"`;
    if (category) return `${category} jobs`;
    if (company) return `${company} jobs`;
    if (type) return `${type} positions`;
    return 'All opportunities';
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
        <p>Searching for opportunities...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <Search size={28} />
            Search Results for {getSearchTitle()}
          </h1>
          <p className={styles.subtitle}>
            {totalResults > 0 
              ? `Found ${totalResults} ${totalResults === 1 ? 'opportunity' : 'opportunities'}`
              : 'No exact matches found, but here are some recommendations'
            }
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {/* Search Results */}
        {searchResults.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <TrendingUp size={20} />
              Search Results ({totalResults})
            </h2>
            <div className={styles.jobsList}>
              {searchResults.map((job) => (
                <div key={job.id} className={styles.jobCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.titleSection}>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      <div className={styles.companyInfo}>
                        <Building size={16} />
                        <span>{job.company}</span>
                      </div>
                    </div>
                    <div className={styles.badges}>
                      <span 
                        className={styles.typeBadge}
                        style={{ backgroundColor: getTypeColor(job.type) }}
                      >
                        {job.type}
                      </span>
                      <span 
                        className={styles.categoryBadge}
                        style={{ backgroundColor: getCategoryColor(job.category) }}
                      >
                        {job.category}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.jobMeta}>
                      <div className={styles.metaItem}>
                        <MapPin size={16} />
                        <span>{job.location}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <Clock size={16} />
                        <span>{job.experience}</span>
                      </div>
                      {job.salaryRange && (
                        <div className={styles.metaItem}>
                          <DollarSign size={16} />
                          <span>{job.salaryRange}</span>
                        </div>
                      )}
                    </div>

                    <p className={styles.description}>
                      {job.description.length > 150 
                        ? job.description.substring(0, 150) + '...' 
                        : job.description
                      }
                    </p>

                    {job.skills && job.skills.length > 0 && (
                      <div className={styles.skills}>
                        {job.skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className={styles.skillTag}>
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className={styles.skillMore}>
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <a 
                      href={job.url} 
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
          </section>
        ) : (
          /* No Results Found */
          <section className={styles.section}>
            <div className={styles.noResults}>
              <AlertCircle size={48} className={styles.noResultsIcon} />
              <h2>No exact matches found</h2>
              <p>We couldn't find any opportunities matching your search criteria.</p>
              <div className={styles.suggestions}>
                <h3>Try searching for:</h3>
                <div className={styles.suggestionTags}>
                  {getSearchSuggestions().map((suggestion, index) => (
                    <button
                      key={index}
                      className={styles.suggestionTag}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Heart size={20} />
              Related Opportunities
            </h2>
            <div className={styles.relatedGrid}>
              {relatedJobs.map((job) => (
                <div key={job.id} className={styles.relatedCard}>
                  <h4 className={styles.relatedTitle}>{job.title}</h4>
                  <p className={styles.relatedCompany}>{job.company}</p>
                  <p className={styles.relatedLocation}>{job.location}</p>
                  <div className={styles.relatedSkills}>
                    {job.skills?.slice(0, 3).map((skill, index) => (
                      <span key={index} className={styles.relatedSkill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Link 
                    href={`/search?q=${encodeURIComponent(job.title)}`}
                    className={styles.relatedLink}
                  >
                    View Similar
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Sparkles size={20} />
              Recommended for You
            </h2>
            <div className={styles.recommendationsGrid}>
              {recommendations.map((job) => (
                <div key={job.id} className={styles.recommendationCard}>
                  <div className={styles.recHeader}>
                    <h4 className={styles.recTitle}>{job.title}</h4>
                    <span 
                      className={styles.recCategory}
                      style={{ backgroundColor: getCategoryColor(job.category) }}
                    >
                      {job.category}
                    </span>
                  </div>
                  <p className={styles.recCompany}>{job.company}</p>
                  <p className={styles.recSalary}>{job.salaryRange}</p>
                  <Link 
                    href={`/search?q=${encodeURIComponent(job.title)}`}
                    className={styles.recLink}
                  >
                    Learn More
                    <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Searches */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Lightbulb size={20} />
            Popular Searches
          </h2>
          <div className={styles.popularSearches}>
            {popularSearches.map((search, index) => (
              <button
                key={index}
                className={styles.popularSearch}
                onClick={() => handleSuggestionClick(search.term)}
              >
                <span className={styles.searchTerm}>{search.term}</span>
                <span className={styles.searchCount}>{search.count} jobs</span>
              </button>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.quickActions}>
            <Link href="/opportunities" className={styles.actionCard}>
              <Filter size={24} />
              <h3>Browse All Jobs</h3>
              <p>Explore all available opportunities</p>
            </Link>
            <Link href="/opportunities?category=tech" className={styles.actionCard}>
              <TrendingUp size={24} />
              <h3>Tech Jobs</h3>
              <p>Latest technology positions</p>
            </Link>
            <Link href="/opportunities?type=remote" className={styles.actionCard}>
              <MapPin size={24} />
              <h3>Remote Work</h3>
              <p>Work from anywhere opportunities</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function SearchLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.loadingState}>
          <Search className={styles.loadingIcon} />
          <h2>Loading search results...</h2>
          <p>Please wait while we find the best opportunities for you</p>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}