import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

import { environment } from "../environments/environment";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { StasisModule } from 'stasis';

import { Globals } from './app.globals';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ATFMiniXComponent } from './components/acquisition-table/atf-minix.component';
import { ATFLCMSComponent } from './components/acquisition-table/atf-lcms.component';
import { ATFGCMSComponent } from './components/acquisition-table/atf-gcms.component';
import { ATFMSMSComponent } from './components/acquisition-table/atf-msms.component';
import { ATFConfirmationComponent } from './components/acquisition-table/atf-confirm.component';
import { ATFSubmitComponent } from './components/acquisition-table/atf-submit.component';
import { ATFDisplayComponent } from './components/acquisition-table/atf-display.component';

import { LCMSComponent } from './pages/acquisition-lcms/lcms.component';
import { GCMSComponent } from './pages/acquisition-gcms/gcms.component';

import { AcquisitionDataService } from './components/acquisition-table/acquisition-data.service';
import { AcquisitionTableService } from './components/acquisition-table/acquisition-table.service';

import { StartsWithPipe } from './shared/startswith.pipe';
import { MiniXService } from './shared/services/minix/minix.service';


export const ROUTES: Routes = [
  {path: '', redirectTo: '/lcms', pathMatch: 'full'},
  {path: 'lcms', component: LCMSComponent},
  {path: 'gcms', component: GCMSComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ATFMiniXComponent,
    ATFLCMSComponent,
    ATFGCMSComponent,
    ATFMSMSComponent,
    ATFConfirmationComponent,
    ATFSubmitComponent,
    ATFDisplayComponent,
    LCMSComponent,
    GCMSComponent,

    StartsWithPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    NgbModule.forRoot(),
    StasisModule.forRoot(environment)
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
