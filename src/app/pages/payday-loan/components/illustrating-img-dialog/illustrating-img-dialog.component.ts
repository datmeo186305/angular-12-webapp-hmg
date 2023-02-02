import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-illustrating-img-dialog',
  templateUrl: './illustrating-img-dialog.component.html',
  styleUrls: ['./illustrating-img-dialog.component.scss'],
})
export class IllustratingImgDialogComponent implements OnInit {
  isTng: boolean = false;

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data) {
    if (data?.isTng) {
      this.isTng = data?.isTng
    }
  }

  ngOnInit(): void {}
}
