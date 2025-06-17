import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseInputProps {
  label: string;
  error?: string;
}

interface TextInputProps extends BaseInputProps, InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'number' | 'date' | 'email' | 'password';
}

interface TextareaProps extends BaseInputProps, TextareaHTMLAttributes<HTMLTextAreaElement> {}

interface SelectProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLSelectElement>, 'type'> {
  options: Array<{ value: string; label: string }>;
}

export function TextInput({ label, error, className = '', ...props }: TextInputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          w-full px-3 py-2 rounded-lg
          bg-white dark:bg-gray-700
          border border-gray-300 dark:border-gray-600
          text-gray-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400
          focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
          focus:border-blue-500 dark:focus:border-blue-400
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
          ${className}
        `}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`
          w-full px-3 py-2 rounded-lg
          bg-white dark:bg-gray-700
          border border-gray-300 dark:border-gray-600
          text-gray-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400
          focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
          focus:border-blue-500 dark:focus:border-blue-400
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
          resize-none
          ${className}
        `}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        {...props}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${className}`}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
} 