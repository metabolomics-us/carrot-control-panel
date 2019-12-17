import { async, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { AuthService } from './auth.service';
import { StasisService } from 'stasis';

describe('Service: AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [
        AuthService,
        CookieService,
        StasisService,
        {
          provide: 'env',
          useValue: {production: false}
        }
      ]
    });

    service = TestBed.get(AuthService);
  });

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));
});
