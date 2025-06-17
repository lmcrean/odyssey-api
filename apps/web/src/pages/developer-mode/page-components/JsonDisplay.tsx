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
    <div className="rounded-lg border border-slate-600/50 bg-slate-900/60 backdrop-blur-sm">
      <div className="p-4">
        <pre className="overflow-x-auto text-xs text-slate-300 font-mono leading-relaxed">
          <code className="language-json">{formatJson(data)}</code>
        </pre>
      </div>
    </div>
  );
}
