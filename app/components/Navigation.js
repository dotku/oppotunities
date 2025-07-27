'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Briefcase, FileText, BarChart3 } from 'lucide-react';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <Briefcase size={24} />
          <span>JobMatching</span>
        </Link>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link href="/opportunities" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Browse Jobs
          </Link>
          <Link href="/docs/api" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            <FileText size={16} />
            API Docs
          </Link>
          <a 
            href="/api/stats" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.navLink}
            onClick={() => setIsMenuOpen(false)}
          >
            <BarChart3 size={16} />
            API Stats
          </a>
        </div>

        <button 
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}