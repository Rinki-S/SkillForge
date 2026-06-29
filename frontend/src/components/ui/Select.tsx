import * as React from 'react';
import { cn } from '../../lib/utils';

// NOTE: Intentionally kept as a native <select> for this Kumo adoption pass.
// Kumo Select is a Base UI component using `items` + `onValueChange(value)` and
// renders no native <select> element, so it is NOT drop-in compatible with the
// current usage: controlled `onChange(event)` filters (Marketplace/Admin/SkillDetail)
// and React Hook Form `register()` spreads in SkillForm (categoryId, modelType,
// variables.N.type). Migrating to Kumo Select requires a Controller-based adapter
// and dedicated form testing; that is deferred to a follow-up change. The label
// styling matches the Kumo-backed Input wrapper so the control still reads as
// part of the console design system.
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder = '请选择', ...props }, ref) => (
    <label className="space-y-1.5">
      {label ? <span className="sf-label">{label}</span> : null}
      <select ref={ref} className={cn('sf-input', className)} {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="sf-error">{error}</p> : null}
    </label>
  ),
);
Select.displayName = 'Select';
