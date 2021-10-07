import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of, Subscription } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly accessTokenKey = 'access_token';
  tokenSubscription = new Subscription();

  constructor(private http:HttpClient, private jwtHelper: JwtHelperService, private router: Router) { }

  login(username: String, password: String): Observable<any> {
    return this.http.get<{access_token:string}>('https://pnitfunctions.azurewebsites.net/api/token?userName=' + username + '&password=' + password)
      .pipe(
        tap(
          (resp) => {
            this.setToken(resp.access_token);
            let timeout = this.jwtHelper.getTokenExpirationDate(resp.access_token)!.valueOf() - new Date().valueOf();
            this.expirationCounter(timeout)
          }
        )
      )
  }

  private setToken(token: string) {
    localStorage.setItem(this.accessTokenKey, token);
  }

  private expirationCounter(timeout: number) {
    this.tokenSubscription.unsubscribe();
    this.tokenSubscription = of(null).pipe(delay(timeout)).subscribe((expired) => {
      console.log('EXPIRED!!');
      this.logout();
      this.router.navigate(['']);
      alert('Auto Logout!');
    });
  }
    

  getToken(): string {
    return localStorage.getItem(this.accessTokenKey) || '';
  }
  
  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
  }

}
