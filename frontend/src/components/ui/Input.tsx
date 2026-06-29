import * as React from 'react';
import { Input as KumoInput } from '@cloudflare/kumo/components/input';
import { InputArea as KumoInputArea } from '@cloudflare/kumo/components/input';
import { cn } from '../../lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
}

// Kumo Input forwards its ref to the underlying input element, so React Hook Form
// `register()` (ref/name/onChange/onBlur) keeps working. Label/error are passed to
// Kumo's built-in Field wrapper. We deliberately do NOT pass `required`: Kumo's
// Field shows a gray "(optional)" hint when `required` is explicitly `false`, so
// omitting it keeps labels clean (no "(optional)" and no required asterisk).
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, error, ...props }, ref) => (
  <KumoInput
    ref={ref}
    label={label}
    error={error}
    className={cn('border border-console-line', className)}
    {...props}
  />
));
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <KumoInputArea
      ref={ref}
      label={label}
      error={error}
      className={cn('min-h-28 border border-console-line', className)}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
