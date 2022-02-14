import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { WarehouseMaterialViewModel, StoreMaterialViewModel } from '../../models/warehouse/warehouse.model';
import { ImportMaterialViewModel, ExportMaterialViewModel, ImportExportHistoryViewModel } from '../../models/warehouse/material.model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private readonly materialWarehouseApiUrl = AppService.getPath(ApiController.WarehouseApi.Warehouse);
  // private readonly materialWarehouseApiUrl = 'http://localhost:50007/api/warehouse/';

  constructor(private http: HttpClient) { }

  public getWarehouseMaterial(): Observable<WarehouseMaterialViewModel[]> {
    return this.http.get(this.materialWarehouseApiUrl)
      .pipe(
        map((res: WarehouseMaterialViewModel[]) => res)
      );
  }

  public getStoreExportDefault(): Observable<ExportMaterialViewModel[]> {
    return this.http.get(this.materialWarehouseApiUrl + 'store-export-default')
      .pipe(
        map((res: ExportMaterialViewModel[]) => res)
      );
  }

  public getImportExportHistories(materialId: number): Observable<ImportExportHistoryViewModel[]> {
    return this.http.get(this.materialWarehouseApiUrl + 'import-export-histories' + '?materialId=' + materialId)
      .pipe(
        map((res: ImportExportHistoryViewModel[]) => res)
      );
  }

  public importMaterial(materials: ImportMaterialViewModel[]) {
    return this.http.post(this.materialWarehouseApiUrl + 'import-materials', materials)
      .pipe(
        map((res: any) => res)
      );
  }

  public exportMaterial(materials: ExportMaterialViewModel[]) {
    return this.http.post(this.materialWarehouseApiUrl + 'export-materials', materials)
      .pipe(
        map((res: any) => res)
      );
  }

  public setDefaultImportMaterial(materials: ImportMaterialViewModel[]) {
    return this.http.post(this.materialWarehouseApiUrl + 'set-default-import', materials)
      .pipe(
        map((res: any) => res)
      );
  }

  public setDefaultExportMaterial(materials: ExportMaterialViewModel[]) {
    return this.http.post(this.materialWarehouseApiUrl + 'set-default-export', materials)
      .pipe(
        map((res: any) => res)
      );
  }

  public getStoreWarehouse(branchId: number): Observable<StoreMaterialViewModel[]> {
    return this.http.get(this.materialWarehouseApiUrl + 'store-warehouse/' + branchId)
      .pipe(
        map((res: StoreMaterialViewModel[]) => res)
      );
  }

  public updateStoreWarehouse(listStoreWarehouse: StoreMaterialViewModel[]) {
    return this.http.post(this.materialWarehouseApiUrl + 'save-store-warehouse', listStoreWarehouse)
      .pipe(
        map((res: any) => res)
      );
  }
}
