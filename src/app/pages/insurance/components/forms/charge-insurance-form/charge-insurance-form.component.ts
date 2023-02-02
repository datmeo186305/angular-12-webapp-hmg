import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'charge-insurance-form',
  templateUrl: './charge-insurance-form.component.html',
  styleUrls: ['./charge-insurance-form.component.scss']
})
export class ChargeInsuranceFormComponent implements OnInit {
  chargeInsuranceForm: FormGroup;

  insurancesPackages = [
    {
      id: 1,
      name: "Bảo hiểm TNDS bắt buộc (xe trên 50cc)"
    },
    {
      id: 2,
      name: "Bảo hiểm TNDS bắt buộc (xe trên 1000cc)"
    }
  ];

  constructor(private formBuilder: FormBuilder) {

    this.chargeInsuranceForm = this.formBuilder.group({
      packageId: [''],
      numberOfVehicle: [''],
      discountCode: [''],
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log('form data is ', this.chargeInsuranceForm.value);
  }

}
