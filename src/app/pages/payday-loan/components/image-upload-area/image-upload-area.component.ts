import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import urlToFile from '../../../../core/utils/url-to-file';
import getUrlExtension from '../../../../core/utils/get-url-extension';
import getFileNameAndExt from '../../../../core/utils/get-file-name-and-extension';
import isBase64 from '../../../../core/utils/is-base-64';
import getUrlFileName from '../../../../core/utils/get-url-file-name';

@Component({
  selector: 'image-upload-area',
  templateUrl: './image-upload-area.component.html',
  styleUrls: ['./image-upload-area.component.scss'],
})
export class ImageUploadAreaComponent implements OnInit, AfterViewInit {
  @Input() initValue: string;
  @Input() placeholderImageSrc: string;
  @Input() filledTitle: string;
  @Input() uploadHint: string;
  @Input() uploadTitle: string;
  @Input() required: boolean = false;
  @Input() isManualUploadFile: boolean = false;
  @Input() name: string = 'image-upload-area';
  @Input() acceptFileType: string =
    'image/png, image/jpeg, image/jpg, application/pdf, application/zip,application/x-zip,application/x-zip-compressed, application/x-rar-compressed, application/octet-stream';
  @Input() rules: string;
  @Input() id: string;
  @Input() disabled: boolean = false;

  _imageSrc: any;
  get imageSrc(): any {
    return this._imageSrc;
  }

  @Input() set imageSrc(newVal: any) {
    if (!newVal) {
      this.triggerClickResetInput();
      this.file = null;
    }
    this.image = newVal;
    this._imageSrc = newVal;
  }

  _file: any;
  get file(): any {
    return this._file;
  }

  set file(newVal: any) {
    if (this.isManualUploadFile && newVal && newVal['name']) {
      this.fileName = getFileNameAndExt(newVal['name'])[0];
      this.fileType = getFileNameAndExt(newVal['name'])[1];
    }
    this._file = newVal;
  }

  @Output() receiveResult = new EventEmitter<any>();
  @Output() changeImage = new EventEmitter<string>();
  @Output() uploadImage = new EventEmitter<string>();

  image: any = null;
  fileName: string = '';
  fileType: string = '';

  constructor() {}

  ngOnInit(): void {}

  initImgSrc(value): void {
    if (!value) {
      this.triggerClickResetInput();
      this.file = null;
    }
    this.image = value;
    if (!this.isManualUploadFile || !value || isBase64(value)) {
      return;
    }

    urlToFile(value, getUrlFileName(value), getUrlExtension(value)).then(
      (file) => {
        this.file = file;
      }
    );
  }

  uploadImg(): void {
    if (this.isManualUploadFile) {
      this.triggerClickUploadImg();
    }

    this.uploadImage.emit('uploadImage');
  }

  triggerClickUploadImg(): void {
    let manualUploadInput: HTMLElement = document.getElementById(
      `manual-upload-input-${this.id}`
    ) as HTMLElement;
    if (!manualUploadInput) return;
    manualUploadInput.click();
  }

  triggerClickResetInput(): void {
    let resetInput: HTMLElement = document.getElementById(
      `reset-manual-upload-input-${this.id}`
    ) as HTMLElement;
    if (!resetInput) return;
    resetInput.click();
  }

  changeImageSrc(): void {
    if (this.isManualUploadFile) {
      this.triggerClickUploadImg();
    }
    this.changeImage.emit('changeImage');
  }

  onFileChange(e): void {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.getValidFile(files[0]);
  }

  createImage(file): void {
    let reader = new FileReader();
    reader.onload = (e) => {
      this.image = e.target.result;
      this.receiveResult.emit({
        imgSrc: this.image,
        file: file,
      });
    };
    reader.readAsDataURL(file);
  }

  getValidFile(file) {
    if (!(file instanceof File)) {
      return null;
    }
    this.file = file;
    this.createImage(file);
  }

  ngAfterViewInit(): void {
    this.initImgSrc(this.imageSrc);
  }
}
