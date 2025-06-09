import React, { useState, useEffect } from 'react';
import EndpointButton from './EndpointButton';
import JsonDisplay from './JsonDisplay';
import ApiResponse from './ApiResponse';
import InputForm from './InputForm';
import axios, { AxiosError } from 'axios';

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
 * A reusable row component for an API endpoint
 */
export default function EndpointRow({
  method,
  endpoint,
  expectedOutput,
  requiresAuth = false,
  requiresParams = false,
  inputFields = [],
  pathParams = [],
  onCustomButtonClick
}: EndpointRowProps) {
  const [response, setResponse] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'partial'>('idle');
  const [showInputForm, setShowInputForm] = useState(false);
  const [pathParamValues, setPathParamValues] = useState<Record<string, string>>({});
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
    placeholder: `Enter value for ${param}`
  }));

  // Replace path parameters in endpoint
  const getProcessedEndpoint = (overridePathParams?: Record<string, string>) => {
    let processedEndpoint = endpoint;
    const paramsToUse = overridePathParams || pathParamValues;

    pathParams.forEach((param) => {
      if (paramsToUse[param]) {
        processedEndpoint = processedEndpoint.replace(`:${param}`, paramsToUse[param]);
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
      if (requiresAuth && !localStorage.getItem('accessToken') && endpoint !== '/dj-rest-auth/logout/') {
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
          result = await axios.get(`${baseURL}${processedEndpoint}`, { headers });
          break;
        case 'POST':
          if (endpoint === '/dj-rest-auth/logout/') {
            try {
              result = await axios.post(`${baseURL}${processedEndpoint}`, {}, { headers });
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
            result = await axios.post(`${baseURL}${processedEndpoint}`, formData || {}, { headers });
            
            // Handle login response
            if (endpoint === '/dj-rest-auth/login/' && result.data.access_token) {
              localStorage.setItem('accessToken', result.data.access_token);
              if (result.data.refresh_token) {
                localStorage.setItem('refreshToken', result.data.refresh_token);
              }
              if (result.data.user) {
                localStorage.setItem('auth_user', JSON.stringify(result.data.user));
              }
              setIsAuthenticated(true);
              
              // Trigger auth state change in AuthStatus component
              window.dispatchEvent(new Event('authToken_changed'));
            }
          }
          break;
        case 'PUT':
          result = await axios.put(`${baseURL}${processedEndpoint}`, formData || {}, { headers });
          break;
        case 'DELETE':
          result = await axios.delete(`${baseURL}${processedEndpoint}`, { headers });
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

  return (
    <div className="mb-4 rounded border border-gray-600 bg-gray-700">
      <div className="p-4">
        <div className="mb-2 flex items-center space-x-2">
          <span className={`rounded px-2 py-1 text-xs font-mono ${
            method === 'GET' ? 'bg-green-600' :
            method === 'POST' ? 'bg-blue-600' :
            method === 'PUT' ? 'bg-yellow-600' :
            'bg-red-600'
          }`}>
            {method}
          </span>
          <code className="text-yellow-300">{getProcessedEndpoint()}</code>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div>
            {requiresAuth && (
              <div className="mb-2">
                <span className={`text-xs ${isAuthenticated ? 'text-green-400' : 'text-red-400'}`}>
                  {isAuthenticated ? '🔒 Authentication: ✅' : '🔒 Authentication: ❌ Required'}
                </span>
              </div>
            )}
            
            <EndpointButton
              label={`${method} ${endpoint}`}
              method={method}
              onClick={handleButtonClick}
              status={status}
              isLoading={isLoading}
            />
          </div>

          {status !== 'idle' && (
            <div className="text-right">
              <ApiResponse response={response} status={status} />
            </div>
          )}
        </div>

        {authError && (
          <div className="mb-3 rounded bg-red-900 p-2 text-red-300 text-sm">
            ❌ Authentication required. Please login first.
          </div>
        )}

        {showInputForm && (
          <div className="mt-4">
            <InputForm
              fields={[...pathParamFields, ...inputFields]}
              onSubmit={handleFormSubmit}
              submitLabel="Send POST Request"
              isLoading={isLoading}
            />
          </div>
        )}

        {status === 'success' && response ? (
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-300">Response:</h4>
            <JsonDisplay data={response} />
          </div>
        ) : null}

        {status === 'error' && response ? (
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-semibold text-red-400">Error:</h4>
            <JsonDisplay data={(response as AxiosError)?.response?.data || response} />
          </div>
        ) : null}

        <div className="mt-4">
          <h4 className="mb-2 text-sm font-semibold text-gray-400">Expected Output:</h4>
          <JsonDisplay data={expectedOutput} />
        </div>
      </div>
    </div>
  );
} 