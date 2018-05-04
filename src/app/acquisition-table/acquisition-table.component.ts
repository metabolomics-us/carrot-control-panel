import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-acquisition-table',
  templateUrl: './acquisition-table.component.html',
  styleUrls: ['./acquisition-table.component.css']
})
export class AcquisitionTableComponent implements OnInit {

  acquistionTableForm: FormGroup;

  ngOnInit() {
    this.acquistionTableForm = new FormGroup({
      minix: new FormControl('', [
        Validators.required,
        Validators.pattern("\d+")
      ])
    });
  }
}