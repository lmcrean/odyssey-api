import React from 'react';
import styles from '../styles/modules/PostSkeleton.module.css';

const PostSkeleton = () => {
  return (
    <div className={styles.postSkeleton}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonAvatar}></div>
        <div className={styles.skeletonUsername}></div>
      </div>
      <div className={styles.skeletonBody}></div>
      <div className={styles.skeletonFooter}>
        <div className={styles.skeletonAction}></div>
        <div className={styles.skeletonAction}></div>
      </div>
    </div>
  );
};

export default PostSkeleton;