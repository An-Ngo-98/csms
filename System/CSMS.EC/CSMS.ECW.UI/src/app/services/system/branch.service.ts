import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BranchApiRoutes } from 'app/api-routes/branch.route';
import { Branch, BranchItem } from 'app/models/branch.models';
import { ApiService } from '../api.service';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';

@Injectable()
export class BranchService {
    // private baseUrl = BranchApiRoutes;
    private baseUrl = AppService.getPath(ApiController.SystemApi.Branch);
    constructor(private apiService: ApiService) {}

    public loadBranchs(): Observable<BranchItem> {
        return this.apiService.get(this.baseUrl + BranchApiRoutes.loadBranch);
    }

    public loadBranchsEnable(): Observable<Branch[]> {
        return this.apiService.get(this.baseUrl + BranchApiRoutes.loadBranchEnable);
    }
}

