import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Globals } from './app.globals';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ATFMiniXComponent } from './acquisition-table/atf-minix.component';
import { ATFLCMSComponent } from './acquisition-table/atf-lcms.component';
import { ATFMSMSComponent } from './acquisition-table/atf-msms.component';
import { LCMSComponent } from './lcms/lcms.component';

import { AcquisitionDataService } from './acquisition-table/acquisition-data.service';
import { AcquisitionTableService } from './acquisition-table/acquisition-table.service';
import { MiniXService } from './minix/minix.service';


export const ROUTES: Routes = [
  {path: '', redirectTo: '/lcms', pathMatch: 'full'},
  {path: 'lcms', component: LCMSComponent},
  {path: 'gcms', component: LCMSComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ATFMiniXComponent,
    ATFLCMSComponent,
    ATFMSMSComponent,
    LCMSComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    NgbModule.forRoot()
  ],
  providers: [
    Globals,
    MiniXService,
    AcquisitionDataService,
    AcquisitionTableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
