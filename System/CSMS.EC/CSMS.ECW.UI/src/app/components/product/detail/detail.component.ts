import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState,
  LoadProduct,
  LoveProduct,
  DeleteLovedProduct,
  BuyLaterProduct,
  AddProductToCart,
  GetReviewProduct,
  GetAllReviewProduct,
  ProductActionTypes,
  GetAllReviewProductSuccess
} from 'app/store';
import { productSelector, loveSelector, getProductReviewsSelector,
  getAllProductReviewsSelector, ProductLoading, productLoadingSelector } from 'app/store/reducers/product.reducer';
import { ProductItem, Product, ProductReview, ProductItemReview } from 'app/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import { CategoryItem } from 'app/models/category.model';
import { catogerySelector } from 'app/store/reducers/category.reducer';
import { FormGroup, FormControl } from '@angular/forms';
import { CartService } from 'app/services/cart/cart.service';
import { BaseComponent } from 'app/components/base.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { WriteReviewComponent } from 'app/modals/write-review/write-review.component';
import { sortByDate } from '../../../utils/function';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { PagedListModel } from 'app/common/helpers/paged-list.model';
import { Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends BaseComponent implements OnInit {
  public selected = 4;
  public hovered = 0;
  public readonly = false;
  public currentRate: string;
  public currentRateFail = 0;
  public cartForm: FormGroup;
  public product: ProductItem;
  public catogeries: CategoryItem;
  public page = 1;
  public pageSizeProduct = 100;
  public pageSize = 4;
  public sortField = 1;
  public categorySelected = 0;
  public listPageSize = [4, 8, 16, 40, 80];
  public enabled = true;
  public productDetailId: number;
  public productDetail: Product;
  public productImgUrl = '';
  private imgSize = 250;
  public imgSizeProduct = 200;
  public lovedProducts: Product[];
  public loveProduct: Product;
  public productOfCategory3: Product[];
  public cartsLocalStorage: Product[] = [];
  public productReviews: ProductReview;
  public producItemReviews: ProductItemReview[];
  public totalScoreVote = 0;
  public averagetotalScoreVote = 0;
  public scoreIs5: ProductItemReview[];
  public percentOfScore5: number;
  public scoreIs4: ProductItemReview[];
  public percentOfScore4: number;
  public scoreIs3: ProductItemReview[];
  public percentOfScore3: number;
  public scoreIs2: ProductItemReview[];
  public percentOfScore2: number;
  public scoreIs1: ProductItemReview[];
  public percentOfScore1: number;
  public listReview: PagedListModel<ProductItemReview>;
  public loadingProduct$: Observable<ProductLoading>;
  // public loadingReview$: Observable<Rev>
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private cartService: CartService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private dispatcher: Actions,
  ) {
    super();
    this._subscription.add(
      this.route.paramMap.subscribe(params => {
        this.productDetailId = Number(params.get('id'));
      })
    );
    this._subscription.add(
      this.store.pipe(select(productSelector)).subscribe(product => {
        this.product = product;
        this.productOfCategory3 = product && product.items;
        if (this.product) {
          this.productDetail = this.product.items.find(item => item.id === this.productDetailId);
          if (this.productDetail) {
            this.productImgUrl = AppService.getPath(ApiController.CdnApi.ProductPhoto + this.productDetail.avatarId + '/' + this.imgSize)
          }
        }
      })
    );
    this._subscription.add(
      this.store.pipe(select(catogerySelector)).subscribe(catogeries => {
        this.catogeries = catogeries;
      })
    );
  }

  ngOnInit() {
    this.getListProduct(1, this.pageSize);
    this.cartForm = new FormGroup({
      count: new FormControl(),
    });
    this.loadingProduct$ = this.store.pipe(select(productLoadingSelector));
    this.store.dispatch(new LoadProduct(this.page, this.pageSizeProduct, this.sortField, this.categorySelected, this.enabled))
    this.store.dispatch(new GetAllReviewProduct(this.productDetailId));
    this.dispatcher
    .pipe(
      ofType(
        ProductActionTypes.GetAllReviewProductSuccessAction,
      ),
      filter(
        (action: GetAllReviewProductSuccess) =>
          action instanceof GetAllReviewProductSuccess
      ),
    )
    .subscribe(action => {
      this._subscription.add(
        this.store.pipe(select(getAllProductReviewsSelector)).subscribe(productReviews => {
          if (productReviews) {
            this.productReviews = productReviews;
            productReviews.items.forEach(element => {
              this.totalScoreVote += element.score;
            });
            // this.averagetotalScoreVote = this.totalScoreVote / productReviews.totalCount;
            this.currentRate = (this.totalScoreVote / productReviews.totalCount).toFixed(1);
            this.currentRateFail = 0;
            this.scoreIs5 = productReviews.items.filter(element => element.score === 5);
            this.percentOfScore5 = Math.round((this.scoreIs5.length / productReviews.items.length) * 100);
            this.scoreIs4 = productReviews.items.filter(element => element.score === 4);
            this.percentOfScore4 = Math.round((this.scoreIs4.length / productReviews.items.length) * 100);
            this.scoreIs3 = productReviews.items.filter(element => element.score === 3);
            this.percentOfScore3 = Math.round((this.scoreIs3.length / productReviews.items.length) * 100);
            this.scoreIs2 = productReviews.items.filter(element => element.score === 2);
            this.percentOfScore2 = Math.round((this.scoreIs2.length / productReviews.items.length) * 100);
            this.scoreIs1 = productReviews.items.filter(element => element.score === 1);
            this.percentOfScore1 = Math.round((this.scoreIs1.length / productReviews.items.length) * 100);
          }
        })
      );
    });
  }

  public getDetailProduct(id) {
    this.productDetail = this.productOfCategory3.find(product => product.id === id)
    this.productImgUrl = AppService.getPath(ApiController.CdnApi.ProductPhoto + this.productDetail.avatarId + '/' + this.imgSize)
  }

  public getListProduct(page = 1, pageSize = this.pageSize): void {
    this.page = page;
    this.pageSize = pageSize;
    this.store.dispatch(new GetReviewProduct(this.productDetailId, this.page, this.pageSize));
    this._subscription.add(
      this.store.pipe(select(getProductReviewsSelector)).subscribe(reviews => {
        if (reviews) {
          this.listReview = reviews;
          this.producItemReviews = reviews.items;
        }
      })
    )
  }

  public isLovedProduct() {
    this._subscription.add(
      this.store.pipe(select(loveSelector)).subscribe(love => {
        this.loveProduct = love.find(item => item.id === this.productDetailId);
      })
    )
    if (this.loveProduct) {
      return true;
    } else {
      return false;
    }
  }

  public addDeleteLoveProduct() {
    if (this.isLovedProduct()) {
      this.store.dispatch(new DeleteLovedProduct(this.productDetail))
    } else {
      this.store.dispatch(new LoveProduct(this.productDetail))
    }
  }

  public addBuyLater() {
    this.store.dispatch(new BuyLaterProduct(this.productDetail))
  }

  public addProductToCart() {
    let countNow = this.cartForm.controls['count'].value;
    if (!countNow) {
      countNow = 1;
    }
    const newProduct: Product = {
      ...this.productDetail,
      count: countNow
    }
    this.store.dispatch(new AddProductToCart(newProduct));
  }

  public getImg(id) {
    return AppService.getPath(ApiController.CdnApi.ProductPhoto + id + '/' + this.imgSizeProduct)
  }

  public getProductFromCategory3(id) {
    if (id === 0) {
      this.productOfCategory3 = this.product.items
    } else {
      this.productOfCategory3 = this.product.items.filter(products => products.categoryId === id);
    }
  }

  // cart localStorage

  public addCartLocalStorage() {
    let countNow = this.cartForm.controls['count'].value;
    if (!countNow) {
      countNow = 1;
    }
    const newProduct: Product = {
      ...this.productDetail,
      count: countNow
    }
    if (localStorage.getItem('cart')) {
      this.cartService.loadCartLocalStorage();
      this.cartsLocalStorage = this.cartService.cartsLocalStorage;
      const productIsExit = this.cartsLocalStorage.find(x => x.id === newProduct.id);
      if (!productIsExit) {
        this.cartService.setLength(1);
      }
    }
    this.cartService.addToCartLocalStorage(newProduct);
    this.openSnackBar('Add product to cart success', 'DONE');
    this.fetch();
  }

  public fetch() {
    this.cartsLocalStorage = this.cartService.cartsLocalStorage;
  }

  public openModalWriteReview() {
    this.dialog.open(WriteReviewComponent, {
      minWidth: '40%',
      data: this.productDetail
    })
  }
  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
