import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState, Login, AuthActionTypes, CreateUserSuccess, LoginSuccess, SignUpSocial } from 'app/store';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
import { AuthServiceLocal } from 'app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthLoading, authLoadingSelector } from 'app/store/reducers/auth.reducer';
import { SpinnerColor } from 'app/common/spinner.const';
import { ValidateForm } from 'app/common/helpers/form-validator';
import { GoogleLoginProvider, FacebookLoginProvider, AuthService } from 'angular-6-social-login';
import { SocialLoginModule, AuthServiceConfig } from 'angular-6-social-login';
import { UserService } from 'app/services/user/user.service';
import { Socialusers } from 'app/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit {
  public loginForm: FormGroup;
  public loading$: Observable<AuthLoading>;
  public loginFormErrors: any;
  public socialusers: Socialusers;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LoginComponent>,
    private dispatcher: Actions,
    private store: Store<AppState>,
    public OAuth: AuthService,
    private SocialloginService: AuthServiceLocal,
    private router: Router
  ) {
    this.dispatcher
    .pipe(
      ofType(
        AuthActionTypes.LoginSuccessAction,
      ),
      filter(
        (action: LoginSuccess) =>
          action instanceof LoginSuccess
      ),
    )
    .subscribe(action => {
      this.close();
    });
    this.loginFormErrors = {
      email: {},
      password: {}
    };
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    this.loginForm.valueChanges.subscribe(() => {
      ValidateForm(this.loginFormErrors, this.loginForm);
    });

    this.loading$ = this.store.pipe(select(authLoadingSelector));
  }

  public openModalSignUp() {
    this.dialog.open(SignUpComponent, {
      width: '40%',
    })
    this.close();
  }

  public close() {
    this.dialogRef.close();
  }

  public login() {
    const username = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;
    this.store.dispatch(new Login(username, password));
  }

  public socialSignIn(socialProvider: string) {
    let socialPlatformProvider;
    if (socialProvider === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialProvider === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.OAuth.signIn(socialPlatformProvider).then(socialusers => {
      console.log(socialProvider, socialusers);
      console.log(socialusers);
      // this.Savesresponse(socialusers);
      const newUser: Socialusers = {
        email: socialusers.email,
        name: socialusers.name
      }
      this.store.dispatch(new SignUpSocial(newUser));
    });
  }
  // Savesresponse(socialusers: Socialusers) {
  //   // this.store.dispatch(new SignUpSocial(socialusers));
  //   this.SocialloginService.signUpSocical(socialusers).subscribe((res: any) => {
  //     console.log(res);
  //     this.socialusers = res;
  //     // this.response = res.userDetail;
  //     localStorage.setItem('socialusers', JSON.stringify( this.socialusers));
  //     console.log(localStorage.setItem('socialusers', JSON.stringify(this.socialusers)));
  //     this.router.navigate([`/Dashboard`]);
  //   })
  // }
}
