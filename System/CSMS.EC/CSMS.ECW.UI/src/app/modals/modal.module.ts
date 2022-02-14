import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import {
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatDatepickerModule,
    MatNativeDateModule, MatRadioModule, MatMenuModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NewAddressComponent } from './new-address/new-address.component';
import {MatSelectModule} from '@angular/material/select';
import { ChooseVouchersComponent } from './choose-vouchers/choose-vouchers.component';
import { WriteReviewComponent } from './write-review/write-review.component';
import {MatButtonModule} from '@angular/material/button';
const components = [
    // UpdateAddressComponent,
    // NewAddressComponent,
];
@NgModule({
    declarations: [...components],
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
        MatSelectModule,
        MatButtonModule
    ],
    entryComponents: [
        // UpdateAddressComponent,
        // NewAddressComponent,
    ],
})
export class ModalModule { }
