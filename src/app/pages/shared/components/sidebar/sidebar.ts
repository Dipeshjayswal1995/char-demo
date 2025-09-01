import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiServices } from '../../../../@core/services/api-services';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { StorageService } from '../../../../@core/services/storage-service';
import { LOCAL_STORAGE_KEYS } from './../../../../@core/utils/local-storage-key.utility';
import { ChartEventService } from '../../../../@core/services/chart-event-service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule, MatSidenavModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  standalone: true,
})
export class Sidebar {
  files: { name: string; createdAt?: string }[] = [];
  selectedTab: string = '';
  constructor(private readonly router: Router, private readonly apiServices: ApiServices, private readonly route: ActivatedRoute, private readonly storage: StorageService,
    private readonly chartEventService: ChartEventService,
  ) {
    // this.files = JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.FILELIST));
    // this.route.paramMap.subscribe(params => {
    //   console.log(params.get('filename'));
    // });

    this.chartEventService.createChartEvent.subscribe((data) => {
      console.log('🔥 New chart mode activated!');
      if (data) {
        this.loadFileList();
      }
      // here you can open a dialog, update sidebar, reset forms, etc.
    });
  }

  ngOnInit() {
    this.loadFileList();
  }

  getCleanFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9-]/g, '-');
  }

  loadFileList() {
    this.apiServices.getFiles().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.files = res.data;
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
    this.router.navigate(['/chart']);
    this.chartEventService.changeTab(false);
  }

  viewChart(item: any) {
    this.selectedTab = item.name;
    this.chartEventService.changeTab(item);
  }

}
