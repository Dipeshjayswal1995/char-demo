import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../../@core/services/storage-service';
import { LOCAL_STORAGE_KEYS } from './../../../../@core/utils/local-storage-key.utility';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChartEventService } from '../../../../@core/services/chart-event-service';
import { CreatePage } from '../../create-page/create-page';
import { ProjectConfiguration } from '../project-configuration/project-configuration';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, MatDialogModule, CommonModule, MatButtonToggleModule, MatSlideToggleModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
})
export class Header {
  @Output() sidebarToggle = new EventEmitter<void>();
  filesList = [];
  isViewCharts = true;
  projectData: any = null;
  // isDesignerMode = false;
  // selectedTab = '';
  constructor(private readonly dialog: MatDialog, private readonly router: Router, private readonly storage: StorageService, private readonly route: ActivatedRoute,
    private readonly chartEventService: ChartEventService,
  ) {
    this.filesList = JSON.parse(storage.getPersistentItem(LOCAL_STORAGE_KEYS.FILELIST));
    this.projectData = this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION) ? JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION)) : null;
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      this.isViewCharts = mode !== 'designer';
    });
    this.setDynamicThemeing();
  }


  setDynamicThemeing() {
    if (this.projectData) {
      document.documentElement.style.setProperty('--sidebar-bg', this.projectData.sidebarColor);
      document.documentElement.style.setProperty('--text-color', this.projectData.textColor);
      document.documentElement.style.setProperty('--button-bg', this.projectData.selectedColor || '#1976d2');
    }
  }

  toggleView(event: any): void {
    this.isViewCharts = !event.checked;
    const mode = this.isViewCharts ? 'viewer' : 'designer';
    this.router.navigate(['dashboard'], {
      queryParams: { mode },
      queryParamsHandling: 'merge'
    }).then(() => {
      // window.location.reload();
    });
  }

  createNewChart() {
    console.log('Create New Chart');
    this.dialog.open(CreatePage, { disableClose: true }).afterClosed().subscribe((data) => {
      if (data) {
        this.chartEventService.createChart(data);
      }
    });
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  openProjectSettion() {
    this.dialog.open(ProjectConfiguration, { data: 'reportName', panelClass: ['modal-fullscreen-right', 'modal-md'], disableClose: true }).afterClosed().subscribe((data) => {
      if (data) {
        console.log('Dialog result:', data);
        this.chartEventService.projectConfigFire(true);
        location.reload();
      }
    });
  }

}
