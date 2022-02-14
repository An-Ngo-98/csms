import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../configs/app-service';
import { ApiController } from '../../commons/consts/api-controller.const';
import { Observable } from 'rxjs';
import { PagedListModel } from '../../models/app/paged-list.model';
import { CsmsBranch, EnabledBranchViewModel } from '../../models/system-data/branch.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private readonly apiUrl = AppService.getPath(ApiController.SystemApi.Branch);
  private readonly branchCdnApiUrl = AppService.getPath(ApiController.CdnApi.Stores);

  constructor(private http: HttpClient) { }

  public getListBranch(page: number, pageSize: number): Observable<PagedListModel<CsmsBranch>> {
    return this.http.get(this.apiUrl + 'GetAllBranch/' + page + '/' + pageSize)
      .pipe(
        map((res: PagedListModel<CsmsBranch>) => res)
      );
  }

  public getEnabledBranch(): Observable<EnabledBranchViewModel[]> {
    return this.http.get(this.apiUrl + 'GetAllEnableBranch')
      .pipe(
        map((res: EnabledBranchViewModel[]) => res)
      );
  }

  public saveBranch(branch: CsmsBranch) {
    return this.http.post(this.apiUrl + 'SaveBranch', branch)
      .pipe(
        map((res: CsmsBranch) => res)
      );
  }

  public saveBranchPhoto(storeId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('categoryId', storeId.toString());

    return this.http.post(this.branchCdnApiUrl + storeId, formData)
      .pipe(
        map((res: any) => res)
      );
  }

  public deleteBranch(branchId: number) {
    return this.http.delete(this.apiUrl + 'DeleteBranch/' + branchId)
      .pipe(
        map((res: any) => res)
      );
  }
}
