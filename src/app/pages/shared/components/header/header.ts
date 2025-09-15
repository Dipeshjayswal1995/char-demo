import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../../@core/services/storage-service';
import { LOCAL_STORAGE_KEYS } from './../../../../@core/utils/local-storage-key.utility';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, MatDialogModule, CommonModule, MatButtonToggleModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
})
export class Header {
  @Output() sidebarToggle = new EventEmitter<void>();
  filesList = [];
  isDesignerMode = false; // Default is viewer
  constructor(private readonly dialog: MatDialog, private readonly router: Router, private readonly storage: StorageService, private readonly route: ActivatedRoute,) {
    this.filesList = JSON.parse(storage.getPersistentItem(LOCAL_STORAGE_KEYS.FILELIST));

 this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      this.isDesignerMode = mode === 'designer';
    });
  }

  toggleMode(event: any): void {
    const selectedValue = event.value;

    // Update the mode based on selected toggle
    this.isDesignerMode = selectedValue === 'designer';

    // Update URL with new query param
    this.router.navigate([], {
      queryParams: { mode: this.isDesignerMode ? 'designer' : 'viewer' },
      queryParamsHandling: 'merge', // keep other params if present
    });
  }
  toggleSidebar() {
    this.sidebarToggle.emit();
  }

}
