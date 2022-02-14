import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, ChangePassword } from 'app/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { authSelector, AuthLoading, authLoadingSelector } from 'app/store/reducers/auth.reducer';
import { User } from 'app/models/user.model';
import { Observable } from 'rxjs';
import { ValidateForm } from 'app/common/helpers/form-validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public changePasswordForm: FormGroup;
  public userCurrent: User;
  public loadingAuth$: Observable<AuthLoading>
  public changePasswordFormErrors: any;
  constructor(private store: Store<AppState>) {
    // this.store.pipe(select(authSelector)).subscribe(user => this.userCurrent = )
    this.changePasswordFormErrors = {
      oldPassword: {},
      newPassword: {},
      confirmPassword: {}
    }
   }

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required])
    });
    this.changePasswordForm.valueChanges.subscribe(() => {
      ValidateForm(this.changePasswordFormErrors, this.changePasswordForm);
    });
  }

  public changePassword() {
    const userId = '119';
    const oldPassword = this.changePasswordForm.controls['oldPassword'].value;
    const newPassword = this.changePasswordForm.controls['newPassword'].value;
    this.store.dispatch(new ChangePassword(userId, oldPassword, newPassword));
    this.loadingAuth$ = this.store.pipe(select(authLoadingSelector));
  }

}
