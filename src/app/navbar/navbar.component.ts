import { Component } from '@angular/core';

import { Globals } from '../app.globals';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [Globals]
})
export class NavbarComponent {

  navbarCollapsed: boolean;

  constructor(private globals: Globals) {
      this.navbarCollapsed = true;
  }
}