import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step-progress-bar',
  templateUrl: './step-progress-bar.component.html',
  styleUrls: ['./step-progress-bar.component.scss']
})
export class StepProgressBarComponent implements OnInit {

  stepTitles = [
    "Tính phí bảo hiểm",
    "Điền thông tin",
    "Thanh toán"
  ];
  initCurrentStep = 2;

  constructor() { }

  ngOnInit(): void {
  }

}
