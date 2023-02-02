import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
  zaloURL: string =
    environment.ZALO_URL || 'https://zalo.me/2848902721585176437';
  fbMessURL: string = environment.FB_MESSENGER_URL || 'https://m.me/monexvn';

  @Input() isLandingPage: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
