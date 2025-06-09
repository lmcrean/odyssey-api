import React from 'react';
import { EndpointTable } from '../../page-components';

/**
 * Container component for messages endpoints
 */
export default function MessagesEndpoints() {
  return (
    <EndpointTable title="Messages Endpoints">
      <div className="space-y-4">
        {/* Get Messages */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-green-600 px-2 py-1 text-xs font-mono">GET</span>
            <code className="text-yellow-300">/messages/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">Retrieve user's messages (requires authentication)</p>
          <button className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">
            Test Endpoint
          </button>
        </div>

        {/* Send Message */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-blue-600 px-2 py-1 text-xs font-mono">POST</span>
            <code className="text-yellow-300">/messages/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">Send a new message (requires authentication)</p>
          <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
            Test Endpoint
          </button>
        </div>

        {/* Get Message Details */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-green-600 px-2 py-1 text-xs font-mono">GET</span>
            <code className="text-yellow-300">/messages/:id/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">Retrieve specific message details</p>
          <button className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">
            Test Endpoint
          </button>
        </div>

        {/* Update Message */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-yellow-600 px-2 py-1 text-xs font-mono">PUT</span>
            <code className="text-yellow-300">/messages/:id/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">Update message (requires ownership)</p>
          <button className="rounded bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-700">
            Test Endpoint
          </button>
        </div>

        {/* Delete Message */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-red-600 px-2 py-1 text-xs font-mono">DELETE</span>
            <code className="text-yellow-300">/messages/:id/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">Delete message (requires ownership)</p>
          <button className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
            Test Endpoint
          </button>
        </div>
      </div>
    </EndpointTable>
  );
} 