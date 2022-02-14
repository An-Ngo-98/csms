// import { AuthenticationRoutingModule } from './authentication-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import {
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatDatepickerModule,
    MatNativeDateModule, MatRadioModule, MatIconModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProductRoutingModule } from './product-routing.module';
import { DetailComponent } from './detail/detail.component';
import { SearchComponent } from './search/search.component';
import { ShowProductMoreComponent } from 'app/common/show-product-more/show-product-more.component';
import { WriteReviewComponent } from 'app/modals/write-review/write-review.component';
import { PaginationComponent } from 'app/common/pagination/pagination.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
const APP_AUTH_COMPONENTS: any[] = [
    DetailComponent,
    SearchComponent,
    WriteReviewComponent,
    PaginationComponent
];

@NgModule({
    declarations: [
        APP_AUTH_COMPONENTS,
    ],
    imports: [
        RouterModule,
        CommonModule,
        HttpClientModule,
        NgbModule,
        FormsModule,
        MatDialogModule,
        ProductRoutingModule,
        SharedModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatDatepickerModule, MatNativeDateModule, MatMomentDateModule,
        MatRadioModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatButtonModule
    ],
    entryComponents: [
        WriteReviewComponent
    ]
})
export class ProductModule { }
