import React, { ReactNode } from 'react';

interface EndpointTableProps {
  title: string;
  children: ReactNode;
}

export default function EndpointTable({ title, children }: EndpointTableProps) {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold text-blue-400">{title}</h2>
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
} 