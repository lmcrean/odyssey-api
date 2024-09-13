// src/contexts/PostCacheContext.js
import React, { createContext, useState, useContext } from 'react';

const PostCacheContext = createContext();

export const PostCacheProvider = ({ children }) => {
  const [cachedPosts, setCachedPosts] = useState({});

  const cachePost = (post) => {
    
    setCachedPosts(prevCache => ({
      ...prevCache,
      [post.id]: post
    }));
  };

  return (
    <PostCacheContext.Provider value={{ cachedPosts, cachePost }}>
      {children}
    </PostCacheContext.Provider>
  );
};

export const usePostCache = () => useContext(PostCacheContext);