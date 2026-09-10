import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-hand rounded-[10px] transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none select-none focus:outline-none border-2';

  const sizeStyles = {
    sm: 'text-[13px] px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-marker-pink hover:bg-marker-pink/90 text-white border-ink shadow-sketch-sm',
    secondary:
      'bg-paper-200 hover:bg-paper-300 text-ink border-ink shadow-sketch-sm',
    outline:
      'bg-paper-50 hover:bg-paper-100 text-ink border-ink shadow-sketch-sm',
    ghost:
      'bg-transparent hover:bg-paper-200 text-ink-soft hover:text-ink border-transparent',
    danger:
      'bg-marker-pink/10 hover:bg-marker-pink/20 text-marker-pink border-marker-pink/50',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
