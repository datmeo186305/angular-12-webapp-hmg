import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Prompt } from '../../../../public/models/prompt.model';
import { BUTTON_TYPE } from '../../../../core/common/enum/prompt';

@Component({
  selector: 'pl-prompt',
  templateUrl: './pl-prompt.component.html',
  styleUrls: ['./pl-prompt.component.scss'],
})
export class PlPromptComponent implements OnInit {
  promptContent: Prompt = {
    title: '',
    content: '',
    secondaryBtnText: '',
    secondaryBtnClass: 'btn-secondary',
    primaryBtnText: '',
    primaryBtnClass: 'btn-primary',
    disabledBtn: false,
    imgGroupUrl: null,
    imgUrl: null,
    imgBackgroundClass: null,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Prompt,
    private dialogRef: MatDialogRef<PlPromptComponent>
  ) {
    dialogRef.disableClose = true;
    if (data) {
      this.promptContent = {
        title: data.title,
        content: data.content,
        secondaryBtnText: data.secondaryBtnText,
        secondaryBtnClass: data.secondaryBtnClass || 'btn-secondary',
        primaryBtnText: data.primaryBtnText,
        primaryBtnClass: data.primaryBtnClass || 'btn-primary',
        disabledBtn: data.disabledBtn,
        imgGroupUrl: data.imgGroupUrl,
        imgUrl: data.imgUrl,
        imgBackgroundClass: data.imgBackgroundClass,
      };
    }
  }

  ngOnInit(): void {}

  clickSecondary() {
    this.dialogRef.close(BUTTON_TYPE.SECONDARY);
  }

  clickPrimary() {
    this.dialogRef.close(BUTTON_TYPE.PRIMARY);
  }
}
