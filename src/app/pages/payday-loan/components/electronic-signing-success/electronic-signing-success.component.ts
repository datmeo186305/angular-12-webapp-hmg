import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'electronic-signing-success',
  templateUrl: './electronic-signing-success.component.html',
  styleUrls: ['./electronic-signing-success.component.scss']
})
export class ElectronicSigningSuccessComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() title: string;
  @Input() bodyText: string;
  @Input() disabledBtn: boolean = false;
  @Input() btnText: string;
  @Output() btnClick = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  confirmOk() {
    this.btnClick.emit("btnClick");
  }

}
