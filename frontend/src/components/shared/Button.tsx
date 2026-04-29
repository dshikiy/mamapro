'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-lg font-medium transition flex items-center justify-center space-x-2';

  const variantClasses = {
    primary: 'bg-accent-pink text-white hover:bg-accent-purple disabled:bg-warm-gray',
    secondary: 'bg-lavender text-dark-text hover:bg-accent-purple hover:text-white disabled:bg-beige',
    outline: 'border-2 border-accent-pink text-accent-pink hover:bg-soft-pink disabled:border-warm-gray disabled:text-warm-gray',
    soft: 'bg-soft-pink text-dark-text hover:bg-accent-pink hover:text-white disabled:bg-beige',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
