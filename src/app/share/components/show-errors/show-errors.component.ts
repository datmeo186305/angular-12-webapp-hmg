import {Component, Input} from "@angular/core";

import {AbstractControl, AbstractControlDirective} from "@angular/forms";

@Component({
  selector: "show-errors",
  template: `
    <div class="mat-form-field-subscript-wrapper validation-errors" [ngClass]="{'has-icon-prefix': isHasIconPrefix()}">
      <div class="ng-trigger ng-trigger-transitionMessages ng-star-inserted error-msg-box"
           [ngClass]="{'error-msg-box-active': shouldShowErrors() }">
        <mat-error class="error-msg" *ngIf="shouldShowErrors()">{{getError()}}</mat-error>
      </div>
    </div>
  `,
  styleUrls: ['../../../../styles/payday-loan/_validator.scss']
})
export class ShowErrorsComponent {
  private static readonly errorMessages: any = {
    required: (params: any) => "##FIELD## không được để trống",

    minlength: (params: any) =>
      "##FIELD## phải có tối thiểu " + params.requiredLength + " ký tự",

    maxlength: (params: any) =>
      "##FIELD## không được lớn hơn " +
      params.requiredLength +
      " ký tự",

    pattern: (params: any) => "##FIELD## phải là định dạng hợp lệ.",

    email: (params: any) => "##FIELD## không đúng định dạng.",

    strongPassword: (params: any) => "##FIELD## phải gồm ít nhất 6 ký tự",

    phoneNumber: (params: any) => "##FIELD## không đúng định dạng.",

    confirmPassword: (params:any) => "##FIELD## không trùng khớp."
  };

  @Input() private control: AbstractControlDirective | AbstractControl;
  @Input() private controlLabel: string;
  @Input() private hasIconPrefix: boolean = false;

  shouldShowErrors(): boolean {
    return (
      this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched)
    );
  }

  isHasIconPrefix(): boolean {
    return this.hasIconPrefix;
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors)
      .map(field =>
        this.getMessage(field, this.control.errors[field], this.control)
      );
  }

  getError(): string {
    var errors = Object.keys(this.control.errors)
      .map(field =>
        this.getMessage(field, this.control.errors[field], this.control)
      );

    return errors[0];
  }

  private getMessage(type: string, params: any, control: any) {

    let msg: any = ShowErrorsComponent.errorMessages[type](params);

    if (this.controlLabel) {
      return msg.replace("##FIELD##", this.controlLabel);
    }

    let fname = this.getControlName(control);

    fname = fname
      .replace("_", " ")
      .replace(" id", "")
      .toLowerCase();

    fname = fname.replace(/\b\w/g, l => l.toUpperCase());

    return msg.replace("##FIELD##", fname);
  }

  getControlName(c: AbstractControl): string | null {
    const formGroup: any = c.parent.controls;

    return Object.keys(formGroup).find(name => c === formGroup[name]) || null;
  }
}
