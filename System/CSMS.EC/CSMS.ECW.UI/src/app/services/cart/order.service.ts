import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from '../api.service';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import { OrderCart, OrderToOrder } from 'app/models/order.model';

@Injectable()
export class OrderService {
    private baseUrl = AppService.getPath(ApiController.InvoicesApi.Orders);
    // private baseUrl = 'http://localhost:3001/invoices-api/orders';
    constructor(private apiService: ApiService) {}

    public order(order: OrderToOrder): Observable<OrderToOrder> {
        return this.apiService.post(this.baseUrl, order);
    }

    public getOrderByUserId(userId: string): Observable<OrderCart[]> {
        return this.apiService.get(this.baseUrl + userId);
    }

    public getOrderById(orderId: string): Observable<OrderCart> {
        return this.apiService.get(this.baseUrl + orderId);
    }

    public cancelOrder(orderId: string): Observable<OrderCart> {
        return this.apiService.put(this.baseUrl + 'canceled-time/' + orderId);
    }
}

