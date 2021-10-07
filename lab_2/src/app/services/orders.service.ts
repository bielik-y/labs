import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Order } from '../models/order/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly path = 'https://pnitfunctions.azurewebsites.net/api/GetOrders'

  constructor(private httpClient: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.path).pipe(
      map((orders: any[]) => orders.map((order: any) =>
        new Order(order.name, order.category, order.price))),
      filter((orders: Order[]) => !!orders),
      tap((orders: Order[]) => {
        localStorage.setItem('ordersCount', orders.length.toString());
        console.log('Recieved orders:', orders);
      })
    );
  }
}
