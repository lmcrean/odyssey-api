import { AuthStatus, EndpointCard, BackendInfo } from './components';
import { useApiTesting } from './hooks/useApiTesting';
import { odysseyEndpoints } from './utils/endpoints';

export default function DeveloperMode() {
  const { results, loading, authToken, testEndpoint, clearResults, clearAuth } =
    useApiTesting();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">🚀 Odyssey API Developer Mode</h1>
          <p className="text-muted-foreground mb-4">
            Test and explore the Odyssey API endpoints. This page helps you understand
            and debug your backend connections.
          </p>
        </div>

        {/* Auth Status */}
        <AuthStatus
          authToken={authToken}
          onClearAuth={clearAuth}
          onClearResults={clearResults}
        />

        {/* Endpoints Grid */}
        <div className="grid gap-6 mb-8">
          {odysseyEndpoints.map((test) => {
            const key = `${test.method}-${test.endpoint}`;
            const result = results[key];
            const isLoading = loading[key];

            return (
              <EndpointCard
                key={key}
                test={test}
                result={result}
                isLoading={isLoading}
                authToken={authToken}
                onTest={testEndpoint}
              />
            );
          })}
        </div>

        {/* Backend Info */}
        <BackendInfo />
      </div>
    </div>
  );
} 