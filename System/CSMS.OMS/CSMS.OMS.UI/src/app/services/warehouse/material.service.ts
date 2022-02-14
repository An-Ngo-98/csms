import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { CsmsMaterial, MaterialViewModel } from '../../models/warehouse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PagedListModel } from '../../models/app/paged-list.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private readonly materialWarehouseApiUrl = AppService.getPath(ApiController.WarehouseApi.Material);
  // private readonly materialWarehouseApiUrl = 'http://localhost:50007/api/materials/';

  constructor(private http: HttpClient) { }

  public getListMaterial(page: number = 0, pageSize: number = 0, searchString: string = '')
    : Observable<PagedListModel<MaterialViewModel>> {
    return this.http.get(this.materialWarehouseApiUrl + page + '/' + pageSize +
      '?searchString=' + searchString)
      .pipe(
        map((res: PagedListModel<MaterialViewModel>) => res)
      );
  }

  public saveMaterial(model: CsmsMaterial) {
    return this.http.post(this.materialWarehouseApiUrl, model)
      .pipe(
        map((res: any) => res)
      );
  }
}
