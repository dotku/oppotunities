'use client';

import styles from './page.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>About JobMatching</h1>
          <p className={styles.subtitle}>
            Revolutionizing how talent meets opportunity through intelligent matching technology
          </p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Our Mission</h2>
            <p>
              At JobMatching, we believe that finding the right job should be as simple as finding the right match. 
              Our platform leverages advanced algorithms and intelligent matching technology to connect talented 
              professionals with their ideal career opportunities.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What We Do</h2>
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🎯</div>
                <h3>Smart Matching</h3>
                <p>Our AI-powered algorithm analyzes skills, experience, and preferences to find perfect job matches.</p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🚀</div>
                <h3>Career Growth</h3>
                <p>We focus on long-term career development, not just filling positions, ensuring sustainable growth.</p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🤝</div>
                <h3>Quality Connections</h3>
                <p>We partner with top companies to provide opportunities that truly match your career aspirations.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Why Choose JobMatching?</h2>
            <div className={styles.benefits}>
              <div className={styles.benefit}>
                <h4>Intelligent Recommendations</h4>
                <p>Get personalized job recommendations based on your unique profile and career goals.</p>
              </div>
              <div className={styles.benefit}>
                <h4>Verified Opportunities</h4>
                <p>All job listings are verified and come from reputable companies actively hiring.</p>
              </div>
              <div className={styles.benefit}>
                <h4>Real-time Updates</h4>
                <p>Our platform is updated daily with fresh opportunities to keep you ahead of the competition.</p>
              </div>
              <div className={styles.benefit}>
                <h4>Career Support</h4>
                <p>Access to career resources, tips, and guidance throughout your job search journey.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Our Story</h2>
            <p>
              Founded with the vision of transforming the job search experience, JobMatching was born from the 
              frustration of traditional hiring processes. We recognized that both job seekers and employers 
              were struggling with inefficient matching, leading to missed opportunities and unfilled positions.
            </p>
            <p>
              Our team of experienced technologists and career experts came together to create a platform that 
              puts intelligence at the heart of job matching. By understanding what makes a great fit beyond 
              just keywords and requirements, we've built a system that creates meaningful connections.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Join Our Community</h2>
            <p>
              Whether you're a job seeker looking for your next opportunity or an employer seeking top talent, 
              JobMatching is here to make the process smoother, smarter, and more successful.
            </p>
            <div className={styles.ctaButtons}>
              <a href="/opportunities" className={styles.ctaButton}>
                Browse Jobs
              </a>
              <a href="/contact" className={styles.ctaButton}>
                Get in Touch
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}