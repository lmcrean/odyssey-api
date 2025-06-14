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
  onSubmit: (formData: Record<string, any>) => void;
  submitLabel?: string;
  isLoading?: boolean;
}

/**
 * Form component for handling inputs for API requests that require parameters
 */
export default function InputForm({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  isLoading = false,
}: InputFormProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    // Initialize form values with default values
    const initialValues: Record<string, any> = {};
    fields.forEach((field) => {
      initialValues[field.name] = field.defaultValue || '';
    });
    return initialValues;
  });

  const [jsonErrors, setJsonErrors] = useState<Record<string, boolean>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear JSON error when editing
    if (jsonErrors[name]) {
      setJsonErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleJsonChange = (name: string, value: string) => {
    try {
      const parsedValue = value.trim() ? JSON.parse(value) : '';
      setFormValues((prev) => ({ ...prev, [name]: parsedValue }));
      setJsonErrors((prev) => ({ ...prev, [name]: false }));
    } catch (error) {
      setFormValues((prev) => ({ ...prev, [name]: value }));
      setJsonErrors((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if there are any JSON errors
    if (Object.values(jsonErrors).some(Boolean)) {
      return;
    }

    // Parse JSON fields before submitting
    const processedValues = { ...formValues };
    fields.forEach((field) => {
      if (
        field.type === 'json' &&
        typeof processedValues[field.name] === 'string'
      ) {
        try {
          processedValues[field.name] = processedValues[field.name].trim()
            ? JSON.parse(processedValues[field.name])
            : {};
        } catch (error) {
          // Keep as string if invalid JSON
        }
      }
    });

    onSubmit(processedValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label
            htmlFor={field.name}
            className="block text-sm font-semibold text-slate-200 tracking-wide"
          >
            {field.label}
            {field.required && <span className="text-rose-400 ml-1">*</span>}
          </label>

          {field.type === 'textarea' || field.type === 'json' ? (
            <div className="relative">
              <textarea
                id={field.name}
                name={field.name}
                value={
                  typeof formValues[field.name] === 'object'
                    ? JSON.stringify(formValues[field.name], null, 2)
                    : formValues[field.name]
                }
                onChange={handleInputChange}
                onBlur={
                  field.type === 'json'
                    ? (e) => handleJsonChange(field.name, e.target.value)
                    : undefined
                }
                placeholder={field.placeholder}
                required={field.required}
                rows={5}
                className={`w-full rounded-lg border bg-slate-800/80 backdrop-blur-sm px-4 py-3 transition-all duration-200 font-mono text-sm ${
                  jsonErrors[field.name]
                    ? 'border-rose-500/60 focus:border-rose-400 focus:ring-rose-500/30 bg-rose-500/5'
                    : 'border-slate-600/50 focus:border-blue-400/60 focus:ring-blue-500/30 hover:border-slate-500/60'
                } text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 resize-none`}
              />
              {field.type === 'json' && (
                <div className="absolute top-2 right-2">
                  <span className="text-xs text-slate-500 bg-slate-700/60 px-2 py-1 rounded">
                    JSON
                  </span>
                </div>
              )}
            </div>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formValues[field.name]}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full rounded-lg border border-slate-600/50 bg-slate-800/80 backdrop-blur-sm px-4 py-3 text-slate-100 placeholder-slate-400 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 hover:border-slate-500/60"
            />
          )}

          {field.type === 'json' && jsonErrors[field.name] && (
            <div className="flex items-center space-x-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
              <span>⚠️</span>
              <span className="italic">Invalid JSON format</span>
            </div>
          )}
        </div>
      ))}

      <div className="pt-4 border-t border-slate-700/50">
        <button
          type="submit"
          disabled={isLoading || Object.values(jsonErrors).some(Boolean)}
          className="w-full rounded-lg bg-blue-600/90 hover:bg-blue-500/90 disabled:bg-slate-600/50 disabled:text-slate-400 px-6 py-3 font-semibold text-white transition-all duration-200 border border-blue-500/50 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:shadow-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
