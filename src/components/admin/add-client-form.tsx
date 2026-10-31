//#region File Documentation
/**
 * File: src/components/admin/add-client-form.tsx
 * Updated: 2026-10-30
 *
 * Purpose:
 * - Add-client form with zod validation, inline errors, toast messages and loading state.
 * - Rendering model: Client Component (needs state, events and the router).
 *
 * Changes:
 * - New file.
 *
 * Safety:
 * - Validates with the same createClientSchema the API uses, then POSTs to /api/clients.
 * - Server validation (400) and duplicate (409) errors are mapped back onto the fields.
 * - The submit button is disabled while a request is running, which prevents double submits.
 *
 * Connected Modules:
 * - src/lib/validations.ts, src/components/admin/form-field.tsx, src/data/admin-copy.ts,
 *   src/types/client.ts, /api/clients
 *
 * Dependencies:
 * - sonner: toast messages.
 * - zod (via validations): form validation.
 */
//#endregion

'use client';

import { FormField, getFieldId } from '@/components/admin/form-field';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { adminCopy, CLIENT_FORM_FIELDS } from '@/data/admin-copy';
import { createClientSchema } from '@/lib/validations';
import type {
    ApiErrorBody,
    ApiFieldIssue,
    ClientFormErrors,
    ClientFormValues,
} from '@/types/client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';

const EMPTY_VALUES: ClientFormValues = {
  name: '',
  websiteUrl: '',
  businessType: '',
  city: '',
  state: '',
  contactEmail: '',
  whatsappNumber: '',
};

function isFieldName(name: string): name is keyof ClientFormValues {
  return name in EMPTY_VALUES;
}

function toFieldErrors(issues: ApiFieldIssue[]): ClientFormErrors {
  const errors: ClientFormErrors = {};
  for (const issue of issues) {
    if (isFieldName(issue.field) && !errors[issue.field]) {
      errors[issue.field] = issue.message;
    }
  }
  return errors;
}

function focusFirstError(errors: ClientFormErrors): void {
  const first = CLIENT_FORM_FIELDS.find((field) => errors[field.name]);
  if (first) {
    document.getElementById(getFieldId(first.name))?.focus();
  }
}

export function AddClientForm() {
  const router = useRouter();
  const [values, setValues] = useState<ClientFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ClientFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(name: string, value: string): void {
    if (!isFieldName(name)) return;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) =>
      previous[name] ? { ...previous, [name]: undefined } : previous
    );
  }

  function showFieldErrors(nextErrors: ClientFormErrors): void {
    setErrors(nextErrors);
    toast.error(adminCopy.toast.fixErrors);
    focusFirstError(nextErrors);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    if (isSubmitting) return;

    const parsed = createClientSchema.safeParse(values);
    if (!parsed.success) {
      showFieldErrors(
        toFieldErrors(
          parsed.error.issues.map((issue) => ({
            field: String(issue.path[0] ?? ''),
            message: issue.message,
          }))
        )
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success(adminCopy.toast.created(parsed.data.name));
        setValues(EMPTY_VALUES);
        setErrors({});
        router.refresh();
        return;
      }

      const body = (await response
        .json()
        .catch(() => null)) as ApiErrorBody | null;

      if (response.status === 400 && body?.details) {
        showFieldErrors(toFieldErrors(body.details));
        return;
      }
      if (response.status === 409) {
        const duplicateErrors: ClientFormErrors = {
          websiteUrl: adminCopy.toast.duplicate,
        };
        setErrors(duplicateErrors);
        toast.error(adminCopy.toast.duplicate);
        focusFirstError(duplicateErrors);
        return;
      }
      toast.error(body?.error ?? adminCopy.toast.genericError);
    } catch {
      toast.error(adminCopy.toast.networkError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-base font-semibold">{adminCopy.form.title}</h2>
        </CardTitle>
        <CardDescription>{adminCopy.form.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-busy={isSubmitting}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {CLIENT_FORM_FIELDS.map((field) => (
              <FormField
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
                inputMode={field.inputMode}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                optionalText={
                  field.optional ? adminCopy.form.optional : undefined
                }
                value={values[field.name]}
                error={errors[field.name]}
                disabled={isSubmitting}
                className={
                  field.wide ? 'sm:col-span-2 lg:col-span-1' : undefined
                }
                onChange={handleChange}
              />
            ))}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 w-full sm:w-auto lg:w-full"
          >
            {isSubmitting ? adminCopy.form.submitting : adminCopy.form.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
