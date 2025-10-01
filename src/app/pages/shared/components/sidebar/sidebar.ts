import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiServices } from '../../../../@core/services/api-services';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { StorageService } from '../../../../@core/services/storage-service';
import { ChartEventService } from '../../../../@core/services/chart-event-service';
import { LOCAL_STORAGE_KEYS } from '../../../../@core/utils/local-storage-key.utility';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule, MatSidenavModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  standalone: true,
})
export class Sidebar {
  files: { filename: string; createdAt?: string, id: string, updatedAt?: string, displayName: string }[] = [];
  selectedTab: string = '';
  sidebarVisible = true;
  projectData: any = null;
  constructor(private readonly router: Router, private readonly apiServices: ApiServices, private readonly route: ActivatedRoute, private readonly storage: StorageService,
    private readonly chartEventService: ChartEventService,
  ) {
    this.projectData = this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION) ? JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION)) : null;
    console.log('this.projectData==>', this.projectData);

    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      this.sidebarVisible = mode !== 'designer';
    });
    this.chartEventService.createChartEventApi.subscribe((data) => {
      if (data) {
        console.log('🔥 New chart mode activated!', data);
        this.loadFileList(data);
      }
    });
    this.setDynamicThemeing();
  }

  setDynamicThemeing() {
    if (this.projectData) {
      document.documentElement.style.setProperty('--sidebar-bg', this.projectData.sidebarColor);
      document.documentElement.style.setProperty('--text-color', this.projectData.textColor);
      document.documentElement.style.setProperty('--active-link-bg', this.projectData.selectedColor);
      document.documentElement.style.setProperty('--active-link-color', this.projectData.selectedColor);
    }
  }

  ngOnInit() {
    this.loadFileList();
  }

  getCleanFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9-]/g, '-');
  }

  loadFileList(name: string = '') {
    this.apiServices.getFiles().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.files = res.data;
          if (this.files.length) {
            if (name) {
              const index = this.files.findIndex(file => file.displayName === name);
              if (this.files[index]) {
                this.viewChart(this.files[index]);
              }
            } else {
              this.viewChart(this.files[0]);
            }
          }
        } else {
          this.files = [];
          console.error('API Error:', res.message);
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  sanitizeFileName(fileName: string) {
    return encodeURIComponent(fileName.replace(/\s+/g, '_'));
  }

  createNewChart() {
    this.selectedTab = '';
    this.router.navigate(['/chart']);
    this.chartEventService.createChart(true);
  }

  viewChart(item: any) {
    if (item) {
      console.log('item', item);
      this.selectedTab = item.id;
      this.chartEventService.changeTab(item);
    }
  }

}
