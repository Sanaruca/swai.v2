import { ValidatorFn } from '@angular/forms';

export function validateIf(
  condition: boolean,
  validator: ValidatorFn
): ValidatorFn {
  if (condition) return validator;
  return () => null;
}
