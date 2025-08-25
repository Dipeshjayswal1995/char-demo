import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare var Highcharts: any;

@Component({
  selector: 'app-mapchart2',
  imports: [CommonModule, FormsModule],
  templateUrl: './mapchart2.html',
  styleUrl: './mapchart2.scss'
})
export class Mapchart2 {
  chart8: any;
  selectedFilter: 'income' | 'gdp' | 'qtd' | 'qtdTarget' = 'income';
  stateData: any = {};
  columns: any[] = [];
  mapData: any;
  selectedView: 'map' | 'pie' = 'map';


  async ngAfterViewInit() {
    await this.loadMapData();
    this.updateMapData();
  }

  async loadMapData() {
    this.mapData = await fetch('https://code.highcharts.com/mapdata/countries/us/us-all.topo.json')
      .then(res => res.json());

    this.stateData = {
      "AL": { name: "Alabama", income: 60660, gdp: 67786 },
      "AK": { name: "Alaska", income: 113934, gdp: 95147 },
      "AZ": { name: "Arizona", income: 77315, gdp: 78201 },
      "AR": { name: "Arkansas", income: 63250, gdp: 60276 },
      "CA": { name: "California", income: 123988, gdp: 104916 },
      "CO": { name: "Colorado", income: 97301, gdp: 93026 },
      "CT": { name: "Connecticut", income: 114156, gdp: 100235 },
      "DE": { name: "Delaware", income: 87173, gdp: 98055 },
      "FL": { name: "Florida", income: 73311, gdp: 78918 },
      "GA": { name: "Georgia", income: 74632, gdp: 79435 },
      "HI": { name: "Hawaii", income: 141832, gdp: 80979 },
      "ID": { name: "Idaho", income: 74942, gdp: 68000 },
      "IL": { name: "Illinois", income: 80306, gdp: 88000 },
      "IN": { name: "Indiana", income: 76910, gdp: 70000 },
      "IA": { name: "Iowa", income: 71433, gdp: 68000 },
      "KS": { name: "Kansas", income: 70333, gdp: 70000 },
      "KY": { name: "Kentucky", income: 61980, gdp: 62000 },
      "LA": { name: "Louisiana", income: 57650, gdp: 60000 },
      "ME": { name: "Maine", income: 73733, gdp: 70000 },
      "MD": { name: "Maryland", income: 124693, gdp: 88000 },
      "MA": { name: "Massachusetts", income: 127760, gdp: 110561 },
      "MI": { name: "Michigan", income: 76960, gdp: 75000 },
      "MN": { name: "Minnesota", income: 86364, gdp: 85000 },
      "MS": { name: "Mississippi", income: 55060, gdp: 53061 },
      "MO": { name: "Missouri", income: 78290, gdp: 72000 },
      "MT": { name: "Montana", income: 70804, gdp: 68000 },
      "NC": { name: "North Carolina", income: 70804, gdp: 75000 },
      "ND": { name: "North Dakota", income: 76525, gdp: 95982 },
      "NE": { name: "Nebraska", income: 74590, gdp: 93145 },
      "NH": { name: "New Hampshire", income: 110205, gdp: 87000 },
      "NJ": { name: "New Jersey", income: 117847, gdp: 89000 },
      "NM": { name: "New Mexico", income: 60980, gdp: 61000 },
      "NV": { name: "Nevada", income: 80366, gdp: 75000 },
      "NY": { name: "New York", income: 91366, gdp: 117332 },
      "OH": { name: "Ohio", income: 73770, gdp: 70000 },
      "OK": { name: "Oklahoma", income: 67330, gdp: 65000 },
      "OR": { name: "Oregon", income: 91100, gdp: 80000 },
      "PA": { name: "Pennsylvania", income: 73824, gdp: 75000 },
      "RI": { name: "Rhode Island", income: 104252, gdp: 78000 },
      "SC": { name: "South Carolina", income: 69100, gdp: 65000 },
      "SD": { name: "South Dakota", income: 71810, gdp: 70000 },
      "TN": { name: "Tennessee", income: 72700, gdp: 68000 },
      "TX": { name: "Texas", income: 75780, gdp: 76000 },
      "UT": { name: "Utah", income: 89786, gdp: 85000 },
      "VT": { name: "Vermont", income: 89695, gdp: 45707 },
      "VA": { name: "Virginia", income: 89393, gdp: 82000 },
      "WA": { name: "Washington", income: 103748, gdp: 108468 },
      "WI": { name: "Wisconsin", income: 74631, gdp: 72000 },
      "WV": { name: "West Virginia", income: 60410, gdp: 60783 },
      "WY": { name: "Wyoming", income: 72415, gdp: 90335 }
    };


    const postalCodes = Object.keys(this.stateData);
    console.log("postalCodes===> ", postalCodes);
    const names = postalCodes.map(code => this.stateData[code].name);
    console.log("postalCodes===> ", names);
    const incomes = postalCodes.map(code => this.stateData[code].income);
    console.log("postalCodes===> ", incomes);
    const gdps = postalCodes.map(code => this.stateData[code].gdp);
    const qtd = incomes.map(val => Math.round(val * 0.7));
    console.log("qtd===> ", qtd);
    const qtdTarget = gdps.map(val => Math.round(val * 0.65));
    console.log("qtd===> ", qtdTarget);
    this.columns = [postalCodes, names, incomes, gdps, qtd, qtdTarget];
    console.log("this.columns===> ",this.columns);
  }

