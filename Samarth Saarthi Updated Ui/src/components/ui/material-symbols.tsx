import React from 'react';
import { cn } from '@/lib/utils';

interface MaterialSymbolProps {
  icon: string;
  size?: 'small' | 'normal' | 'large';
  weight?: number;
  fill?: 0 | 1;
  grade?: number;
  opticalSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const MaterialSymbol: React.FC<MaterialSymbolProps> = ({
  icon,
  size = 'normal',
  weight = 400,
  fill = 0,
  grade = 0,
  opticalSize = 24,
  className,
  style,
  ...props
}) => {
  const sizeClasses = {
    small: 'text-base',  // ~16px
    normal: 'text-lg',   // ~20px
    large: 'text-xl',    // ~24px
  };

  const symbolStyle = {
    fontSize: `${opticalSize}px`,
    fontWeight: weight,
    fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
    ...style,
  };

  return (
    <span
      className={cn(
        'material-symbols-rounded select-none align-middle',
        sizeClasses[size],
        className
      )}
      style={symbolStyle}
      {...props}
    >
      {icon}
    </span>
  );
};