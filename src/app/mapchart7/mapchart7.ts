import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadChart } from '../services/load-chart';
import * as XLSX from 'xlsx';
import { Aggregation } from '../services/aggregation';


declare const Highcharts: any;

@Component({
  selector: 'app-mapchart7',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './mapchart7.html',
  styleUrl: './mapchart7.scss'
})
export class Mapchart7 {
  apiUrl: string = 'assets/test1.json';
  isLoading = false;
  rawData: any[] = [];

  allFields: string[] = [];
  valueFields: string[] = [];
  argumentFields: string[] = [];
  seriesFields: string[] = [];

  selectedValueField = '';
  selectedArgumentField = '';
  selectedSeriesField = '';
  selectedMatchValue = '';
  selectedMapOption: {
    name: string;
    json_file: string;
    uniqueValueMatch: string;
  } | null = null;
  currentChart: any;
  title: string = '';
  subTitle: string = '';

  chartOption = [
    { name: 'line', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: true, dataLabel: true, enableMouseTracking: true, markerSymbols: false, zooming: true, typeofareaChart: false, barColunmchartOption: false },
    { name: 'spline-with-inverted-axes', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: false, dataLabel: true, enableMouseTracking: false, markerSymbols: true, zooming: true, barColunmchartOption: false },
    { name: 'area-chart', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: true, dataLabel: true, enableMouseTracking: true, markerSymbols: true, zooming: true, typeofareaChart: true, barColunmchartOption: false },
    { name: 'column', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: true, dataLabel: true, enableMouseTracking: true, markerSymbols: true, zooming: true, typeofareaChart: true, barColunmchartOption: true },
    { name: 'pie', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: false, dataLabel: false, enableMouseTracking: false, markerSymbols: false, zooming: false, typeofareaChart: false, barColunmchartOption: false },
    { name: 'bubble', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: false, dataLabel: true, enableMouseTracking: false, markerSymbols: false, zooming: true, typeofareaChart: false, barColunmchartOption: false },
    { name: 'scatter', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: true, dataLabel: true, enableMouseTracking: true, markerSymbols: false, zooming: true, typeofareaChart: false, barColunmchartOption: false },
    { name: 'map', isVisableMapOption: true, isVisableMatchFeild: true, isVisialbeValueFeild: true, isVisiableArgumentField: false, isVisiableSeriesField: false, dataLabel: false, enableMouseTracking: false, markerSymbols: false, zooming: false, typeofareaChart: false, barColunmchartOption: false },
    { name: 'multiDiminssional', isVisableMapOption: true, isVisableMatchFeild: true, isVisialbeValueFeild: true, isVisiableArgumentField: false, isVisiableSeriesField: false, dataLabel: false, enableMouseTracking: false, markerSymbols: false, zooming: false, typeofareaChart: false, barColunmchartOption: false },
  ]


  mapOption = [
    { name: 'USA-ALL', json_file: 'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json', uniqueValueMatch: 'postal-code' },
    { name: 'ASIA', json_file: 'https://code.highcharts.com/mapdata/custom/asia.geo.json', uniqueValueMatch: 'iso-a2' },
    { name: 'EUROPE', json_file: 'https://code.highcharts.com/mapdata/custom/europe.topo.json', uniqueValueMatch: 'iso-a2' },
  ]
  markerSymbols = ['circle', 'square', 'diamond', 'triangle', 'triangle-down', 'url(https://www.highcharts.com/samples/graphics/sun.png)'];
  selectSymbol: string = '';


  xAxisData: string = '';

  yAxes: { title: string; field: string, chartType: string, unit: string, opposite: boolean, color: string }[] = [];


  selectedSeriesFields: string[] = [];    // Multiple dynamic series fields

  enableCustomAnimation = true;
  zooming: string = '';

  typeofareaChart: string = '';
  barColunmchartOption: string = '';

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


  constructor(private readonly http: HttpClient, private readonly chartBuilderService: LoadChart, public aggregation: Aggregation) { }

  ngOnInit() {
    this.loadChartCategories();
  }

  loadChartCategories(): void {
    this.http.get<any>('assets/common.json').subscribe(
      data => {
        this.chartCategories = data;
        console.log('Loaded chart categories:', this.chartCategories);
      },
      error => {
        console.error('Error loading common.json:', error);
      }
    );
  }

