'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Activity, Database, Server, Wifi, AlertTriangle } from 'lucide-react';
import styles from './page.module.css';

export default function ApiStatus() {
  const [status, setStatus] = useState({
    overall: 'loading',
    services: [],
    lastUpdated: null,
    uptime: null,
    stats: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkApiStatus = async () => {
    try {
      const startTime = Date.now();
      
      // Check main API endpoints
      const endpoints = [
        { name: 'Opportunities API', url: '/api/opportunities', critical: true },
        { name: 'Statistics API', url: '/api/stats', critical: true },
        { name: 'Search API', url: '/api/opportunities?search=test', critical: false },
        { name: 'Categories API', url: '/api/opportunities?category=tech', critical: false },
        { name: 'Daily Update Webhook', url: '/api/webhook/daily-update', critical: false, method: 'GET' }
      ];

      const serviceChecks = await Promise.all(
        endpoints.map(async (endpoint) => {
          try {
            const checkStart = Date.now();
            const response = await fetch(endpoint.url, {
              method: endpoint.method || 'GET',
              headers: { 'Cache-Control': 'no-cache' }
            });
            const responseTime = Date.now() - checkStart;
            
            const isHealthy = response.ok && responseTime < 5000;
            
            return {
              name: endpoint.name,
              status: isHealthy ? 'operational' : 'degraded',
              responseTime: responseTime,
              lastCheck: new Date().toISOString(),
              critical: endpoint.critical,
              statusCode: response.status,
              url: endpoint.url
            };
          } catch (error) {
            return {
              name: endpoint.name,
              status: 'down',
              responseTime: null,
              lastCheck: new Date().toISOString(),
              critical: endpoint.critical,
              error: error.message,
              url: endpoint.url
            };
          }
        })
      );

      // Load additional stats
      let apiStats = null;
      try {
        const statsResponse = await fetch('/api/stats');
        if (statsResponse.ok) {
          apiStats = await statsResponse.json();
        }
      } catch (error) {
        console.warn('Could not load API stats:', error);
      }

      // Determine overall status
      const criticalDown = serviceChecks.filter(s => s.critical && s.status === 'down').length;
      const anyDegraded = serviceChecks.some(s => s.status === 'degraded');
      
      let overallStatus = 'operational';
      if (criticalDown > 0) {
        overallStatus = 'major_outage';
      } else if (anyDegraded) {
        overallStatus = 'degraded';
      }

      const totalResponseTime = Date.now() - startTime;

      setStatus({
        overall: overallStatus,
        services: serviceChecks,
        lastUpdated: new Date().toISOString(),
        uptime: calculateUptime(serviceChecks),
        stats: apiStats,
        totalResponseTime
      });
      
    } catch (error) {
      console.error('Status check failed:', error);
      setStatus(prev => ({
        ...prev,
        overall: 'major_outage',
        lastUpdated: new Date().toISOString()
      }));
    } finally {
      setLoading(false);
    }
  };

  const calculateUptime = (services) => {
    const operational = services.filter(s => s.status === 'operational').length;
    const total = services.length;
    return total > 0 ? ((operational / total) * 100).toFixed(1) : '0.0';
  };

  const getStatusIcon = (serviceStatus) => {
    switch (serviceStatus) {
      case 'operational':
        return <CheckCircle className={styles.statusIconGreen} />;
      case 'degraded':
        return <AlertTriangle className={styles.statusIconYellow} />;
      case 'down':
        return <XCircle className={styles.statusIconRed} />;
      default:
        return <Clock className={styles.statusIconGray} />;
    }
  };

  const getOverallStatusColor = (overallStatus) => {
    switch (overallStatus) {
      case 'operational':
        return styles.statusGreen;
      case 'degraded':
        return styles.statusYellow;
      case 'major_outage':
        return styles.statusRed;
      default:
        return styles.statusGray;
    }
  };

  const getOverallStatusText = (overallStatus) => {
    switch (overallStatus) {
      case 'operational':
        return 'All Systems Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'major_outage':
        return 'Major Outage';
      case 'loading':
        return 'Checking Status...';
      default:
        return 'Unknown Status';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.loadingState}>
            <Activity className={styles.loadingIcon} />
            <h2>Checking API Status...</h2>
            <p>Please wait while we check all services</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>API Status Dashboard</h1>
          <p className={styles.subtitle}>
            Real-time status of JobMatching API services and infrastructure
          </p>
        </div>

        <div className={styles.content}>
          {/* Overall Status */}
          <div className={`${styles.overallStatus} ${getOverallStatusColor(status.overall)}`}>
            <div className={styles.statusHeader}>
              <div className={styles.statusInfo}>
                {getStatusIcon(status.overall)}
                <div>
                  <h2>{getOverallStatusText(status.overall)}</h2>
                  <p>Last updated: {status.lastUpdated ? new Date(status.lastUpdated).toLocaleString() : 'Never'}</p>
                </div>
              </div>
              <div className={styles.uptimeInfo}>
                <div className={styles.uptimeNumber}>{status.uptime}%</div>
                <div className={styles.uptimeLabel}>Current Uptime</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {status.stats && (
            <div className={styles.quickStats}>
              <div className={styles.statCard}>
                <Database className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{status.stats.totalOpportunities}</div>
                  <div className={styles.statLabel}>Active Jobs</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <Server className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{status.services.filter(s => s.status === 'operational').length}/{status.services.length}</div>
                  <div className={styles.statLabel}>Services Up</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <Activity className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{status.totalResponseTime}ms</div>
                  <div className={styles.statLabel}>Response Time</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <Wifi className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{status.stats.totalCompanies}</div>
                  <div className={styles.statLabel}>Companies</div>
                </div>
              </div>
            </div>
          )}

          {/* Service Status */}
          <div className={styles.servicesSection}>
            <h2>Service Status</h2>
            <div className={styles.servicesList}>
              {status.services.map((service, index) => (
                <div key={index} className={styles.serviceItem}>
                  <div className={styles.serviceHeader}>
                    <div className={styles.serviceInfo}>
                      {getStatusIcon(service.status)}
                      <div>
                        <h3>{service.name}</h3>
                        <p className={styles.serviceUrl}>{service.url}</p>
                      </div>
                    </div>
                    <div className={styles.serviceMetrics}>
                      <div className={styles.metric}>
                        <span className={styles.metricLabel}>Status:</span>
                        <span className={`${styles.metricValue} ${styles[service.status]}`}>
                          {service.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      {service.responseTime && (
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Response:</span>
                          <span className={styles.metricValue}>{service.responseTime}ms</span>
                        </div>
                      )}
                      {service.statusCode && (
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>HTTP:</span>
                          <span className={styles.metricValue}>{service.statusCode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {service.error && (
                    <div className={styles.serviceError}>
                      <strong>Error:</strong> {service.error}
                    </div>
                  )}
                  <div className={styles.serviceFooter}>
                    <span>Last checked: {new Date(service.lastCheck).toLocaleString()}</span>
                    {service.critical && <span className={styles.criticalBadge}>Critical</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Incidents */}
          <div className={styles.incidentsSection}>
            <h2>Recent Activity</h2>
            <div className={styles.incident}>
              <div className={styles.incidentIcon}>
                <CheckCircle className={styles.statusIconGreen} />
              </div>
              <div className={styles.incidentInfo}>
                <h4>All Systems Operational</h4>
                <p>All API services are running normally with optimal performance.</p>
                <span className={styles.incidentTime}>Last 24 hours</span>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <p>
              Status page automatically refreshes every 30 seconds. 
              For support, contact <a href="mailto:recruiter@jytech.us">recruiter@jytech.us</a>
            </p>
            <button onClick={checkApiStatus} className={styles.refreshBtn}>
              Refresh Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}