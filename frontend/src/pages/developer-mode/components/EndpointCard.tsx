import { EndpointTest, TestResult } from '../types';

interface EndpointCardProps {
  test: EndpointTest;
  result?: TestResult;
  isLoading: boolean;
  authToken: string;
  onTest: (test: EndpointTest) => void;
}

export function EndpointCard({
  test,
  result,
  isLoading,
  authToken,
  onTest,
}: EndpointCardProps) {
  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800';
      case 'POST':
        return 'bg-blue-100 text-blue-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status: number | string) => {
    if (typeof status === 'number') {
      if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
      if (status >= 400) return 'bg-red-100 text-red-800';
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-card p-6 rounded-lg border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 text-xs rounded font-mono ${getMethodBadgeClass(
                test.method
              )}`}
            >
              {test.method}
            </span>
            {test.name}
            {test.requiresAuth && (
              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                Auth Required
              </span>
            )}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {test.description}
          </p>
          <code className="text-sm bg-muted px-2 py-1 rounded inline-block">
            {test.endpoint}
          </code>
        </div>
        <button
          onClick={() => onTest(test)}
          disabled={isLoading || (test.requiresAuth && !authToken)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed ml-4"
        >
          {isLoading ? 'Testing...' : 'Test'}
        </button>
      </div>

      {/* Sample Data */}
      {test.sampleData && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Sample Request Data:</h4>
          <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
            {JSON.stringify(test.sampleData, null, 2)}
          </pre>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            Response
            <span className={`px-2 py-1 text-xs rounded ${getStatusBadgeClass(result.status)}`}>
              {result.status}
            </span>
          </h4>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-sm mb-1">Data:</h5>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto max-h-60">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 