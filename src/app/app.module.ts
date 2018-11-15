import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

import { environment } from "../environments/environment";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HotTableModule } from '@handsontable/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { StasisModule } from 'stasis';

import { StartsWithPipe } from './shared/startswith.pipe';
import { GetTypePipe } from './shared/gettype.pipe';
import { MiniXService } from './shared/services/minix/minix.service';
import { CarrotHttpService } from './shared/services/carrot/carrot.http.service';

import { AcquisitionDataService } from './components/acquisition-table/acquisition-data.service';
import { AcquisitionTableService } from './components/acquisition-table/acquisition-table.service';

import { RiCurveGraphComponent } from './components/ri-curve-graph/ri-curve-graph.component';
import { RiCorrectionTableComponent } from './components/ri-correction-table/ri-correction-table.component';
import { ResultTableComponent } from './components/result-table/result-table.component';
import { StatusTableComponent } from './components/status-table/status-table.component';

import { LCMSComponent } from './pages/acquisition-lcms/lcms.component';
import { GCMSComponent } from './pages/acquisition-gcms/gcms.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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
import { AddTargetComponent } from './pages/library/addtarget.component';
import { AddLibraryComponent } from './pages/library/addlibrary.component';
import { DownloadComponent } from './pages/download/download.component';

import { NgxSpinnerModule } from 'ngx-spinner';

export const ROUTES: Routes = [
  {path: '', redirectTo: '/lcms', pathMatch: 'full'},
  {path: 'lcms', component: LCMSComponent},
  {path: 'gcms', component: GCMSComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'schedule', component: ScheduleComponent},
  {path: 'addtarget', component: AddTargetComponent},
  {path: 'addlibrary', component: AddLibraryComponent},
  {path: 'download', component: DownloadComponent}
];


@NgModule({
  declarations: [
    StartsWithPipe,
    GetTypePipe,

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
    RiCurveGraphComponent,
    RiCorrectionTableComponent,
    ResultTableComponent,
    StatusTableComponent,
    DashboardComponent,

    ScheduleComponent,
    AddTargetComponent,
    AddLibraryComponent,
    DownloadComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    NgbModule.forRoot(),
    StasisModule.forRoot(environment),
    HotTableModule,
    NgxChartsModule,
    HotTableModule.forRoot(),
    NgxSpinnerModule
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
