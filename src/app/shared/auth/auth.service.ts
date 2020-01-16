import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { StasisService } from '@stasis';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthService {

  private COOKIE_NAME = 'api_key';
  private validatedApiKey: boolean;

  constructor(private cookieService: CookieService, private stasisService: StasisService) {
    // Delete the cookie first so that you have to log in every time, for testing purposes
    cookieService.delete(this.COOKIE_NAME);
    
    this.validatedApiKey = false;
  }

  /**
   * Log in by setting cookie if api key is valid
   * @param api_key
   */
  login(api_key: string): Observable<boolean> {
    return this.stasisService.validateAPIKey(api_key)
      .pipe(map(isValidToken => {
        if (isValidToken) {
          this.validatedApiKey = true;
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
  isLoggedIn(): Observable<boolean> {
    console.log("isLoggedIn, valid key?:", this.validatedApiKey);
    if (this.validatedApiKey) {
      return of(true);
    } else if (this.cookieService.check(this.COOKIE_NAME)) {
      console.log("this.cookieService.check(this.COOKIE_NAME)");
      // Check whether api key stored in the cookie is still valid
      const api_key = this.cookieService.get(this.COOKIE_NAME);

      return this.stasisService.validateAPIKey(api_key)
        .pipe(map(isValidToken => {
          if (isValidToken) {
            this.validatedApiKey = true;
            return true;
          } else {
            return false;
          }
        }));
    } else {
      return of(false);
    }
  }

  getAPIKey(): string {
    return this.cookieService.get(this.COOKIE_NAME);
  }
}
