import { Directive } from "@angular/core";
import {
  NG_VALIDATORS,
  FormControl,
  Validator,
  ValidationErrors
} from "@angular/forms"; // Will import the angular forms

@Directive({
  selector: "[strong-password-validate]",

  providers: [
    { provide: NG_VALIDATORS, useExisting: StrongPasswordValidatorDirective, multi: true }
  ]
})
export class StrongPasswordValidatorDirective implements Validator {
  // Creating class implementing Validator interface

  validate(c: FormControl): ValidationErrors {
    // Custom regex for a strong password
    const PASSREG = /^.{6,}$/;

    // Check for either of these to return true
    const isValid = PASSREG.test(c.value);

    const message = {
      strongPassword: {
        message: "Mật khẩu phải gồm ít nhất 6 ký tự" // Will changes the error defined in errors helper.
      }
    };

    return isValid ? null : message;
  }
}
