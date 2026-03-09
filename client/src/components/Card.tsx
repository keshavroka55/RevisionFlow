import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export const Card = ({ children, hover = false, className = '', ...props }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 ${
        hover ? 'hover:shadow-lg hover:border-gray-200 transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
