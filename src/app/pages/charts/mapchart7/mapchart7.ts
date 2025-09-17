import { Component, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadChart } from '../../../@core/services/load-chart';
import * as XLSX from 'xlsx';
import { Aggregation } from '../../../@core/services/aggregation';
import { NotificationMassageService } from '../../../@core/services/notification-massage-service';
import { ApiServices } from '../../../@core/services/api-services';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../../@core/services/storage-service';
import { ChartEventService } from '../../../@core/services/chart-event-service';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';


declare const Highcharts: any;

@Component({
  selector: 'app-mapchart7',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './mapchart7.html',
  styleUrl: './mapchart7.scss'
})
export class Mapchart7 {
  // apiUrl: string = 'assets/test1.json';
  apiUrl: string = '';
  isLoading = false;
  rawData: any[] = [];
  allFields: string[] = [];

  selectedMatchValue = '';
  selectedMapOption: {
    name: string;
    json_file: string;
    uniqueValueMatch: string;
  } | null = null;
  currentChart: any;
  title: string = '';
  subTitle: string = '';

  mapOption = [
    { name: 'USA-ALL', json_file: 'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json', uniqueValueMatch: 'postal-code' },
    { name: 'ASIA', json_file: 'https://code.highcharts.com/mapdata/custom/asia.geo.json', uniqueValueMatch: 'iso-a2' },
    { name: 'EUROPE', json_file: 'https://code.highcharts.com/mapdata/custom/europe.topo.json', uniqueValueMatch: 'iso-a2' },
  ]

  yAxes: { title: string; field: string, chartType: string, unit: string, opposite: boolean, color: string }[] = [];
  selectedSeriesFields: { field: string, color: string }[] = [];

  pieInnerSize: string = '';
  pieStartAngal: number = 0;
  pieENDAngal: number = 0;
  uploadedExcelData: any[] | null = null;
  showOptions = false;

