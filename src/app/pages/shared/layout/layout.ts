import { Component, OnDestroy, OnInit } from '@angular/core';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../@core/services/storage-service';
import { LOCAL_STORAGE_KEYS } from './../../../@core/utils/local-storage-key.utility';
import { ChartEventService } from '../../../@core/services/chart-event-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [Header, Sidebar, RouterOutlet, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout  implements OnInit, OnDestroy{
  sidebarVisible = true;
  filesList = [];
  projectData: any = null;
  private readonly destroy$ = new Subject<void>();
  constructor(public router: Router, private readonly storage: StorageService, private readonly route: ActivatedRoute, private readonly chartEventService: ChartEventService) {
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      this.sidebarVisible = mode !== 'designer';
    });
  }

  ngOnInit() {
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

   ngOnDestroy() {
    this.destroy$.next();      // 👈 emit on destroy
    this.destroy$.complete();  // 👈 cleanup
  }

  setDynamicThemeing() {
    if (this.projectData) {
      document.documentElement.style.setProperty('--main-container-bg', this.projectData.mainBackgroundColor || '#fff');
      document.documentElement.style.setProperty('--color-text', this.projectData.textColor || '#333');
      document.documentElement.style.setProperty('--button-bg', this.projectData.selectedColor || '#1976d2');
      document.documentElement.style.setProperty('--button-text', this.projectData.mainBackgroundColor || '#fff');
      document.documentElement.style.setProperty('--button-bg-hover', this.projectData.mainBackgroundColor || '#145a9e');
      document.documentElement.style.setProperty('--card-bg', this.projectData.mainBackgroundColor || '#fff');
      document.documentElement.style.setProperty('--card-text', this.projectData.mainBackgroundColor || '#333');
    }
  }


  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }




}
