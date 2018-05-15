import { NgModule } from '@angular/core';
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
export class StasisHttpModule { }