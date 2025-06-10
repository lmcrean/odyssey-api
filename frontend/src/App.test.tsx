import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import App from './App';

describe('App', () => {
  it('renders the welcome message', () => {
    render(<App />);
    expect(screen.getByText('Welcome to Odyssey')).toBeInTheDocument();
  });

  it('renders the navigation', () => {
    render(<App />);
    expect(screen.getByText('Odyssey')).toBeInTheDocument();
  });
}); 