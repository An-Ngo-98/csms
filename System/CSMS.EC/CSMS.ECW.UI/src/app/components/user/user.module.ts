// import { AuthenticationRoutingModule } from './authentication-routing.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import {
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatDatepickerModule,
    MatNativeDateModule, MatRadioModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { OrderManagementComponent } from './order-management/order-management.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserComponent } from './user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressBookComponent } from './address-book/address-book.component';
import {MatIconModule} from '@angular/material/icon';
import { ModalModule } from 'app/modals/modal.module';
import { FavoritedProductComponent } from './favorited-product/favorited-product.component';
import { BuyLaterProductComponent } from './buy-later-product/buy-later-product.component';
import { NgxLoadingModule } from 'ngx-loading';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommentComponent } from './comment/comment.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {MatButtonModule} from '@angular/material/button';
const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };
const APP_AUTH_COMPONENTS: any[] = [
    ProfileComponent,
    OrderManagementComponent,
    ChangePasswordComponent,
    UserComponent,
    AddressBookComponent,
    BuyLaterProductComponent,
    CommentComponent
];

@NgModule({
    declarations: [
        APP_AUTH_COMPONENTS,
        FavoritedProductComponent,
        CommentComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        HttpClientModule,
        NgbModule,
        FormsModule,
        MatDialogModule,
        UserRoutingModule,
        SharedModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatDatepickerModule, MatNativeDateModule, MatMomentDateModule,
        MatRadioModule,
        MatTableModule,
        MatPaginatorModule,
        SharedModule,
        ReactiveFormsModule,
        MatIconModule,
        ModalModule,
        NgxLoadingModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        SocketIoModule.forRoot(config)
    ],
    entryComponents: [],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ]
})
export class UserModule { }
