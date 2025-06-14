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
        return 'text-emerald-400';
      case 'error':
        return 'text-rose-400';
      default:
        return 'text-slate-400';
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

  const getMethodStyle = () => {
    switch (method) {
      case 'GET':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'POST':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'PUT':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'DELETE':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <>
      <tr className="border-b border-slate-700/40 hover:bg-slate-800/50 transition-all duration-200 group">
        <td className="px-6 py-6">
          <div className="space-y-4">
            {/* Method and Endpoint */}
            <div className="flex items-center space-x-3">
              <span
                className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold border transition-all duration-200 group-hover:shadow-md ${getMethodStyle()}`}
              >
                {method}
              </span>
              <code className="text-yellow-300/90 text-sm font-medium bg-slate-800/60 px-3 py-1 rounded-md border border-slate-700/50">
                {getProcessedEndpoint()}
              </code>
            </div>
            
            {/* Authentication Status */}
            {requiresAuth && (
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                <span className={`font-medium ${isAuthenticated ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isAuthenticated ? 'Authenticated' : 'Authentication Required'}
                </span>
                <span className="text-slate-500 italic">
                  {isAuthenticated ? '🔓' : '🔒'}
                </span>
              </div>
            )}

            {/* Test Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleButtonClick}
                disabled={isLoading}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 border ${
                  isLoading
                    ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed border-slate-600/50'
                    : 'bg-blue-600/90 text-white hover:bg-blue-500/90 border-blue-500/50 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </span>
                ) : (
                  `Test ${method}`
                )}
              </button>

              {/* Status Indicator */}
              <div className={`text-xs font-medium flex items-center space-x-1 ${getStatusColor()}`}>
                <span>{getStatusIcon()}</span>
              </div>
            </div>

            {/* Auth Error */}
            {authError && (
              <div className="flex items-center space-x-2 text-xs bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
                <span className="text-rose-400">⚠️</span>
                <span className="text-rose-300 italic">Authentication required. Please login first.</span>
              </div>
            )}
          </div>
        </td>

        <td className="px-6 py-6">
          <div className="max-w-md">
            <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 p-3">
              <JsonDisplay data={expectedOutput} />
            </div>
          </div>
        </td>

        <td className="px-6 py-6">
          <div className="max-w-md">
            {response ? (
              <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 p-3">
                <JsonDisplay
                  data={
                    status === 'error' 
                      ? (response as AxiosError)?.response?.data || response
                      : response
                  }
                />
              </div>
            ) : (
              <div className="bg-slate-800/30 rounded-lg border border-dashed border-slate-600/50 p-6 text-center">
                <span className="text-slate-500 italic text-sm">
                  No response yet. Click the endpoint button to test.
                </span>
              </div>
            )}
          </div>
        </td>
      </tr>

      {showInputForm && (
        <tr>
          <td colSpan={3} className="px-6 py-6 bg-slate-800/60 border-b border-slate-700/40">
            <div className="bg-slate-900/80 rounded-xl border border-slate-700/50 p-6">
              <h4 className="text-slate-200 font-semibold mb-4 flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>Request Parameters</span>
              </h4>
              <InputForm
                fields={[...pathParamFields, ...inputFields]}
                onSubmit={handleFormSubmit}
                submitLabel={`Send ${method} Request`}
                isLoading={isLoading}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
