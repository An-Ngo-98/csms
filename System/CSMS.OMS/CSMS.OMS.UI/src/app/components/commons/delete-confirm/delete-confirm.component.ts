import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogService } from 'angularx-bootstrap-modal';
import { Message } from '../../../commons/consts/message.const';
import { PopupConfirmComponent } from '../popup-confirm/popup-confirm.component';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html'
})
export class DeleteConfirmComponent {

  @Input() public title: string = Message.Common.DELETE_TITLE_COMMON;
  @Input() public message: string = Message.Common.DELETE_COMMON;
  @Input() public id: string;
  @Input() public visible = true;
  @Input() public disabled = false;
  @Input() public iconSize = 'lg';
  @Input() public isRoundIcon = false;
  @Output() public executeDelete: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private dialogService: DialogService) { }

  public confirmDelete(): void {
    if (!this.disabled) {
      this.dialogService.addDialog(PopupConfirmComponent, {
        title: this.title,
        message: this.message
      }).subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.executeDelete.emit();
        }
      });
    }
  }
}
