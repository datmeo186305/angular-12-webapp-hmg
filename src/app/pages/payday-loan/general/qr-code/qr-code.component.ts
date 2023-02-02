import {Component, OnInit} from '@angular/core';
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {

  qrCodeSrc = environment.QR_CODE_SRC;

  constructor() {
  }

  ngOnInit(): void {
  }

}
