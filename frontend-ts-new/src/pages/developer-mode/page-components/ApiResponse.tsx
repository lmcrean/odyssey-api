import React from 'react';

interface ApiResponseProps {
  response: unknown;
  status: 'idle' | 'success' | 'error' | 'partial';
}

export default function ApiResponse({ status }: ApiResponseProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'partial': return '⚠️';
      default: return '⏳';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'partial': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'partial': return 'Partial';
      default: return 'Pending';
    }
  };

  return (
    <div className={`text-sm ${getStatusColor()}`}>
      <span>{getStatusIcon()} {getStatusText()}</span>
    </div>
  );
} 