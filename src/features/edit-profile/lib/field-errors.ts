import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { isApiError } from '@/shared/api';

export function applyFieldErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>) {
  if (!isApiError(error) || !error.fieldErrors) {
    return;
  }
  for (const [field, messages] of Object.entries(error.fieldErrors)) {
    const message = messages[0];
    if (!message) {
      continue;
    }
    setError(field as Path<T>, { type: 'server', message });
  }
}
