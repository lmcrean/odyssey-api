import React from 'react';

import { EndpointTable, EndpointRow } from '../../page-components';

/**
 * Container component for posts endpoints
 */
export default function PostsEndpoints() {
  return (
    <EndpointTable title="Posts Endpoints">
      <EndpointRow
        method="GET"
        endpoint="/posts/"
        expectedOutput={{
          count: 10,
          next: 'https://odyssey-api-lmcreans-projects.vercel.app/posts/?page=2',
          previous: null,
          results: [
            {
              id: 1,
              title: 'Sample Post',
              content: 'This is a sample post content',
              owner: 'testuser',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          ],
        }}
      />

      <EndpointRow
        method="POST"
        endpoint="/posts/"
        expectedOutput={{
          id: 1,
          title: 'New Post',
          content: 'This is new post content',
          owner: 'testuser',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }}
        requiresAuth={true}
        requiresParams={true}
        inputFields={[
          {
            name: 'title',
            label: 'Title',
            type: 'text',
            required: true,
            placeholder: 'Enter post title',
          },
          {
            name: 'content',
            label: 'Content',
            type: 'textarea',
            required: true,
            placeholder: 'Enter post content',
          },
        ]}
      />

      <EndpointRow
        method="GET"
        endpoint="/posts/:id/"
        expectedOutput={{
          id: 1,
          title: 'Sample Post',
          content: 'This is a sample post content',
          owner: 'testuser',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }}
        pathParams={['id']}
      />
    </EndpointTable>
  );
}
