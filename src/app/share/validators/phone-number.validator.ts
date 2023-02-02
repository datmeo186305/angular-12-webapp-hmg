import { Directive } from "@angular/core";
import {
  NG_VALIDATORS,
  FormControl,
  Validator,
  ValidationErrors
} from "@angular/forms"; // Will import the angular forms

@Directive({
  selector: "[phone-number-validate]",

  providers: [
    { provide: NG_VALIDATORS, useExisting: PhoneNumberValidatorDirective, multi: true }
  ]
})
export class PhoneNumberValidatorDirective implements Validator {
  // Creating class implementing Validator interface

  validate(c: FormControl): ValidationErrors {
    // Custom regex for a phone number
    const PASSREG = /^((0|\+84)[1|3|5|7|8|9])+([0-9]{8})$/;

    // Check for either of these to return true
    const isValid = PASSREG.test(c.value);

    const message = {
      phoneNumber: {
        message: "Số điện thoại không đúng định dạng" // Will changes the error defined in errors helper.
      }
    };

    return isValid ? null : message;
  }
}
