import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Province, District, Ward } from 'app/models/location.model';
import { LocationApiRoutes } from 'app/api-routes/location.route';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class LocationService {
    // private baseUrl = BranchApiRoutes;
    private baseUrl = 'https://dc.tintoc.net/app/api-customer/public/'
    constructor(
        private apiService: ApiService,
        private http: HttpClient
        ) {}

    // public loadAllProvinces(): Observable<Province[]> {
    //     return this.http.get(this.baseUrl + LocationApiRoutes.getAllProvinces);
    // }

    public loadAllProvinces(): Observable<any> {
        return this.http.get(this.baseUrl + LocationApiRoutes.getAllProvinces);
      }

    public loadDistrictByIdProvince(provinceId: string): Observable<any> {
        return this.http.get(this.baseUrl + LocationApiRoutes.getListDistrictByProvinceId + provinceId);
    }

    public loadWardByIdDistrict(districtId: string): Observable<any> {
        return this.http.get(this.baseUrl + LocationApiRoutes.getListWardByDistrictId + districtId);
    }

    public getLocationByAddress(address: string): Observable<any> {
        return this.http.get('https://api.opencagedata.com/geocode/v1/json?key=e9f5f181e2804424b98dd54172773eee&q=' + address);
    }
}

