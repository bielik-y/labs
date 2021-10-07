import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private jwtHelper: JwtHelperService) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      if(this.authService.getToken() && !this.jwtHelper.isTokenExpired(this.authService.getToken())){
        alert("You have logged in!")
        console.log(this.authService.getToken());
        return true;
      }
      else{
        this.authService.logout();
        this.router.navigate(['']);
        return false;
      }
  }
  
}
