import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // color class: alert-primary, alert-info, alert-success, alert-warning, alert-danger

  constructor(private toastr: ToastrService) { }

  public success(message: string) {
    this.toastr.success(
      '<span data-notify="icon" class="nc-icon nc-check-2"></span><span data-notify="message">'
      + '<b>Success</b> - ' + message + '.</span>',
      '',
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        toastClass: 'alert alert-info alert-with-icon',
        positionClass: 'toast-top-right'
      }
    );
  }

  public error(message: string) {
    this.toastr.error(
      '<span data-notify="icon" class="nc-icon nc-simple-remove"></span><span data-notify="message">'
      + '<b>Error</b> - ' + message + '.</span>',
      '',
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        toastClass: 'alert alert-danger alert-with-icon',
        positionClass: 'toast-top-right'
      }
    );
  }
}
