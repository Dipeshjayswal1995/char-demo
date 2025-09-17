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

  constructor(private readonly dialog: MatDialog, private readonly router: Router, private readonly storage: StorageService, private readonly route: ActivatedRoute,) {
    this.filesList = JSON.parse(storage.getPersistentItem(LOCAL_STORAGE_KEYS.FILELIST));

    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      this.isViewCharts = mode !== 'designer';
    });
  }

  toggleView(event: any): void {
    // this.isViewCharts = !event.checked; // event.checked = true → designer mode
    // this.router.navigate(['map3'], {
    //   queryParams: { mode: this.isViewCharts ? 'viewer' : 'designer' },
    //   queryParamsHandling: 'merge'
    // });

    this.isViewCharts = !event.checked;
    const mode = this.isViewCharts ? 'viewer' : 'designer';
    this.router.navigate(['map3'], {
      queryParams: { mode },
      queryParamsHandling: 'merge'
    }).then(() => {
      // window.location.reload(); // full browser reload
    });
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

}
