import React from 'react';
import styles from '../styles/modules/PopularProfilesSkeleton.module.css';

const PopularProfilesSkeleton = () => {
  return (
    <div className={styles.popularProfilesSkeleton}>
      <div className={styles.titleSkeleton}></div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className={styles.profileItemSkeleton}>
          <div className={styles.avatarSkeleton}></div>
          <div className={styles.nameSkeleton}></div>
        </div>
      ))}
    </div>
  );
};

export default PopularProfilesSkeleton;