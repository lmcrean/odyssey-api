import React from 'react';
import styles from '../styles/modules/ProfileSkeleton.module.css';

const ProfileSkeleton = () => {
  return (
    <div className={styles.profileSkeleton}>
      <div className={styles.headerSkeleton}>
        <div className={styles.avatarSkeleton}></div>
        <div className={styles.infoSkeleton}>
          <div className={styles.nameSkeleton}></div>
          <div className={styles.statsSkeleton}>
            <div className={styles.statItemSkeleton}></div>
            <div className={styles.statItemSkeleton}></div>
            <div className={styles.statItemSkeleton}></div>
          </div>
        </div>
      </div>
      <div className={styles.bioSkeleton}></div>
      <div className={styles.postsSkeleton}>
        {[...Array(3)].map((_, index) => (
          <div key={index} className={styles.postSkeleton}></div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;