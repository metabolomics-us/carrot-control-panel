import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { StatusTableComponent } from './status-table.component';

describe('StatusTableComponent', () => {
  let component: StatusTableComponent;
  let fixture: ComponentFixture<StatusTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule
      ],
      declarations: [ 
        StatusTableComponent 
      ]
      // ,
      // providers: [

      // ]
    })
    .compileComponents();

    // fixture = TestBed.createComponent(StatusTableComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusTableComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  fit('should compile', () => {
    expect(component).toBeTruthy();
  });
});