import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`
      bg-white dark:bg-gray-800 
      rounded-xl 
      shadow-sm 
      border border-gray-200 dark:border-gray-700
      transition-colors duration-200
      ${className}
    `}>
      {children}
    </div>
  );
} 