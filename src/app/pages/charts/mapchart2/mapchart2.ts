import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ApiServices } from '../../../@core/services/api-services';
import { ChartEventService } from '../../../@core/services/chart-event-service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


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
  isViewCharts = true;
  selectedChartFiles: any = null;

  // @HostListener('window:resize')
  // onWindowResize() {
  //   // if (this.options?.api?.resize) {
  //   //   this.options.api.resize();
  //   // }
  // }

  //  @HostListener('window:beforeunload', ['$event'])
  // unloadHandler(event: BeforeUnloadEvent) {
  //   // if (this.isFormDirty) {
  //     event.preventDefault();
  //     event.returnValue = ''; // Required for Chrome/Edge to show confirmation
  //   // }
  // }

  constructor(private readonly cdr: ChangeDetectorRef, private readonly zone: NgZone, private readonly route: ActivatedRoute, private readonly router: Router,
    private readonly http: HttpClient, private readonly apiServices: ApiServices, private readonly chartEventService: ChartEventService,
    private readonly breakpointObserver: BreakpointObserver
  ) {
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      this.isViewCharts = mode !== 'designer';
    });

    this.chartEventService.changeTabEvent.subscribe((data) => {
      console.log('🔥 New chart mode activated!', data);
      if (data) {
        this.selectedChartFiles = data;
        // this.loadChartCategories();
        this.getFilesData();
      }
    });
  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      compactType: 'compactUp',
      displayGrid: DisplayGrid.None,
      initCallback: Mapchart2.gridInit,
      margin: 5,
      outerMargin: true,
      destroyCallback: Mapchart2.gridDestroy,
      gridSizeChangedCallback: Mapchart2.gridSizeChanged,
      itemChangeCallback: Mapchart2.itemChange,
      itemResizeCallback: Mapchart2.itemResize,
      itemInitCallback: Mapchart2.itemInit,
      itemRemovedCallback: Mapchart2.itemRemoved,
      itemValidateCallback: Mapchart2.itemValidate,
      pushItems: true,
      draggable: { enabled: true },
      resizable: { enabled: true },
      // responsiveOptions: [
      //   {
      //     breakpoint: 'sm', // Small (mobile)
      //     minWidth: 0,
      //     maxWidth: 600,
      //     cols: 1,
      //     rowHeight: 300
      //   },
      //   {
      //     breakpoint: 'md', // Tablet
      //     minWidth: 601,
      //     maxWidth: 960,
      //     cols: 2,
      //     rowHeight: 350
      //   },
      //   {
      //     breakpoint: 'lg', // Desktop
      //     minWidth: 961,
      //     maxWidth: 1400,
      //     cols: 4,
      //     rowHeight: 400
      //   }
      // ]

    };

    // this.options = {
    //   gridType: GridType.Fit,
    //   compactType: 'compactUp',
    //   displayGrid: DisplayGrid.None,
    //   margin: 5,
    //   outerMargin: true,
    //   pushItems: true,
    //   draggable: { enabled: true },
    //   resizable: { enabled: true },
    //   rowHeight: 300,  // default
    //   minCols: 1,
    //   maxCols: 6
    // };

    // this.breakpointObserver.observe([
    //   Breakpoints.Handset,  // mobile
    //   Breakpoints.Tablet,   // tablet
    //   Breakpoints.Web       // desktop
    // ]).subscribe(result => {
    //   if (result.breakpoints[Breakpoints.Handset]) {
    //     this.options.rowHeight = 200;
    //     this.options.minCols = 1;
    //   } else if (result.breakpoints[Breakpoints.Tablet]) {
    //     this.options.rowHeight = 250;
    //     this.options.minCols = 2;
    //   } else {
    //     this.options.rowHeight = 300;
    //     this.options.minCols = 4;
    //   }
    //   this.options.api?.optionsChanged?.(); // refresh Gridster
    // });

    // this.options = {
    //   draggable: { enabled: !this.isViewCharts },
    //   resizable: { enabled: !this.isViewCharts },
    //   // displayGrid: 'always',
    //   displayGrid: DisplayGrid.None,
    //   pushItems: true,
    //   gridType: GridType.Fit,
    //   compactType: 'compactUp',
    //   margin: 5,
    // };


    // this.dashboard = [
    //   { cols: 2, rows: 2, y: 0, x: 0, label: 'Sales Chart' },
    //   { cols: 4, rows: 2, y: 0, x: 0, label: 'Sales Chart' },
    //   { cols: 2, rows: 2, y: 0, x: 0, label: 'Sales Chart' }
    // ];
  }

  ngAfterViewInit(): void {
    // Load initial chart if there are items
    this.loadChartCategories();
  }


  loadChartCategories(): void {
    this.http.get<any>('assets/test-data/charts2.json').subscribe(
      data => {
        this.dashboard = data;
        this.cdr.detectChanges();
        setTimeout(() => this.loadAllCharts(), 2000);
        console.log('Loaded chart categories:', this.dashboard);
      },
      error => {
        console.error('Error loading common.json:', error);
      }
    );
  }

  getFilesData(): void {
    this.apiServices.getFile(this.selectedChartFiles.name).subscribe({
      next: (res: any) => {
        if (!res?.status) {
          console.error("API Error:", res?.message || "Unknown error");
          return;
        }
        const data = res.data;
        this.dashboard = data;
        this.cdr.detectChanges();
        setTimeout(() => this.loadAllCharts(), 20);
        console.log('Loaded chart categories:', this.dashboard);
        console.log("Fetched file data:", data);
      },
      error: (err) => {
        console.error("HTTP Error:", err);
      },
      complete: () => {
        console.log("Request completed.");
      }
    });
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

  addItem(): void {
    const wigetSize: any = { "wigetSize": { cols: 4, rows: 4, x: 0, y: 0 } };
    this.dashboard.push(wigetSize);
    console.log('Added new item:', this.dashboard);
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
    let chart;
    if (this.dashboard[index]['type'] == 'map') {
      chart = Highcharts.mapChart(container, this.dashboard[index]);
    } else {
      chart = Highcharts.chart(container, this.dashboard[index]);
    }
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
