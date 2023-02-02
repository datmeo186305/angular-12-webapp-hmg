import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'determine-needs',
  templateUrl: './determine-needs.component.html',
  styleUrls: ['./determine-needs.component.scss']
})
export class DetermineNeedsComponent implements OnInit {
  ageOptions: number[] = []
  jobOptions = ["Làm việc văn phòng", "Hay di chuyển", "Công nhân"]
  genderOptions = ["Nam", "Nữ"]
  vehicleOptions = ["Xe Máy", "Ô tô", "Khác"]
  houseConditionOptions = ["Sở hữu nhà riêng", "Thuê nhà", "Sống cùng bố mẹ", "Khác"]
  dependentPersonOptions = ["Không có người phụ thuộc", "Người thân cao tuổi", "Dự định có con", "Đã có con"]
  genderStartValue = this.genderOptions[0];
  vehicleStartValue = this.vehicleOptions[0];

  infoForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.infoForm =  this.formBuilder.group({
      age: [""],
      gender: [""],
      job: [""],
      vehicle: [""],
      houseCondition: [""],
      dependentPerson: [""]
    })
  }

  dependInfo = {
    label: "Tình trạng người phụ thuộc",
    hint: "",
    options: ["Có", "Không"],
    formControlName: "depend"
  }

  ngOnInit(): void {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear();
    for (let index = 1900; index <= currentYear; index++) {
      this.ageOptions.push(index)
    }
  }

  onInfoSubmit() {
    console.log(this.infoForm);
  }
}
