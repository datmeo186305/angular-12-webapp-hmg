import { Directive } from "@angular/core";
import {
  NG_VALIDATORS,
  FormControl,
  Validator,
  ValidationErrors
} from "@angular/forms"; // Will import the angular forms

@Directive({
  selector: "[confirm-password-validate]",

  providers: [
    { provide: NG_VALIDATORS, useExisting: ConfirmPasswordValidatorDirective, multi: true }
  ]
})
export class ConfirmPasswordValidatorDirective implements Validator {
  // Creating class implementing Validator interface

  validate(c: FormControl): ValidationErrors {

    const isValid = c.value === c.parent.controls["password"].value

    const message = {
      confirmPassword: {
        message: "Xác nhận mật khẩu không trùng khớp." // Will changes the error defined in errors helper.
      }
    };
    
    return isValid ? null : message;
  }
}


// matchValues(
//   matchTo: string // name of the control to match to
// ): (AbstractControl) => ValidationErrors | null {
//   return (control: AbstractControl): ValidationErrors | null => {
//     return !!control.parent &&
//       !!control.parent.value &&
//       control.value === control.parent.controls[matchTo].value
//       ? null
//       : { isMatching: false };
//   };
// }