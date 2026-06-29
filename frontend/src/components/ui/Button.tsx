import * as React from 'react';
import { Button as KumoButton } from '@cloudflare/kumo/components/button';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

// Map SkillForge wrapper variants/sizes onto Kumo Button's API so existing pages
// keep passing the same props they used before the Kumo migration.
const variantMap = {
  primary: 'primary',
  secondary: 'secondary',
  ghost: 'ghost',
  danger: 'destructive',
} as const;

const sizeMap = {
  sm: 'sm',
  md: 'base',
} as const;

export function Button({ className, variant = 'primary', size = 'md', type = 'button', ...props }: ButtonProps) {
  return (
    <KumoButton
      type={type}
      variant={variantMap[variant]}
      size={sizeMap[size]}
      className={cn(
        variant === 'ghost' ? 'border-0' : variant === 'secondary' ? 'border border-console-line' : 'border border-transparent',
        className,
      )}
      {...props}
    />
  );
}
