import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Globals } from './app.globals';
import { AppComponent } from './app.component';
import { AcquisitionTableComponent } from './acquisition-table/acquisition-table.component';
import { AcquisitionTableService } from './acquisition-table/acquisition-table.service';
import { MiniXService } from './acquisition-table/minix.service';

import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    AcquisitionTableComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot()
  ],
  providers: [
    Globals,
    MiniXService,
    AcquisitionTableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
