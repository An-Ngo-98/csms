import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OpenApiUrl } from '../../commons/consts/open-api-url.const';
import { Province, District, Ward } from '../../models/app/location.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private readonly apiUrl = OpenApiUrl.LocationApi;

  constructor(
    private http: HttpClient) { }

  public getAllProvinces(): Observable<Province[]> {
    return this.http.get(this.apiUrl + 'provinces?size=64')
      .pipe(
        map((res: Province[]) => res)
      );
  }

  public getListDistrictByProvinceId(provinceId: number): Observable<District[]> {
    return this.http.get(this.apiUrl + 'districts?size=1000&provinceId.equals=' + provinceId)
      .pipe(
        map((res: District[]) => res)
      );
  }

  public getListWardByDistrictId(districtId: number): Observable<Ward[]> {
    return this.http.get(this.apiUrl + 'wards?size=1000&districtId.equals=' + districtId)
      .pipe(
        map((res: Ward[]) => res)
      );
  }
}

