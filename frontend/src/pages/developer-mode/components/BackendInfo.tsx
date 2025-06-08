export function BackendInfo() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const environment = import.meta.env.MODE;

  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        🔗 Backend Connection Info
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <strong className="block mb-1">API Base URL:</strong>
          <code className="bg-muted px-2 py-1 rounded block break-all">
            {apiBaseUrl}
          </code>
        </div>
        <div>
          <strong className="block mb-1">Environment:</strong>
          <code className="bg-muted px-2 py-1 rounded block">
            {environment}
          </code>
        </div>
        <div>
          <strong className="block mb-1">Full API URL:</strong>
          <code className="bg-muted px-2 py-1 rounded block break-all">
            {apiBaseUrl}/api/
          </code>
        </div>
        <div>
          <strong className="block mb-1">Production API:</strong>
          <code className="bg-muted px-2 py-1 rounded block break-all">
            https://odyssey-api-lmcreans-projects.vercel.app/api/
          </code>
        </div>
      </div>
    </div>
  );
} 