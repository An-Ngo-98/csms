import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from 'app/components/authentication/login/login.component';
import { SignUpComponent } from 'app/components/authentication/sign-up/sign-up.component';
import { Category, CategoryItem } from 'app/models/category.model';
import { Store, select } from '@ngrx/store';
import {
    AppState, LoadCategory, LoadBranch, Logout,
    ProductActionTypes,
    SearchProduct,
    SearchProductSuccess,
    LoadProduct,
    LoadProductSuccess,
    GetProductByBranchId,
    GetProductByBranchIdSuccess,
    GetInfoFromToken
} from 'app/store';
import { catogerySelector, CategoryLoading, catogeryLoadingSelector } from 'app/store/reducers/category.reducer';
import { branchSelector, BranchLoading, branchLoadingSelector } from 'app/store/reducers/branch.reducer';
import { Branch, BranchItem } from 'app/models/branch.models';
import { Observable } from 'rxjs';
import { isLoggedSelector } from 'app/store/reducers/auth.reducer';
import { FormGroup, FormControl } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { cartSelector } from 'app/store/reducers/cart.reducer';
import { Product } from 'app/models/product.model';
import { CartService } from 'app/services/cart/cart.service';
import { BaseComponent } from 'app/components/base.component';
import { userSelector } from 'app/store/reducers/user.reducer';
import { User } from 'app/models/user.model';
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends BaseComponent implements OnInit {
    @Input() public loading: boolean;
    public catogeries: CategoryItem;
    public branchs: BranchItem;
    public currentCount = 0;
    // public isLogged$: Observable<boolean>;
    public loadingCategory$: Observable<CategoryLoading>;
    public loadingBranch$: Observable<BranchLoading>;
    public isLogged: boolean;
    public page = 1;
    public pageSize = 10;
    public sortField = 1;
    public categorySelected = 0;
    public enabled = true;
    public formSearch: FormGroup;
    public carts: Product[];
    public user: User;

    // cart localStorage
    public cartsLocalStorage: Product[] = [];

    constructor(
        private dialog: MatDialog,
        private store: Store<AppState>,
        private dispatcher: Actions,
        private router: Router,
        private cartService: CartService,
    ) {
        super();
        this._subscription.add(
            this.store.pipe(select(catogerySelector)).subscribe(catogeries => {
                this.catogeries = catogeries;
            })
        );
        this._subscription.add(
            this.store.pipe(select(branchSelector)).subscribe(branchs => {
                this.branchs = branchs;
            })
        );
        this._subscription.add(
            this.store.pipe(select(cartSelector)).subscribe(carts => {
                this.carts = carts;
            })
        )
        this._subscription.add(
            this.store.pipe(select(isLoggedSelector)).subscribe(isLogged => {
                this.isLogged = isLogged;
            })
        );
    }

    ngOnInit() {
        // Load Cart LocalStorage
        this.cartService.loadCartLocalStorage();
        this.cartsLocalStorage = this.cartService.cartsLocalStorage;
        this.currentCount = this.cartsLocalStorage.length;
        this.newLenght();
        //
        this.formSearch = new FormGroup({
            searchString: new FormControl(),
        });
        this.store.dispatch(new LoadCategory());
        this.store.dispatch(new LoadBranch());
        this.loadingCategory$ = this.store.pipe(select(catogeryLoadingSelector));
        this.loadingBranch$ = this.store.pipe(select(branchLoadingSelector));
        if (this.isLogged) {
            this.store.dispatch(new GetInfoFromToken(localStorage.getItem('token')));
            this._subscription.add(
                this.store.pipe(select(userSelector)).subscribe(user => {
                    this.user = user;
                })
            );
        }
    }

    public newLenght() {
        this._subscription.add(
            this.cartService.cartLength$.subscribe(x => {
                this.currentCount = x
            })
        );
    }

    public openModalLogin() {
        this.dialog.open(LoginComponent, {
            minWidth: '40%',
            width: '40%'
        })
    }

    public openModalSignUp() {
        this.dialog.open(SignUpComponent, {
            width: '40%',
        })
    }

    public logout() {
        this.store.dispatch(new Logout());
    }

    public searchProduct() {
        const searchString = this.formSearch.controls['searchString'].value;
        this.store.dispatch(new SearchProduct(this.page, this.pageSize, this.sortField, this.categorySelected,
            this.enabled, searchString));
        this._subscription.add(
            this.dispatcher.pipe(ofType(ProductActionTypes.SearchProductSuccessAction),
                filter((action: SearchProductSuccess) => action instanceof SearchProductSuccess),
            ).subscribe(action => {
                this.router.navigate(['/product/search/' + searchString]);
            })
        );
    }

    public searchByCategory(id) {
        this.store.dispatch(new LoadProduct(this.page, this.pageSize, this.sortField, id, this.enabled))
        this._subscription.add(
            this.dispatcher.pipe(ofType(ProductActionTypes.LoadProductSuccessAction),
                filter((action: LoadProductSuccess) => action instanceof LoadProductSuccess),
            ).subscribe(action => {
                this.router.navigate(['/product/search/' + id]);
            })
        );
    }

    public searchByBranch(id) {
        this.store.dispatch(new GetProductByBranchId(id))
        this._subscription.add(
            this.dispatcher.pipe(ofType(ProductActionTypes.GetProductByBranchIdSuccessAction),
                filter((action: GetProductByBranchIdSuccess) => action instanceof GetProductByBranchIdSuccess),
            ).subscribe(action => {
                this.router.navigate(['/product/search/' + id]);
            })
        );
    }

}
