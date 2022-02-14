import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import { UserApiRoutes } from 'app/api-routes/user.route';
import { User, UserToUpdate, UserReview, UserItemReview, Socialusers } from 'app/models/user.model';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
    // private baseUrl = BranchApiRoutes;
    private baseUrl = AppService.getPath(ApiController.UsersApi.Account);
    private customerUrl = AppService.getPath(ApiController.UsersApi.Customer);
    private imageUrl = AppService.getPath(ApiController.CdnApi.UserAvatar);
    private reviewUrl = AppService.getPath(ApiController.ProductsApi.Reviews);
    constructor(private apiService: ApiService) {}

    public getUserInfoFromToken(accessToken: string): Observable<User> {
        return this.apiService.post(this.baseUrl + UserApiRoutes.userInfoFromToken, {
            accessToken
        });
    }

    public updateProfile(userToUpdate: UserToUpdate): Observable<User> {
        return this.apiService.put(this.customerUrl + UserApiRoutes.updateProfile, userToUpdate);
    }

    public updateImageUser(userId: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId.toString());
        return this.apiService.post(this.imageUrl + userId, formData).pipe(
            map((res: any) => res)
        )
    }

    public getReviewByUserId(userId: string): Observable<UserItemReview[]> {
        return this.apiService.get(this.reviewUrl + 'user-reviews/' + userId);
    }
}

