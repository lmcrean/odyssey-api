import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  // TODO: Implement actual authentication check
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please log in to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
