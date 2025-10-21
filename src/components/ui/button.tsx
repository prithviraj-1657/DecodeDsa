import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean; // ← NEW: pass true to show spinner & disable button
}

export const Button: React.FC<ButtonProps> = ({
                                                children,
                                                className = '',
                                                variant = 'primary',
                                                size = 'md',
                                                isLoading = false, // default false
                                                disabled,
                                                ...props
                                              }) => {
  const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
      <button
          className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          disabled={disabled || isLoading} // ← disable during operation
          {...props}
      >
        {isLoading ? (
            <span className="inline-flex items-center gap-2">
          <div className="spinner-small" /> {/* small spinner */}
              {children}
        </span>
        ) : (
            children
        )}
      </button>
  );
};