  updateMapData() {
    const filterMap = { income: 2, gdp: 3, qtd: 4, qtdTarget: 5 };
    const index = filterMap[this.selectedFilter];
    const data = this.columns[0].map((code: string, i: number) => {
      const dataPoint = {
        'postal-code': code,
        name: this.columns[1][i],
        value: this.columns[index][i],
        labelText: `$${(this.columns[index][i] / 1000).toFixed(1)}K`,
        row: i
      };

      console.log('Mapped Data Point:', this.columns[index][i]); // <-- Console log here

      return dataPoint;
    });
    console.log(data);
    //   this.columns[0].map((code: string, i: number) => ({
    //     'postal-code': code,
    //     name: this.columns[1][i],
    //     value: this.columns[index][i],
    //     labelText: `$${(this.columns[index][i] / 1000).toFixed(1)}K`,
    //     row: i
    //   }
    // ));

    const mapOptions = {
      chart: {
        map: this.mapData
      },
      title: {
        text: 'US State Financial Overview'
      },
      subtitle: {
        text: 'Select filter from dropdown to update view'
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom'
        }
      },
      colorAxis: {
        min: 50000,
        max: 130000,
        stops: [
          [0, '#E0F7FA'],
          [0.5, '#4FC3F7'],
          [1, '#01579B']
        ]
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top'
      },
      series: [{
        data: data,
        name: 'Financial Metric',
        joinBy: 'postal-code',
        dataLabels: {
          enabled: true,
          format: '{point.labelText}'
        },
        tooltip: {
          pointFormatter: function (this: any) {
            return `<b>${this.name}</b><br>Value: $${this.value}`;
          }
        }
      }]
    };

    if (!this.chart8) {
      this.chart8 = Highcharts.mapChart('container8', mapOptions);
    } else {
      this.chart8.update(mapOptions);
    }
  }

  updateData() {
    this.chart8 = null;
    console.log(this.selectedView)
    if (this.selectedView == 'map') {
      this.updateMapData();
    } else {
      this.updateChartDat();
    }
  }

  updateChartDat() {
    this.chart8 = null;;
    const filterMap = { income: 2, gdp: 3, qtd: 4, qtdTarget: 5 };
    const index = filterMap[this.selectedFilter];

    if (index === undefined || !this.columns || !this.columns[index]) {
      console.warn('Invalid selectedFilter or columns not initialized');
      return;
    }

    const labels = this.columns[1]; // State names
    const values = this.columns[index];

    const pieData = labels.map((label: any, i: any) => ({
      name: label,
      y: values[i]
    }));

    const pieOptions = {
      chart: {
        type: 'pie',
        renderTo: 'container8'
      },
      title: {
        text: `US State Financial Overview (${this.selectedFilter.toUpperCase()})`
      },
      tooltip: {
        pointFormat: 'Value: <b>${point.y}</b>'
      },
      plotOptions: {
        pie: {
          innerSize: '50%',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.percentage:.1f}%'
          }
        }
      },
      series: [{
        name: 'States',
        colorByPoint: true,
        data: pieData
      }]
    };

    if (!this.chart8) {
      this.chart8 = Highcharts.chart(pieOptions);
    } else {
      this.chart8.update(pieOptions);
    }
  }
}


