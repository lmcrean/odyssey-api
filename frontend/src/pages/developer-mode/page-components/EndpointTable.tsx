import React, { ReactNode } from 'react';

interface EndpointTableProps {
  title: string;
  children: ReactNode;
}

export default function EndpointTable({ title, children }: EndpointTableProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mr-4"></div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-wide">{title}</h2>
      </div>
      
      <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/90 backdrop-blur-sm">
              <tr className="border-b border-slate-700/60">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 tracking-wider uppercase">
                  Endpoint
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 tracking-wider uppercase">
                  Expected Output
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 tracking-wider uppercase">
                  Actual Output
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {children}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
