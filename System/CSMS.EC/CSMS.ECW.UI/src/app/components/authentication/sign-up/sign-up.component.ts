import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserToCreate } from 'app/models/user.model';
import { Store, select } from '@ngrx/store';
import { AppState, CreateUser, AuthActionTypes, CreateUserSuccess } from 'app/store';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthLoading, authLoadingSelector } from 'app/store/reducers/auth.reducer';
import { ValidateForm } from 'app/common/helpers/form-validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public createUserForm: FormGroup;
  public loading$: Observable<AuthLoading>;
  public signUpFormErrors: any;
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SignUpComponent>,
    private store: Store<AppState>,
    private dispatcher: Actions,
  ) {
    this.dispatcher
    .pipe(
      ofType(
        AuthActionTypes.CreateUserSuccessAction,
      ),
      filter(
        (action: CreateUserSuccess) =>
          action instanceof CreateUserSuccess
      ),
    )
    .subscribe(action => {
      this.close();
    });
    this.signUpFormErrors = {
      firstName: {},
      middleName: {},
      lastName: {},
      phoneNumber: {},
      email: {},
      password: {},
      birthday: {},
      gender: {}
    };
   }

  ngOnInit() {
    this.createUserForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      birthday: new FormControl(''),
      gender: new FormControl('')
    });
    this.createUserForm.valueChanges.subscribe(() => {
      ValidateForm(this.signUpFormErrors, this.createUserForm);
    });
    this.loading$ = this.store.pipe(select(authLoadingSelector));
  }

  public close() {
    this.dialogRef.close();
  }

  public openModalLogin() {
    this.dialog.open(LoginComponent,
      {
        width: '40%',
      })
    this.closeDialog();
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public signUp() {
    const signUpForm: UserToCreate = {
      firstName: this.createUserForm.controls['firstName'].value,
      middleName: this.createUserForm.controls['middleName'].value,
      lastName: this.createUserForm.controls['lastName'].value,
      phoneNumber: this.createUserForm.controls['phoneNumber'].value,
      email: this.createUserForm.controls['email'].value,
      password: this.createUserForm.controls['password'].value,
      birthday: this.createUserForm.controls['birthday'].value,
      gender: this.createUserForm.controls['gender'].value,
    };
    this.store.dispatch(new CreateUser(signUpForm))
  }

}
