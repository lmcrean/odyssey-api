import React, { useState } from 'react';

interface InputField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'json';
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

interface InputFormProps {
  fields: InputField[];
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function InputForm({ fields, onSubmit, onCancel, isLoading }: InputFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      initial[field.name] = field.defaultValue || '';
    });
    return initial;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData: Record<string, unknown> = {};
    fields.forEach((field) => {
      let value: unknown = formData[field.name];
      
      if (field.type === 'json' && value) {
        try {
          value = JSON.parse(value as string);
        } catch {
          value = formData[field.name];
        }
      } else if (field.type === 'number' && value) {
        value = Number(value);
      }
      
      processedData[field.name] = value;
    });

    onSubmit(processedData);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderField = (field: InputField) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleInputChange(field.name, e.target.value),
      placeholder: field.placeholder,
      required: field.required,
      className: "mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    };

    if (field.type === 'textarea') {
      return (
        <textarea
          {...commonProps}
          rows={4}
        />
      );
    }

    return (
      <input
        {...commonProps}
        type={field.type}
      />
    );
  };

  return (
    <div className="rounded border border-gray-600 bg-gray-800 p-4">
      <h4 className="mb-4 text-lg font-semibold text-white">Request Parameters</h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-300">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? 'Sending...' : 'Send Request'}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 