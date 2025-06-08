import React from 'react';

interface EndpointButtonProps {
  onClick: () => void;
  isLoading: boolean;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  disabled?: boolean;
}

export default function EndpointButton({ onClick, isLoading, method, disabled = false }: EndpointButtonProps) {
  const getButtonColor = () => {
    if (disabled) return 'bg-gray-600';
    
    switch (method) {
      case 'GET': return 'bg-green-600 hover:bg-green-700';
      case 'POST': return 'bg-blue-600 hover:bg-blue-700';
      case 'PUT': return 'bg-yellow-600 hover:bg-yellow-700';
      case 'DELETE': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`rounded px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 disabled:opacity-50 ${getButtonColor()}`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-1">
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        `Test ${method} Endpoint`
      )}
    </button>
  );
} 