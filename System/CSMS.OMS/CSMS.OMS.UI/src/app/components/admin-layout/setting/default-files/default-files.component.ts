import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SystemService } from '../../../../services/system/system.service';
import { CsmsDefaultFile } from '../../../../models/system-data/default-files.model';
import { NotificationService } from '../../../../services/notification.service';
import { Message } from '../../../../commons/consts/message.const';
import { AppService } from '../../../../configs/app-service';
import { ApiController } from '../../../../commons/consts/api-controller.const';

@Component({
  selector: 'app-default-files',
  templateUrl: './default-files.component.html'
})
export class DefaultFilesComponent implements OnInit {

  private editingFileIndex: number = null;
  private photoSize = 300;
  private photoUrl = AppService.getPath(ApiController.CdnApi.DefaultFiles + '{0}/' + '?size={1}');

  public loading = true;
  public errorMessage = '';
  public files: CsmsDefaultFile[] = [];

  @ViewChild('fileSelect', { static: false }) fileInput: ElementRef;

  constructor(
    private systemService: SystemService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.systemService.getListDefaultFile().subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.loading = false;
          this.files = res;
        } else {
          this.loading = false;
          this.errorMessage = Message.DefaultFiles.LOAD_FILES_FAIL;
          this.notificationService.error(Message.DefaultFiles.LOAD_FILES_FAIL);
        }
      }, (err) => {
        this.loading = false;
        this.errorMessage = Message.DefaultFiles.LOAD_FILES_FAIL;
        this.notificationService.error(Message.DefaultFiles.LOAD_FILES_FAIL);
      }
    )
  }

  public onClickUpload(index): void {
    this.editingFileIndex = index;
    this.fileInput.nativeElement.click()
  }

  public saveFile(files: FileList): void {

    if (files.length === 0 && !this.editingFileIndex) {
      return;
    }

    const fileType = files[0].type;
    if (fileType.match(/image\/*/) === null) {
      this.errorMessage = 'Only images are supported';
      return;
    }

    this.loading = true;
    this.systemService.saveDefaultPhoto(
      this.files[this.editingFileIndex].defaultType,
      this.files[this.editingFileIndex].title,
      files.item(0)
    ).subscribe(
      (res) => {
        if (res) {
          this.files[this.editingFileIndex].isNew = new Date().getTime().toString();
        } else {
          this.notificationService.error(Message.DefaultFiles.SAVE_PHOTO_FAIL);
        }

        this.loading = false;
        this.editingFileIndex = null;
      }, (err) => {
        this.loading = false;
        this.editingFileIndex = null;
        this.notificationService.error(Message.DefaultFiles.SAVE_PHOTO_FAIL);
      }
    )
  }

  public getPhotoUrl(fileId: number, isNew: string = null, size = this.photoSize) {
    let result = this.photoUrl.replace('{0}', fileId.toString()).replace('{1}', size.toString());
    result += isNew ? '&reload=' + isNew : '';

    return result;
  }
}
