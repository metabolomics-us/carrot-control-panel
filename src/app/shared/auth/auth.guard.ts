import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { StasisService } from 'stasis';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService, private stasisService: StasisService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      this.stasisService.setAPIKey(this.authService.getAPIKey());
      return true;
    } else {
      this.router.navigate(['/login'], {queryParams: {return: state.url}});
      return false;
    }
  }
}
