import React from 'react';
import { EndpointTable } from '../../page-components';

/**
 * Container component for profiles endpoints
 */
export default function ProfilesEndpoints() {
  return (
    <EndpointTable title="Profiles Endpoints">
      <div className="space-y-4">
        {/* Get Profiles */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-green-600 px-2 py-1 text-xs font-mono">GET</span>
            <code className="text-yellow-300">/profiles/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">Retrieve paginated list of user profiles</p>
          <button className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">
            Test Endpoint
          </button>
        </div>

        {/* Get Profile Details */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-green-600 px-2 py-1 text-xs font-mono">GET</span>
            <code className="text-yellow-300">/profiles/:id/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">Retrieve specific profile details</p>
          <button className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">
            Test Endpoint
          </button>
        </div>

        {/* Update Profile */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-yellow-600 px-2 py-1 text-xs font-mono">PUT</span>
            <code className="text-yellow-300">/profiles/:id/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">Update profile (requires ownership)</p>
          <button className="rounded bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-700">
            Test Endpoint
          </button>
        </div>
      </div>
    </EndpointTable>
  );
} 