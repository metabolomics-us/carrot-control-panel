import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { StasisService } from '@stasis';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService, private stasisService: StasisService) {
    console.log('AuthGuard class constructor');
   }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // return true;
    console.log('Function: CanActivate');
    // Check if user is logged in/api key is validated, otherwise return to login page
    return this.authService.isLoggedIn()
      .pipe(map((isLoggedIn) => {
        if (isLoggedIn) {
          return true;
        } else {
          this.router.navigate(['/login'], {queryParams: {return: state.url}});
          return false;
        }
      }));
  }
}
