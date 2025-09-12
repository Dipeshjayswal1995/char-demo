import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StorageService } from '../../../../@core/services/storage-service';
import { LOCAL_STORAGE_KEYS } from './../../../../@core/utils/local-storage-key.utility';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, MatDialogModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
})
export class Header {
  @Output() sidebarToggle = new EventEmitter<void>();
  filesList = [];
  constructor(private readonly dialog: MatDialog, private readonly router: Router, private readonly storage: StorageService) {
    this.filesList = JSON.parse(storage.getPersistentItem(LOCAL_STORAGE_KEYS.FILELIST));
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

}
