import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PagedListModel } from 'app/models/app';
import { ProductViewModel } from 'app/models/product';
import { ResultUploadPhotoViewModel } from '../../models/product/product-photo';
import { EnableProductViewModel } from '../../models/product/product-list';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly productApiUrl = AppService.getPath(ApiController.ProductsApi.Product);
  private readonly productBranchApiUrl = AppService.getPath(ApiController.ProductsApi.Branch);
  private readonly productCdnApiUrl = AppService.getPath(ApiController.CdnApi.ProductPhoto);

  constructor(private http: HttpClient) { }

  public getListProduct(
    page: number, pageSize: number, sortField: number, categorySelected: number, enabled = null, searchString: string
  ): Observable<PagedListModel<ProductViewModel>> {
    return this.http.get(this.productApiUrl + 'GetListProduct/' + page + '/' + pageSize + '/' + sortField
      + '?categoryId=' + categorySelected + '&enabled=' + enabled + '&searchString=' + encodeURIComponent(searchString))
      .pipe(
        map((res: PagedListModel<ProductViewModel>) => res)
      );
  }

  public getEnableProduct(): Observable<EnableProductViewModel[]> {
    return this.http.get(this.productApiUrl + 'GetEnableProduct')
      .pipe(
        map((res: EnableProductViewModel[]) => res)
      );
  }

  public getProductByBranchId(branchId: number): Observable<EnableProductViewModel[]> {
    return this.http.get(this.productBranchApiUrl + 'GetProductByBranchId/' + branchId)
      .pipe(
        map((res: EnableProductViewModel[]) => res)
      );
  }

  public saveProduct(product: ProductViewModel): Observable<ProductViewModel> {
    return this.http.post(this.productApiUrl + 'SaveProduct/', product)
      .pipe(
        map((res: ProductViewModel) => res)
      );
  }

  public updateStoreProduct(branchId: number, listProduct: EnableProductViewModel[]) {
    return this.http.put(this.productBranchApiUrl + 'UpdateStoreProduct/' + branchId, listProduct)
      .pipe(
        map((res: any) => res)
      );
  }

  public deleteProduct(productId: number) {
    return this.http.delete(this.productApiUrl + 'DeleteProduct/' + productId)
      .pipe(
        map((res: any) => res)
      );
  }

  public saveProductPhoto(imageId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageId', imageId.toString());

    return this.http.post(this.productCdnApiUrl + imageId, formData)
      .pipe(
        map((res: ResultUploadPhotoViewModel) => res)
      );
  }

  public deleteProductPhoto(imageId: number) {
    return this.http.delete(this.productCdnApiUrl + imageId)
      .pipe(
        map((res: any) => res)
      );
  }
}
