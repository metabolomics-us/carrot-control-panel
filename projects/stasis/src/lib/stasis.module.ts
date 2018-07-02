import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { StasisService } from './stasis.service'

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    StasisService
  ]
})
export class StasisModule {

  public static forRoot(environment: any): ModuleWithProviders {
    return {
      ngModule: StasisModule,
      providers: [
        StasisService,
        {
          provide: 'env',
          useValue: environment
        }
      ]
    };
  }
}