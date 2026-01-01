import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Checkbox Component
 * 
 * Styled checkbox input with label
 * 
 * @example
 * <Checkbox 
 *   label="I accept the terms" 
 *   checked={accepted}
 *   onChange={(e) => setAccepted(e.target.checked)}
 * />
 */
export function Checkbox({
  label,
  error,
  className = '',
  ...props
}: CheckboxProps) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          className={`w-5 h-5 border-2 border-gray-300 rounded cursor-pointer transition-colors duration-200 focus:ring-2 focus:ring-anclora-gold focus:ring-offset-2 checked:bg-anclora-gold checked:border-anclora-gold ${className}`}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-3">
          <label className="text-sm text-gray-700 cursor-pointer">
            {label}
          </label>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Radio Component
 * 
 * Styled radio input with label
 * 
 * @example
 * <Radio 
 *   name="budget"
 *   value="1m-2m" 
 *   label="1M€ - 2M€"
 *   checked={budget === '1m-2m'}
 *   onChange={(e) => setBudget(e.target.value)}
 * />
 */
export function Radio({
  label,
  error,
  className = '',
  ...props
}: RadioProps) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="radio"
          className={`w-5 h-5 border-2 border-gray-300 cursor-pointer transition-colors duration-200 focus:ring-2 focus:ring-anclora-gold focus:ring-offset-2 checked:bg-anclora-gold checked:border-anclora-gold ${className}`}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-3">
          <label className="text-sm text-gray-700 cursor-pointer">
            {label}
          </label>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
