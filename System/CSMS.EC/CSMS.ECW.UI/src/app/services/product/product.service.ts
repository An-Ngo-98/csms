import { Injectable } from '@angular/core';
import { ProductApiRoutes } from 'app/api-routes/product.route';
// import { ApiService } from './api.service';
import { Observable, from, Subject, BehaviorSubject } from 'rxjs';
import { Product, ProductItem, ProductReview, ReviewProductToSave, ProductItemReview } from 'app/models/product.model';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import { ApiService } from '../api.service';

@Injectable()
export class ProductService {
  // private baseUrl = ProductApiRoutes;
  private baseUrl = AppService.getPath(ApiController.ProductsApi.Product) + ProductApiRoutes.loadProducts;
  private baseUrl1 = AppService.getPath(ApiController.ProductsApi.Branch) + ProductApiRoutes.getProductByBranchId;
  private baseUrl2 = AppService.getPath(ApiController.ProductsApi.Reviews);
  constructor(private apiService: ApiService) { }

  public loadProducts(page: number, pageSize: number, sortField: number, categorySelected: number,
    enabled: boolean): Observable<ProductItem> {
    return this.apiService.get(this.baseUrl + page + '/' + pageSize + '/' + sortField + '?categoryId=' + categorySelected +
      '&enabled=' + enabled);
  }

  public searchProducts(page: number, pageSize: number, sortField: number, categorySelected: number,
    enabled: boolean, searchString: string): Observable<ProductItem> {
    return this.apiService.get(this.baseUrl + page + '/' + pageSize + '/' + sortField + '?categoryId=' + categorySelected +
      '&enabled=' + enabled + '&searchString=' + searchString);
  }

  public getReviewProduct(productId: number, page: number, pageSize: number, filterType = 0): Observable<ProductReview> {
    return this.apiService.get(this.baseUrl2 + 'product-reviews/' + productId + '?page=' + page
                                    + '&pageSize=' + pageSize + '&filterType=' + filterType);
  }

  public getAllReviewProduct(productId: number, page = 1, pageSize = 100, filterType = 0): Observable<ProductReview> {
    return this.apiService.get(this.baseUrl2 + 'product-reviews/' + productId + '?page=' + page
                                    + '&pageSize=' + pageSize + '&filterType=' + filterType);
  }

  public saveReviewProduct(review: ReviewProductToSave): Observable<ProductItemReview> {
    return this.apiService.post(this.baseUrl2, review);
  }

  public getProductByBranchId(id: number): Observable<Product[]> {
    return this.apiService.get(this.baseUrl1 + id);
  }

  public loveProducts(product: any): Observable<Product> {
    const subject = new BehaviorSubject<any>(product);
    return subject.asObservable();
  }

  public deleteLoveProducts(product: any): Observable<Product> {
    const subject = new BehaviorSubject<any>(product);
    return subject.asObservable();
  }

  public buyLaterProduct(product: Product): Observable<Product> {
    const subject = new BehaviorSubject<any>(product);
    return subject.asObservable();
  }

  public deleteBuyLaterProduct(id: string): Observable<any> {
    const subject = new BehaviorSubject<any>(id);
    return subject.asObservable();
  }

}

