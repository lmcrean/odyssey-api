import React from 'react';

import { EndpointTable } from '../../page-components';

/**
 * Container component for comments endpoints
 */
export default function CommentsEndpoints() {
  return (
    <EndpointTable title="Comments Endpoints">
      <div className="space-y-4">
        {/* Get Comments */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-green-600 px-2 py-1 font-mono text-xs">
              GET
            </span>
            <code className="text-yellow-300">/comments/</code>
          </div>
          <p className="mb-3 text-sm text-gray-300">
            Retrieve paginated list of comments
          </p>
          <button className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">
            Test Endpoint
          </button>
        </div>

        {/* Create Comment */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-blue-600 px-2 py-1 font-mono text-xs">
              POST
            </span>
            <code className="text-yellow-300">/comments/</code>
          </div>
          <p className="mb-3 text-sm text-gray-300">
            Create a new comment (requires authentication)
          </p>
          <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
            Test Endpoint
          </button>
        </div>

        {/* Get Comment Details */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-green-600 px-2 py-1 font-mono text-xs">
              GET
            </span>
            <code className="text-yellow-300">/comments/:id/</code>
          </div>
          <p className="mb-3 text-sm text-gray-300">
            Retrieve specific comment details
          </p>
          <button className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">
            Test Endpoint
          </button>
        </div>

        {/* Update Comment */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-yellow-600 px-2 py-1 font-mono text-xs">
              PUT
            </span>
            <code className="text-yellow-300">/comments/:id/</code>
          </div>
          <p className="mb-3 text-sm text-gray-300">
            Update comment (requires ownership)
          </p>
          <button className="rounded bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-700">
            Test Endpoint
          </button>
        </div>

        {/* Delete Comment */}
        <div className="rounded border border-gray-600 bg-gray-700 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded bg-red-600 px-2 py-1 font-mono text-xs">
              DELETE
            </span>
            <code className="text-yellow-300">/comments/:id/</code>
          </div>
          <p className="mb-3 text-sm text-gray-300">
            Delete comment (requires ownership)
          </p>
          <button className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
            Test Endpoint
          </button>
        </div>
      </div>
    </EndpointTable>
  );
}
