import {Component, Input, OnInit} from '@angular/core';
import {CustomerInfoResponse} from "../../../../../../open-api-modules/customer-api-docs";

@Component({
  selector: 'pl-current-loan-user-info',
  templateUrl: './pl-current-loan-user-info.component.html',
  styleUrls: ['./pl-current-loan-user-info.component.scss']
})
export class PlCurrentLoanUserInfoComponent implements OnInit {
  @Input() userInfo: CustomerInfoResponse;
  constructor() { }

  ngOnInit(): void {
  }

}
