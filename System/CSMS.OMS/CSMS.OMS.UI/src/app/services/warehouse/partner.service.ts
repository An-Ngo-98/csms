import { Injectable } from '@angular/core';
import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedListModel } from '../../models/app/paged-list.model';
import { PartnerViewModel } from '../../models/warehouse/partner.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  private readonly partnerWarehouseApiUrl = AppService.getPath(ApiController.WarehouseApi.Partners);
  // private readonly partnerWarehouseApiUrl = 'http://localhost:50007/api/partners/';

  constructor(private http: HttpClient) { }

  public getListPartner(page: number, pageSize: number, searchString: string): Observable<PagedListModel<PartnerViewModel>> {
    return this.http.get(this.partnerWarehouseApiUrl + page + '/' + pageSize + '?searchString=' + searchString)
      .pipe(
        map((res: PagedListModel<PartnerViewModel>) => res)
      );
  }

  public getPartnerById(id: number): Observable<PartnerViewModel> {
    return this.http.get(this.partnerWarehouseApiUrl + id)
      .pipe(
        map((res: PartnerViewModel) => res)
      );
  }

  public savePartner(model: PartnerViewModel) {
    return this.http.post(this.partnerWarehouseApiUrl, model)
      .pipe(
        map((res: any) => res)
      );
  }
}
