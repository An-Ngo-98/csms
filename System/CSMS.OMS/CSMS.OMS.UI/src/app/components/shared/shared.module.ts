import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.declaration';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonComponentModule } from '../commons/common-component.module';

const APP_SHARED_COMPONENTS: any[] = [
  SharedComponent
];

@NgModule({
  declarations: [
    APP_SHARED_COMPONENTS
  ],
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    CommonComponentModule,
  ],
  exports: [
    APP_SHARED_COMPONENTS
  ]
})
export class SharedModule { }
