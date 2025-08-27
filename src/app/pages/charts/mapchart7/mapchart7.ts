import { Component, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadChart } from '../../../@core/services/load-chart';
import * as XLSX from 'xlsx';
import { Aggregation } from '../../../@core/services/aggregation';
import { NotificationMassageService } from '../../../@core/services/notification-massage-service';
import * as convert from 'xml-js';
import { ApiServices } from '../../../@core/services/api-services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../../@core/services/storage-service';
import { LOCAL_STORAGE_KEYS } from './../../../@core/utils/local-storage-key.utility';

declare const Highcharts: any;

@Component({
  selector: 'app-mapchart7',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './mapchart7.html',
  styleUrl: './mapchart7.scss'
})
export class Mapchart7 {
  apiUrl: string = 'assets/test1.json';
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
  enableCustomAnimation = true;

  pieInnerSize: string = '';
  pieStartAngal: number = 0;
  pieENDAngal: number = 0;
  uploadedExcelData: any[] | null = null;
  showOptions = false;

  lineOption: string = 'line';

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
  topBottomOptions = [3, 5, 10];
  rankingType: string = 'all';
  limit: number | null = null;
  zooming: string = '';
  stacking: string = '';
  fileNameFromUrl: string = '';
  showErrors = false;
  newFileName: string = '';
  isViewCharts = false;
  files: { name: string; createdAt?: string }[] = [];
  constructor(private readonly http: HttpClient, private readonly chartBuilderService: LoadChart, public aggregation: Aggregation, private ngZone: NgZone,
    private readonly notifyService: NotificationMassageService, private readonly apiServices: ApiServices, private readonly storage: StorageService,
    private readonly route: ActivatedRoute, private readonly router: Router) {
    const filename = this.route.snapshot.paramMap.get('filename');
    this.files = JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.FILELIST));
    console.log(filename);
    // if (!filename && this.files.length > 0) {
    //   this.router.navigate(['/chart', this.files[0].name]);
    // }
  }

  ngOnInit() {

  }

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
        this.route.params.subscribe((params: any) => {
          this.fileNameFromUrl = params['filename'];
          const mode = params['mode'] || 'viewer';
          this.isViewCharts = (mode === 'viewer');
          if (this.fileNameFromUrl) {
            console.log(this.fileNameFromUrl);
            this.getFilesData();
          } else {
            this.fileNameFromUrl = '';
          }
        });
      },
      error => {
        console.error('Error loading common.json:', error);
      }
    );
  }

  // switchMode(newMode: string) {
  //   this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParams: { mode: newMode },
  //     queryParamsHandling: 'merge' // keep other params if any
  //   });
  // }

  getFilesData() {
    this.apiServices.getFile(this.fileNameFromUrl).subscribe({
      next: (res: any) => {
        if (res.status) {
          // this.files = res.data;
          console.log('Files:', res.data);
          this.selectedChartCate = res.data.selectedChartCate;
          console.log(this.selectedChartCate);
          this.selectedChartType = res.data.selectedChartType;
          this.rawData = res.data.rawData;
          this.title = res.data.title;
          this.subTitle = res.data.subTitle;
          this.selectedXAxis = res.data.selectedXAxis;
          this.selectedYAxis = res.data.selectedYAxis;
          this.zooming = res.data.zooming;
          this.showLengend = res.data.showLengend;
          this.dataLabel = res.data.dataLabel;
          this.enableMouseTracking = res.data.enableMouseTracking;
          this.selectedThirdArgument = res.data.selectedThirdArgument;
          this.pieInnerSize = res.data.pieInnerSize;
          this.pieStartAngal = res.data.pieStartAngal;
          this.pieENDAngal = res.data.pieENDAngal;
          this.stacking = res.data.stacking;
          this.selectedSeriesFields = res.data.selectedSeriesFields;
          this.yAxes = res.data.yAxes;
          if (!this.rawData || this.rawData.length === 0) {
            console.error('No data found');
            return;
          }
          this.showOptions = false;
          this.allFields = Object.keys(this.rawData[0]);
          setTimeout(() => {
            this.renderChart();
          }, 300);
        } else {
          // this.files = [];
          console.error('API Error:', res.message);
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
      },
      complete: () => {
        console.log('Request completed.');
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

    if ((!this.newFileName || this.newFileName.trim() === '') && !this.fileNameFromUrl) {
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
        console.error('CSV Load Error:', error);
      });
    } else if (isJSON) {
      this.http.get<any[]>(this.apiUrl).subscribe(data => {
        this.handleLoadedData(data);
      }, error => {
        this.isLoading = false;
        console.error('JSON Load Error:', error);
      });
    } else {
      // fallback if unknown file type
      this.isLoading = false;
      console.error('Unsupported file type. Only .csv or .json allowed.');
    }
  }

  handleLoadedData(data: any[]) {
    this.isLoading = false;
    this.showOptions = false;
    this.rawData = data;
    console.log(this.rawData);
    if (!data || data.length === 0) {
      console.error('No data found');
      return;
    }
    this.allFields = Object.keys(data[0]);
    // this.xmlToJson();
  }

  renderChart(): void {
    console.log('selectedChartType', this.selectedChartType);
    // if (!this.selectedChartType || !this.selectedValueField || !this.selectedArgumentField) return;

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
    console.log(this.rawData);
    console.log(chartOptions);
    // setTimeout(() => {
    this.currentChart = Highcharts.chart('chart-container', chartOptions);
    console.log('this.currentCharts', this.currentChart);
    // }, 3000);
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
    console.log(chartOptions);
    console.log('this.chat', this.currentChart);
    this.currentChart = Highcharts.chart('chart-container', chartOptions);
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
    console.log(chartOptions);
    console.log('this.chat', this.currentChart);
    this.currentChart = Highcharts.chart('chart-container', chartOptions);
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
    console.log(this.rawData);
    console.log(chartOptions);
    this.currentChart = Highcharts.chart('chart-container', chartOptions);
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
        this.zooming,
        this.showLengend,
        this.dataLabel,
        this.enableMouseTracking,
      );
      this.currentChart = Highcharts.mapChart('chart-container', chartOptions);
    } catch (err) {
      console.error('Map load error:', err);
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
    this.resetAllValue();
    // this.apiUrl = '';
  }

  createFiles() {
    this.apiServices.saveJson(this.newFileName, {
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
          // this.router.navigate(['/chart', this.newFileName]);
        } else {
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  updateFiles() {
    this.apiServices.updateFile(this.fileNameFromUrl, {
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
        } else {
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }


  saveData() {
    if (this.fileNameFromUrl) {
      this.updateFiles();
    } else {
      this.createFiles();
    }

  }


}
