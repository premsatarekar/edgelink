//#region File Documentation
/**
 * File: src/components/admin/form-field.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - One labelled text input with an inline error message.
 * - Rendering model: Presentational component, used inside a Client Component.
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Always renders a visible label. Errors are linked with aria-describedby and aria-invalid.
 * - Inputs are 44px high for touch targets.
 *
 * Connected Modules:
 * - src/components/admin/add-client-form.tsx, src/components/ui/input.tsx, src/components/ui/label.tsx
 *
 * Dependencies:
 * - None.
 */
//#endregion

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function getFieldId(name: string): string {
  return `field-${name}`;
}

interface FormFieldProps {
  name: string;
  label: string;
  value: string;
  type: 'text' | 'email' | 'url' | 'tel';
  inputMode: 'text' | 'email' | 'url' | 'tel';
  placeholder: string;
  autoComplete: string;
  optionalText?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  onChange: (name: string, value: string) => void;
}

export function FormField({
  name,
  label,
  value,
  type,
  inputMode,
  placeholder,
  autoComplete,
  optionalText,
  error,
  disabled,
  className,
  onChange,
}: FormFieldProps) {
  const id = getFieldId(name);
  const errorId = `${id}-error`;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id}>
        {label}
        {optionalText ? (
          <span className="font-normal text-muted-foreground">
            {' '}
            {optionalText}
          </span>
        ) : null}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-11"
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
