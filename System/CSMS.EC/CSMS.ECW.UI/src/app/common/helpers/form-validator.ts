import { FormGroup } from '@angular/forms';

// tslint:disable:no-any
export function ValidateForm(formErrors: any, form: FormGroup) {
    for (const field in formErrors) {
      if (!formErrors.hasOwnProperty(field)) {
        continue;
      }
      // Clear previous errors
      formErrors[field] = {};
      // Get the control
      const control = form.get(field);
      if (control && (control.dirty && !control.valid || !control.value)) {
        formErrors[field] = control.errors;
      }
    }
  }
