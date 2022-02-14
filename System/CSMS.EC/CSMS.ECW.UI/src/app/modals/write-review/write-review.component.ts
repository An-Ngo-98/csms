import { Component, OnInit, Inject } from '@angular/core';
import { BaseComponent } from 'app/components/base.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState, SaveReviewProduct, GetInfoFromToken, ProductActionTypes, SaveReviewProductSuccess } from 'app/store';
import { ReviewProductToSave, Product } from 'app/models/product.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { userSelector } from 'app/store/reducers/user.reducer';
import { User } from 'app/models/user.model';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProductLoading, productLoadingSelector } from 'app/store/reducers/product.reducer';
import { ValidateForm } from 'app/common/helpers/form-validator';

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
  styleUrls: ['./write-review.component.scss']
})
export class WriteReviewComponent extends BaseComponent implements OnInit {
  public writeReviewForm: FormGroup;
  public currentRate = 0;
  public user: User;
  public loadingReview$: Observable<ProductLoading>;
  public writeReviewFormErrors: any;
  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    public dialogRef: MatDialogRef<WriteReviewComponent>,
    private dispatcher: Actions,
  ) {
    super();
    this.dispatcher
    .pipe(
      ofType(
        ProductActionTypes.SaveReviewProductSuccessAction,
      ),
      filter(
        (action: SaveReviewProductSuccess) =>
          action instanceof SaveReviewProductSuccess
      ),
    )
    .subscribe(action => {
      this.close();
    });
    this._subscription.add(
      this.store.pipe(select(userSelector)).subscribe(user => {
        if (user) {
          this.user = user;
        }
      })
    );
    this.writeReviewFormErrors = {
      score: {},
      title: {},
      comment: {}
    }
   }

  ngOnInit() {
    this.writeReviewForm = new FormGroup({
      score: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      comment: new FormControl('', [Validators.required]),
    })
    this.writeReviewForm.valueChanges.subscribe(() => {
      ValidateForm(this.writeReviewFormErrors, this.writeReviewForm);
    });
    this.store.dispatch(new GetInfoFromToken(localStorage.getItem('token')));
    this.loadingReview$ = this.store.pipe(select(productLoadingSelector));
  }

  public saveReview() {
    const reviewSave: ReviewProductToSave = {
      productId: this.data.id,
      userId: Number(this.user.id),
      fullName: this.user.firstName + ' ' + this.user.middleName + ' ' + this.user.lastName,
      score: this.writeReviewForm.controls['score'].value,
      title: this.writeReviewForm.controls['title'].value,
      comment: this.writeReviewForm.controls['comment'].value,
      invoiceId: null,
    }
    this.store.dispatch(new SaveReviewProduct(reviewSave));
  }

  public close() {
    this.dialogRef.close();
  }
}
