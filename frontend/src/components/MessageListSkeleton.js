import React from 'react';
import styles from '../styles/modules/MessageListSkeleton.module.css';

const MessageListSkeleton = (props) => {
  return (
    <div className={styles.messageListSkeleton} {...props}>
      <div className={styles.titleSkeleton}></div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className={styles.messageItemSkeleton}>
          <div className={styles.avatarSkeleton}></div>
          <div className={styles.contentSkeleton}>
            <div className={styles.nameSkeleton}></div>
            <div className={styles.previewSkeleton}></div>
          </div>
          <div className={styles.timeSkeleton}></div>
        </div>
      ))}
    </div>
  );
};

export default MessageListSkeleton;