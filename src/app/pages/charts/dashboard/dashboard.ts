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
  OnDestroy,
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
import { BreakpointObserver } from '@angular/cdk/layout';
import { SidePannel } from '../../shared/components/side-pannel/side-pannel';
import { MatDialog } from '@angular/material/dialog';
import { NotificationMassageService } from '../../../@core/services/notification-massage-service';
import { LoadChart } from '../../../@core/services/load-chart';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { CreatePage } from '../../shared/create-page/create-page';
import { StorageService } from '../../../@core/services/storage-service';
import { firstValueFrom, Observable, Subject, takeUntil, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfirmationDialog } from '../../shared/components/confirmation-dialog/confirmation-dialog';

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
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
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
  projectData: any = null;
  private readonly destroy$ = new Subject<void>();
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
    private readonly breakpointObserver: BreakpointObserver, private readonly notifyService: NotificationMassageService, private readonly chartBuilderService: LoadChart,
    private readonly storage: StorageService
  ) {
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      console.log('Query param mode:', mode);
      this.isViewCharts = mode !== 'designer';
      if (this.options) {
        if (this.options.draggable) {
          this.options.draggable.enabled = !this.isViewCharts;
        }
        if (this.options.resizable) {
          this.options.resizable.enabled = !this.isViewCharts;
        }

        if (this.options.api && this.options.api.optionsChanged) {
          this.options.api.optionsChanged();
        }
      }
      setTimeout(() => {
        this.cdr.detectChanges(); // ✅ runs in next tick, no assertion error
      });
      console.log('isViewCharts set to:', this.isViewCharts);
    });

    this.chartEventService.changeTabEvent.subscribe((data) => {
      console.log('🔥 New chart mode activated!', data);
      if (data) {
        console.log('Selected file:', data);
        const tempData = JSON.stringify(data)
        this.selectedChartFiles = JSON.parse(tempData);
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
    console.log('isViewCharts on init:', this.options);
    this.cdr.detectChanges();

    this.chartEventService.config$
      .pipe(takeUntil(this.destroy$))   // 👈 auto unsubscribe
      .subscribe(config => {
        if (config) {
          this.projectData = config;
          this.setDynamicThemeing();
        }
      });
    this.chartEventService.loadConfigFromStorage();
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => c?.destroy?.());
    this.charts = [];
    this.allDataFromChart = null;
    this.destroy$.next();      // 👈 emit on destroy
    this.destroy$.complete();  // 👈 cleanup
  }


  setDynamicThemeing() {
    if (this.projectData) {
      document.documentElement.style.setProperty('--header-bg', this.projectData.mainBackgroundColor || '#fff');
      document.documentElement.style.setProperty('--color-text', this.projectData.textColor || '#333');
      document.documentElement.style.setProperty('--button-bg', this.projectData.selectedColor || '#1976d2');
      document.documentElement.style.setProperty('--chart-background', this.projectData.chartBackgroundColor || '#fff');
      document.documentElement.style.setProperty('--button-bg-hover', this.projectData.mainBackgroundColor || '#145a9e');
      document.documentElement.style.setProperty('--card-bg', this.projectData.mainBackgroundColor || '#fff');
      document.documentElement.style.setProperty('--card-text', this.projectData.mainBackgroundColor || '#333');
    }
  }

  editNameOfReportFiles(reportName: string) {
    console.log('Create New Chart');
    this.dialog.open(CreatePage, { data: reportName, disableClose: true }).afterClosed().subscribe((data) => {
      if (data) {
        console.log('Dialog result:', data);
        if (this.selectedChartFiles && this.selectedChartFiles.displayName) {
          this.selectedChartFiles['oldName'] = this.selectedChartFiles.displayName;
          this.selectedChartFiles['displayName'] = data;
        } else {
          this.createNewFiles = data;
        }
        this.cdr.detectChanges();
        console.log('Updated file name:', this.selectedChartFiles);
        console.log('Updated file name:', this.createNewFiles);
      }
    });
  }

  createDataSource() {
    console.log("Create Data Source clicked");
  }

  createDashboard() {
    console.log("Creating dashboard:", this.dashboardName, "with", this.selectedDataSource);
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


  openModal(groupItem?: any, index?: any): void {
    this.dialog.open(SidePannel, { data: { cfg: groupItem, sourceData: JSON.stringify(this.allDataFromChart.sourceData) }, panelClass: ['modal-fullscreen-right', 'modal-md'], disableClose: true }).afterClosed().subscribe((data) => {
      if (data) {
        this.dashboard[index]['chartConfig'] = data.chartData;
        this.allDataFromChart.sourceData = data.sourceData;
        this.cdr.detectChanges();
        this.renderChart(index);
        console.log('this.dashboard', this.dashboard);
        console.log('this.dashboard', data);
        console.log('this.dashboard', this.allDataFromChart.sourceData);
      }
    });
  }

  ngAfterViewInit(): void {
  }


  getFilesData(): void {
    this.apiServices.getFile(this.selectedChartFiles.id).subscribe({
      next: (res: any) => {
        if (!res?.status) {
          console.error("API Error:", res?.message || "Unknown error");
          return;
        }
        const data = res.data;
        this.allDataFromChart = data.data;
        this.dashboard = data.data.listOfChartOption;
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

  addItem(partial?: any): void {
    const wigetSize = { cols: 2, rows: 2, x: 0, y: 0 };
    const cfg: any = this.createChartConfig(partial, wigetSize);
    this.dashboard.push(cfg);
    console.log('Added new dashboard item:', this.dashboard);
    this.cdr.detectChanges();
  }

  createChartConfig(partial: any = {}, wigetSize: any = { cols: 2, rows: 2, x: 0, y: 0 }) {
    return {
      wigetSize
    };
  }

  loadAllCharts(): void {
    this.dashboard.forEach((_, i) => this.renderChart(i));
  }

  async renderChart(index: number): Promise<void> {
    const cfg: any = this.dashboard[index];
    if (!cfg.chartConfig) return;

    if (this.charts[index]) {
      try { this.charts[index].destroy(); } catch (e) { /* ignore */ }
      this.charts[index] = null;
    }

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

  getDataReturnFuction(cfg: any): Observable<any[]> {
    console.log(this.allDataFromChart.sourceData);
    const index = this.allDataFromChart.sourceData.findIndex(
      (data: any) => data.name === cfg.rawData
    );

    if (index === -1) {
      console.warn(`No source found for ${cfg.rawData}`);
      return of([]);
    }

    const rawData = this.allDataFromChart.sourceData[index];

    // ✅ Return cached data if available
    if (rawData.data && rawData.data.length) {
      return of(rawData.data);
    }

    // ✅ Otherwise fetch and update the object in sourceData
    return this.http.get<any[]>(rawData.sourceFile).pipe(
      map((fetchedData: any[]) => {
        // update the matched object in the array
        this.allDataFromChart.sourceData[index] = {
          ...rawData,
          data: fetchedData
        };
        return fetchedData;
      }),
      catchError((error: any) => {
        this.notifyService.error('Failed to load data.', 'Error');
        console.error('Data Load Error:', error);
        return of([]);
      })
    );
  }



  async renderSingleAndTwoLevelChart(index: number, cfg: any, container: HTMLElement) {
    if (!cfg.selectedXAxis && cfg.selectedYAxis) {
      console.warn('Select at least one series field and argument field');
      return;
    }

    try {
      const rawData = await firstValueFrom(this.getDataReturnFuction(cfg));
      const chartOptions = this.chartBuilderService.getChartOptions(
        cfg.selectedChartCate,
        cfg.selectedChartType,
        rawData,
        cfg.title,
        cfg.subTitle,
        cfg.titleAlign,
        cfg.subTitleAlign,
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

      this.charts[index] = Highcharts.chart(container as any, chartOptions);
      console.log("this.currentChart =>", chartOptions);

    } catch (error) {
      console.error('Render chart error:', error);
      this.charts[index] = null;
      this.notifyService.error('Unable to render chart. Check config/data.', 'Error');
    }
  }

  async renderthreeAndFourLevelChart(index: number, cfg: any, container: HTMLElement) {
    // same shape as above — re-use getChartOptions
    await this.renderSingleAndTwoLevelChart(index, cfg, container);
  }

  async rendertSeriesChart(index: number, cfg: any, container: HTMLElement) {
    const rawData = await firstValueFrom(this.getDataReturnFuction(cfg));
    const chartOptions = this.chartBuilderService.getChartOptions(
      cfg.selectedChartCate,
      cfg.selectedChartType,
      rawData,
      cfg.title,
      cfg.subTitle,
      cfg.titleAlign,
      cfg.subTitleAlign,
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
    const rawData = await firstValueFrom(this.getDataReturnFuction(cfg));
    const chartOptions = this.chartBuilderService.multiDiminonalChart(
      cfg.title,
      cfg.subTitle,
      cfg.titleAlign,
      cfg.subTitleAlign,
      rawData,
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
    const rawData = await firstValueFrom(this.getDataReturnFuction(cfg));
    try {
      const chartOptions = await this.chartBuilderService.renderMapChart(
        cfg.selectedChartCate,
        cfg.selectedMapOption,
        cfg.selectedMatchValue,
        rawData,
        cfg.title,
        cfg.subTitle,
        cfg.titleAlign,
        cfg.subTitleAlign,
        cfg.selectedXAxis,
        cfg.showLengend,
        cfg.dataLabel,
        cfg.enableMouseTracking,
      );
      this.charts[index] = Highcharts.mapChart(container as any, chartOptions);
      console.log("Map chartOptions =>", chartOptions);
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
      sourceData: this.getProcessedSourceData()
    }).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.chartEventService.emitCreateChart(this.createNewFiles);
          this.createNewFiles = '';
          this.notifyService.success(res.message, 'success');
        }
      },
      error: (err) => {
        this.notifyService.error(err.error.message, 'error');
        console.error('HTTP Error:', err);
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  getProcessedSourceData(): any[] {
    // Fallback to [] if sourceData is missing
    const sourceData = this.allDataFromChart?.sourceData
      ? this.allDataFromChart.sourceData
      : [];

    return sourceData.map((item: any) => {
      if (item.sourceType == 1) {
        return { ...item, data: [] };  // overwrite data
      }
      return item; // keep as is
    });
  }

  updatFileName() {
    this.apiServices.updateFile(this.selectedChartFiles.id, {
      listOfChartOption: this.dashboard,
      sourceData: this.getProcessedSourceData()
    }, this.selectedChartFiles.displayName).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.chartEventService.emitCreateChart(this.selectedChartFiles.displayName);
          this.notifyService.success(res.message, 'success');
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
        this.notifyService.error(err.error.message, 'error');
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  deleteChartReport() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '420px',
      disableClose: true,
      data: {
        title: `Confirm Deletion`,
        message: `Are you sure you want to delete "${this.selectedChartFiles?.displayName}"? This action cannot be undone.`,
        confirmButtonText: 'Delete',
        confirmButtonColor: 'warn',
        cancelButtonText: 'Cancel',
        cancelButtonColor: '',
        icon: 'delete_forever'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDelete();
      } else {
        this.notifyService.info('Deletion cancelled.');
      }
    });
  }

  performDelete() {
    this.apiServices.deleteFile(this.selectedChartFiles.id).subscribe({
      next: (res: any) => {
        if (res.status) {
          // location.reload();
          this.notifyService.success('Chart report deleted successfully.', 'success');
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
        this.notifyService.error(err.error.message, 'error');
      },
      complete: () => {
        console.log('Delete request completed.');
      }
    });
  }
}
