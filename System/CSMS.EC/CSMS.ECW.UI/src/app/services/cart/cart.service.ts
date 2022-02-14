import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { CategoriesApiRoutes } from 'app/api-routes/category.route';
import { Category, CategoryItem } from 'app/models/category.model';
import { ApiService } from '../api.service';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import { Product } from 'app/models/product.model';

@Injectable()
export class CartService {
    cartsLocalStorage: Product[] = [];
    private cartLengthSubject = new Subject<number>();
    public cartLength$ = this.cartLengthSubject.asObservable();

    private totalPriceSubject = new Subject<number>();
    public totalPrice$ = this.totalPriceSubject.asObservable();
    // private baseUrl = CategoriesApiRoutes;
    // private baseUrl = AppService.getPath(ApiController.ProductsApi.Category) + CategoriesApiRoutes.loadCategories;
    constructor(private apiService: ApiService) { }

    public addProductToCart(product: Product): Observable<Product> {
        const subject = new BehaviorSubject<any>(product);
        return subject.asObservable();
    }

    public deleteProductFromCart(id: number): Observable<any> {
        const subject = new BehaviorSubject<any>(id);
        return subject.asObservable();
    }

    public editCountProductFromCart(product: Product): Observable<Product> {
        const subject = new BehaviorSubject<any>(product);
        return subject.asObservable();
    }

    // Cart local storage

    public addToCartLocalStorage(pro: Product) {
        if (localStorage.getItem('cart') === null) {
            const cart: any = [];
            cart.push(JSON.stringify(pro));
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            const cart: any = JSON.parse(localStorage.getItem('cart'));
            let index = -1;
            for (let i = 0; i < cart.length; i++) {
                const product: Product = JSON.parse(cart[i])
                if (product.id === pro.id) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                // NO exist => push new item in cart
                cart.push(JSON.stringify(pro));
                localStorage.setItem('cart', JSON.stringify(cart));
            } else {
                const producta: Product = JSON.parse(cart[index]);
                producta.count += pro.count;
                cart[index] = JSON.stringify(producta);
                localStorage.setItem('cart', JSON.stringify(cart));
            }
        }
    }

    public updateCountProductLocalStorage(product) {
        let index = -1;
        const oldCart = JSON.parse(localStorage.getItem('cart'));
        for (let i = 0; i < oldCart.length; i++) {
            const itemProduct = JSON.parse(oldCart[i]);
            if (itemProduct.id === product.id) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            const newProduct: Product = JSON.parse(oldCart[index]);
            newProduct.count = product.count;
            oldCart[index] = JSON.stringify(newProduct);
            localStorage.setItem('cart', JSON.stringify(oldCart));
        }
    }

    public loadCartLocalStorage() {
        this.cartsLocalStorage = [];
        const cart = JSON.parse(localStorage.getItem('cart'));
        if (cart) {
            for (let i = 0; i < cart.length; i++) {
                const product = JSON.parse(cart[i]);
                this.cartsLocalStorage.push(product)
            }
        }
    }

    public removeProductCartLocalStorage(id: number) {
        const cart: any = JSON.parse(localStorage.getItem('cart'));
        const index = -1;
        for (let i = 0; i < cart.length; i++) {
            const item: Product = JSON.parse(cart[i]);
            if (item.id === id) {
                cart.splice(i, 1);
                break;
            }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        this.loadCartLocalStorage();
    }

    public setLength(numb: number) {
        const a = JSON.parse(localStorage.getItem('cart'));
        const count = a.length + numb
        this.cartLengthSubject.next(count);
    }

    public setPrice(numb: number) {
        this.totalPriceSubject.next(numb);
    }

}

