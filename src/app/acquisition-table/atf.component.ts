import { Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export class ATFComponent {

  // Study data injected into this component
  @Input()
  data;

  // This component's form
  form: FormGroup;


  validateAllFormFields(formGroup: FormGroup = this.form) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      console.log(field);

      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  isValid(field: string) {
    const control = this.form.get(field);

    if (control instanceof FormControl) {
      return control.valid || !control.touched;
    } else {
      return control.valid;
    }
  }

  displayFieldCss(field: string) {
    return {
      'is-invalid': !this.isValid(field)
    };
  }

  reset() {
    this.form.reset();
  }
}