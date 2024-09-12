import React from 'react';
import styles from '../styles/modules/MessageDetailSkeleton.module.css';

const MessageDetailSkeleton = () => {
  return (
    <div className={styles.messageDetailSkeleton}>
      <div className={styles.headerSkeleton}>
        <div className={styles.avatarSkeleton}></div>
        <div className={styles.nameSkeleton}></div>
      </div>
      <div className={styles.messageListSkeleton}>
        {[...Array(5)].map((_, index) => (
          <div key={index} className={styles.messageSkeleton}>
            <div className={styles.messageContentSkeleton}></div>
            <div className={styles.messageTimeSkeleton}></div>
          </div>
        ))}
      </div>
      <div className={styles.inputSkeleton}></div>
    </div>
  );
};

export default MessageDetailSkeleton;