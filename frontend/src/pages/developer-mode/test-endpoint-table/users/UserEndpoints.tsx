import React from 'react';

import { EndpointTable } from '../../page-components';
import EndpointRow from '../../page-components/EndpointRow';

/**
 * Container component for user endpoints
 */
export default function UserEndpoints() {
  return (
    <EndpointTable title="User Endpoints">
      <EndpointRow
        method="GET"
        endpoint="/profiles/"
        expectedOutput={{
          count: 25,
          next: "https://odyssey-api-lmcreans-projects.vercel.app/profiles/?page=2",
          previous: null,
          results: [
            {
              id: 1,
              user: {
                id: 1,
                username: "testuser",
                email: "test@example.com"
              },
              bio: "This is a test bio",
              location: "Test City",
              birth_date: "1990-01-01",
              created_at: "2023-01-01T00:00:00Z",
              updated_at: "2023-01-01T00:00:00Z"
            }
          ]
        }}
        requiresAuth={false}
      />
      
      <EndpointRow
        method="GET"
        endpoint="/profiles/:id/"
        expectedOutput={{
          id: 1,
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com"
          },
          bio: "This is a test bio",
          location: "Test City",
          birth_date: "1990-01-01",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z"
        }}
        requiresAuth={false}
        pathParams={['id']}
      />
      
      <EndpointRow
        method="PUT"
        endpoint="/profiles/:id/"
        expectedOutput={{
          id: 1,
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com"
          },
          bio: "Updated bio",
          location: "Updated location",
          birth_date: "1990-01-01",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z"
        }}
        requiresAuth={true}
        requiresParams={true}
        pathParams={['id']}
        inputFields={[
          {
            name: 'bio',
            label: 'Bio',
            type: 'textarea',
            placeholder: 'Tell us about yourself',
          },
          {
            name: 'location',
            label: 'Location',
            type: 'text',
            placeholder: 'Your location',
          },
          {
            name: 'birth_date',
            label: 'Birth Date',
            type: 'text',
            placeholder: 'YYYY-MM-DD',
          },
        ]}
      />

      <EndpointRow
        method="GET"
        endpoint="/dj-rest-auth/user/"
        expectedOutput={{
          pk: 1,
          username: "testuser",
          email: "test@example.com",
          first_name: "",
          last_name: ""
        }}
        requiresAuth={true}
      />
    </EndpointTable>
  );
} 