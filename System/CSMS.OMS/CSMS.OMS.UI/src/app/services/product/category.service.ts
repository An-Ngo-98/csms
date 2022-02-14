import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { EnabledCategoryViewModel, CategoryViewModel } from 'app/models/category';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PagedListModel } from 'app/models/app';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly categoryApiUrl = AppService.getPath(ApiController.ProductsApi.Category);
  private readonly categoryCdnApiUrl = AppService.getPath(ApiController.CdnApi.Categories);

  constructor(private http: HttpClient) { }

  public getListCategory(page: number, pageSize: number): Observable<PagedListModel<CategoryViewModel>> {
    return this.http.get(
      this.categoryApiUrl + 'GetListCategory/' + page + '/' + pageSize)
      .pipe(
        map((res: PagedListModel<CategoryViewModel>) => res)
      );
  }

  public getEnabledCategory(): Observable<EnabledCategoryViewModel[]> {
    return this.http.get(this.categoryApiUrl + 'GetEnableCategory')
      .pipe(
        map((res: EnabledCategoryViewModel[]) => res)
      );
  }

  public saveCategory(cat: CategoryViewModel): Observable<CategoryViewModel> {
    return this.http.post(this.categoryApiUrl + 'SaveCategory', cat)
      .pipe(
        map((res: CategoryViewModel) => res)
      );
  }

  public saveCategoryPhoto(categoryId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('categoryId', categoryId.toString());

    return this.http.post(this.categoryCdnApiUrl + categoryId, formData)
      .pipe(
        map((res: any) => res)
      );
  }

  public deleteCategory(categoryId: number) {
    return this.http.delete(this.categoryApiUrl + 'DeleteCategory/' + categoryId)
      .pipe(
        map((res: any) => res)
      );
  }
}
