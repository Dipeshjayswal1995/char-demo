import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

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
  constructor(public dialogRef: MatDialogRef<ConfirmationDialog>,@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) { }

  onConfirm(): void {
    this.dialogRef.close(true); // User confirmed
  }

  onCancel(): void {
    this.dialogRef.close(false); // User cancelled
  }
}
