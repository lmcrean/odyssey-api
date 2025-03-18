import React from 'react';
import styles from '../styles/modules/Logo.module.css';  // Adjust the import path as needed

const Logo = () => {
  return (
    <div className={styles.logoContainer}>
      <svg class="logo-container" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path d="
            M 20 0
            H 80
            Q 100 0 100 20
            V 80
            Q 100 100 80 100
            H 20
            Q 0 100 0 80
            V 20
            Q 0 0 20 0
            Z" fill="#0A1025" />

      <g transform="rotate(-16, 50, 50) scale(0.7) translate(10,5)">
          <path d="M50 50 L14.64 14.64 L50 25 Z" fill="#2B303E" />
          <path d="M50 50 L85.36 14.64 L75 50 Z" fill="#2B303E" />
          <path d="M50 50 L85.36 85.36 L50 75 Z" fill="#2B303E" />
          <path d="M50 50 L25 50 L14.64 85.36 Z" fill="#2B303E" />
        </g>

        <g transform="rotate(-16, 50, 50) scale(-0.7, 0.7) translate(-110,5)">
          <path d="M50 50 L14.64 14.64 L50 25 Z" fill="#DFD3E9" />
          <path d="M50 50 L85.36 14.64 L75 50 Z" fill="#DFD3E9" />
          <path d="M50 50 L85.36 85.36 L50 75 Z" fill="#DFD3E9" />
          <path d="M50 50 L25 50 L14.64 85.36 Z" fill="#DFD3E9" />
        </g>
      </svg>
    </div>
  );
};

export default Logo;