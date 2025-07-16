import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var Highcharts: any;

@Component({
  selector: 'app-mapchart6',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './mapchart6.html',
  styleUrl: './mapchart6.scss'
})
export class Mapchart6 {
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
  selectedMapOption : {
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
  // chartType: 'column' | 'bar' | 'line' | 'pie' | 'donut' | 'map' = 'column';
  currentChart: any;
  chartOption = [
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

  constructor(private readonly http: HttpClient) { }

  ngOnInit() { }

  changeChart(){
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

      // Detect numeric fields for value
      // this.valueFields = this.allFields.filter(f => typeof data[0][f] === 'number');
      this.valueFields = this.allFields;
      this.argumentFields = this.allFields;
      // Detect likely state code fields (e.g. shortName, state_code, etc.)
      // this.argumentFields = this.allFields.filter(f => {
      //   const val = data[0][f];
      //   return typeof val === 'string';
      // });

      this.seriesFields = this.allFields;

      this.selectedValueField = this.valueFields[0] || '';
      this.selectedArgumentField = this.argumentFields[0] || '';
      this.selectedSeriesField = '';

      // this.renderChart();
    }, error => {
      this.isLoading = false;
      console.error('API error:', error);
    });
  }

  renderChart(): void {
    if (!this.selectedValueField || !this.selectedArgumentField) return;

    if (this.currentChart) {
      this.currentChart.destroy();
    }

    if (this.selectedChartType?.name === 'map') {
      this.renderMapChart();
      return;
    }

    const grouped = this.groupData();
    const categories = Object.keys(grouped);
    const seriesNames = new Set<string>();

    Object.values(grouped).forEach((entry: any) => {
      Object.keys(entry).forEach(key => seriesNames.add(key));
    });

    const seriesData = Array.from(seriesNames).map(seriesName => ({
      name: seriesName,
      data: categories.map(cat => grouped[cat][seriesName] || 0)
    }));

    const isPieOrDonut = this.selectedChartType?.name === 'pie' || this.selectedChartType?.name === 'donut';
    const chartOptions: any = {
      chart: {
        type: isPieOrDonut ? 'pie' : this.selectedChartType?.name,
        backgroundColor: 'transparent'
      },
      title: {
        text: `Chart of ${this.selectedValueField} by ${this.selectedArgumentField}`
      },
      series: [],
      plotOptions: {},
    };

    if (isPieOrDonut) {
      const pieData = categories.map(cat => {
        const value = Object.values(grouped[cat]).reduce((a: any, b: any) => a + b, 0);
        return { name: cat, y: value };
      });

      chartOptions.plotOptions.pie = {
        innerSize: this.selectedChartType?.name === 'donut' ? '60%' : '0%',
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
    } else {
      chartOptions.xAxis = { categories };
      chartOptions.yAxis = {
        title: { text: this.selectedValueField }
      };
      chartOptions.series = seriesData;
    }

    this.currentChart = Highcharts.chart('chart-container', chartOptions);
  }

  renderMapChart(): void {
    console.log(this.selectedValueField);
    // const mapUrl = 'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json';
    // const mapUrl = 'https://code.highcharts.com/mapdata/custom/asia.geo.json';
    const mapUrl:any = this.selectedMapOption?.json_file;


    fetch(mapUrl)
      .then(res => res.json())
      .then(topology => {
        const mapData = this.rawData.map(row => ({
          code: (row[this.selectedMatchValue] || '').toUpperCase(),
          value: row[this.selectedValueField],
        }));
        console.log("this.rawData===>", this.rawData);
        console.log("this.rawData===>", mapData);
        if (!mapData.length) {
          console.error('Map data is empty.');
          return;
        }
        console.log(mapData);
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
                return `${this.point.value ? this.point.value : ''}`; // Value only
              }
              // format: '{point.value}'
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

  // renderMapChart123(): void {
  //   const mapUrl = 'https://code.highcharts.com/mapdata/custom/europe.topo.json';

  //   fetch(mapUrl)
  //     .then(res => res.json())
  //     .then(topology => {
  //       const mapData = this.rawData.map(row => ({
  //         code: row[this.selectedMatchValue].toLowerCase(),  // match against "id" from map JSON
  //         value: Number(row[this.selectedValueField])
  //       }));

  //       console.log('Map Data:', mapData);

  //       if (!mapData.length) {
  //         console.error('❌ Map data is empty.');
  //         return;
  //       }

  //       this.currentChart = Highcharts.mapChart('chart-container', {
  //         chart: {
  //           map: topology,
  //           backgroundColor: 'transparent'
  //         },
  //         title: {
  //           text: `Map of ${this.selectedValueField} by ${this.selectedMatchValue}`
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
  //           joinBy: ['iso-a2', 'code'],
  //           name: this.selectedValueField,
  //           dataLabels: {
  //             enabled: true,
  //             formatter: function (this: any) {
  //               return `${this.point.value ?? ''}`;
  //             }
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


  private groupData(): any {
    const grouped: any = {};
    this.rawData.forEach(item => {
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
