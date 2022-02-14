import { Injectable } from '@angular/core';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import { AuthApiRoutes } from 'app/api-routes/auth.route';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { User, UserToCreate, Socialusers } from 'app/models/user.model';
import { LocalStorageService } from '../local-storage.service';

@Injectable()
export class AuthServiceLocal {
    // private baseUrl = ProductApiRoutes;
    private baseUrl = AppService.getPath(ApiController.UsersApi.Account);
    private readonly testSocial = '/api/account/';
    constructor(private apiService: ApiService, private localStorageService: LocalStorageService) {}

    // public isLoggedIn(): boolean {
    //     return !!this.localStorageService.getAuthToken();
    //   }

    public createUser(userToCreate: UserToCreate): Observable<User> {
        return this.apiService.post(this.baseUrl  + AuthApiRoutes.createUser , userToCreate);
    }

    public login(username: string, password: string): Observable<User> {
        return this.apiService.post(this.baseUrl + AuthApiRoutes.login, {
            username,
            password
        });
    }

    public signUpSocical(userToCreate: Socialusers): Observable<User> {
        return this.apiService.post(this.baseUrl  + AuthApiRoutes.createUserSocial , userToCreate);
    }

    // public signUpSocical(userToSave: Socialusers): Observable<User> {
    //     return this.apiService.put(this.customerUrl + UserApiRoutes.updateProfile, userToSave);
    // }

    public changePassword(UserId: string, oldPassword: string, newPassword: string): Observable<User> {
        return this.apiService.put(this.baseUrl + AuthApiRoutes.changePassword, {
            UserId,
            oldPassword,
            newPassword
        })
    }
}
