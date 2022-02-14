import { Component, OnInit, HostListener } from '@angular/core';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';

export enum TypeButton {
  ConfirmCancel = 0,
  YesNo = 1,
  SureCancel = 2,
  OK = 3,
  YesNoCancel = 4,
  Custom = 5
}

@Component({
  selector: 'app-popup-confirm',
  templateUrl: './popup-confirm.component.html'
})
export class PopupConfirmComponent extends DialogComponent<any, boolean> implements OnInit {

  // Variables
  public title: string = undefined;
  public message: string;
  public typeButton: number = TypeButton.YesNo;
  public modalSize = 'modal-sm';

  public labelButtonConfirmYes: string = undefined;
  public labelButtonConfirmNo: string = undefined;
  public labelButtonCancel: string = undefined;

  constructor(
    public dialogService: DialogService) {
    super(dialogService);
  }

  public ngOnInit(): void {
    switch (this.typeButton) {
      case TypeButton.ConfirmCancel:
      default:
        this.labelButtonConfirmYes = 'Confirm';
        this.labelButtonCancel = 'Cancel';
        break;
      case TypeButton.YesNo:
        this.labelButtonConfirmYes = 'Yes';
        this.labelButtonConfirmNo = 'No';
        break;
      case TypeButton.SureCancel:
        this.labelButtonConfirmYes = 'Sure';
        this.labelButtonCancel = 'Cancel';
        break;
      case TypeButton.OK:
        this.labelButtonConfirmYes = 'Ok';
        this.labelButtonCancel = undefined;
        break;
      case TypeButton.YesNoCancel:
        this.labelButtonConfirmYes = 'Yes';
        this.labelButtonConfirmNo = 'No';
        this.labelButtonCancel = undefined;
        break;
      case TypeButton.Custom:
        break;
    }

    // setTimeout(() => {
    //   $('#md-confirm-btn').trigger('focus');
    // }, 0);
  }

  public onConfirm(result: boolean): void {
    this.result = result;
    this.close();
  }

  public onCancel(): void {
    this.result = undefined;
    this.close();
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault();
    if (event.keyCode === 13) {
      this.onConfirm(true);
    }
  }
}
