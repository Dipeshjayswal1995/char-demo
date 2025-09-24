import { Component } from '@angular/core';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../@core/services/storage-service';
import { LOCAL_STORAGE_KEYS } from './../../../@core/utils/local-storage-key.utility';

@Component({
  selector: 'app-layout',
  imports: [Header, Sidebar, RouterOutlet, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  sidebarVisible = true;
  filesList = [];
  constructor(public router: Router, private readonly storage: StorageService, private readonly route: ActivatedRoute) {
    // this.filesList = JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.FILELIST));

    // this.route.queryParams.subscribe(params => {
    //   const mode = params['mode'];
    //   this.sidebarVisible = mode !== 'designer';
    // });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }




}
