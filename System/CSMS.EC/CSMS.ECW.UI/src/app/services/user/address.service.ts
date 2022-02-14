import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import { UserApiRoutes } from 'app/api-routes/user.route';
import { Address, AddressToUpdate, AddressToCreate } from 'app/models/address.model';

@Injectable()
export class AddressService {
    private customerUrl = AppService.getPath(ApiController.UsersApi.Customer);
    private userUrl = AppService.getPath(ApiController.UsersApi.User);
    constructor(private apiService: ApiService) {}

    public getAddress(userId: string): Observable<Address[]> {
        return this.apiService.get(this.customerUrl +  UserApiRoutes.getAddress + userId)
    }

    public createAddress(addressToCreate: AddressToCreate): Observable<Address> {
        return this.apiService.post(this.userUrl + UserApiRoutes.createAddress, addressToCreate);
    }

    public updateAddress(address: AddressToUpdate): Observable<Address> {
        return this.apiService.post(this.userUrl + UserApiRoutes.updateAddress, address);
    }

    public deleteAddress(addressId: string): Observable<Address> {
        return this.apiService.delete(this.userUrl + UserApiRoutes.deleteAddress + addressId);
    }
}

