import { Component, OnInit, isDevMode } from '@angular/core';

import { HotTableRegisterer } from '@handsontable/angular';

import { StasisService } from 'stasis';
import { MiniXService } from '../../shared/services/minix/minix.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  // Scheduling task
  task: any = {};
  taskToSubmit;

  // Processing status and errors
  status: any = {};

  // MiniX Pull
  miniXLoading: boolean = false;

  // HandsOnTable properties
  hotId: string = 'scheduler';
  settings;
  data;

  defaultColumns: any[] = ['Sample File Name', 'Class', 'Species', 'Organ', 'Comment', 'Label'];
  selectedColumns;

  // Form options
  acquisitionMethodOptions = [];
  platformOptions = [];

  constructor(
    private hotRegisterer: HotTableRegisterer, 
    private stasisService: StasisService,
    private minixService: MiniXService
  ) { }

  ngOnInit() {
    // HandsOnTable settings and initial data
    this.settings = {
      contextMenu: true,
      rowHeaders: true,
      colHeaders: this.defaultColumns.slice(0),
      minRows: 6,
      minCols: this.defaultColumns.length,
      minSpareRows: 2,
      observeChanges: true
    };

    // Set default
    this.data = [[]];
    this.selectedColumns = this.defaultColumns.slice(0);

    // Set form options
    this.task = {platform: 'lcms'};
    this.pullAcquisitionMethodsAndPlatforms();
  }


  /**
   * Pull platform and acquisition method information from carrot scheduler
   */
  pullAcquisitionMethodsAndPlatforms() {
    this.stasisService.getLibraries().subscribe(response => {
      this.acquisitionMethodOptions = response;
    });

    this.stasisService.getPlatforms().subscribe(response => {
      this.platformOptions = response;
    });
  }

  /**
   * Pull study information from MiniX
   */
  pullMiniXStudy() {
    this.status.miniXError = undefined;

    if (!this.task.minix || this.task.minix == '') {
      this.status.miniXError = 'No MiniX study ID provided!';
    } else {
      this.status.miniXLoading = true;

      let instance = this.hotRegisterer.getInstance(this.hotId);
      let headers: any = instance.getColHeader();

      let fileNameCol = headers.indexOf('Sample File Name');
      let classCol = headers.indexOf('Class');
      let speciesCol = headers.indexOf('Species');
      let organCol = headers.indexOf('Organ');
      let commentCol = headers.indexOf('Comment');
      let labelCol = headers.indexOf('Label');

      this.minixService.getMiniXJSONExport(this.task.minix).subscribe(
        (response: any) => {
          this.status.miniXLoading = false;

          response.forEach((x, i) => {
            let values = Array(this.defaultColumns.length).fill('');

            if (fileNameCol > -1)
                values[fileNameCol] = x.sample;
            if (classCol > -1)
                values[classCol] = x.className;
            if (speciesCol > -1)
                values[speciesCol] = x.species;
            if (organCol > -1)
                values[organCol] = x.organ;
            if (commentCol > -1)
                values[commentCol] = x.comment;
            if (labelCol > -1)
                values[labelCol] = x.label;

            if (i < this.data.length) {
              this.data[i] = values;
            } else {
              this.data.push(values);
            }

            instance.updateSettings({data: this.data}, false);
          });
        },
        error => {
          this.status.miniXLoading = false;
          this.status.miniXError = 'MiniX study ID could not be found!';
        }
      );
    }
  }


  /**
   * Synchronize column selectors and headers after selection in dropdown
   */
  updateColumnName(idx) {
    let instance = this.hotRegisterer.getInstance(this.hotId);
    instance.updateSettings({colHeaders: this.selectedColumns}, false);
  }

  /**
   * Reset the data and headers in the table
   */
  resetTable() {
    this.resetTableRowHeaders();
    this.data = [[]];
  }

  /**
   * Reset row labels on the table to numeric values
   */
  resetTableRowHeaders() {
    let instance = this.hotRegisterer.getInstance(this.hotId);
    let rowLabels: any = instance.getRowHeader();

    this.data.forEach((x, i) => rowLabels[i] = i + 1);
    instance.updateSettings({rowHeaders: rowLabels}, false);
  };

  sortTableByValidity(includeBadRows: boolean = true) {
    let instance = this.hotRegisterer.getInstance(this.hotId);
    let rowLabels: any = instance.getRowHeader();

    // Find valid and invalid samples
    let goodRows = [];
    let badRows = [];

    this.data.forEach((x, i) => {
      if (typeof rowLabels[i] === 'string') {
        if (rowLabels[i].indexOf('fa-check') > 0) {
          goodRows.push(x);
        }

        if (rowLabels[i].indexOf('fa-times') > 0) {
          badRows.push(x);
        }
      }
    });

    // Update data
    this.data = includeBadRows ? goodRows.concat(badRows) : goodRows;

    if (this.data.length == 0)
      this.data = [[]];

    // Update row headers
    for (let i = 0; i < goodRows.length + badRows.length; i++) {
      if (i < goodRows.length) {
        rowLabels[i] = '<i class="fa fa-check text-success" aria-hidden="true"></i>';
      } else if(includeBadRows && i < goodRows.length + badRows.length) {
        rowLabels[i] = '<i class="fa fa-times text-danger" aria-hidden="true"></i>';
      } else {
        rowLabels[i] = i + 1;
      }
    }

    instance.updateSettings({rowHeaders: rowLabels}, false);
  }

  removeInvalidRows() {
    this.sortTableByValidity(false);
    this.status.checkFileError = undefined;
    this.status.checkFileSuccess = this.taskToSubmit.samples.length > 0;
  }

  /**
   * Check whether the sample filenames given in the table exist
   */
  checkFiles() {
    // Reset errors
    this.status.success = false;
    this.status.checkFileSuccess = undefined;
    this.status.checkFileError = undefined;
    this.status.error = undefined;
    this.status.miniXError = undefined;

    // Check that filename column is selected
    let instance = this.hotRegisterer.getInstance(this.hotId);
    let headers: any = instance.getColHeader();

    let fileNameCol = headers.indexOf('Sample File Name');
    let classCol = headers.indexOf('Class');
    let speciesCol = headers.indexOf('Species');
    let organCol = headers.indexOf('Organ');
    let commentCol = headers.indexOf('Comment');
    let labelCol = headers.indexOf('Label');

    // Validate form
    if (fileNameCol == -1) {
      this.status.error = 'No sample file name column selected!';
      return;
    }

    this.status.checkingFiles = true;
    this.resetTableRowHeaders();

    // Task object to submit
    this.taskToSubmit = {
      samples: []
    };

    // Check file existence for each row and update the row header with the result
    let rowLabels: any = instance.getRowHeader();
    let checkCount = 0;
    let validCount = 0;
    let errorCount = 0;

    this.data.forEach((x, i) => {
      if (x[fileNameCol] !== null && x[fileNameCol] !== "") {
        // Replace extension if desired
        if (this.task.extension && this.task.extension != "") {
          if (x[fileNameCol].indexOf('.') > -1) {
            x[fileNameCol] = x[fileNameCol].substr(0, x[fileNameCol].lastIndexOf('.')) +'.'+ this.task.extension;
          } else if (x[fileNameCol] != "") {
            x[fileNameCol] += '.'+ this.task.extension;
          }
        }

        this.stasisService.checkFileStatus(x[fileNameCol]).subscribe(
          response => {
            // Add a valid sample to the task
            let sample: any = {fileName: x[fileNameCol]};
            let matrix: any = {};

            // No treatments handling for now
            matrix.treatments = [];

            if (classCol > -1)
              matrix.identifier = x[classCol];
            if (speciesCol > -1)
              matrix.species = x[speciesCol];
            if (organCol > -1)
              matrix.organ = x[organCol];
            if (commentCol > -1)
              sample.comment = x[commentCol];
            if (labelCol > -1)
              sample.label = x[labelCol];
            if (Object.keys(matrix).length > 0)
              sample.matrix = matrix;

            this.taskToSubmit.samples.push(sample.fileName.replace("." + this.task.extension, ""));

            // Update row header
            console.log(response['exist'])
            rowLabels[i] = `<i class="fa fa-check ${response['exist']?'text-success':'text-danger'} aria-hidden="true"></i>`;
            instance.updateSettings({rowHeaders: rowLabels}, false);

            checkCount++;
            validCount++;
          },
          error => {
            // Update row header
            rowLabels[i] = '<i class="fa fa-times text-danger" aria-hidden="true"></i>';
            instance.updateSettings({rowHeaders: rowLabels}, false);

            checkCount++;
            errorCount++;
          }
        )
      } else if (x.filter(x => x != null && x != "").length == 0) {
        // Ignore empty rows
        rowLabels[i] = i + 1;
        instance.updateSettings({rowHeaders: rowLabels}, false);
        checkCount++;
      } else {
        rowLabels[i] = '<i class="fa fa-times text-danger" aria-hidden="true"></i>';
        instance.updateSettings({rowHeaders: rowLabels}, false);
        checkCount++;
      }
    });

    // Submit the task, waiting until all checks are complete
    let monitorFileCheck = () => {
      if (checkCount < this.data.length) {
        setTimeout(monitorFileCheck, 1000);
      } else if (errorCount > 0) {
        this.status.checkFileError = errorCount +'/'+ (validCount + errorCount) +' sample files could not be found!  Please remove or rename these.';
        this.status.checkingFiles = false;
      } else {
        this.status.checkFileSuccess = true;
        this.status.checkingFiles = false;
      }
    }

    monitorFileCheck();
  }


  /**
   * Reset form
   */
  reset() {
    window.location.reload();
  }


  /**
   * Validate and submit form
   */
  submit() {
    this.status.error = undefined;

    let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    if (this.status.checkFileError) {
      this.status.error = 'Not all sample files are valid - please re-check files before submitting!';
      window.scroll(0, 0);
      return;
    }
    if (!this.task.email) {
      this.status.error = 'No email address provided!';
      window.scroll(0, 0);
      return;
    }
    if (!emailRegex.test(this.task.email)) {
      this.status.error = 'Invalid email address!';
      window.scroll(0, 0);
      return;
    }
    if (!this.task.platform) {
      this.status.error = 'No platform selected!';
      window.scroll(0, 0);
      return;
    }
    if (!this.task.acquisitionMethod) {
      this.status.error = 'No acquisition method selected!';
      window.scroll(0, 0);
      return;
    }
    
    this.status.submitting = true;

    this.taskToSubmit.name = this.task.email;
    this.taskToSubmit.email = this.task.email;
    this.taskToSubmit.acquisitionMethod = this.task.acquisitionMethod.asCarrot();
    this.taskToSubmit.mode = this.task.platform;
    this.taskToSubmit.env = this.getEnv();

    // Add task name
    if (this.task.name && this.task.name != '') {
      this.taskToSubmit.name += '_'+ this.task.name;
    } else {
      this.taskToSubmit.name += '_'+ new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    }

    console.log(this.taskToSubmit);

    // Submit the task, waiting until all checks are complete
    this.stasisService.submitJob(this.taskToSubmit).subscribe(
      response => {
        this.status.success = response;
        this.status.submitting = false;
        window.scroll(0, 0);
      },
      error => {
        console.log('Error: ' + error);
        this.status.error = error;
        this.status.submitting = false;
        window.scroll(0, 0);
      }
    );
  }

  getEnv() {
    if(isDevMode()) {
      return "dev";
    } else {
      return "prod";
    }
  }
}
