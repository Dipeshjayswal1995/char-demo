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
import { SidePannel } from '../../shared/components/side-pannel/side-pannel';
import { MatDialog } from '@angular/material/dialog';
import { NotificationMassageService } from '../../../@core/services/notification-massage-service';
import { LoadChart } from '../../../@core/services/load-chart';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';


declare var Highcharts: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MarkdownModule,
    GridsterComponent,
    GridsterItemComponent,
    MatFormFieldModule,
    MatInputModule,
    MatListModule

  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, AfterViewInit {
  options: GridsterConfig = {};
  dashboard: Array<GridsterItem> = [];
  charts: any[] = [];
  remove = false;
  isViewCharts = true;
  selectedChartFiles: any = null;
  allDataFromChart: any = null;
  dashboardName = 'New Dashboard';
  selectedDataSource: any;
  searchText = '';
  createNewFiles = '';

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
    private readonly http: HttpClient, private readonly apiServices: ApiServices, private readonly chartEventService: ChartEventService, public dialog: MatDialog,
    private readonly breakpointObserver: BreakpointObserver, private readonly notifyService: NotificationMassageService, private readonly chartBuilderService: LoadChart
  ) {
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      console.log('Query param mode:', mode);
      // this.cdr.detectChanges();
      this.isViewCharts = mode !== 'designer';
      setTimeout(() => {
        this.cdr.detectChanges(); // ✅ runs in next tick, no assertion error
      });
      //       this.zone.run(() => {
      //   this.isViewCharts = params['mode'] !== 'designer';
      // });
      // this.cdr.detectChanges();
      console.log('isViewCharts set to:', this.isViewCharts);
    });

    this.chartEventService.changeTabEvent.subscribe((data) => {
      console.log('🔥 New chart mode activated!', data);
      if (data) {
        console.log('Selected file:', data);
        this.selectedChartFiles = data;
        // this.loadChartCategories();
        this.getFilesData();
      }
    });

    this.chartEventService.createNewChatEvent.subscribe((data) => {
      if (data) {
        this.createNewFiles = data;
        this.selectedChartFiles = null;
        this.allDataFromChart = { listOfChartOption: [], sourceData: [] };
        this.dashboard = [];
        this.charts = [];
        this.cdr.detectChanges();
        this.addItem();
      }
    })
  }

  createDataSource() {
    console.log("Create Data Source clicked");
  }

  createDashboard() {
    console.log("Creating dashboard:", this.dashboardName, "with", this.selectedDataSource);
  }

  ngOnDestroy(): void {
    // destroy all charts

    this.charts.forEach(c => c?.destroy?.());
    this.charts = [];
    this.allDataFromChart = null;
  }

  static itemChange(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    // console.info('itemChanged', item, itemComponent);
  }
  static itemResize(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    // console.info('itemResized', item, itemComponent);
  }
  static itemInit(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    // console.info('itemInitialized', item, itemComponent);
  }
  static itemRemoved(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    // console.info('itemRemoved', item, itemComponent);
  }
  static itemValidate(item: GridsterItem): boolean {
    return item.cols > 0 && item.rows > 0;
  }
  static gridInit(grid: GridsterComponentInterface): void {
    // console.info('gridInit', grid);
  }
  static gridDestroy(grid: GridsterComponentInterface): void {
    // console.info('gridDestroy', grid);
  }
  static gridSizeChanged(grid: GridsterComponentInterface): void {
    // console.info('gridSizeChanged', grid);
  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      compactType: 'compactUp',
      displayGrid: DisplayGrid.None,
      initCallback: Dashboard.gridInit,
      margin: 5,
      outerMargin: true,
      destroyCallback: Dashboard.gridDestroy,
      gridSizeChangedCallback: Dashboard.gridSizeChanged,
      itemChangeCallback: Dashboard.itemChange,
      itemResizeCallback: Dashboard.itemResize,
      itemInitCallback: Dashboard.itemInit,
      itemRemovedCallback: Dashboard.itemRemoved,
      itemValidateCallback: Dashboard.itemValidate,
      pushItems: true,
      draggable: { enabled: !this.isViewCharts },
      resizable: { enabled: !this.isViewCharts },
    };
    this.cdr.detectChanges();
  }

  openModal(groupItem?: any, index?: any): void {
    this.dialog.open(SidePannel, { data: { cfg: groupItem, sourceData: this.allDataFromChart.sourceData }, panelClass: ['modal-fullscreen-right', 'modal-md'], disableClose: true }).afterClosed().subscribe((data) => {
      if (data) {
        this.dashboard[index]['chartConfig'] = data;
        this.cdr.detectChanges();
        this.renderChart(index);
        console.log('Dialog result:', this.dashboard[index]);
      }
    });
  }

  ngAfterViewInit(): void {
  }


  getFilesData(): void {
    this.apiServices.getFile(this.selectedChartFiles.name).subscribe({
      next: (res: any) => {
        if (!res?.status) {
          console.error("API Error:", res?.message || "Unknown error");
          return;
        }
        const data = res.data;
        this.allDataFromChart = data;
        this.dashboard = data.listOfChartOption;
        console.log("Fetched file data:", data);
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

  // addItem(): void {
  //   const wigetSize: any = { "wigetSize": { cols: 4, rows: 4, x: 0, y: 0 } };
  //   this.dashboard.push(wigetSize);
  //   console.log('Added new item:', this.dashboard);
  //   this.cdr.detectChanges();
  //   setTimeout(() => this.loadChart(this.dashboard.length - 1), 0);
  // }

  addItem(partial?: any): void {
    // default grid size (you can make it dynamic if needed)
    const wigetSize = { cols: 2, rows: 2, x: 0, y: 0 };

    const cfg: any = this.createChartConfig(partial, wigetSize);

    this.dashboard.push(cfg);
    console.log('Added new dashboard item:', this.dashboard);

    this.cdr.detectChanges();

    // wait for DOM to render, then load chart
    // setTimeout(() => {
    // const newIndex = this.dashboard.length - 1;
    // this.renderChart(newIndex);
    // }, 0);
  }

  createChartConfig(partial: any = {}, wigetSize: any = { cols: 2, rows: 2, x: 0, y: 0 }) {
    return {
      wigetSize
    };
  }

  /** Load all charts after grid initializes */
  loadAllCharts(): void {
    // this.dashboard.forEach((_, i) => this.loadChart(i));
    this.dashboard.forEach((_, i) => this.renderChart(i));
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

  async renderChart(index: number): Promise<void> {
    // console.log('selectedChartType', this.selectedChartType);
    const cfg: any = this.dashboard[index];
    if (!cfg.chartConfig) return;


    if (this.charts[index]) {
      try { this.charts[index].destroy(); } catch (e) { /* ignore */ }
      this.charts[index] = null;
    }

    // if (this.currentChart) {
    //   this.currentChart.destroy();
    // }

    const container = document.getElementById('chart-container' + index);
    if (!container) {
      console.warn('Missing container for', 'chart-container' + index);
      return;
    }


    try {
      switch (cfg.chartConfig.selectedChartCate?.id) {
        case 1:
        case 2:
          await this.renderSingleAndTwoLevelChart(index, cfg.chartConfig, container);
          break;
        case 3:
          await this.renderthreeAndFourLevelChart(index, cfg.chartConfig, container);
          break;
        case 4:
          await this.multiDiminonalChart(index, cfg.chartConfig, container);
          break;
        case 5:
          await this.rendertMapChart(index, cfg.chartConfig, container);
          break;
        case 6:
          await this.rendertSeriesChart(index, cfg.chartConfig, container);
          break;
        default:
          await this.renderSingleAndTwoLevelChart(index, cfg.chartConfig, container);
      }
    } catch (err) {
      console.error('renderChart error', err);
      this.notifyService.error('Unable to render chart', 'Error');
    }
  }


  async renderSingleAndTwoLevelChart(index: number, cfg: any, container: HTMLElement) {
    if (!cfg.selectedXAxis && cfg.selectedYAxis) {
      console.warn('Select at least one series field and argument field');
      return;
    }
    const rawData = this.allDataFromChart.sourceData.find((data: any) => data.name === cfg.rawData);
    const chartOptions = this.chartBuilderService.getChartOptions(
      cfg.selectedChartCate,
      cfg.selectedChartType,
      rawData.data,
      cfg.title,
      cfg.subTitle,
      cfg.selectedXAxis,
      cfg.selectedYAxis,
      cfg.zooming,
      cfg.showLengend,
      cfg.dataLabel,
      cfg.enableMouseTracking,
      cfg.selectedThirdArgument,
      cfg.pieInnerSize,
      cfg.pieStartAngal,
      cfg.pieENDAngal,
      cfg.stacking,
    );

    try {
      this.charts[index] = Highcharts.chart(container as any, chartOptions);
    } catch (error) {
      console.error('Highcharts error:', error);
      this.charts[index] = null;
      this.notifyService.error('Unable to render chart. Check config/data.', 'Error');
    }
    console.log("this.currentChart =>", chartOptions);
  }

  async renderthreeAndFourLevelChart(index: number, cfg: any, container: HTMLElement) {
    // same shape as above — re-use getChartOptions
    await this.renderSingleAndTwoLevelChart(index, cfg, container);
  }


  // renderthreeAndFourLevelChart() {
  //   if (!this.selectedXAxis && this.selectedYAxis) {
  //     console.warn('Select at least one series field and argument field');
  //     return;
  //   }
  //   let chartOptions: any = null;
  //   chartOptions = this.chartBuilderService.getChartOptions(
  //     this.selectedChartCate,
  //     this.selectedChartType,
  //     this.rawData,
  //     this.title,
  //     this.subTitle,
  //     this.selectedXAxis,
  //     this.selectedYAxis,
  //     this.zooming,
  //     this.showLengend,
  //     this.dataLabel,
  //     this.enableMouseTracking,
  //     this.selectedThirdArgument,
  //     this.pieInnerSize,
  //     this.pieStartAngal,
  //     this.pieENDAngal,
  //     this.stacking,
  //   );
  //   try {
  //     this.currentChart = Highcharts.chart('chart-container', chartOptions);
  //     console.log("chartOptions =>", chartOptions);
  //   } catch (error: any) {
  //     console.error('Highcharts error:', error);
  //     this.currentChart = null;
  //     // Show user-friendly message
  //     this.notifyService.error('Unable to render chart. Please check your data and chart configuration.', 'Error');
  //   }
  // }

  async rendertSeriesChart(index: number, cfg: any, container: HTMLElement) {
    const rawData = this.allDataFromChart.sourceData.find((data: any) => data.name === cfg.rawData);
    const chartOptions = this.chartBuilderService.getChartOptions(
      cfg.selectedChartCate,
      cfg.selectedChartType,
      rawData.data,
      cfg.title,
      cfg.subTitle,
      cfg.selectedXAxis,
      cfg.selectedYAxis,
      cfg.zooming,
      cfg.showLengend,
      cfg.dataLabel,
      cfg.enableMouseTracking,
      cfg.selectedThirdArgument,
      cfg.pieInnerSize,
      cfg.pieStartAngal,
      cfg.pieENDAngal,
      cfg.stacking,
      cfg.selectedSeriesFields
    );

    try {
      this.charts[index] = Highcharts.chart(container as any, chartOptions);
    } catch (error) {
      console.error(error);
      this.charts[index] = null;
      this.notifyService.error('Unable to render series chart.', 'Error');
    }
  }


  async multiDiminonalChart(index: number, cfg: any, container: HTMLElement) {
    const rawData = this.allDataFromChart.sourceData.find((data: any) => data.name === cfg.rawData);
    const chartOptions = this.chartBuilderService.multiDiminonalChart(
      cfg.title,
      cfg.subTitle,
      rawData.data,
      cfg.selectedXAxis,
      cfg.yAxes,
      cfg.zooming,
      cfg.showLengend,
      cfg.dataLabel,
      cfg.enableMouseTracking,
    );
    console.log("multiDiminonalChart chartOptions =>", chartOptions);
    try {
      this.charts[index] = Highcharts.chart(container as any, chartOptions);
    } catch (error) {
      console.error(error);
      this.charts[index] = null;
      this.notifyService.error('Unable to render multi-dim chart.', 'Error');
    }
  }

  async rendertMapChart(index: number, cfg: any, container: HTMLElement) {
    // chartBuilderService.renderMapChart is async (loads map JSON etc)
    const rawData = this.allDataFromChart.sourceData.find((data: any) => data.name === cfg.rawData);
    try {
      const chartOptions = await this.chartBuilderService.renderMapChart(
        cfg.selectedChartCate,
        cfg.selectedMapOption,
        cfg.selectedMatchValue,
        rawData.data,
        cfg.title,
        cfg.subTitle,
        cfg.selectedXAxis,
        cfg.showLengend,
        cfg.dataLabel,
        cfg.enableMouseTracking,
      );
      this.charts[index] = Highcharts.mapChart(container as any, chartOptions);
    } catch (err) {
      console.error(err);
      this.charts[index] = null;
      this.notifyService.error('Unable to render map chart.', 'Error');
    }
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

  saveData() {
    if (this.createNewFiles) {
      this.createFiles();
    } else {
      this.updatFileName();
    }
  }

  createFiles() {
    this.apiServices.saveJson(this.createNewFiles, {
      listOfChartOption: this.dashboard ? this.dashboard : [],
      sourceData: this.allDataFromChart.sourceData ? this.allDataFromChart.sourceData : []
    }).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.chartEventService.emitCreateChart(this.createNewFiles);
          this.createNewFiles = '';
          this.notifyService.success(res.message, 'success');
        }
      },
      error: (err) => {
        this.notifyService.success(err.message, 'success');
        console.error('HTTP Error:', err);
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  updatFileName() {
    console.log('uploadedFileName', this.selectedChartFiles.name);
    this.apiServices.updateFile(this.selectedChartFiles.name, {
      listOfChartOption: this.dashboard,
      sourceData: this.allDataFromChart.sourceData
    }).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.chartEventService.emitCreateChart(this.selectedChartFiles.name);
          this.notifyService.success(res.message, 'success');
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
        this.notifyService.success(err.message, 'error');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }
}