  ngAfterViewInit(): void {
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

  removeYAxis(index: number): void {
    this.yAxes.splice(index, 1);
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

      // Assuming data is in the first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Read sheet as raw 2D array (header + rows)
      const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      // Remove completely empty rows
      const filteredRows = data.filter(row => row.some(cell => cell !== ''));

      // Separate headers from rows
      const [headerRow, ...rows] = filteredRows;

      // Build clean JSON
      const cleanJson = rows.map(row => {
        const obj: any = {};
        headerRow.forEach((header, i) => {
          obj[header] = row[i];
        });
        return obj;
      });

      // console.log('✅ Clean Excel JSON:', cleanJson);
      this.uploadedExcelData = cleanJson;
      // this.handleLoadedData(cleanJson);
      // Now you can use `cleanJson` to display, upload, etc.
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
    this.isLoading = true;

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
  }

  renderChart(): void {
    console.log('selectedChartType', this.selectedChartType);
    // if (!this.selectedChartType || !this.selectedValueField || !this.selectedArgumentField) return;

    if (this.currentChart) {
      this.currentChart.destroy();
    }
    // console.log(this.rankingType)
    // this.rawData = this.applyTopBottomFilter(this.rawData);
    // console.log('Rendering chart of type:', this.selectedChartCate?.id);
    switch (this.selectedChartCate?.id) {
      case 1:
      case 2:
        this.renderSingleAndTwoLevelChart();
        break;
      case 3:
        this.renderthreeAndFourLevelChart();
        break;
      case 6:
        this.rendertSeriesChart();
        break;
      default:
        this.renderSingleAndTwoLevelChart();
    }
  }

  applyTopBottomFilter(rawData: any[]): any[] {
    let filteredData = [...rawData];

    if (this.rankingType !== 'all' && (this.limit && this.limit > 0)) {
      const field = Array.isArray(this.selectedSeriesFields)
        ? this.selectedSeriesFields[0]
        : this.selectedSeriesFields;

      filteredData = [...rawData]
        .sort((a, b) => {
          const aVal = Number(a[field]) || 0;
          const bVal = Number(b[field]) || 0;
          return this.rankingType === 'top' ? bVal - aVal : aVal - bVal;
        })
        .slice(0, this.limit);
    }

    return filteredData;
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
    );
    console.log(chartOptions);
    console.log('this.chat', this.currentChart);
    this.currentChart = Highcharts.chart('chart-container', chartOptions);
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
      this.selectedSeriesFields,
      this.zooming,
      this.showLengend,
      this.dataLabel,
      this.enableMouseTracking,
      this.selectedThirdArgument,
    );
    console.log(chartOptions);
    console.log('this.chat', this.currentChart);
    this.currentChart = Highcharts.chart('chart-container', chartOptions);
  }


  multiDiminonalChart() {
    if (!this.selectedValueField) {
      console.warn('Select at least one series field and argument field');
      return;
    }
    let chartOptions: any;
    chartOptions = this.chartBuilderService.multiDiminonalChart(
      this.title,
      this.subTitle,
      this.rawData,
      this.selectedValueField,
      this.yAxes
    );
    this.currentChart = Highcharts.chart('chart-container', chartOptions);
  }

  onSeriesFieldToggle(field: string, e: any): void {
    if (e.target?.checked) {
      this.selectedSeriesFields.push(field);
    } else {
      this.selectedSeriesFields = this.selectedSeriesFields.filter(f => f !== field);
    }
    this.renderChart();
  }

  loadChart() {
    this.renderChart();
  }

  private groupData(filteredData: any[] = this.rawData): any {
    const grouped: any = {};
    filteredData.forEach(item => {
      const category = item[this.selectedArgumentField];
      const series = this.selectedSeriesField ? item[this.selectedSeriesField] : 'Default';

      if (!grouped[category]) grouped[category] = {};
      if (!grouped[category][series]) grouped[category][series] = 0;

      const value = item[this.selectedValueField];
      grouped[category][series] += typeof value === 'number' ? value : 1;
    });
    return grouped;
  }

  resetAllValue() {
    this.selectedChartCate = null;
    this.selectedChartType = null;
    this.allFields = [];
    this.zooming = '';
  }

  changeCategory() {
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
  }

  resetOptions() {
    this.showOptions = true;
    this.rawData = [];
    this.resetAllValue();
    // this.apiUrl = '';
  }
}
