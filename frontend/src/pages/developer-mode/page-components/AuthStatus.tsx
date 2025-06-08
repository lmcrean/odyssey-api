import React, { useState, useEffect } from 'react';
import { LoginInput } from '../types';

interface AuthStatusProps {
  onLogin: (credentials: LoginInput) => Promise<void>;
  onLogout: () => void;
}

export default function AuthStatus({ onLogin, onLogout }: AuthStatusProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);

  // Check if token exists on mount and listen for auth changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('accessToken');
      const userString = localStorage.getItem('auth_user');

      if (token) {
        setIsAuthenticated(true);

        if (userString) {
          try {
            setUser(JSON.parse(userString));
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    // Check on mount
    checkAuthStatus();

    // Listen for auth changes
    window.addEventListener('authToken_changed', checkAuthStatus);

    return () => {
      window.removeEventListener('authToken_changed', checkAuthStatus);
    };
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const credentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    try {
      await onLogin(credentials);
      setIsAuthenticated(true);
      setUser({ email: credentials.email });
      setShowLoginForm(false);
      
      // Save auth state
      localStorage.setItem('auth_user', JSON.stringify({ email: credentials.email }));
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      onLogout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('auth_user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="mb-8 rounded-lg border border-gray-700 bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-bold">Authentication Status</h2>
      
      {isAuthenticated ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-400">✅ Authenticated</p>
            {user && <p className="text-gray-300">Logged in as: {user.email}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-red-400">❌ Not authenticated</p>
          </div>
          
          {!showLoginForm ? (
            <button
              onClick={() => setShowLoginForm(true)}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Login
            </button>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLoginForm(false)}
                  className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
} 