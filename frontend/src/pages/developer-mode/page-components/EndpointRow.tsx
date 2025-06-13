import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

import JsonDisplay from './JsonDisplay';
import InputForm from './InputForm';

interface InputField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'json';
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

interface EndpointRowProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  expectedOutput: unknown;
  requiresAuth?: boolean;
  requiresParams?: boolean;
  inputFields?: InputField[];
  pathParams?: string[];
  onCustomButtonClick?: () => void;
}

/**
 * A reusable table row component for an API endpoint
 */
export default function EndpointRow({
  method,
  endpoint,
  expectedOutput,
  requiresAuth = false,
  requiresParams = false,
  inputFields = [],
  pathParams = [],
  onCustomButtonClick,
}: EndpointRowProps) {
  const [response, setResponse] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'success' | 'error' | 'partial'
  >('idle');
  const [showInputForm, setShowInputForm] = useState(false);
  const [pathParamValues, setPathParamValues] = useState<
    Record<string, string>
  >({});
  const [authError, setAuthError] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  // Prepare path parameters input fields
  const pathParamFields: InputField[] = pathParams.map((param) => ({
    name: param,
    label: `${param} (path parameter)`,
    type: 'text',
    required: true,
    placeholder: `Enter value for ${param}`,
  }));

  // Replace path parameters in endpoint
  const getProcessedEndpoint = (
    overridePathParams?: Record<string, string>
  ) => {
    let processedEndpoint = endpoint;
    const paramsToUse = overridePathParams || pathParamValues;

    pathParams.forEach((param) => {
      if (paramsToUse[param]) {
        processedEndpoint = processedEndpoint.replace(
          `:${param}`,
          paramsToUse[param]
        );
      }
    });

    return processedEndpoint;
  };

  const handleApiCall = async (
    formData?: Record<string, unknown>,
    overridePathParams?: Record<string, string>
  ) => {
    setIsLoading(true);
    setStatus('idle');
    setAuthError(false);

    try {
      let result;
      const processedEndpoint = getProcessedEndpoint(overridePathParams);
      const baseURL = 'https://odyssey-api-lmcreans-projects.vercel.app';

      // Check authentication if required
      if (
        requiresAuth &&
        !localStorage.getItem('accessToken') &&
        endpoint !== '/dj-rest-auth/logout/'
      ) {
        setAuthError(true);
        throw new Error('Authentication required. Please login first.');
      }

      // Set up headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      const token = localStorage.getItem('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Make appropriate API call based on method
      switch (method) {
        case 'GET':
          result = await axios.get(`${baseURL}${processedEndpoint}`, {
            headers,
          });
          break;
        case 'POST':
          if (endpoint === '/dj-rest-auth/logout/') {
            try {
              result = await axios.post(
                `${baseURL}${processedEndpoint}`,
                {},
                { headers }
              );
              // Clear tokens after successful logout
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('auth_user');
              setIsAuthenticated(false);

              // Trigger auth state change
              window.dispatchEvent(new Event('authToken_changed'));
            } catch (error) {
              console.error('Logout error:', error);
              // Clear tokens even if logout fails
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('auth_user');
              setIsAuthenticated(false);

              // Trigger auth state change
              window.dispatchEvent(new Event('authToken_changed'));
              result = { data: { message: 'Logged out locally' } };
            }
          } else {
            result = await axios.post(
              `${baseURL}${processedEndpoint}`,
              formData || {},
              { headers }
            );

            // Handle login response
            if (
              endpoint === '/dj-rest-auth/login/' &&
              result.data.access_token
            ) {
              localStorage.setItem('accessToken', result.data.access_token);
              if (result.data.refresh_token) {
                localStorage.setItem('refreshToken', result.data.refresh_token);
              }
              if (result.data.user) {
                localStorage.setItem(
                  'auth_user',
                  JSON.stringify(result.data.user)
                );
              }
              setIsAuthenticated(true);

              // Trigger auth state change in AuthStatus component
              window.dispatchEvent(new Event('authToken_changed'));
            }
          }
          break;
        case 'PUT':
          result = await axios.put(
            `${baseURL}${processedEndpoint}`,
            formData || {},
            { headers }
          );
          break;
        case 'DELETE':
          result = await axios.delete(`${baseURL}${processedEndpoint}`, {
            headers,
          });
          break;
      }

      setResponse(result.data);
      setStatus('success');

      // Hide form after successful call
      if (requiresParams) {
        setShowInputForm(false);
      }
    } catch (error: unknown) {
      console.error(`Error calling ${endpoint}:`, error);
      setResponse(error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (onCustomButtonClick) {
      onCustomButtonClick();
      return;
    }

    if ((requiresParams && inputFields.length > 0) || pathParams.length > 0) {
      setShowInputForm(true);
    } else {
      handleApiCall();
    }
  };

  const handleFormSubmit = (formData: Record<string, unknown>) => {
    if (pathParams.length > 0) {
      const newPathParamValues: Record<string, string> = {};
      pathParams.forEach((param) => {
        if (formData[param]) {
          newPathParamValues[param] = formData[param] as string;
          delete formData[param];
        }
      });
      setPathParamValues(newPathParamValues);
      handleApiCall(formData, newPathParamValues);
    } else {
      handleApiCall(formData);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return '⏳';
    switch (status) {
      case 'success':
        return '✅ Success';
      case 'error':
        return '❌ Error';
      default:
        return '⚪ Ready';
    }
  };

  return (
    <>
      <tr className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
        <td className="px-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span
                className={`rounded px-2 py-1 font-mono text-xs font-semibold ${
                  method === 'GET'
                    ? 'bg-green-600 text-white'
                    : method === 'POST'
                      ? 'bg-blue-600 text-white'
                      : method === 'PUT'
                        ? 'bg-yellow-600 text-black'
                        : 'bg-red-600 text-white'
                }`}
              >
                {method}
              </span>
              <code className="text-yellow-300 text-sm">
                {getProcessedEndpoint()}
              </code>
            </div>
            
            {requiresAuth && (
              <div className="text-xs">
                <span
                  className={`${isAuthenticated ? 'text-green-400' : 'text-red-400'}`}
                >
                  {isAuthenticated
                    ? '🔒 Authentication: ✅'
                    : '🔒 Authentication: ❌ Required'}
                </span>
              </div>
            )}

            <button
              onClick={handleButtonClick}
              disabled={isLoading}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Loading...' : `Test ${method}`}
            </button>

            {authError && (
              <div className="text-xs text-red-400">
                ❌ Authentication required. Please login first.
              </div>
            )}
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="max-w-md">
            <JsonDisplay data={expectedOutput} />
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="max-w-md">
            <div className={`text-sm font-medium mb-2 ${getStatusColor()}`}>
              {getStatusIcon()}
            </div>
            {response ? (
              <JsonDisplay
                data={
                  status === 'error' 
                    ? (response as AxiosError)?.response?.data || response
                    : response
                }
              />
            ) : null}
          </div>
        </td>
      </tr>

      {showInputForm && (
        <tr>
          <td colSpan={3} className="px-4 py-4 bg-gray-800">
            <InputForm
              fields={[...pathParamFields, ...inputFields]}
              onSubmit={handleFormSubmit}
              submitLabel={`Send ${method} Request`}
              isLoading={isLoading}
            />
          </td>
        </tr>
      )}
    </>
  );
}
