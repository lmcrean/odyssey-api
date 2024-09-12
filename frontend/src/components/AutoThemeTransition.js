// src/components/AutoThemeTransition.js
import React from 'react';
import { useThemeTransition } from '../contexts/ThemeContext';

export const AutoThemeTransition = ({ children }) => {
  const themeProps = useThemeTransition();
  
  const addPropsToChildren = (children) => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, themeProps);
      }
      return child;
    });
  };

  return <>{addPropsToChildren(children)}</>;
};