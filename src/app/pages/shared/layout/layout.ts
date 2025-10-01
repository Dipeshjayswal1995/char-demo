import { Component } from '@angular/core';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../@core/services/storage-service';
import { LOCAL_STORAGE_KEYS } from './../../../@core/utils/local-storage-key.utility';
import { ChartEventService } from '../../../@core/services/chart-event-service';

@Component({
  selector: 'app-layout',
  imports: [Header, Sidebar, RouterOutlet, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  sidebarVisible = true;
  filesList = [];
  projectData: any = null;
  constructor(public router: Router, private readonly storage: StorageService, private readonly route: ActivatedRoute, private readonly chartEventService: ChartEventService) {
    // this.filesList = JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.FILELIST));
    this.projectData = this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION) ? JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION)) : null;
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      this.sidebarVisible = mode !== 'designer';
    });
    this.setDynamicThemeing();
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
