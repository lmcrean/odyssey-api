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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-10">
        {/* Header with improved styling */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
            Odyssey Developer Mode
          </h1>
          <p className="text-slate-400 italic text-lg">
            Now testing in <span className="font-semibold text-slate-200">{environment.toUpperCase()}</span>
          </p>
        </div>

        {/* Authentication status and login */}
        <div className="mb-10">
          <AuthStatus onLogin={handleLogin} onLogout={handleLogout} />
        </div>

        {/* Main endpoint sections - organized like Dottie project */}
        <div className="space-y-8">
          <SetupEndpoints />
          <AuthEndpoints />
          <UserEndpoints />

          {/* Additional endpoints - can be reorganized later */}
          <PostsEndpoints />
          <MessagesEndpoints />
          <CommentsEndpoints />
        </div>
      </div>
    </div>
  );
}
