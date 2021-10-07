import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../models/order/order';
import { AuthService } from '../services/auth.service';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  orders: Order[] | undefined;

  constructor(private auth: AuthService,  private router: Router, private orderService: OrdersService) { }

  ngOnInit(): void {
    console.log('hi');
    this.orderService.getOrders()
      .subscribe(orders => {
        this.orders = orders;
        console.log('Orders:', orders);
      })
  }


  logout(){
    this.auth.logout();
    this.router.navigate(['/'])
  }

}
