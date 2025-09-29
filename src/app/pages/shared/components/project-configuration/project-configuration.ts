import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiServices } from '../../../../@core/services/api-services';
import { StorageService } from '../../../../@core/services/storage-service';
import { LOCAL_STORAGE_KEYS } from '../../../../@core/utils/local-storage-key.utility';

@Component({
  selector: 'app-project-configuration',
  imports: [ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    MatToolbarModule],
  templateUrl: './project-configuration.html',
  styleUrl: './project-configuration.scss'
})
export class ProjectConfiguration implements OnInit {

  projectForm: FormGroup;
  logoPreview: string | null = null;
  projectData: any;
  constructor(private readonly fb: FormBuilder, public dialogRef: MatDialogRef<ProjectConfiguration>,
    @Inject(MAT_DIALOG_DATA) public modalData: any, private readonly apiServices: ApiServices, private readonly storage: StorageService) {
    this.projectData = this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION) ? JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION)) : null;
    console.log("Project Data:", this.projectData);
    this.projectForm = this.fb.group({
      projectName: [this.projectData.projectName ? this.projectData.projectName : '' , Validators.required],
      sidebarColor: ['#1976d2', Validators.required],
      mainBackgroundColor: ['#ffffff', Validators.required],
      textColour: ['#f5f5f5', Validators.required],
      projectLogo: [null, Validators.required],
      chartBackgroundColor: ['#ffffff', Validators.required],
      selectedColor: ['#1976d2', Validators.required],
      tilesColor: ['#e0e0e0', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  getProjectData() {
    this.apiServices.getConfig().subscribe({
      next: (res: any) => {
        if (!res?.status) {
          console.error("API Error:", res?.message || "Unknown error");
          return;
        }
        const data = res.data;
        console.log("Fetched file data:", data);
      },
      error: (err) => {
        console.error("HTTP Error:", err);
      },
      complete: () => {
        console.log("Request completed.");
      }
    });
  }

  onLogoChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string; // base64 string
        this.projectForm.patchValue({ projectLogo: this.logoPreview });
        // this.logoPreview = this.logoBase64;
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo() {
    this.logoPreview = null;
  }

  onSubmit() {
    if (this.projectForm.valid) {
      console.log('Project Configuration:', this.projectForm.value);
      // Here you can call API to save settings
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

}
