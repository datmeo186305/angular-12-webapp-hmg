import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pl-auth-success',
  templateUrl: './pl-auth-success.component.html',
  styleUrls: ['./pl-auth-success.component.scss'],
})
export class PlAuthSuccessComponent implements OnInit {
  @Input() title: string = '';
  @Input() bodyText: string = '';
  @Input() disabledBtn: boolean = false;
  @Input() showBtn: boolean = true;
  @Input() btnText: string = 'Tiếp tục';
  @Output() btnClick: EventEmitter<string>;

  constructor() {
  }

  ngOnInit(): void {
  }

  btnClickTrigger() {
    this.btnClick.emit('btnClick');
  }
}
