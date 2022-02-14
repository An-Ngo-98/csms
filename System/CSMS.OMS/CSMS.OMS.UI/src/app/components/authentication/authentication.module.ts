import * as fromAuthen from '.';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { CommonComponentModule } from '../commons/common-component.module';

const APP_AUTH_COMPONENTS: any[] = [
  fromAuthen.LoginComponent,
];

@NgModule({
  declarations: [
    APP_AUTH_COMPONENTS
  ],
  imports: [
    RouterModule,
    CommonModule,
    CommonComponentModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    AuthenticationRoutingModule,
  ]
})
export class AuthenticationModule { }
