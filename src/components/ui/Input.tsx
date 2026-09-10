import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-[13px] font-hand text-ink-soft">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-ink-soft">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full sketch-input px-3.5 py-2 text-sm font-hand transition-colors ${
              leftIcon ? 'pl-9' : ''
            } ${rightIcon ? 'pr-9' : ''} ${
              error ? 'border-marker-pink focus:border-marker-pink' : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center text-ink-soft">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs font-note text-marker-pink">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
