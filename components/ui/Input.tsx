import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

const baseInputClasses = 'w-full px-4 py-3 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-anclora-gold focus:border-transparent';
const errorInputClasses = 'border-red-500 focus:ring-red-500';
const normalInputClasses = 'border-gray-300 hover:border-gray-400';

/**
 * Input Component
 * 
 * Standard text input with label, error, and helper text
 * 
 * @example
 * <Input 
 *   label="Email" 
 *   type="email" 
 *   error="Invalid email"
 * />
 */
export function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  const inputClasses = `${baseInputClasses} ${error ? errorInputClasses : normalInputClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

/**
 * TextArea Component
 * 
 * Multi-line text input
 * 
 * @example
 * <TextArea 
 *   label="Message" 
 *   rows={5}
 *   placeholder="Your message..."
 * />
 */
export function TextArea({
  label,
  error,
  helperText,
  className = '',
  ...props
}: TextAreaProps) {
  const textareaClasses = `${baseInputClasses} ${error ? errorInputClasses : normalInputClasses} resize-y ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea className={textareaClasses} {...props} />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

/**
 * Select Component
 * 
 * Dropdown select input
 * 
 * @example
 * <Select label="Property Type">
 *   <option value="">Select...</option>
 *   <option value="villa">Villa</option>
 * </Select>
 */
export function Select({
  label,
  error,
  helperText,
  className = '',
  children,
  ...props
}: SelectProps) {
  const selectClasses = `${baseInputClasses} ${error ? errorInputClasses : normalInputClasses} cursor-pointer ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select className={selectClasses} {...props}>
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
