import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-create-page',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,
    MatDialogContent,
    MatDialogActions,CommonModule,
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './create-page.html',
  styleUrl: './create-page.scss'
})
export class CreatePage {
  fileName = '';
  reportForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<CreatePage>, @Inject(MAT_DIALOG_DATA) public modalData: any, private readonly fb: FormBuilder,) {
    console.log('modalData', this.modalData);
    this.reportForm = this.fb.group({
      fileName: [
        this.modalData? this.modalData : '',
        [Validators.required, Validators.maxLength(30), this.noWhitespaceValidator],
      ],
    });
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