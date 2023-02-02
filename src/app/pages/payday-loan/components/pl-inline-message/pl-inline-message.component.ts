import {Component, Input, OnInit} from '@angular/core';
import {PL_MESSAGE_TYPE} from "../../../../core/common/enum/label-status";

@Component({
  selector: 'pl-inline-message',
  templateUrl: './pl-inline-message.component.html',
  styleUrls: ['./pl-inline-message.component.scss']
})
export class PlInlineMessageComponent implements OnInit {
  @Input() messageType: string = PL_MESSAGE_TYPE.INFORMATION;

  get statusClasses() {
    return {
      "pl-inline-message-warning":
        this.messageType === PL_MESSAGE_TYPE.WARNING,
      "pl-inline-message-success":
        this.messageType === PL_MESSAGE_TYPE.SUCCESS,
      "pl-inline-message-info":
        this.messageType === PL_MESSAGE_TYPE.INFORMATION
    };
  }

  get statusIconSrc() {
    switch (this.messageType) {
      case PL_MESSAGE_TYPE.WARNING:
        return "sprite-group-3-warning-message-icon";
      case PL_MESSAGE_TYPE.SUCCESS:
        return "sprite-group-3-checkmark-circle-green";
      case PL_MESSAGE_TYPE.INFORMATION:
      default:
        return "sprite-group-3-info-message-icon";
    }
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
