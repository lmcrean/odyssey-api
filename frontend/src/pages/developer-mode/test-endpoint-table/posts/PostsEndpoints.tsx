import React from 'react';
import { EndpointTable } from '../../page-components';

/**
 * Container component for posts endpoints
 */
export default function PostsEndpoints() {
  return (
    <EndpointTable title="Posts Endpoints">
      <div className="space-y-4">
        {/* Get Posts */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-green-600 px-2 py-1 text-xs font-mono">GET</span>
            <code className="text-yellow-300">/posts/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">Retrieve paginated list of posts</p>
          <button className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">
            Test Endpoint
          </button>
        </div>

        {/* Create Post */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-blue-600 px-2 py-1 text-xs font-mono">POST</span>
            <code className="text-yellow-300">/posts/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">Create a new post (requires authentication)</p>
          <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
            Test Endpoint
          </button>
        </div>

        {/* Get Post Details */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-green-600 px-2 py-1 text-xs font-mono">GET</span>
            <code className="text-yellow-300">/posts/:id/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">Retrieve specific post details</p>
          <button className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">
            Test Endpoint
          </button>
        </div>

        {/* Update Post */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-yellow-600 px-2 py-1 text-xs font-mono">PUT</span>
            <code className="text-yellow-300">/posts/:id/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">Update post (requires ownership)</p>
          <button className="rounded bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-700">
            Test Endpoint
          </button>
        </div>

        {/* Delete Post */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-red-600 px-2 py-1 text-xs font-mono">DELETE</span>
            <code className="text-yellow-300">/posts/:id/</code>
          </div>
          <p className="text-gray-300 text-sm mb-3">Delete post (requires ownership)</p>
          <button className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
            Test Endpoint
          </button>
        </div>
      </div>
    </EndpointTable>
  );
} 