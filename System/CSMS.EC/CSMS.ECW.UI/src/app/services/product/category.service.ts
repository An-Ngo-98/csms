import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesApiRoutes } from 'app/api-routes/category.route';
import { Category, CategoryItem } from 'app/models/category.model';
import { ApiService } from '../api.service';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';

@Injectable()
export class CategoryService {
    // private baseUrl = CategoriesApiRoutes;
    private baseUrl = AppService.getPath(ApiController.ProductsApi.Category) + CategoriesApiRoutes.loadCategories;
    constructor(private apiService: ApiService) {}

    public loadCategories(): Observable<CategoryItem> {
        return this.apiService.get(this.baseUrl);
    }
}

