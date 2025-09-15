import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  HostListener
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  DisplayGrid,
  GridsterComponent,
  GridsterComponentInterface,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridsterItemComponentInterface,
  GridType
} from 'angular-gridster2';
import { MarkdownModule } from 'ngx-markdown';

declare var Highcharts: any;

@Component({
  selector: 'app-mapchart2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MarkdownModule,
    GridsterComponent,
    GridsterItemComponent
  ],
  standalone: true,
  templateUrl: './mapchart2.html',
  styleUrl: './mapchart2.scss'
})
export class Mapchart2 implements OnInit, AfterViewInit {
  options: GridsterConfig = {};
  dashboard: Array<GridsterItem> = [];
  charts: any[] = [];
  remove = false;

  //  @HostListener('window:beforeunload', ['$event'])
  // unloadHandler(event: BeforeUnloadEvent) {
  //   // if (this.isFormDirty) {
  //     event.preventDefault();
  //     event.returnValue = ''; // Required for Chrome/Edge to show confirmation
  //   // }
  // }

  constructor(private readonly cdr: ChangeDetectorRef, private readonly zone: NgZone) { }

  ngOnInit(): void {
    // this.options = {
    //   gridType: GridType.Fit,
    //   compactType: 'compactUp',
    //   displayGrid: DisplayGrid.None,
    //   initCallback: Mapchart2.gridInit,
    //   margin: 5,
    //   outerMargin: true,
    //   destroyCallback: Mapchart2.gridDestroy,
    //   gridSizeChangedCallback: Mapchart2.gridSizeChanged,
    //   itemChangeCallback: Mapchart2.itemChange,
    //   itemResizeCallback: Mapchart2.itemResize,
    //   itemInitCallback: Mapchart2.itemInit,
    //   itemRemovedCallback: Mapchart2.itemRemoved,
    //   itemValidateCallback: Mapchart2.itemValidate,
    //   pushItems: true,
    //   draggable: { enabled: false },
    //   resizable: { enabled: true },
    // };

    this.options = {
      draggable: { enabled: true },
      resizable: { enabled: true },
      // displayGrid: 'always',
      displayGrid: DisplayGrid.None,
      pushItems: true,
      gridType: GridType.Fit,
      compactType: 'compactUp',
      // minCols: 6, // Define a minimum number of columns for the grid
      // minRows: 6, // Define a minimum number of rows for the grid
    };


    this.dashboard = [
      { cols: 2, rows: 2, y: 0, x: 0, label: 'Sales Chart' },
      { cols: 4, rows: 2, y: 0, x: 0, label: 'Sales Chart' },
      { cols: 2, rows: 2, y: 0, x: 0, label: 'Sales Chart' }
    ];
  }

  ngAfterViewInit(): void {
    // Load initial chart if there are items
    setTimeout(() => this.loadAllCharts(), 0);
  }

  static itemChange(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    console.info('itemChanged', item, itemComponent);
  }
  static itemResize(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    console.info('itemResized', item, itemComponent);
  }
  static itemInit(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    console.info('itemInitialized', item, itemComponent);
  }
  static itemRemoved(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    console.info('itemRemoved', item, itemComponent);
  }
  static itemValidate(item: GridsterItem): boolean {
    return item.cols > 0 && item.rows > 0;
  }
  static gridInit(grid: GridsterComponentInterface): void {
    console.info('gridInit', grid);
  }
  static gridDestroy(grid: GridsterComponentInterface): void {
    console.info('gridDestroy', grid);
  }
  static gridSizeChanged(grid: GridsterComponentInterface): void {
    console.info('gridSizeChanged', grid);
  }

  /** Add a new grid item + chart */
  addItem(): void {
    this.dashboard.push({ x: 0, y: 0, cols: 2, rows: 2 });
    this.cdr.detectChanges();
    setTimeout(() => this.loadChart(this.dashboard.length - 1), 0);
  }

  /** Load all charts after grid initializes */
  loadAllCharts(): void {
    this.dashboard.forEach((_, i) => this.loadChart(i));
  }

  /** Load a chart inside given index */
  loadChart(index: number): void {
    const container = document.getElementById('chart-container' + index);
    if (!container) return;

    const chartOptions = this.getChartOptions();
    const chart = Highcharts.chart(container, chartOptions);
    this.charts[index] = chart;
  }

  /** Handle reflow on grid resize */
  onResize(): void {
    // this.zone.runOutsideAngular(() => {
    //   this.charts.forEach(chart => chart?.reflow());
    // });
  }

  removeItem($event: MouseEvent | TouchEvent, item: any): void {
    $event.preventDefault();
    $event.stopPropagation();
    const index = this.dashboard.indexOf(item);
    if (index > -1) {
      if (this.charts[index]) this.charts[index].destroy();
      this.charts.splice(index, 1);
      this.dashboard.splice(index, 1);
    }

    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }

    // ✅ Allow DOM to update, then reflow all Highcharts
    setTimeout(() => {
      Highcharts.charts.forEach((chart: any) => {
        chart?.reflow();
      });
    }, 100);
  }

  loadWidgetData(): void {
    console.log("loadWidgetData called", this.dashboard);
  }

  destroy(): void {
    this.remove = !this.remove;
  }

  /** Chart configuration */
  getChartOptions(): any {
    return {
      chart: {
        zooming: { type: 'xy' },
        spacingBottom: 30
      },
      title: { text: '' },
      subtitle: { text: '' },
      xAxis: [{ categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], crosshair: true }],
      yAxis: [
        { title: { text: 'Rainfall', style: { color: '#5856d2' } }, labels: { format: '{value}mm', style: { color: '#5856d2' } }, opposite: true },
        { title: { text: 'Temperature', style: { color: '#29d13d' } }, labels: { format: '{value}C', style: { color: '#29d13d' } }, opposite: true },
        { title: { text: 'Sea Level Pressure', style: { color: '#49b4b6' } }, labels: { format: '{value}mn', style: { color: '#49b4b6' } }, opposite: false }
      ],
      tooltip: { shared: true },
      legend: { enabled: true },
      series: [
        { name: 'Rainfall', type: 'column', data: [49.9, 71.5, null, 129.2, 144, 176, 135.6, null, 216.4, 194.1, 95.6, 54.4], yAxis: 0, color: '#5856d2' },
        { name: 'Temperature', type: 'spline', data: [7, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6], yAxis: 1, color: '#29d13d' },
        { name: 'Sea Level Pressure', type: 'spline', data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7], yAxis: 2, color: '#49b4b6' }
      ],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500 // When container < 500px wide
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            },
            xAxis: {
              labels: {
                rotation: -45, // Rotate labels for readability
                style: { fontSize: '10px' }
              }
            }
          }
        }]
      }
    };
  }
}
