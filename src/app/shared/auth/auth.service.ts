import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { StasisService } from '@stasis';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {

  private COOKIE_NAME = 'api_key';

  constructor(private cookieService: CookieService, private stasisService: StasisService) { }

  /**
   * Log in by setting cookie if api key is valid
   * @param api_key
   */
  login(api_key: string) {
    return this.stasisService.validateAPIKey(api_key)
      .pipe(map(isValidToken => {
        if (isValidToken) {
          this.cookieService.set(this.COOKIE_NAME, api_key);
          return true;
        } else {
          return false;
        }
      }));
  }

  /**
   * Check if api key is set
   */
  isLoggedIn(): boolean {
    return this.cookieService.check(this.COOKIE_NAME);
  }

  getAPIKey(): string {
    return this.cookieService.get(this.COOKIE_NAME);
  }
}
