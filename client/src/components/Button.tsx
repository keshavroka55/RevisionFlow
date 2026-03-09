import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = ({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) => {
  const baseStyles = 'rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#4F46E5] text-white hover:bg-[#4338CA] active:scale-95 shadow-md hover:shadow-lg',
    secondary: 'bg-[#0D9488] text-white hover:bg-[#0F766E] active:scale-95 shadow-md hover:shadow-lg',
    ghost: 'bg-transparent text-[#0F172A] hover:bg-gray-100 active:bg-gray-200',
    danger: 'bg-[#dc2626] text-white hover:bg-[#b91c1c] active:scale-95 shadow-md hover:shadow-lg',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-7 py-3.5 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
