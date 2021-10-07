import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class TokenInterseptor implements HttpInterceptor{

    constructor(private auth: AuthService, private router: Router, private jwtHelper: JwtHelperService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${this.auth.getToken()}`
            }
          });
          return next.handle(req).pipe(
            tap(
              event => {
                if (event instanceof HttpResponse){
                  console.log('Server response');
                }
              },
              (err) => {
                if (err instanceof HttpErrorResponse) {
                  console.log(this.auth.getToken());
                  if (this.jwtHelper.isTokenExpired(this.auth.getToken())){
                     this.auth.logout();
                     this.router.navigate(['']);
                  }
                  if (err.status == 401)
                    console.log('Unauthorized');
                    alert('401 Unauthorized');
                    this.auth.logout();
                    this.router.navigate(['']);
                }
              }
            )
          )
    }

    // private handleAuthError(error: HttpErrorResponse): Observable<any> {
    //     if (error.status === 401 || error.status === 403){
    //         console.log("401 or 403");
    //         alert('Error 401 / 403');
    //     }
    //     return throwError(error);
    // }
}