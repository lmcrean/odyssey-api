import React from 'react';
import { EndpointTable } from '../../page-components';

/**
 * Container component for authentication endpoints
 */
export default function AuthEndpoints() {
  return (
    <EndpointTable title="Authentication Endpoints">
      <div className="space-y-4">
        {/* Login Endpoint */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-blue-600 px-2 py-1 text-xs font-mono">POST</span>
            <code className="text-yellow-300">/dj-rest-auth/login/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">User login with email/username and password</p>
          <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
            Test Endpoint
          </button>
        </div>

        {/* Registration Endpoint */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-blue-600 px-2 py-1 text-xs font-mono">POST</span>
            <code className="text-yellow-300">/dj-rest-auth/registration/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">User registration with email, username and password</p>
          <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
            Test Endpoint
          </button>
        </div>

        {/* Logout Endpoint */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-blue-600 px-2 py-1 text-xs font-mono">POST</span>
            <code className="text-yellow-300">/dj-rest-auth/logout/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">User logout (requires authentication)</p>
          <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
            Test Endpoint
          </button>
        </div>
      </div>
    </EndpointTable>
  );
} 