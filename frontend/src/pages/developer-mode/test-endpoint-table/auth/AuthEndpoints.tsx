import React from 'react';
import { EndpointTable, EndpointRow } from '../../page-components';

/**
 * Container component for authentication endpoints
 */
export default function AuthEndpoints() {
  return (
    <EndpointTable title="Authentication Endpoints">
      <EndpointRow
        method="POST"
        endpoint="/dj-rest-auth/login/"
        expectedOutput={{
          access_token: 'jwt-access-token',
          refresh_token: 'jwt-refresh-token',
          user: {
            id: 1,
            username: 'testuser',
            email: 'user@example.com'
          }
        }}
        requiresParams={true}
        inputFields={[
          {
            name: 'username',
            label: 'Username',
            type: 'text',
            required: true,
            placeholder: 'your_username'
          },
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            required: true,
            placeholder: 'Your password'
          }
        ]}
      />

      <EndpointRow
        method="POST"
        endpoint="/dj-rest-auth/registration/"
        expectedOutput={{
          access_token: 'jwt-access-token',
          refresh_token: 'jwt-refresh-token',
          user: {
            id: 1,
            username: 'newuser',
            email: 'newuser@example.com'
          }
        }}
        requiresParams={true}
        inputFields={[
          {
            name: 'username',
            label: 'Username',
            type: 'text',
            required: true,
            placeholder: 'Choose a username'
          },
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            placeholder: 'user@example.com'
          },
          {
            name: 'password1',
            label: 'Password',
            type: 'password',
            required: true,
            placeholder: 'Create a password'
          },
          {
            name: 'password2',
            label: 'Confirm Password',
            type: 'password',
            required: true,
            placeholder: 'Confirm your password'
          }
        ]}
      />

      <EndpointRow
        method="POST"
        endpoint="/dj-rest-auth/logout/"
        expectedOutput={{
          detail: 'Successfully logged out.'
        }}
        requiresAuth={true}
      />
    </EndpointTable>
  );
} 