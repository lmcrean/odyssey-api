import React, { ReactNode } from 'react';

interface EndpointTableProps {
  title: string;
  children: ReactNode;
}

export default function EndpointTable({ title, children }: EndpointTableProps) {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold text-blue-400">{title}</h2>
      <div className="rounded-lg border border-gray-700 bg-gray-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                Endpoint
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                Expected Output
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                Actual Output
              </th>
            </tr>
          </thead>
          <tbody>
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
