import { async, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './auth.service';

describe('Service: AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [ AuthService ]
    });

    service = TestBed.get(AuthService);
  });

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));
});
