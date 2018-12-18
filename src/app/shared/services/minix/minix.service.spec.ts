import { async, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { MiniXService } from './minix.service';


describe('Service: MiniXService', () => {
  let service: MiniXService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [ MiniXService ]
    });

    service = TestBed.get(MiniXService);
  });

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  it('should return a JSON converted MiniX export', async(() => {
    service.getMiniXExport(400333,
      (error, result) => {
        expect(result).not.toBeNull();
        expect(result.experiment).not.toBeNull();
      },
      error => {}
    );
  }));
});
