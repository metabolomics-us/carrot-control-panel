import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { StasisService } from './stasis.service';
import { MessageService } from './message.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    StasisService,
    MessageService,
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