import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../@core/services/storage-service';
import { LOCAL_STORAGE_KEYS } from '../../../../@core/utils/local-storage-key.utility';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: 'primary' | 'accent' | 'warn' | '';
  cancelButtonColor?: 'primary' | 'accent' | 'warn' | '';
  icon?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatButtonModule, MatIconModule, CommonModule,MatDialogModule],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss'
})
export class ConfirmationDialog {
  projectData: any = null;
  constructor(public dialogRef: MatDialogRef<ConfirmationDialog>,@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData, private readonly storage: StorageService) {
    this.projectData = this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION) ? JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION)) : null;

  }

  setDynamicThemeing() {
    if (this.projectData) {
      document.documentElement.style.setProperty('--sidebar-bg', this.projectData.sidebarColor);
      document.documentElement.style.setProperty('--text-color', this.projectData.textColor);
      document.documentElement.style.setProperty('--button-bg', this.projectData.selectedColor || '#1976d2');
    }
  }


  onConfirm(): void {
    this.dialogRef.close(true); // User confirmed
  }

  onCancel(): void {
    this.dialogRef.close(false); // User cancelled
  }
}
