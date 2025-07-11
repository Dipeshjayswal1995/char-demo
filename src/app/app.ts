import { RouterOutlet } from '@angular/router';

import { Component, AfterViewInit } from '@angular/core';


declare var Highcharts: any;

interface MonthlyData {
  income: number;
  gdp_per_capita: number;
  population: number;
  area: number;
}

interface StateInfo {
  name: string;
  income: number;
  gdp_per_capita: number;
  population: number;
  area: number;
  monthlyData: { [key: string]: MonthlyData };
}



@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'chart-dashboard';

}
