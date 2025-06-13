import React, { useState } from 'react';

import {
  EndpointRow as BaseEndpointRow,
  testCredentialsManager,
} from '../../../page-components';

export default function EndpointRow() {
  const [randomCredentials, setRandomCredentials] = useState<{
    email: string;
    password: string;
    username: string;
  } | null>(null);

  const generateRandomCredentials = () => {
    // Create a more robust random string
    const randomString = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now().toString(36);
    const email = `user_${randomString}${timestamp.slice(0, 4)}@example.com`;

    // Create a stronger password (at least 8 chars with mix of letters, numbers)
    const password = `Pass${randomString}${Math.floor(Math.random() * 1000)}!`;

    // Create a proper name
    const username = `TestUser${randomString.slice(0, 3).toUpperCase()}`;

    const credentials = { email, password, username };

    // Store credentials using the credential manager
    testCredentialsManager.storeCredentials(credentials);

    setRandomCredentials(credentials);
    return credentials;
  };

  return (
    <>
      <BaseEndpointRow
        method="POST"
        endpoint="/dj-rest-auth/registration/"
        expectedOutput={{
          access_token: 'jwt-access-token',
          refresh_token: 'jwt-refresh-token',
          user: {
            id: 1,
            username: 'newuser',
            email: 'newuser@example.com',
          },
        }}
        requiresParams={true}
        inputFields={[
          {
            name: 'username',
            label: 'Username',
            type: 'text',
            required: true,
            placeholder: 'Choose a username',
            defaultValue: randomCredentials?.username || '',
          },
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            placeholder: 'user@example.com',
            defaultValue: randomCredentials?.email || '',
          },
          {
            name: 'password1',
            label: 'Password',
            type: 'password',
            required: true,
            placeholder: 'Create a password',
            defaultValue: randomCredentials?.password || '',
          },
          {
            name: 'password2',
            label: 'Confirm Password',
            type: 'password',
            required: true,
            placeholder: 'Confirm your password',
            defaultValue: randomCredentials?.password || '',
          },
        ]}
      />

      <tr>
        <td colSpan={3}>
          <div className="mb-4 ml-4 mt-2 flex items-center">
            <button
              type="button"
              onClick={() => generateRandomCredentials()}
              className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2"
            >
              Generate Random User
            </button>

            {randomCredentials && (
              <div className="ml-4 rounded bg-gray-800 p-2 text-xs">
                <div>
                  Email:{' '}
                  <span className="text-green-400">
                    {randomCredentials.email}
                  </span>
                </div>
                <div>
                  Password:{' '}
                  <span className="text-green-400">
                    {randomCredentials.password}
                  </span>
                </div>
                <div>
                  Username:{' '}
                  <span className="text-green-400">
                    {randomCredentials.username}
                  </span>
                </div>
              </div>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}
