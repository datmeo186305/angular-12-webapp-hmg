import {Component, Input, OnInit} from '@angular/core';
import {PL_LABEL_STATUS} from "../../../../core/common/enum/label-status";

@Component({
  selector: 'pl-status-label',
  templateUrl: './pl-status-label.component.html',
  styleUrls: ['./pl-status-label.component.scss']
})
export class PlStatusLabelComponent implements OnInit {
  @Input() statusType: string = PL_LABEL_STATUS.SUCCESS;

  get statusClasses() {
    return {
      "pl-status-label-pending": this.statusType === PL_LABEL_STATUS.PENDING,
      "pl-status-label-success": this.statusType === PL_LABEL_STATUS.SUCCESS,
      "pl-status-label-disbursement":
        this.statusType === PL_LABEL_STATUS.DISBURSEMENT,
      "pl-status-label-rejected": this.statusType === PL_LABEL_STATUS.REJECT,
      "pl-status-label-cancel": this.statusType === PL_LABEL_STATUS.CANCEL
    };
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
