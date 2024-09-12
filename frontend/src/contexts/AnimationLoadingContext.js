import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';

const AnimationLoadingContext = createContext();

export const useAnimationLoading = () => useContext(AnimationLoadingContext);

export const AnimationLoadingProvider = ({ children }) => {
  const [isAnimationLoaded, setIsAnimationLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const checkTimeoutRef = useRef(null);
  const imageObserverRef = useRef(null);

  const loadImage = useCallback((img) => {
    if (img.complete) {
      setImagesLoaded(prev => prev + 1);
    } else {
      img.onload = () => setImagesLoaded(prev => prev + 1);
      img.onerror = () => setImagesLoaded(prev => prev + 1);
    }
  }, []);

  const checkImages = useCallback(() => {
    const images = document.querySelectorAll('img');
    const newTotalImages = images.length;

    if (newTotalImages !== totalImages) {
      setTotalImages(newTotalImages);
      setImagesLoaded(0);
      images.forEach(loadImage);
    }

    if (imagesLoaded < totalImages) {
      checkTimeoutRef.current = setTimeout(checkImages, 1000);
    } else {
      setIsAnimationLoaded(true);
    }
  }, [totalImages, imagesLoaded, loadImage]);

  useEffect(() => {
    checkImages();

    // Set up an Intersection Observer to detect new images
    imageObserverRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.tagName === 'IMG') {
          loadImage(entry.target);
          imageObserverRef.current.unobserve(entry.target);
        }
      });
    });

    // Observe all current images
    document.querySelectorAll('img').forEach(img => imageObserverRef.current.observe(img));

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      if (imageObserverRef.current) {
        imageObserverRef.current.disconnect();
      }
    };
  }, [checkImages, loadImage]);

  const loadingProgress = totalImages > 0 ? (imagesLoaded / totalImages) * 100 : 0;

  return (
    <AnimationLoadingContext.Provider value={{ isAnimationLoaded, loadingProgress }}>
      {children}
    </AnimationLoadingContext.Provider>
  );
};