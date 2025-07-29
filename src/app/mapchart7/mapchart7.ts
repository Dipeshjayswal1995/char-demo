import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadChart } from '../services/load-chart';
import * as XLSX from 'xlsx';


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

  selectedChartType: {
    name: string;
    isVisableMapOption: boolean;
    isVisableMatchFeild: boolean;
    isVisialbeValueFeild: boolean;
    isVisiableArgumentField: boolean;
    isVisiableSeriesField: boolean;
    dataLabel: boolean;
    enableMouseTracking: boolean;
    markerSymbols: boolean;
    zooming: boolean;
    typeofareaChart: boolean;
    barColunmchartOption: boolean;

  } | null = null;
  currentChart: any;
  title: string = '';
  subTitle: string = '';
  showLengend: boolean = false;
  chartOption = [
    { name: 'line-time', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: true, dataLabel: true, enableMouseTracking: true, markerSymbols: false, zooming: true, typeofareaChart: false, barColunmchartOption: false },
    { name: 'spline-with-inverted-axes', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: false, dataLabel: true, enableMouseTracking: false, markerSymbols: true, zooming: true, barColunmchartOption: false },
    { name: 'area-chart', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: true, dataLabel: true, enableMouseTracking: true, markerSymbols: true, zooming: true, typeofareaChart: true, barColunmchartOption: false },
    { name: 'column', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: true, dataLabel: true, enableMouseTracking: true, markerSymbols: true, zooming: true, typeofareaChart: true, barColunmchartOption: true },
    { name: 'pie', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: false, dataLabel: false, enableMouseTracking: false, markerSymbols: false, zooming: false, typeofareaChart: false, barColunmchartOption: false },
    { name: 'bubble', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: false, dataLabel: true, enableMouseTracking: false, markerSymbols: false, zooming: true, typeofareaChart: false, barColunmchartOption: false },
    { name: 'scatter',isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: true, dataLabel: true, enableMouseTracking: true, markerSymbols: false, zooming: true, typeofareaChart: false, barColunmchartOption: false},
    { name: 'map', isVisableMapOption: true, isVisableMatchFeild: true, isVisialbeValueFeild: true, isVisiableArgumentField: false, isVisiableSeriesField: false, dataLabel: false, enableMouseTracking: false, markerSymbols: false, zooming: false, typeofareaChart: false, barColunmchartOption: false },

  ]
  mapOption = [
    { name: 'USA-ALL', json_file: 'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json', uniqueValueMatch: 'postal-code' },
    { name: 'ASIA', json_file: 'https://code.highcharts.com/mapdata/custom/asia.geo.json', uniqueValueMatch: 'iso-a2' },
    { name: 'EUROPE', json_file: 'https://code.highcharts.com/mapdata/custom/europe.topo.json', uniqueValueMatch: 'iso-a2' },
  ]
  markerSymbols = ['circle', 'square', 'diamond', 'triangle', 'triangle-down', 'url(https://www.highcharts.com/samples/graphics/sun.png)'];
  selectSymbol: string = '';


  xAxisData: string = '';

  topBottomOptions = [3, 5, 10];
  selectedTopN: number | '' = '';
  selectedBottomN: number | '' = '';
  dataLabel: boolean = false;
  enableMouseTracking: boolean = false;
  selectedSeriesFields: string[] = [];    // Multiple dynamic series fields

  enableCustomAnimation = true;
  zomming: string = '';

  typeofareaChart: string = '';
  barColunmchartOption: string = '';
  selectedThirdArgument: string = '';
  passedInSideDisplayName: string = '';

  pieInnerSize: string = '';
  pieStartAngal: number = 0;
  pieENDAngal: number = 0;
  uploadedExcelData: any[] | null = null;

  constructor(private readonly http: HttpClient, private readonly chartBuilderService: LoadChart) { }

  ngOnInit() {
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

  changeChart() {
    console.log(this.selectedChartType);
  }

  async fetchAndConvertCSVtoJSON123(csvUrl: string): Promise<any[]> {
    const response = await fetch(csvUrl);
    let csvText = await response.text();

    // Clean up the CSV
    csvText = csvText.replace(/\n\n/g, '\n');

    const [headerLine, ...lines] = csvText.trim().split('\n');
    const headers = headerLine.split(',');

    const json = lines.map(line => {
      const values = line.split(',');

      // Declare entry as an object with string keys and any values
      const entry: { [key: string]: any } = {};

      headers.forEach((header, i) => {
        const value = values[i];
        // Parse numeric values, keep strings as-is
        entry[header] = isNaN(Number(value)) ? value : Number(value);
      });

      return entry;
    });

    return json;
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
    this.rawData = data;
    console.log(this.rawData);
    if (!data || data.length === 0) {
      console.error('No data found');
      return;
    }
    this.allFields = Object.keys(data[0]);
    this.valueFields = this.allFields;
    this.argumentFields = this.allFields;
    this.seriesFields = this.allFields;
    this.selectedValueField = this.valueFields[0] || '';
    this.selectedArgumentField = this.argumentFields[0] || '';
    this.selectedSeriesField = '';
  }


  toggleCustomAnimation(ev: any) {
    this.enableCustomAnimation = ev.target.checked;
    (window as any).enableCustomAnimation = ev.target.checked;

    this.renderChart(); // re-render chart with/without animation
  }

  private applyTopBottomFilter(data: any[]): any[] {
    if (!this.selectedValueField) return data;

    const sortedData = [...data].sort((a, b) => {
      const aVal = Number(a[this.selectedValueField]) || 0;
      const bVal = Number(b[this.selectedValueField]) || 0;
      return bVal - aVal;
    });

    if (this.selectedTopN) {
      return sortedData.slice(0, Number(this.selectedTopN));
    }

    if (this.selectedBottomN) {
      return sortedData.reverse().slice(0, Number(this.selectedBottomN));
    }

    return data;
  }

  renderChart(): void {
    if (!this.selectedChartType || !this.selectedValueField || !this.selectedArgumentField) return;

    if (this.currentChart) {
      this.currentChart.destroy();
    }

    const chartType = this.selectedChartType.name;

    switch (chartType) {
      case 'map':
        this.renderMapChart();
        break;
      case 'area-chart':
        this.areayChartRender();
        break;
      case 'column':
        this.coloumChartrender();
        break;
      case 'pie':
        this.renderPieOrDonutChart(chartType);
        break;
      case 'bubble':
        this.renderBubleChart(chartType);
        break;
      case 'scatter':
        this.renderScatterChart(chartType);
        break;
      case 'line-time':
      case 'spline-with-inverted-axes':
        this.renderTimeSeriesLineChart(chartType); // new method
        break;
      default:
        this.renderStandardChart(chartType);
    }
  }

  renderBubleChart(chartType: string) {
    if (!this.selectedArgumentField) {
      console.warn('Select at least one series field and argument field');
      return;
    }
    let chartOptions: any;
    chartOptions = this.chartBuilderService.bubbleChartSetup(
      chartType,
      this.title,
      this.subTitle,
      this.rawData,
      this.selectedValueField,
      this.selectedArgumentField,
      this.selectedThirdArgument,
      this.passedInSideDisplayName
    );
    this.currentChart = Highcharts.chart('chart-container', chartOptions);
  }

  coloumChartrender() {
    if (!this.selectedArgumentField) {
      console.warn('Select at least one series field and argument field');
      return;
    }
    let chartOptions: any;
    if (this.barColunmchartOption === 'columnrange') {
      chartOptions = this.chartBuilderService.getColumnRangeChartOptions(
        this.rawData,
        this.selectedValueField,
        this.selectedArgumentField,
        this.selectedValueField,
        this.dataLabel,
        '',
        '',
        '',
        true,
        this.zomming,
        this.barColunmchartOption
      );
      console.log(chartOptions)
    } else if (this.barColunmchartOption === 'variwide') {
      chartOptions = this.chartBuilderService.getVariwideChartOptions(
        this.rawData,
        this.selectedArgumentField,
        this.selectedValueField,
        this.selectedThirdArgument,
        '',
        '',
        ''
      );
    } else {
      chartOptions = this.chartBuilderService.getBarChartOptions(
        this.barColunmchartOption,
        this.rawData,
        this.selectedValueField,
        this.selectedArgumentField,
        this.selectedSeriesFields,
        this.dataLabel,
        '',
        'Column chart',
        'Column chart',
        true,
        this.selectSymbol,
        this.zomming,
        this.typeofareaChart
      );
    }
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

  renderTimeSeriesLineChart(chartType: string): void {
    if (!this.selectedArgumentField) {
      console.warn('Select at least one series field and argument field');
      return;
    }
    let chartOptions: any = null;
    if (chartType === 'line-time') {
      console.log('Load the line-time charts');
      chartOptions = this.chartBuilderService.getLineChartOptions(
        this.rawData,
        this.title,
        this.subTitle,
        this.selectedValueField,
        this.selectedSeriesFields,
        this.dataLabel,
        this.enableMouseTracking,
        this.selectSymbol,
        this.zomming
      );
      console.log(chartOptions);
    } else {
      chartOptions = this.chartBuilderService.getInvertedSplineChartOptionsFromJson(
        this.rawData,
        this.selectedArgumentField,   // xField
        this.selectedValueField,      // yField
        this.selectedValueField,      // seriesName
        this.selectedArgumentField,   // xTitle
        this.selectedValueField,      // yTitle
        `Trend of ${this.selectedValueField}`,          // chartTitle
        `By ${this.selectedArgumentField}`,             // chartSubtitle
        '',
        '',
        this.dataLabel,
        this.selectSymbol,
        this.zomming
      );
      console.log('this.chat', this.currentChart);
    }
    this.currentChart = Highcharts.chart('chart-container', chartOptions);
  }

  renderScatterChart(chartType: string): void {
    if (!this.selectedArgumentField) {
      console.warn('Select at least one series field and argument field');
      return;
    }
    let chartOptions: any = null;
    console.log('Load the line-time charts');
    chartOptions = this.chartBuilderService.getScatterChartOptions(
      this.rawData,
      this.title,
      this.subTitle,
      this.selectedValueField,
      this.selectedSeriesFields,
    );
    console.log(chartOptions);
    this.currentChart = Highcharts.chart('chart-container', chartOptions);
  }


  areayChartRender() {
    let chartOptions: any;

    if (this.typeofareaChart === 'arearange') {
      chartOptions = this.chartBuilderService.getAreaRangeChartOptions(
        this.rawData,
        this.selectedValueField,   // xField
        this.selectedArgumentField,
        this.selectedThirdArgument,     // yField
        '',
        '',    // yTitle
        '',  // chartTitle
        true,
        this.xAxisData
      );
    } else {
      chartOptions = this.chartBuilderService.getAreaChartOptions(
        this.rawData,
        this.title,
        this.subTitle,
        this.selectedValueField,
        this.selectedSeriesFields,
        this.dataLabel,
        this.enableMouseTracking,
        this.selectSymbol,
        this.zomming,
        this.typeofareaChart
      );
    }
    this.currentChart = Highcharts.chart('chart-container', chartOptions);

  }


  // For pie or donut
  renderPieOrDonutChart(type: string): void {
    const chartOptions = this.chartBuilderService.getPieChartOption(
      type,
      this.title,
      this.subTitle,
      this.rawData,
      this.selectedValueField,
      this.selectedArgumentField,
      this.pieInnerSize,
      this.showLengend,
      this.pieStartAngal,
      this.pieENDAngal
    );
    // const filteredData = this.applyTopBottomFilter(this.rawData);
    // const grouped = this.groupData(filteredData);
    // const categories = Object.keys(grouped);
    // console.log("grouped data ===> ", grouped);
    // const pieData = categories.map(cat => {
    //   const value = Object.values(grouped[cat]).reduce((a: any, b: any) => a + b, 0);
    //   return { name: cat, y: value };
    // });
    // console.log(pieData);
    // const chartOptions = this.getBaseChartOptions(
    //   `Chart of ${this.selectedValueField} by ${this.selectedArgumentField}`,
    //   'pie'
    // );

    // chartOptions.plotOptions.pie = {
    //   innerSize: type === 'donut' ? '60%' : '0%',
    //   dataLabels: {
    //     enabled: true,
    //     format: '<b>{point.name}</b>: {point.percentage:.1f} %'
    //   }
    // };

    // chartOptions.series = [{
    //   name: this.selectedValueField,
    //   data: pieData,
    //   type: 'pie'
    // }];
    console.log(chartOptions);
    this.currentChart = Highcharts.chart('chart-container', chartOptions);
  }

  // For bar/column/line
  renderStandardChart(type: string): void {
    const filteredData = this.applyTopBottomFilter(this.rawData);
    const grouped = this.groupData(filteredData);
    const categories = Object.keys(grouped);
    const seriesNames = new Set<string>();

    Object.values(grouped).forEach((entry: any) => {
      Object.keys(entry).forEach(key => seriesNames.add(key));
    });

    const seriesData = Array.from(seriesNames).map(seriesName => ({
      name: seriesName,
      data: categories.map(cat => grouped[cat][seriesName] || 0)
    }));

    const chartOptions = this.getBaseChartOptions(
      `Chart of ${this.selectedValueField} by ${this.selectedArgumentField}`, type
    );

    chartOptions.xAxis = { categories };
    chartOptions.yAxis = {
      title: { text: this.selectedValueField }
    };
    chartOptions.series = seriesData;

    this.currentChart = Highcharts.chart('chart-container', chartOptions);
  }

  // For map charts
  renderMapChart(): void {
    const mapUrl: any = this.selectedMapOption?.json_file;
    if (!mapUrl) return;

    fetch(mapUrl)
      .then(res => res.json())
      .then(topology => {
        const filtered = this.applyTopBottomFilter(this.rawData);

        const mapData = filtered.map(row => ({
          code: (row[this.selectedMatchValue] || '').toUpperCase(),
          value: row[this.selectedValueField]
        }));

        if (!mapData.length) {
          console.error('Map data is empty.');
          return;
        }

        this.currentChart = Highcharts.mapChart('chart-container', {
          chart: {
            map: topology,
            backgroundColor: 'transparent'
          },
          title: {
            text: `Map of ${this.selectedValueField} by ${this.selectedArgumentField}`
          },
          mapNavigation: {
            enabled: true
          },
          colorAxis: {
            min: 1,
            type: 'logarithmic',
            minColor: '#EEEEFF',
            maxColor: '#000022',
            stops: [
              [0, '#EFEFFF'],
              [0.67, '#4444FF'],
              [1, '#000022']
            ]
          },
          series: [{
            data: mapData,
            joinBy: [this.selectedMapOption?.uniqueValueMatch, 'code'],
            name: this.selectedValueField,
            dataLabels: {
              enabled: true,
              formatter: function (this: any) {
                return `${this.point.value ? this.point.value : ''}`;
              }
            },
            tooltip: {
              pointFormat: '{point.code}: {point.value}'
            }
          }]
        });
      })
      .catch(err => {
        console.error('Map load error:', err);
      });
  }

  // Shared config base
  getBaseChartOptions(title: string, type: string): any {
    return {
      chart: {
        type,
        backgroundColor: 'transparent'
      },
      title: {
        text: title
      },
      plotOptions: {},
      series: []
    };
  }

  addCustomAnimationPlugin() {
    (function (H) {
      const animateSVGPath = (
        svgElem: any,
        animation: any,
        callback?: () => void // ✅ Make the callback explicitly optional
      ) => {
        const length = svgElem.element.getTotalLength();
        svgElem.attr({
          'stroke-dasharray': length,
          'stroke-dashoffset': length,
          opacity: 1
        });
        svgElem.animate(
          {
            'stroke-dashoffset': 0
          },
          animation,
          callback // ✅ Now valid
        );
      };

      // Animate lines (like series.graph) using stroke-dash
      H.seriesTypes.line.prototype.animate = function (init: any) {
        const series = this,
          animation = H.animObject(series.options.animation);

        if (!init && (window as any).enableCustomAnimation !== false) {
          animateSVGPath(series.graph, animation);
        }
      };

      // Axis and plot line animation
      H.addEvent(H.Axis, 'afterRender', function (this: any) {
        const axis = this,
          chart = axis.chart,
          animation = H.animObject(chart.renderer.globalAnimation);

        if ((window as any).enableCustomAnimation === false) return;

        // Animate axis group
        axis.axisGroup
          .attr({ opacity: 0, rotation: -3, scaleY: 0.9 })
          .animate({ opacity: 1, rotation: 0, scaleY: 1 }, animation);

        // Animate label group
        if (axis.horiz) {
          axis.labelGroup
            .attr({ opacity: 0, rotation: 3, scaleY: 0.5 })
            .animate({ opacity: 1, rotation: 0, scaleY: 1 }, animation);
        } else {
          axis.labelGroup
            .attr({ opacity: 0, rotation: 3, scaleX: -0.5 })
            .animate({ opacity: 1, rotation: 0, scaleX: 1 }, animation);
        }

        // Animate plot lines/bands with SVG path effect
        if (axis.plotLinesAndBands) {
          axis.plotLinesAndBands.forEach((plotLine: any) => {
            const anim = H.animObject(plotLine.options.animation);

            plotLine.label?.attr({ opacity: 0 });

            animateSVGPath(plotLine.svgElem, anim, () => {
              plotLine.label?.animate({ opacity: 1 });
            });
          });
        }
      });
    })(Highcharts);
  }


  loadChart() {
    (window as any).enableCustomAnimation = this.enableCustomAnimation;
    this.addCustomAnimationPlugin();
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
}
