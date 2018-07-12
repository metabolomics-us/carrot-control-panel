import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

import { environment } from "../environments/environment";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HotTableModule } from '@handsontable/angular';

import { StasisModule } from 'stasis';

import { StartsWithPipe } from './shared/startswith.pipe';
import { MiniXService } from './shared/services/minix/minix.service';
import { CarrotHttpService } from './shared/services/carrot/carrot.http.service';

import { AcquisitionDataService } from './components/acquisition-table/acquisition-data.service';
import { AcquisitionTableService } from './components/acquisition-table/acquisition-table.service';

import { LCMSComponent } from './pages/acquisition-lcms/lcms.component';
import { GCMSComponent } from './pages/acquisition-gcms/gcms.component';

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

import { ScheduleComponent } from './pages/schedule/schedule.component';
import { DownloadComponent } from './pages/download/download.component';


export const ROUTES: Routes = [
  {path: '', redirectTo: '/lcms', pathMatch: 'full'},
  {path: 'lcms', component: LCMSComponent},
  {path: 'gcms', component: GCMSComponent},
  {path: 'schedule', component: ScheduleComponent},
  {path: 'download', component: DownloadComponent}
];


@NgModule({
  declarations: [
    StartsWithPipe,

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

    ScheduleComponent,
    DownloadComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    NgbModule.forRoot(),
    StasisModule.forRoot(environment),
    HotTableModule.forRoot()
  ],
  providers: [
    Globals,
    MiniXService,
    CarrotHttpService,
    AcquisitionDataService,
    AcquisitionTableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
