import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-tet',
  templateUrl: './event-tet.component.html',
  styleUrls: ['./event-tet.component.scss'],
})
export class EventTetComponent implements OnInit {
  isShowDetailEvent: boolean = false;
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data,
    private router: Router,
    private matDialog: MatDialogRef<EventTetComponent>
  ) {}

  ngOnInit(): void {}

  redirectToLogin() {
    this.matDialog.close()
    this.router.navigateByUrl(
      '/auth/sign-in?utm_source=ALL&utm_medium=Display&utm_campaign=tet2022&utm_content=vuitet-auth-sign-in'
    );
  }
}
