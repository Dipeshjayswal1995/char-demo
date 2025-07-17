import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var Highcharts: any;

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
  } | null = null;
  currentChart: any;
  chartOption = [
    { name: 'line-time', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: true },
    { name: 'column', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: true },
    { name: 'bar', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: true },
    { name: 'line', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: true },
    { name: 'pie', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: false },
    { name: 'donut', isVisableMapOption: false, isVisableMatchFeild: false, isVisialbeValueFeild: true, isVisiableArgumentField: true, isVisiableSeriesField: false },
    { name: 'map', isVisableMapOption: true, isVisableMatchFeild: true, isVisialbeValueFeild: true, isVisiableArgumentField: false, isVisiableSeriesField: false },

  ]
  mapOption = [
    { name: 'USA-ALL', json_file: 'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json', uniqueValueMatch: 'postal-code' },
    { name: 'ASIA', json_file: 'https://code.highcharts.com/mapdata/custom/asia.geo.json', uniqueValueMatch: 'iso-a2' },
    { name: 'EUROPE', json_file: 'https://code.highcharts.com/mapdata/custom/europe.topo.json', uniqueValueMatch: 'iso-a2' },
  ]

  topBottomOptions = [3, 5, 10];
  selectedTopN: number | '' = '';
  selectedBottomN: number | '' = '';
  dataLabel: boolean = false;
  enableMouseTracking: boolean = false;
  selectedSeriesFields: string[] = [];    // Multiple dynamic series fields




  constructor(private readonly http: HttpClient) { }

  ngOnInit() { }

  changeChart() {
    console.log(this.selectedChartType);
  }

  fetchData() {
    this.isLoading = true;
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      this.isLoading = false;
      this.rawData = data;

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

    }, error => {
      this.isLoading = false;
      console.error('API error:', error);
    });
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
      case 'pie':
      case 'donut':
        this.renderPieOrDonutChart(chartType);
        break;
      case 'line-time':
        this.renderTimeSeriesLineChart(); // new method
        break;
      default:
        this.renderStandardChart(chartType);
    }
  }

  onSeriesFieldToggle(field: string, e: any): void {
    if (e.target?.checked) {
      this.selectedSeriesFields.push(field);
    } else {
      this.selectedSeriesFields = this.selectedSeriesFields.filter(f => f !== field);
    }
    this.renderChart();
  }

  renderTimeSeriesLineChart(): void {
    if (!this.selectedArgumentField || this.selectedSeriesFields.length === 0) {
      console.warn('Select at least one series field and argument field');
      return;
    }

    const categories = this.rawData.map(r => r[this.selectedArgumentField]);

    // Build dynamic series from selectedSeriesFields
    const series = this.selectedSeriesFields.map(field => ({
      name: field,
      marker: {
        symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
      },
      data: this.rawData.map(r => r[field] ?? null)
    }));

    const chartOptions = {
      chart: {
        type: 'line',
        backgroundColor: 'transparent'
      },
      title: {
        text: `Trend of ${this.selectedValueField}`,
        align: 'left'
      },
      subtitle: {
        text: `By ${this.selectedArgumentField}`,
        align: 'left'
      },
      yAxis: {
        title: {
          text: this.selectedValueField
        }
      },
      xAxis: {
        categories,
        accessibility: {
          rangeDescription: `Range: ${categories[0]} to ${categories[categories.length - 1]}`
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: this.dataLabel
          },
          enableMouseTracking: this.enableMouseTracking
        },
        series: {
          label: {
            connectorAllowed: true
          }
        }
      },
      series,
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    };

    this.currentChart = Highcharts.chart('chart-container', chartOptions);
  }


  // For pie or donut
  renderPieOrDonutChart(type: string): void {
    const filteredData = this.applyTopBottomFilter(this.rawData);
    const grouped = this.groupData(filteredData);
    const categories = Object.keys(grouped);

    const pieData = categories.map(cat => {
      const value = Object.values(grouped[cat]).reduce((a: any, b: any) => a + b, 0);
      return { name: cat, y: value };
    });

    const chartOptions = this.getBaseChartOptions(
      `Chart of ${this.selectedValueField} by ${this.selectedArgumentField}`,
      'pie'
    );

    chartOptions.plotOptions.pie = {
      innerSize: type === 'donut' ? '60%' : '0%',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
      }
    };

    chartOptions.series = [{
      name: this.selectedValueField,
      data: pieData,
      type: 'pie'
    }];

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




  // renderChart(): void {
  //   if (!this.selectedValueField || !this.selectedArgumentField) return;

  //   if (this.currentChart) {
  //     this.currentChart.destroy();
  //   }

  //   if (this.selectedChartType?.name === 'map') {
  //     this.renderMapChart();
  //     return;
  //   }

  //   const filteredData = this.applyTopBottomFilter(this.rawData);

  //   const grouped = this.groupData(filteredData);
  //   const categories = Object.keys(grouped);
  //   const seriesNames = new Set<string>();

  //   Object.values(grouped).forEach((entry: any) => {
  //     Object.keys(entry).forEach(key => seriesNames.add(key));
  //   });

  //   const seriesData = Array.from(seriesNames).map(seriesName => ({
  //     name: seriesName,
  //     data: categories.map(cat => grouped[cat][seriesName] || 0)
  //   }));

  //   const isPieOrDonut = this.selectedChartType?.name === 'pie' || this.selectedChartType?.name === 'donut';
  //   const chartOptions: any = {
  //     chart: {
  //       type: isPieOrDonut ? 'pie' : this.selectedChartType?.name,
  //       backgroundColor: 'transparent'
  //     },
  //     title: {
  //       text: `Chart of ${this.selectedValueField} by ${this.selectedArgumentField}`
  //     },
  //     series: [],
  //     plotOptions: {},
  //   };

  //   if (isPieOrDonut) {
  //     const pieData = categories.map(cat => {
  //       const value = Object.values(grouped[cat]).reduce((a: any, b: any) => a + b, 0);
  //       return { name: cat, y: value };
  //     });

  //     chartOptions.plotOptions.pie = {
  //       innerSize: this.selectedChartType?.name === 'donut' ? '60%' : '0%',
  //       dataLabels: {
  //         enabled: true,
  //         format: '<b>{point.name}</b>: {point.percentage:.1f} %'
  //       }
  //     };

  //     chartOptions.series = [{
  //       name: this.selectedValueField,
  //       data: pieData,
  //       type: 'pie'
  //     }];
  //   } else {
  //     chartOptions.xAxis = { categories };
  //     chartOptions.yAxis = {
  //       title: { text: this.selectedValueField }
  //     };
  //     chartOptions.series = seriesData;
  //   }

  //   this.currentChart = Highcharts.chart('chart-container', chartOptions);
  // }

  // renderMapChart(): void {
  //   console.log(this.selectedValueField);
  //   // const mapUrl = 'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json';
  //   // const mapUrl = 'https://code.highcharts.com/mapdata/custom/asia.geo.json';
  //   const mapUrl: any = this.selectedMapOption?.json_file;


  //   fetch(mapUrl)
  //     .then(res => res.json())
  //     .then(topology => {
  //       const filtered = this.applyTopBottomFilter(this.rawData); // ✅ Apply top/bottom N

  //       const mapData = filtered.map(row => ({
  //         code: (row[this.selectedMatchValue] || '').toUpperCase(),
  //         value: row[this.selectedValueField],
  //       }));
  //       console.log("this.rawData===>", this.rawData);
  //       console.log("this.rawData===>", mapData);
  //       if (!mapData.length) {
  //         console.error('Map data is empty.');
  //         return;
  //       }
  //       console.log(mapData);
  //       this.currentChart = Highcharts.mapChart('chart-container', {
  //         chart: {
  //           map: topology,
  //           backgroundColor: 'transparent'
  //         },
  //         title: {
  //           text: `Map of ${this.selectedValueField} by ${this.selectedArgumentField}`
  //         },
  //         mapNavigation: {
  //           enabled: true
  //         },
  //         colorAxis: {
  //           min: 1,
  //           type: 'logarithmic',
  //           minColor: '#EEEEFF',
  //           maxColor: '#000022',
  //           stops: [
  //             [0, '#EFEFFF'],
  //             [0.67, '#4444FF'],
  //             [1, '#000022']
  //           ]
  //         },
  //         series: [{
  //           data: mapData,
  //           joinBy: [this.selectedMapOption?.uniqueValueMatch, 'code'],
  //           name: this.selectedValueField,

  //           dataLabels: {
  //             enabled: true,
  //             formatter: function (this: any) {
  //               return `${this.point.value ? this.point.value : ''}`; // Value only
  //             }
  //             // format: '{point.value}'
  //           },
  //           tooltip: {
  //             pointFormat: '{point.code}: {point.value}'
  //           }
  //         }]
  //       });
  //     })
  //     .catch(err => {
  //       console.error('Map load error:', err);
  //     });
  // }

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
