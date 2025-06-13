import React, { useState, useEffect } from 'react';

import {
  EndpointRow as BaseEndpointRow,
  testCredentialsManager,
} from '../../../page-components';

export default function EndpointRow() {
  const [storedCredentials, setStoredCredentials] = useState<{
    email: string;
    password: string;
    username?: string;
  } | null>(null);

  // Listen for credential updates
  useEffect(() => {
    const handleCredentialsUpdate = () => {
      const credentials = testCredentialsManager.getCredentials();
      setStoredCredentials(credentials);
    };

    // Check for existing credentials on mount
    handleCredentialsUpdate();

    // Listen for updates
    window.addEventListener(
      'signup_credentials_updated',
      handleCredentialsUpdate
    );

    return () => {
      window.removeEventListener(
        'signup_credentials_updated',
        handleCredentialsUpdate
      );
    };
  }, []);

  const useLatestCredentials = () => {
    const credentials = testCredentialsManager.getCredentials();
    if (credentials) {
      setStoredCredentials(credentials);

      // Update the form fields
      const usernameInput = document.querySelector(
        'input[name="username"]'
      ) as HTMLInputElement;
      const passwordInput = document.querySelector(
        'input[name="password"]'
      ) as HTMLInputElement;

      if (usernameInput)
        usernameInput.value = credentials.username || credentials.email;
      if (passwordInput) passwordInput.value = credentials.password;
    }
  };

  return (
    <>
      <BaseEndpointRow
        method="POST"
        endpoint="/dj-rest-auth/login/"
        expectedOutput={{
          access_token: 'jwt-access-token',
          refresh_token: 'jwt-refresh-token',
          user: {
            id: 1,
            username: 'testuser',
            email: 'user@example.com',
          },
        }}
        requiresParams={true}
        inputFields={[
          {
            name: 'username',
            label: 'Username',
            type: 'text',
            required: true,
            placeholder: 'your_username',
            defaultValue:
              storedCredentials?.username || storedCredentials?.email || '',
          },
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            required: true,
            placeholder: 'Your password',
            defaultValue: storedCredentials?.password || '',
          },
        ]}
      />

      {storedCredentials && (
        <tr>
          <td colSpan={3}>
            <div className="mb-4 ml-4 mt-2 flex items-center">
              <button
                type="button"
                onClick={useLatestCredentials}
                className="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 focus:outline-none focus:ring-2"
              >
                Use Latest Signup Credentials
              </button>

              <div className="ml-4 rounded bg-gray-800 p-2 text-xs">
                <div>
                  Username:{' '}
                  <span className="text-green-400">
                    {storedCredentials.username || storedCredentials.email}
                  </span>
                </div>
                <div>
                  Password:{' '}
                  <span className="text-green-400">
                    {storedCredentials.password}
                  </span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