  chartCategories: any[] = [];
  selectedChartCate: any = null;
  selectedChartType: any = null;
  selectedXAxis = '';
  selectedYAxis = '';
  showLengend: boolean = false;
  dataLabel: boolean = false;
  enableMouseTracking: boolean = false;
  selectedThirdArgument: string = '';
  selectedForthArgument: string = '';
  zooming: string = '';
  stacking: string = '';
  showErrors = false;
  newFileName: string = '';
  isViewCharts = true;
  selectedChartFiles: any = null;
  aggFunctions = ["sum", "avg", "min", "max", "count"];
  selectedAgg = '';
  uploadedFileName: string = '';
  sourceType = 1; // 1: API, 2: Excel
  constructor(private readonly http: HttpClient, private readonly chartBuilderService: LoadChart, public aggregation: Aggregation, private ngZone: NgZone,
    private readonly notifyService: NotificationMassageService, private readonly apiServices: ApiServices, private readonly storage: StorageService,
    private readonly chartEventService: ChartEventService, private readonly route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      this.isViewCharts = mode !== 'designer';
    });

    this.chartEventService.changeTabEvent.subscribe((data) => {
      console.log('🔥 New chart mode activated!', data);
      if (data) {
        this.selectedChartFiles = data;
        this.loadChartCategories();
      }
    });
    this.chartEventService.createNewChatEvent.subscribe((data) => {
      if (data) {
        this.selectedChartFiles = null;
        this.apiUrl = '';
        this.uploadedExcelData = null;
        this.showOptions = true;
        this.selectedMatchValue = '';
        this.selectedMapOption = null;
        this.title = '';
        this.subTitle = '';
        this.newFileName = '';
        this.selectedChartFiles = null;
        this.isViewCharts = false;
        this.allFields = [];
        this.rawData = [];
        this.showErrors = false;
        this.selectedThirdArgument = '';
        this.chartCategories = [];
        this.selectedChartCate = null;
        this.selectedChartType = null;
        this.selectedXAxis = '';
        this.selectedYAxis = '';
        this.selectedThirdArgument = '';
        this.selectedForthArgument = '';
        this.showLengend = false;
        this.dataLabel = false;
        this.enableMouseTracking = false;
        this.zooming = '';
        this.stacking = '';
        this.uploadedFileName = '';
        this.loadChartCategories();
      }
    })
  }

  ngOnInit() { }

  changeView() {
    this.isViewCharts = !this.isViewCharts;
  }

  ngAfterViewInit(): void {
    this.loadChartCategories();
  }

  loadChartCategories(): void {
    this.http.get<any>('assets/common.json').subscribe(
      data => {
        this.chartCategories = data;
        console.log('Loaded chart categories:', this.chartCategories);
        console.log('Loaded chart categories:', this.selectedChartFiles);
        if (this.selectedChartFiles) {
          this.newFileName = this.selectedChartFiles?.name;
          this.getFilesData();
        }
      },
      error => {
        console.error('Error loading common.json:', error);
      }
    );
  }

  getFilesData(): void {
    this.apiServices.getFile(this.selectedChartFiles.name).subscribe({
      next: (res: any) => {
        if (!res?.status) {
          console.error("API Error:", res?.message || "Unknown error");
          return;
        }

        const data = res.data;
        console.log("Fetched file data:", data);
        this.sourceType = data?.sourceType || 1;
        if (data?.sourceType == 1) {
          this.apiUrl = data?.sourceFile || '';
          this.uploadedFileName = '';
          this.uploadedExcelData = null;
        } else if (data?.sourceType == 2) {
          this.uploadedFileName = data?.sourceFile || '';
          this.uploadedExcelData = data?.rawData || [];
          this.apiUrl = '';
        }
        console.log("data?.sourceType =>", data?.sourceType);
        console.log("data?.sourceType =>", data?.sourceFile);
        console.log("this.sourceType =>", this.uploadedExcelData);
        this.selectedChartCate = data?.selectedChartCate || null;
        this.selectedChartType = data?.selectedChartType || null;
        this.selectedMatchValue = data?.selectedMatchValue || '';
        this.selectedMapOption = data?.selectedMapOption || null;
        this.rawData = data?.rawData || [];
        this.title = data?.title || '';
        this.subTitle = data?.subTitle || '';
        this.selectedXAxis = data?.selectedXAxis || '';
        this.selectedYAxis = data?.selectedYAxis || '';
        this.zooming = data?.zooming || '';
        this.showLengend = !!data?.showLengend;
        this.dataLabel = !!data?.dataLabel;
        this.enableMouseTracking = !!data?.enableMouseTracking;
        this.selectedThirdArgument = data?.selectedThirdArgument || '';
        this.pieInnerSize = data?.pieInnerSize || 0;
        this.pieStartAngal = data?.pieStartAngal || 0;
        this.pieENDAngal = data?.pieENDAngal || 0;
        this.stacking = data?.stacking || '';
        this.selectedSeriesFields = data?.selectedSeriesFields || [];
        this.yAxes = data?.yAxes || [];
        if (!this.rawData.length) {
          console.error("No data found");
          return;
        }
        this.showOptions = false;
        this.allFields = Object.keys(this.rawData[0]);
        setTimeout(() => this.renderChart(), 300);
      },
      error: (err) => {
        console.error("HTTP Error:", err);
      },
      complete: () => {
        console.log("Request completed.");
      }
    });
  }

  compareObjectsByKey(key: string) {
    return (o1: any, o2: any) => {
      return o1 && o2 ? o1[key] === o2[key] : o1 === o2;
    };
  }

  generateBigData(count: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < count; i++) {
      const y = Math.sin(i / 1000) + Math.random();
      result.push(y);
    }
    return result;
  }

  addYAxis(): void {
    this.yAxes.push({ title: '', field: '', chartType: '', unit: '', opposite: false, color: '' });
    console.log(this.yAxes);
  }

  addSeries(): void {
    this.selectedSeriesFields.push({ field: '', color: '' });
    console.log(this.yAxes);
  }

  removeYAxis(index: number): void {
    this.yAxes.splice(index, 1);
  }

  removeSeries(index: number): void {
    this.selectedSeriesFields.splice(index, 1);
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      console.error('Please select a single Excel file.');
      return;
    }

    const file: File = target.files[0];
    const reader: FileReader = new FileReader();
    this.uploadedFileName = file.name;
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      const filteredRows = data.filter(row => row.some(cell => cell !== ''));
      const [headerRow, ...rows] = filteredRows;
      const cleanJson = rows.map(row => {
        const obj: any = {};
        headerRow.forEach((header, i) => {
          obj[header] = row[i];
        });
        return obj;
      });
      this.uploadedExcelData = cleanJson;
    };
    reader.readAsBinaryString(file);
  }

  removeFile(): void {
    this.uploadedFileName = '';
    // Reset the input to allow the same file to be selected again
    // this.fileInput.nativeElement.value = '';
  }

  async fetchAndConvertCSVtoJSON(csvUrl: string): Promise<any[]> {
    const response = await fetch(csvUrl);
    let csvText = await response.text();

    csvText = csvText.replace(/\n\n/g, '\n').trim();
    const lines = csvText.split('\n');

    if (lines.length < 2) {
      throw new Error('CSV has no data rows');
    }

    const headers = lines[0].split(',').map(h => h.trim());

    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',');

      if (values.length !== headers.length) {
        console.warn(`Row ${index + 2} column count mismatch.`);
        return null;
      }

      const entry: { [key: string]: any } = {};
      headers.forEach((h, i) => {
        const val = values[i]?.trim();
        entry[h] = isNaN(Number(val)) ? val : Number(val);
      });

      return entry;
    }).filter(e => e !== null);

    return data;
  }

  fetchData() {
    this.showErrors = true;
    this.isLoading = true;

    if ((!this.newFileName || this.newFileName.trim() === '')) {
      this.isLoading = false;
      return;
    }

    if (!this.newFileName || this.newFileName.trim() === '' || this.newFileName.trim().length > 30) {
      this.isLoading = false;
      return;
    }

    if ((!this.apiUrl || this.apiUrl.trim() === '') && !this.uploadedExcelData) {
      this.isLoading = false;
      return;
    }

    if (this.uploadedExcelData) {
      this.handleLoadedData(this.uploadedExcelData);
      this.isLoading = false;
      return;
    }

    // Check file type by extension
    const isCSV = this.apiUrl.trim().toLowerCase().endsWith('.csv');
    const isJSON = this.apiUrl.trim().toLowerCase().endsWith('.json');

    if (isCSV) {
      this.fetchAndConvertCSVtoJSON(this.apiUrl).then(data => {
        this.handleLoadedData(data);
      }).catch(error => {
        this.isLoading = false;
        this.notifyService.error('Failed to load or parse CSV file.', 'Error');
        console.error('CSV Load Error:', error);
      });
    } else {
      this.http.get<any[]>(this.apiUrl).subscribe(data => {
        this.handleLoadedData(data);
      }, error => {
        this.isLoading = false;
        this.notifyService.error('Failed to load data.', 'Error');
        console.error('JSON Load Error:', error);
      });
    }
  }


  handleLoadedData(data: any[]): void {
    this.isLoading = false;
    this.showOptions = false;
    if (!this.validateRowData(data)) {
      this.notifyService.error('Row data not valid', 'Validation Failed', { timeOut: 5000 });
      return;
    }
    this.rawData = data;
    this.allFields = Object.keys(data[0]);
    console.log(this.rawData);
  }

  validateRowData(rows: any[]): boolean {
    if (!Array.isArray(rows) || rows.length === 0) {
      return false;
    }

    for (const row of rows) {
      if (!row || typeof row !== 'object' || Array.isArray(row)) {
        return false;
      }

      for (const value of Object.values(row)) {
        if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
          return false;
        }
      }
    }
    return true;
  }

  renderChart(): void {
    console.log('selectedChartType', this.selectedChartType);

    if (this.currentChart) {
      this.currentChart.destroy();
    }

    switch (this.selectedChartCate?.id) {
      case 1:
      case 2:
        this.renderSingleAndTwoLevelChart();
        break;
      case 3:
        this.renderthreeAndFourLevelChart();
        break;
      case 4:
        this.multiDiminonalChart();
        break;
      case 5:
        this.rendertMapChart();
        break;
      case 6:
        this.rendertSeriesChart();
        break;
      default:
        this.renderSingleAndTwoLevelChart();
    }
  }


  renderSingleAndTwoLevelChart(): void {
    if (!this.selectedXAxis && this.selectedYAxis) {
      console.warn('Select at least one series field and argument field');
      return;
    }
    let chartOptions: any = null;
    chartOptions = this.chartBuilderService.getChartOptions(
      this.selectedChartCate,
      this.selectedChartType,
      this.rawData,
      this.title,
      this.subTitle,
      this.selectedXAxis,
      this.selectedYAxis,
      this.zooming,
      this.showLengend,
      this.dataLabel,
      this.enableMouseTracking,
      this.selectedThirdArgument,
      this.pieInnerSize,
      this.pieStartAngal,
      this.pieENDAngal,
      this.stacking,
    );
    try {
      this.currentChart = Highcharts.chart('chart-container', chartOptions);
      console.log("chartOptions =>", chartOptions);
    } catch (error: any) {
      this.currentChart = null;
      console.error('Highcharts error:', error);
      this.notifyService.error('Unable to render chart. Please check your data and chart configuration.', 'Error');
    }
    console.log("this.currentChart =>", this.currentChart);
    console.log("this.currentChart =>", chartOptions);
  }


  renderthreeAndFourLevelChart() {
    if (!this.selectedXAxis && this.selectedYAxis) {
      console.warn('Select at least one series field and argument field');
      return;
    }
    let chartOptions: any = null;
    chartOptions = this.chartBuilderService.getChartOptions(
      this.selectedChartCate,
      this.selectedChartType,
      this.rawData,
      this.title,
      this.subTitle,
      this.selectedXAxis,
      this.selectedYAxis,
      this.zooming,
      this.showLengend,
      this.dataLabel,
      this.enableMouseTracking,
      this.selectedThirdArgument,
      this.pieInnerSize,
      this.pieStartAngal,
      this.pieENDAngal,
      this.stacking,
    );
    try {
      this.currentChart = Highcharts.chart('chart-container', chartOptions);
      console.log("chartOptions =>", chartOptions);
    } catch (error: any) {
      console.error('Highcharts error:', error);
      this.currentChart = null;
      // Show user-friendly message
      this.notifyService.error('Unable to render chart. Please check your data and chart configuration.', 'Error');
    }
  }

  rendertSeriesChart() {
    console.log('render series charts');
    if (!this.selectedXAxis && this.selectedYAxis) {
      console.warn('Select at least one series field and argument field');
      return;
    }
    let chartOptions: any = null;
    chartOptions = this.chartBuilderService.getChartOptions(
      this.selectedChartCate,
      this.selectedChartType,
      this.rawData,
      this.title,
      this.subTitle,
      this.selectedXAxis,
      this.selectedYAxis,
      this.zooming,
      this.showLengend,
      this.dataLabel,
      this.enableMouseTracking,
      this.selectedThirdArgument,
      this.pieInnerSize,
      this.pieStartAngal,
      this.pieENDAngal,
      this.stacking,
      this.selectedSeriesFields
    );
    try {
      this.currentChart = Highcharts.chart('chart-container', chartOptions);
      console.log("chartOptions =>", chartOptions);
    } catch (error: any) {
      console.error('Highcharts error:', error);
      this.currentChart = null;
      // Show user-friendly message
      this.notifyService.error('Unable to render chart. Please check your data and chart configuration.', 'Error');
    }
  }


  multiDiminonalChart() {
    if (!this.selectedXAxis) {
      console.warn('Select at least one series field and argument field');
      return;
    }
    let chartOptions: any;
    chartOptions = this.chartBuilderService.multiDiminonalChart(
      this.title,
      this.subTitle,
      this.rawData,
      this.selectedXAxis,
      this.yAxes,
      this.zooming,
      this.showLengend,
      this.dataLabel,
      this.enableMouseTracking,
    );
    try {
      this.currentChart = Highcharts.chart('chart-container', chartOptions);
      console.log('chartOptions =>', chartOptions);
    } catch (error: any) {
      console.error('Highcharts error:', error);
      this.currentChart = null;
      // Show user-friendly message
      this.notifyService.error('Unable to render chart. Please check your data and chart configuration.', 'Error');
    }
  }

  async rendertMapChart(): Promise<void> {
    if (!this.selectedXAxis) {
      console.warn('Select at least one series field and argument field');
      return;
    }
    try {
      const chartOptions = await this.chartBuilderService.renderMapChart( // 👈 await here
        this.selectedChartCate,
        this.selectedMapOption,
        this.selectedMatchValue,
        this.rawData,
        this.title,
        this.subTitle,
        this.selectedXAxis,
        this.showLengend,
        this.dataLabel,
        this.enableMouseTracking,
      );
      this.currentChart = Highcharts.mapChart('chart-container', chartOptions);
      console.log("chartOptions =>", chartOptions);
    } catch (err) {
      this.currentChart = null;
      this.notifyService.error('Unable to render chart. Please check your data and chart configuration.', 'Error');
    }
  }

  loadChart() {
    this.renderChart();
  }

  resetAllValue() {
    this.selectedChartCate = null;
    this.selectedChartType = null;
    this.allFields = [];
    this.zooming = '';
  }

  changeCategory() {
    console.log(this.selectedChartCate);
    this.selectedChartType = null;
    this.changeChart();
  }

  changeChart() {
    this.selectedXAxis = '';
    this.selectedYAxis = '';
    this.showLengend = false;
    this.dataLabel = false;
    this.enableMouseTracking = false;
    this.zooming = '';
    this.selectedThirdArgument = '';
    this.selectedForthArgument = '';
    this.pieENDAngal = 0;
    this.pieStartAngal = 0;
    this.pieInnerSize = '';
    this.stacking = '';
    this.selectedSeriesFields = []
  }

  resetOptions() {
    this.showOptions = true;
    this.rawData = [];
    // this.resetAllValue();
    // this.apiUrl = '';
  }

  createFiles() {
    this.apiServices.saveJson(this.newFileName, {
      sourceType: this.sourceType,
      sourceFile: this.sourceType == 1 ? this.apiUrl : this.uploadedFileName,
      selectedMatchValue: this.selectedMatchValue,
      selectedMapOption: this.selectedMapOption,
      selectedChartCate: this.selectedChartCate,
      selectedChartType: this.selectedChartType,
      rawData: this.rawData,
      title: this.title,
      subTitle: this.subTitle,
      selectedXAxis: this.selectedXAxis,
      selectedYAxis: this.selectedYAxis,
      zooming: this.zooming,
      showLengend: this.showLengend,
      dataLabel: this.dataLabel,
      enableMouseTracking: this.enableMouseTracking,
      selectedThirdArgument: this.selectedThirdArgument,
      pieInnerSize: this.pieInnerSize,
      pieStartAngal: this.pieStartAngal,
      pieENDAngal: this.pieENDAngal,
      stacking: this.stacking,
      selectedSeriesFields: this.selectedSeriesFields,
      yAxes: this.yAxes
    }).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.chartEventService.emitCreateChart(this.newFileName);
          this.notifyService.success(res.message, 'success');
        }
      },
      error: (err) => {
        this.notifyService.success(err.message, 'success');
        console.error('HTTP Error:', err);
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  updateFiles() {
    console.log('apiUrl', this.apiUrl);
    console.log('uploadedFileName', this.uploadedFileName);
    console.log('sourceType', this.sourceType);
    this.apiServices.updateFile(this.selectedChartFiles.name, {
      sourceType: this.sourceType,
      sourceFile: this.sourceType == 1 ? this.apiUrl : this.uploadedFileName,
      selectedChartCate: this.selectedChartCate,
      selectedChartType: this.selectedChartType,
      selectedMatchValue: this.selectedMatchValue,
      selectedMapOption: this.selectedMapOption,
      rawData: this.rawData,
      title: this.title,
      subTitle: this.subTitle,
      selectedXAxis: this.selectedXAxis,
      selectedYAxis: this.selectedYAxis,
      zooming: this.zooming,
      showLengend: this.showLengend,
      dataLabel: this.dataLabel,
      enableMouseTracking: this.enableMouseTracking,
      selectedThirdArgument: this.selectedThirdArgument,
      pieInnerSize: this.pieInnerSize,
      pieStartAngal: this.pieStartAngal,
      pieENDAngal: this.pieENDAngal,
      stacking: this.stacking,
      selectedSeriesFields: this.selectedSeriesFields,
      yAxes: this.yAxes
    }).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.chartEventService.emitCreateChart(this.newFileName);
          this.notifyService.success(res.message, 'success');
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
        this.notifyService.success(err.message, 'error');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }


  saveData() {
    if (this.selectedChartFiles) {
      this.updateFiles();
    } else {
      this.createFiles();
    }
  }

  changeSourceType() {
    if (this.sourceType == 1) {
      this.uploadedExcelData = null;
      this.uploadedFileName = '';
    } else {
      this.apiUrl = '';
    }
  }

}
