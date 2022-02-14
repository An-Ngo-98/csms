import { SharedComponent } from './shared.declaration';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../authentication/login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatIcon } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SignUpComponent } from '../authentication/sign-up/sign-up.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
const APP_SHARED_COMPONENTS: any[] = [
  SharedComponent,
];

@NgModule({
  declarations: [
    APP_SHARED_COMPONENTS
  ],
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule, MatNativeDateModule, MatMomentDateModule,
    MatRadioModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatButtonModule
  ],
  exports: [
    APP_SHARED_COMPONENTS
  ],
  entryComponents: [
    LoginComponent,
    SignUpComponent
  ]
})
export class SharedModule { }
