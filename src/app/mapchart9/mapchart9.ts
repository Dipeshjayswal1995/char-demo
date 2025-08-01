import { Component } from '@angular/core';
import { HighchartsChartComponent, ChartConstructorType } from 'highcharts-angular';

@Component({
  selector: 'app-mapchart9',
  imports: [HighchartsChartComponent],
  templateUrl: './mapchart9.html',
  styleUrl: './mapchart9.scss'
})
export class Mapchart9 {
   chartOptions:  Highcharts.Options = {
    series: [
      {
        data: [1, 2, 3],
        type: 'pie',
      },
    ],
  };// Required
  chartConstructor: ChartConstructorType = 'chart'; // Optional, defaults to 'chart'
  updateFlag: boolean = false; // Optional
  oneToOneFlag: boolean = true; // Optional, defaults to 

}
