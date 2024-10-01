import React from 'react';
import styles from '../styles/modules/Logo.module.css';  // Adjust the import path as needed

const Logo = () => {
  return (
    <div className={styles.logoContainer}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" className={styles.logoBg} />
        <g transform="rotate(-56, 50, 50)" className={styles.logoContent}>
          {/* Top-left quadrant */}
          <path d="M50 50 L14.64 14.64 L50 25 Z" className={styles.logoPrimary} />
          <path d="M50 50 L50 25 L85.36 14.64 Z" className={styles.logoSecondary} />
          
          {/* Top-right quadrant */}
          <path d="M50 50 L85.36 14.64 L75 50 Z" className={styles.logoPrimary} />
          <path d="M50 50 L75 50 L85.36 85.36 Z" className={styles.logoSecondary} />
          
          {/* Bottom-right quadrant */}
          <path d="M50 50 L85.36 85.36 L50 75 Z" className={styles.logoPrimary} />
          <path d="M50 50 L50 75 L14.64 85.36 Z" className={styles.logoSecondary} />
          
          {/* Bottom-left quadrant */}
          <path d="M50 50 L14.64 85.36 L25 50 Z" className={styles.logoPrimary} />
          <path d="M50 50 L25 50 L14.64 14.64 Z" className={styles.logoSecondary} />
        </g>
      </svg>
    </div>
  );
};

export default Logo;