import React from 'react';

interface JsonDisplayProps {
  data: unknown;
}

export default function JsonDisplay({ data }: JsonDisplayProps) {
  const formatJson = (obj: unknown) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  return (
    <div className="rounded border border-gray-600 bg-gray-800 p-3">
      <pre className="overflow-x-auto text-xs text-gray-300">
        <code>{formatJson(data)}</code>
      </pre>
    </div>
  );
}
