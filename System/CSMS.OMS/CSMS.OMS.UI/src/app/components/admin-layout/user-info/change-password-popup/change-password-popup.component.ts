import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { SpinnerColor, SpinnerType } from '../../../../commons/consts/spinner.const';

@Component({
  selector: 'app-change-password-popup',
  templateUrl: './change-password-popup.component.html'
})
export class ChangePasswordPopupComponent extends DialogComponent<any, any> {

  public loading = false;
  public error = false;
  public errorMessage = '';
  public SpinnerType = SpinnerType;
  public SpinnerColor = SpinnerColor;

  public userId: number;

  constructor(
    public dialogService: DialogService, ) {
    super(dialogService);
  }

  public onSave(): void {
    this.loading = true;
    if (!this.isDataValid()) {
      this.loading = false;
      return;
    }
  }

  public onCancel(): void {
    this.result = undefined;
    this.close();
  }

  private isDataValid(): boolean {
    // if ( ) {
    //   this.error = true;
    //   this.errorMessage = 'Some data cannot null';

    //   return false;
    // }

    this.error = false;
    return true;
  }
}
