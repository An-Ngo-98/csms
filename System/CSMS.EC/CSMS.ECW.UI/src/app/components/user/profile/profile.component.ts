import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, GetInfoFromToken, UpdateProfile } from 'app/store';
import { User, UserToUpdate } from 'app/models/user.model';
import { userSelector, UserLoading, userLoadingSelector } from 'app/store/reducers/user.reducer';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import { BaseComponent } from 'app/components/base.component';
import { UserService } from 'app/services/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ValidateForm } from 'app/common/helpers/form-validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  public user: User;
  public profileForm: FormGroup;
  public avatarUrl = '';
  private avatarSize = 300;
  public avatarUpload: File;
  public loadingProfile$: Observable<UserLoading>;
  public profileFormErrors: any;

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) {
    super();
    this.profileFormErrors = {
      firstName: {},
      middleName: {},
      lastName: {},
      phoneNumber: {},
      email: {},
      password: {},
    }
  }

  ngOnInit() {
    this.profileForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      gender: new FormControl(''),
      birthday: new FormControl(''),
    });
    this.profileForm.valueChanges.subscribe(() => {
      ValidateForm(this.profileFormErrors, this.profileForm);
    });
    this._subscription.add(
      this.store.pipe(select(userSelector)).subscribe(user => {
        this.user = user;
        if (this.user) {
          this.profileForm.controls['firstName'].setValue(this.user.firstName);
          this.profileForm.controls['middleName'].setValue(this.user.middleName);
          this.profileForm.controls['lastName'].setValue(this.user.lastName);
          this.profileForm.controls['phoneNumber'].setValue(this.user.phoneNumber);
          this.profileForm.controls['email'].setValue(this.user.email);
          this.profileForm.controls['gender'].setValue(this.user.gender);
          this.profileForm.controls['birthday'].setValue(this.user.birthday);
          this.avatarUrl = AppService.getPath(ApiController.CdnApi.UserAvatar + this.user.id + '/' + this.avatarSize)
        }
      })
    );
    this.store.dispatch(new GetInfoFromToken(localStorage.getItem('token')));
    this.loadingProfile$ = this.store.pipe(select(userLoadingSelector));
  }

  public updateProfile() {
    const userToUpdate: UserToUpdate = {
      id: this.user.id,
      firstName: this.profileForm.controls['firstName'].value,
      middleName: this.profileForm.controls['middleName'].value,
      lastName: this.profileForm.controls['lastName'].value,
      phoneNumber: this.profileForm.controls['phoneNumber'].value,
      email: this.profileForm.controls['email'].value,
      gender: this.profileForm.controls['gender'].value,
      birthday: this.profileForm.controls['birthday'].value,
    };
    this.store.dispatch(new UpdateProfile(userToUpdate));
  }

  public updateImage(files: FileList) {
    this.avatarUpload = files.item(0);
    this.userService.updateImageUser(this.user.id, this.avatarUpload).subscribe(res => {
      if (res && res.succeeded) {
        this.avatarUrl += '?refresh=' + (new Date()).getTime();
        this.openSnackBar('Change image success', 'DONE');
      } else if (res && !res.succeeded) {
        this.openSnackBar(res.errors[0].description, 'DONE');
      }
    });
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
