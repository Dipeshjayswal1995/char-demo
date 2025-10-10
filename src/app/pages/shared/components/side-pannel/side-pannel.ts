import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, NgZone, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartEventService } from '../../../../@core/services/chart-event-service';
import { NotificationMassageService } from '../../../../@core/services/notification-massage-service';
import { HttpClient } from '@angular/common/http';
import { LoadChart } from '../../../../@core/services/load-chart';
import { Aggregation } from '../../../../@core/services/aggregation';
import { StorageService } from '../../../../@core/services/storage-service';
import { ApiServices } from '../../../../@core/services/api-services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LOCAL_STORAGE_KEYS } from '../../../../@core/utils/local-storage-key.utility';

declare const Highcharts: any;

@Component({
  selector: 'app-side-pannel',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    MatIconModule,
  ],
  templateUrl: './side-pannel.html',
  styleUrl: './side-pannel.scss'
})
export class SidePannel implements OnInit, AfterViewInit {
  apiUrl: string = '';
  isLoading = false;
  rawData: string = '';
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
  selectedData: string = '';

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
  selectedChartFiles: any = null;
  aggFunctions = ["sum", "avg", "min", "max", "count"];
  selectedAgg = '';
  uploadedFileName: string = '';
  sourceType = 1; // 1: API, 2: Excel
  addNewSource = false;
  sourceName: string = '';
  projectData: any = null;
  sourceData: any = [];
  titleAlign: 'left' | 'center' | 'right' = 'center';
  isTitleAlignOpen = false;
  subTitleAlign: 'left' | 'center' | 'right' = 'center';
  isSubTitleAlignOpen = false;
  constructor(private readonly http: HttpClient, private readonly chartBuilderService: LoadChart, public aggregation: Aggregation, private readonly ngZone: NgZone,
    private readonly notifyService: NotificationMassageService, private readonly apiServices: ApiServices, private readonly storage: StorageService,
    private readonly chartEventService: ChartEventService, private readonly route: ActivatedRoute, public dialogRef: MatDialogRef<SidePannel>,
    @Inject(MAT_DIALOG_DATA) public modalData: any) {
    this.projectData = this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION) ? JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION)) : null;
  }

  ngOnInit() {
    console.log("modalData =>", this.modalData);
    this.setDynamicThemeing();
  }

  setDynamicThemeing() {
    if (this.projectData) {
      document.documentElement.style.setProperty('--bg-color', this.projectData.mainBackgroundColor || '#fff');
      document.documentElement.style.setProperty('--color-text', this.projectData.textColor || '#333');
      document.documentElement.style.setProperty('--button-bg', this.projectData.selectedColor || '#1976d2');
      document.documentElement.style.setProperty('--chart-background', this.projectData.chartBackgroundColor || '#fff');
      document.documentElement.style.setProperty('--button-bg-hover', this.projectData.mainBackgroundColor || '#145a9e');
      document.documentElement.style.setProperty('--card-bg', this.projectData.mainBackgroundColor || '#fff');
      document.documentElement.style.setProperty('--card-text', this.projectData.mainBackgroundColor || '#333');
      document.documentElement.style.setProperty('--sidebar-bg', this.projectData.sidebarBackgroundColor || this.projectData.mainBackgroundColor || '#1e1e1e');

    }
  }

  setTitleAlign(item: 'left' | 'center' | 'right') {
    this.titleAlign = item;
    this.isTitleAlignOpen = false;
  }

  toggleTitleAlignMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isTitleAlignOpen = !this.isTitleAlignOpen;
  }

  setSubTitleAlign(item: 'left' | 'center' | 'right') {
    this.subTitleAlign = item;
    this.isSubTitleAlignOpen = false;
  }

  toggleSubTitleAlignMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isSubTitleAlignOpen = !this.isSubTitleAlignOpen;
  }

  @HostListener('document:click')
  closeAlignPopover() {
    this.isTitleAlignOpen = false;
    this.isSubTitleAlignOpen = false;
  }

  ngAfterViewInit(): void {
    this.loadChartCategories();
  }

  loadChartCategories(): void {
    this.http.get<any>('assets/common.json').subscribe(
      data => {
        this.chartCategories = data;
        console.log('modalData =>', this.modalData);
        this.getFilesData();
      },
      error => {
        console.error('Error loading common.json:', error);
      }
    );
  }


  changeSource() {
    const index = this.sourceData.findIndex((data: any) => data.name === this.rawData);

    if (index === -1) {
      console.error("No source found");
      return;
    }

    const sourceData = this.sourceData[index];
    console.log("Selected Source:", sourceData);

    // ✅ If data is empty, fetch from API
    if (!sourceData.data || sourceData.data.length === 0) {
      console.warn("No local data found, fetching from API:", sourceData.sourceFile);

      const isCSV = sourceData.sourceFile.trim().toLowerCase().endsWith('.csv');

      if (isCSV) {
        this.fetchAndConvertCSVtoJSON(sourceData.sourceFile).then(data => {
          this.sourceData[index] = { ...sourceData, data };
          this.processLoadedData(data);
        }).catch(error => {
          this.isLoading = false;
          this.notifyService.error('Failed to load or parse CSV file.', 'Error');
          console.error('CSV Load Error:', error);
        });
      } else {
        this.http.get<any[]>(sourceData.sourceFile).subscribe(data => {
          this.sourceData[index] = { ...sourceData, data };
          this.processLoadedData(data);
        }, error => {
          this.isLoading = false;
          this.notifyService.error('Failed to load data.', 'Error');
          console.error('JSON Load Error:', error);
        });
      }

      return;
    }
    this.processLoadedData(sourceData.data);
  }

  private processLoadedData(data: any[]): void {
    if (!data || !data.length) {
      console.error("No data found even after fetch");
      return;
    }

    console.log("Fetched file data:", data);
    this.allFields = Object.keys(data[0]);
    this.resetChartConfig();
  }

  resetChartConfig() {
    this.selectedChartCate = null;
    this.selectedChartType = null;
    this.selectedMatchValue = '';
    this.selectedMapOption = null;
    this.selectedXAxis = '';
    this.selectedYAxis = '';
    this.zooming = '';
    this.showLengend = false;
    this.dataLabel = false;
    this.enableMouseTracking = false;
    this.selectedThirdArgument = '';
    this.pieInnerSize = '0';
    this.pieStartAngal = 0;
    this.pieENDAngal = 0;
    this.stacking = '';
    this.selectedSeriesFields = [];
    this.yAxes = [];
  }

  getFilesData(): void {
    this.selectedChartCate = this.modalData?.cfg?.selectedChartCate || null;
    this.selectedChartType = this.modalData?.cfg?.selectedChartType || null;
    this.selectedMatchValue = this.modalData?.cfg?.selectedMatchValue || '';
    this.selectedMapOption = this.modalData?.cfg?.selectedMapOption || null;
    this.rawData = this.modalData?.cfg?.rawData || '';
    this.selectedData = this.modalData?.cfg?.selectedData || '';
    this.title = this.modalData?.cfg?.title || '';
    this.subTitle = this.modalData?.cfg?.subTitle || '';
    this.titleAlign = this.modalData?.cfg?.titleAlign || 'center';
    this.subTitleAlign = this.modalData?.cfg?.subTitleAlign || 'center';
    this.selectedXAxis = this.modalData?.cfg?.selectedXAxis || '';
    this.selectedYAxis = this.modalData?.cfg?.selectedYAxis || '';
    this.zooming = this.modalData?.cfg?.zooming || '';
    this.showLengend = !!this.modalData?.cfg?.showLengend;
    this.dataLabel = !!this.modalData?.cfg?.dataLabel;
    this.enableMouseTracking = !!this.modalData?.cfg?.enableMouseTracking;
    this.selectedThirdArgument = this.modalData?.cfg?.selectedThirdArgument || '';
    this.pieInnerSize = this.modalData?.cfg?.pieInnerSize || 0;
    this.pieStartAngal = this.modalData?.cfg?.pieStartAngal || 0;
    this.pieENDAngal = this.modalData?.cfg?.pieENDAngal || 0;
    this.stacking = this.modalData?.cfg?.stacking || '';
    this.selectedSeriesFields = this.modalData?.cfg?.selectedSeriesFields || [];
    this.yAxes = this.modalData?.cfg?.yAxes || [];
    if (this.modalData?.sourceData) {
      try {
        this.sourceData = JSON.parse(this.modalData.sourceData);
        console.log('Source data:', this.sourceData);

        const data = this.sourceData.find((d: any) => d.name === this.rawData);
        console.log('Fetched file data:', data);

        if (!data || !data.data || !data.data.length) {
          console.error('No data found');
          return;
        }

        this.addNewSource = false;
        this.allFields = Object.keys(data.data[0]);
      } catch (err) {
        console.error('Error parsing sourceData:', err);
      }
    } else {
      console.error('modalData.sourceData not found');
    }
    console.log(this.allFields);
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

  //   onFileChange(event: any): void {
  //   const target: DataTransfer = <DataTransfer>(event.target);
  //   if (target.files.length !== 1) throw new Error('Cannot use multiple files');

  //   const reader: FileReader = new FileReader();
  //   reader.onload = (e: any) => {
  //     const bstr: string = e.target.result;
  //     const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

  //     // Get first sheet
  //     const wsname: string = wb.SheetNames[0];
  //     const ws: XLSX.WorkSheet = wb.Sheets[wsname];

  //     // Read raw rows (2D array)
  //     const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as any[][];
  //     const filteredRows = data.filter(row => row.some(cell => cell !== ''));
  //     const [headerRow, ...rows] = filteredRows;

  //     // ✅ Build clean JSON with formatted values
  //     const cleanJson = rows.map((row, rowIndex) => {
  //       const obj: any = {};
  //       headerRow.forEach((header, colIndex) => {
  //         const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex });
  //         const cell = ws[cellAddress];

  //         if (cell && cell.w) {
  //           // If Excel stored formatted text (e.g. dates) → use it
  //           obj[header] = cell.w;
  //         } else {
  //           // Otherwise use raw value
  //           obj[header] = row[colIndex];
  //         }
  //       });
  //       return obj;
  //     });

  //     console.log(cleanJson); // ✅ Dates show as "24-Apr-25"
  //     this.uploadedExcelData = cleanJson;
  //   };

  //   reader.readAsBinaryString(target.files[0]);
  // }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const file: File = target.files[0];
    const reader: FileReader = new FileReader();
    this.uploadedFileName = file.name;
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as any[][];
      const filteredRows = data.filter(row => row.some(cell => cell !== ''));
      const [headerRow, ...rows] = filteredRows;

      const cleanJson = rows.map((row, rowIndex) => {
        const obj: any = {};
        headerRow.forEach((header, colIndex) => {
          const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex });
          const cell = ws[cellAddress];

          if (!cell) {
            obj[header] = null;
            return;
          }

          if (cell.w && isNaN(Number(cell.w))) {
            // ✅ If Excel already shows a formatted string (like "24-Apr-25" or "Ahmedabad")
            obj[header] = cell.w;
          } else if (cell.t === 'n') {
            // ✅ If it's a number, keep as number
            obj[header] = Number(cell.v);
          } else if (cell.t === 's' || cell.t === 'str') {
            obj[header] = String(cell.v);
          } else if (cell.t === 'b') {
            obj[header] = Boolean(cell.v);
          } else {
            obj[header] = cell.v;
          }
        });
        return obj;
      });

      console.log(cleanJson);
      this.uploadedExcelData = cleanJson;
    };

    reader.readAsBinaryString(target.files[0]);
  }

  removeFile(): void {
    this.uploadedFileName = '';
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

    if ((!this.sourceName || this.sourceName.trim() === '')) {
      this.isLoading = false;
      return;
    }

    if (!this.sourceName || this.sourceName.trim() === '' || this.sourceName.trim().length > 30) {
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
    if (this.sourceData.some((item: any) => item.name === this.sourceName)) {
      this.notifyService.error('Source name already used can please use differnt', 'Failed', { timeOut: 5000 });
      return;
    }
    this.addNewSource = false;
    this.rawData = this.sourceName;
    this.sourceData.push({ name: this.sourceName, data: data, sourceType: this.sourceType, sourceFile: this.sourceType == 1 ? this.apiUrl : this.uploadedFileName });
    // this.apiUrl = ;
    this.uploadedExcelData = null;
    this.uploadedFileName = '';
    this.sourceName = '';
    this.allFields = Object.keys(data[0]);
    console.log(this.rawData);
    console.log(this.modalData);
  }

  backToConfigChart() {
    this.addNewSource = false;
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
    this.addNewSource = true;
    this.rawData = '';
    this.apiUrl = '';
  }

  changeSourceType() {
    if (this.sourceType == 1) {
      this.uploadedExcelData = null;
      this.uploadedFileName = '';
    } else {
      this.apiUrl = '';
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }


  onApply() {
    const data = {
      chartData: {
        sourceType: this.sourceType,
        sourceFile: this.sourceType == 1 ? this.apiUrl : this.uploadedFileName,
        selectedChartCate: this.selectedChartCate,
        selectedChartType: this.selectedChartType,
        selectedMatchValue: this.selectedMatchValue,
        selectedMapOption: this.selectedMapOption,
        rawData: this.rawData,
        title: this.title,
        subTitle: this.subTitle,
        titleAlign: this.titleAlign,
        subTitleAlign: this.subTitleAlign,
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
      },
      sourceData: this.sourceData
    }
    this.dialogRef.close(data);
  }

}
