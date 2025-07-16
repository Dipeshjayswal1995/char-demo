import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { error } from 'highcharts';
import { CommonModule } from '@angular/common';

declare var Highcharts: any;



@Component({
  selector: 'app-mapchart5',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './mapchart5.html',
  styleUrl: './mapchart5.scss'
})
export class Mapchart5 {

  apiUrl: string = 'assets/test1.json'; //assets/test1.json'
  isLoading = false;
  data: any = [];

  rawData: any[] = [];

  valueFields: string[] = [];
  argumentFields: string[] = [];
  seriesFields: string[] = [];
  allFields: string[] = [];

  selectedValueField = '';
  selectedArgumentField = '';
  selectedSeriesField = '';

  hiddenDimension = '';
  hiddenMeasure = '';

  currentChart: any;


  chartType: 'column' | 'bar' | 'line' | 'pie' | 'donut' | 'map' = 'column'; // default


  constructor(private readonly http: HttpClient) { }

  ngOnInit() {

  }


  renderChart(): void {
    if (!this.selectedValueField || !this.selectedArgumentField) return;
    if (this.currentChart) {
      this.currentChart.destroy();
    }

    if (this.chartType === 'map') {
      this.renderMapChart();  // Add this below
      return;
    }

    const grouped = this.groupData();

    const categories = Object.keys(grouped);
    const seriesNames = new Set<string>();
    Object.values(grouped).forEach((entry: any) => {
      Object.keys(entry).forEach(key => seriesNames.add(key));
    });
    console.log('grouped', grouped);
    console.log('seriesNames', seriesNames);


    const seriesData = Array.from(seriesNames).map(seriesName => ({
      name: seriesName,
      data: categories.map(cat => grouped[cat][seriesName] || 0)
    }));
    console.log('seriesNames', seriesData);
    const isPieOrDonut = this.chartType === 'pie' || this.chartType === 'donut';

    const chartOptions: any = {
      chart: {
        type: isPieOrDonut ? 'pie' : this.chartType,
        backgroundColor: 'transparent'
      },
      title: {
        text: `Chart by ${this.selectedArgumentField}`
      },
      plotOptions: {},
      series: [],
      xAxis: undefined,
      yAxis: undefined
    };

    if (isPieOrDonut) {
      // Pie or Donut chart
      const pieData = categories.map(cat => {
        const value = Object.values(grouped[cat]).reduce((a: any, b: any) => a + b, 0);
        return { name: cat, y: value };
      });
      console.log('pieData ===>', pieData);
      chartOptions.plotOptions.pie = {
        innerSize: this.chartType === 'donut' ? '60%' : '0%',
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
      // Column, Bar, Line chart
      console.log(categories);
      console.log(this.selectedValueField);
      chartOptions.xAxis = { categories };
      chartOptions.yAxis = {
        title: { text: this.selectedValueField }
      };
      chartOptions.series = seriesData;
    }


    this.currentChart = Highcharts.chart('chart-container', chartOptions);
  }

  renderMapChart(): void {
    const mapUrl = 'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json';

    fetch(mapUrl)
      .then(res => res.json())
      .then(topology => {
        const mapData = this.rawData.map(row => ({
          code: (row['shortName'] || '').toUpperCase(), // Always from 'shortName'
          value: Number(row[this.selectedValueField]) || 0
        }));

        console.log('🗺️ Map Data:', mapData);

        if (!mapData.length) {
          console.error('❌ Map data is empty. Cannot render chart.');
          return;
        }

        Highcharts.mapChart('chart-container', {
          chart: {
            map: topology,
            backgroundColor: 'transparent'
          },
          title: {
            text: `Map of ${this.selectedValueField} by State`
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
            joinBy: ['postal-code', 'code'],
            name: this.selectedValueField,
            dataLabels: {
              enabled: true,
              format: '{point.code}'
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

  fetchData() {
    this.isLoading = true;
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      console.log('data', data)
      this.isLoading = false;
      this.data = data;
      // console.log('this.', this.data);
      // const { keys, columns } = this.extractDynamicColumns(this.data);

      // console.log("Column Headers (Keys):", keys);
      // console.log("Column Values (Columns):", columns);
      // console.log('Loaded states:', this.data);

      this.rawData = data;
      this.allFields = Object.keys(data[0]);
      console.log(this.allFields);

      // Default categorization
      this.valueFields = this.allFields.filter(f => typeof data[0][f] === 'number');
      // this.valueFields = this.allFields
      this.argumentFields = this.allFields;
      this.seriesFields = this.allFields;

      this.selectedValueField = this.valueFields[0] || '';
      this.selectedArgumentField = this.argumentFields[0] || '';
      this.selectedSeriesField = '';

      this.renderChart();
    }, error => {
      console.log('data', error)
      console.log('data not get from api');
    });
  }

  extractDynamicColumns(stateArray: any[]): { keys: string[], columns: any[][] } {
    if (!Array.isArray(stateArray) || stateArray.length === 0) {
      return { keys: [], columns: [] };
    }
    const sample = stateArray[0];
    const keys = Object.keys(sample).filter(key => typeof sample[key] !== 'object' || Array.isArray(sample[key]));
    const columns = keys.map(key => stateArray.map(state => state[key]));

    return { keys, columns };
  }





}
