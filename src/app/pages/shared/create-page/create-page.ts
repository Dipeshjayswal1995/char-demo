import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LOCAL_STORAGE_KEYS } from '../../../@core/utils/local-storage-key.utility';
import { StorageService } from '../../../@core/services/storage-service';
@Component({
  selector: 'app-create-page',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,
    MatDialogContent,
    MatDialogActions, CommonModule,
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './create-page.html',
  styleUrl: './create-page.scss'
})
export class CreatePage {
  fileName = '';
  reportForm: FormGroup;
  projectData: any = null;
  constructor(public dialogRef: MatDialogRef<CreatePage>, @Inject(MAT_DIALOG_DATA) public modalData: any, private readonly fb: FormBuilder,private readonly storage: StorageService) {
    console.log('modalData', this.modalData);
    this.projectData = this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION) ? JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION)) : null;
    this.reportForm = this.fb.group({
      fileName: [
        this.modalData ? this.modalData : '',
        [Validators.required, Validators.maxLength(30), this.noWhitespaceValidator],
      ],
    });
  }

  setDynamicThemeing() {
    if (this.projectData) {
      document.documentElement.style.setProperty('--sidebar-bg', this.projectData.sidebarColor);
      document.documentElement.style.setProperty('--text-color', this.projectData.textColor);
      document.documentElement.style.setProperty('--active-link-bg', this.projectData.selectedColor);
    }
  }


  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }
  cancel() {
    this.dialogRef.close();
  }
  onNoClick() {
  }
  selectName() {
    if (this.reportForm.valid) {
      const trimmedName = this.reportForm.value.fileName.trim();
      this.dialogRef.close(trimmedName);
    }
  }
}
