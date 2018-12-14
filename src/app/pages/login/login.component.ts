import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {};
  returnPath;

  constructor(private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // Get the query params
    this.route.queryParams
      .subscribe(params => this.returnPath = params['return'] || '/');
  }

  login() {
    this.form.error = undefined;

    if (this.form.apikey) {
      if (this.authService.login(this.form.apikey)) {
        this.router.navigateByUrl(this.returnPath);
      } else {
        this.form.error = 'Invalid API Key';
      }
    } else {
      this.form.error = 'Please provide an API Key';
    }
  }
}
