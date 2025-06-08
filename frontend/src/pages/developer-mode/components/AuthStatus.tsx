interface AuthStatusProps {
  authToken: string;
  onClearAuth: () => void;
  onClearResults: () => void;
}

export function AuthStatus({
  authToken,
  onClearAuth,
  onClearResults,
}: AuthStatusProps) {
  return (
    <div className="bg-card p-4 rounded-lg border mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Authentication Status</h3>
          <p className="text-sm text-muted-foreground">
            {authToken ? '✅ Authenticated' : '❌ Not authenticated'}
          </p>
          {authToken && (
            <p className="text-xs text-muted-foreground mt-1">
              Token: {authToken.substring(0, 20)}...
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClearAuth}
            className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 disabled:opacity-50"
            disabled={!authToken}
          >
            Clear Auth
          </button>
          <button
            onClick={onClearResults}
            className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            Clear Results
          </button>
        </div>
      </div>
    </div>
  );
} 