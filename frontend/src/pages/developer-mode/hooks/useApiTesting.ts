import { useState } from 'react';
import { toast } from 'sonner';

import apiClient from '@/src/api/core/client';

import { EndpointTest, TestResult } from '../types';

export function useApiTesting() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [authToken, setAuthToken] = useState(
    localStorage.getItem('accessToken') || ''
  );

  const testEndpoint = async (test: EndpointTest) => {
    const key = `${test.method}-${test.endpoint}`;
    setLoading((prev) => ({ ...prev, [key]: true }));

    try {
      let response;
      const config =
        test.requiresAuth && authToken
          ? { headers: { Authorization: `Bearer ${authToken}` } }
          : {};

      switch (test.method) {
        case 'GET':
          response = await apiClient.get(test.endpoint, config);
          break;
        case 'POST':
          response = await apiClient.post(
            test.endpoint,
            test.sampleData || {},
            config
          );
          break;
        case 'PUT':
          response = await apiClient.put(
            test.endpoint,
            test.sampleData || {},
            config
          );
          break;
        case 'DELETE':
          response = await apiClient.delete(test.endpoint, config);
          break;
      }

      const result: TestResult = {
        status: response.status,
        data: response.data,
        headers: response.headers,
      };

      setResults((prev) => ({ ...prev, [key]: result }));
      toast.success(`${test.name} - Success (${response.status})`);

      // If login was successful, save the token
      if (test.endpoint.includes('login') && response.data.access) {
        setAuthToken(response.data.access);
        localStorage.setItem('accessToken', response.data.access);
        if (response.data.refresh) {
          localStorage.setItem('refreshToken', response.data.refresh);
        }
        toast.success('Login successful! Token saved.');
      }
    } catch (error: any) {
      const errorResult: TestResult = {
        status: error.response?.status || 'Network Error',
        data: error.response?.data || error.message,
        headers: error.response?.headers || {},
      };

      setResults((prev) => ({ ...prev, [key]: errorResult }));
      toast.error(`${test.name} - Error (${errorResult.status})`);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const clearResults = () => {
    setResults({});
  };

  const clearAuth = () => {
    setAuthToken('');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.info('Authentication cleared');
  };

  return {
    results,
    loading,
    authToken,
    testEndpoint,
    clearResults,
    clearAuth,
  };
} 