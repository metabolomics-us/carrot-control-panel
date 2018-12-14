import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService {

  private COOKIE_NAME = 'api_key';

  constructor(private cookieService: CookieService) { }

  /**
   * Tests whether the api key is valid
   * TODO: tie in with stasis module
   * @param api_key
   */
  validate(api_key: string): boolean {
    return true;
  }

  /**
   * Log in by setting cookie if api key is valid
   * @param api_key
   */
  login(api_key: string): boolean {
    if (this.validate(api_key)) {
      this.cookieService.set(this.COOKIE_NAME, api_key);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Check if api key is set
   */
  isLoggedIn(): boolean {
    return this.cookieService.check(this.COOKIE_NAME);
  }
}
