import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from '../api.service';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import { Voucher } from 'app/models/voucher.model';

@Injectable()
export class VoucherService {
    // private baseUrl = CategoriesApiRoutes;
    private baseUrl = AppService.getPath(ApiController.PromotionsApi.Vouchers);
    constructor(private apiService: ApiService) {}

    public getVoucher(): Observable<Voucher[]> {
        return this.apiService.get(this.baseUrl);
    }

    // public chooseVoucher(vouchers: Voucher[]): Observable<Voucher[]> {
    //     const subject = new BehaviorSubject<any>(vouchers);
    //     return subject.asObservable();
    // }

    public chooseVoucher(vouchers: Voucher): Observable<Voucher> {
        const subject = new BehaviorSubject<any>(vouchers);
        return subject.asObservable();
    }
}

