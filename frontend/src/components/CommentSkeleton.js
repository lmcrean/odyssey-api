import React from 'react';
import styles from '../styles/modules/CommentSkeleton.module.css';

const CommentSkeleton = () => {
  return (
    <div className={styles.commentSkeleton}>
      <div className={styles.avatarSkeleton}></div>
      <div className={styles.contentSkeleton}>
        <div className={styles.nameSkeleton}></div>
        <div className={styles.textSkeleton}></div>
      </div>
    </div>
  );
};

export default CommentSkeleton;