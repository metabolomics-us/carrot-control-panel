import { Component, OnInit } from '@angular/core';

import { CarrotHttpService } from '../../shared/services/carrot/carrot.http.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {

  DOWNLOAD_URL: string;

  task: any = {};
  status: any = {};

  constructor(private carrotHttpService: CarrotHttpService) { }

  ngOnInit() {
    this.DOWNLOAD_URL = this.carrotHttpService.getFileDownloadPath();
  }

  download() {
    this.status.success = undefined;
    this.status.error = undefined;

    if (!this.task.filename || this.task.filename === '') {
      this.status.error = 'No filename specified!';
    } else {
      this.status.checkingFile = true;

      this.carrotHttpService.checkFileStatus(this.task.filename).subscribe(
        response => {
          this.status.checkingFile = false;
          this.status.success = true;

          window.location.href = this.DOWNLOAD_URL + this.task.filename;
        },
        error => {
          this.status.checkingFile = false;
          this.status.error = 'File could not be found!';
        }
      );
    }
  }
}
