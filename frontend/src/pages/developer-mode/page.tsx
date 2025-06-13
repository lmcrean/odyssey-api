'use client';

import {
  SetupEndpoints,
  AuthEndpoints,
  UserEndpoints,
  // Other endpoints for now - can be reorganized later
  PostsEndpoints,
  MessagesEndpoints,
  CommentsEndpoints,
} from './test-endpoint-table';
import { AuthStatus } from './page-components';
import { LoginInput } from './types';

export default function TestPage() {
  const environment =
    typeof window !== 'undefined' ? 'development' : 'development';

  const handleLogin = async (credentials: LoginInput) => {
    try {
      // TODO: Implement actual login API call
      console.log('Login attempt:', credentials);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    // TODO: Implement actual logout
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    console.log('Logged out');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Now testing in {environment.toUpperCase()}
        </h1>

        {/* Authentication status and login */}
        <AuthStatus onLogin={handleLogin} onLogout={handleLogout} />

        {/* Main endpoint sections - organized like Dottie project */}
        <SetupEndpoints />
        <AuthEndpoints />
        <UserEndpoints />

        {/* Additional endpoints - can be reorganized later */}
        <PostsEndpoints />
        <MessagesEndpoints />
        <CommentsEndpoints />
      </div>
    </div>
  );
}
