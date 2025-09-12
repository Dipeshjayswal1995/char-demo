import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import {
  CompactType,
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridType,
  GridsterModule
} from 'angular-gridster2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface DashboardItem extends GridsterItem {
  label?: string;
}

declare const Highcharts: any;

@Component({
  selector: 'app-dashboard',
  imports: [AngularSplitModule, CommonModule, GridsterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  options: GridsterConfig;
  dashboard: Array<DashboardItem>;
  currentChart: any;

  constructor() {
    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      margin: 10,
      outerMargin: true,
      draggable: { enabled: true },
      resizable: { enabled: true },
      pushItems: true,
      displayGrid: DisplayGrid.OnDragAndResize,
      minCols: 6,
      maxCols: 12,
      minRows: 4,
      maxRows: 12
    };

    this.dashboard = [
      { cols: 6, rows: 2, y: 0, x: 0, label: 'Sales Chart' },
      // { cols: 3, rows: 4, y: 0, x: 3, label: 'Revenue' },
      // { cols: 6, rows: 2, y: 2, x: 0, label: 'Customer Map' }
    ];

  }


  ngAfterViewInit(): void {
    this.loadChart();
  }

  loadChart() {
    const chartOptions = {
      "chart": {
        "zooming": {
          "type": "xy"
        }
      },
      "title": {
        "text": ""
      },
      "subtitle": {
        "text": ""
      },
      "xAxis": [
        {
          "categories": [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          "crosshair": true
        }
      ],
      "yAxis": [
        {
          "title": {
            "text": "Rainfall",
            "style": {
              "color": "#5856d2"
            }
          },
          "labels": {
            "format": "{value}mm",
            "style": {
              "color": "#5856d2"
            }
          },
          "opposite": true
        },
        {
          "title": {
            "text": "Tempture",
            "style": {
              "color": "#29d13d"
            }
          },
          "labels": {
            "format": "{value}C",
            "style": {
              "color": "#29d13d"
            }
          },
          "opposite": true
        },
        {
          "title": {
            "text": "Sea Level Pressure",
            "style": {
              "color": "#49b4b6"
            }
          },
          "labels": {
            "format": "{value}mn",
            "style": {
              "color": "#49b4b6"
            }
          },
          "opposite": false
        }
      ],
      "tooltip": {
        "shared": true
      },
      "legend": {
        "enabled": true
      },
      "series": [
        {
          "name": "Rainfall",
          "type": "column",
          "dataLabels": {
            "enabled": false
          },
          "enableMouseTracking": true,
          "yAxis": 0,
          "tooltip": {
            "valueSuffix": " mm"
          },
          "color": "#5856d2",
          "data": [
            49.9,
            71.5,
            106.4,
            129.2,
            144,
            176,
            135.6,
            148.5,
            216.4,
            194.1,
            95.6,
            54.4
          ]
        },
        {
          "name": "Tempture",
          "type": "spline",
          "dataLabels": {
            "enabled": false
          },
          "enableMouseTracking": true,
          "yAxis": 1,
          "tooltip": {
            "valueSuffix": " C"
          },
          "color": "#29d13d",
          "data": [
            7,
            6.9,
            9.5,
            14.5,
            18.2,
            21.5,
            25.2,
            26.5,
            23.3,
            18.3,
            13.9,
            9.6
          ]
        },
        {
          "name": "Sea Level Pressure",
          "type": "spline",
          "dataLabels": {
            "enabled": false
          },
          "enableMouseTracking": true,
          "yAxis": 2,
          "tooltip": {
            "valueSuffix": " mn"
          },
          "color": "#49b4b6",
          "data": [
            1016,
            1016,
            1015.9,
            1015.5,
            1012.3,
            1009.5,
            1009.6,
            1010.2,
            1013.1,
            1016.9,
            1018.2,
            1016.7
          ]
        }
      ]
    }
    this.currentChart = Highcharts.chart('chart-container', chartOptions);
  }

  addWidget() {
    this.dashboard.push({ cols: 2, rows: 2, y: 0, x: 0, label: 'New Widget' });
  }

  removeWidget(item: DashboardItem) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }
}
