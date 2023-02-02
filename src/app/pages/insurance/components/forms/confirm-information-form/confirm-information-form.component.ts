import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'insurance-confirm-information-form',
  templateUrl: './confirm-information-form.component.html',
  styleUrls: ['./confirm-information-form.component.scss']
})
export class ConfirmInformationFormComponent implements OnInit {
  confirmInformationForm: FormGroup;

  provinceOptions = [
    {
      id: 1,
      name: "Hà Nội"
    },
    {
      id: 2,
      name: "TP HCM"
    }
  ];
  constructor(private formBuilder: FormBuilder) {

    this.confirmInformationForm = this.formBuilder.group({
      vehicleOwnerName: [''],
      vehicleProvince: [''],
      vehicleAddress: [''],
      vehicleStartTime: [''],
      vehicleNumber: [''],
      machineNumber: [''],
      frameNumber: [''],
      receiverName: [''],
      receiverProvince: [''],
      receiverAddress: [''],
      receiverEmail: [''],
      receiverPhoneNumber: [''],
      confirmPolicy: [''],
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log('form data is ', this.confirmInformationForm.value);
  }

}
