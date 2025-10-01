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
import { NotificationMassageService } from '../../../../@core/services/notification-massage-service';

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
  projectData: any;
  constructor(private readonly fb: FormBuilder, public dialogRef: MatDialogRef<ProjectConfiguration>,
    @Inject(MAT_DIALOG_DATA) public modalData: any, private readonly apiServices: ApiServices, private readonly storage: StorageService, private readonly notifyService: NotificationMassageService) {
    this.projectData = this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION) ? JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION)) : null;
    console.log("Project Data:", this.projectData);
    this.projectForm = this.fb.group({
      projectName: [this.projectData.projectName ? this.projectData.projectName : '', Validators.required],
      sidebarColor: [this.projectData.sidebarColor ? this.projectData.sidebarColor : '', Validators.required],
      mainBackgroundColor: [this.projectData.mainBackgroundColor ? this.projectData.mainBackgroundColor : '', Validators.required],
      textColor: [this.projectData.textColor ? this.projectData.textColor : '', Validators.required],
      projectLogo: [this.projectData.projectLogo ? this.projectData.projectLogo : '', Validators.required],
      chartBackgroundColor: [this.projectData.chartBackgroundColor ? this.projectData.chartBackgroundColor : '', Validators.required],
      selectedColor: [this.projectData.selectedColor ? this.projectData.selectedColor : '', Validators.required],
      // tilesColor: [this.projectData.tilesColor ? this.projectData.tilesColor : '', Validators.required],
    });
    console.log(this.projectForm.value.projectLogo)
    this.setDynamicThemeing();
  }

  ngOnInit(): void {
  }

  setDynamicThemeing() {
    if (this.projectData) {
      document.documentElement.style.setProperty('--header-bg', this.projectData.mainBackgroundColor || '#fff');
      document.documentElement.style.setProperty('--color-text', this.projectData.textColor || '#333');
      document.documentElement.style.setProperty('--button-bg', this.projectData.selectedColor || '#1976d2');
      document.documentElement.style.setProperty('--chart-background', this.projectData.chartBackgroundColor || '#fff');
      document.documentElement.style.setProperty('--button-bg-hover', this.projectData.mainBackgroundColor || '#145a9e');
      document.documentElement.style.setProperty('--card-bg', this.projectData.mainBackgroundColor || '#fff');
      document.documentElement.style.setProperty('--card-text', this.projectData.mainBackgroundColor || '#333');
    }
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
        const logoPreview = reader.result as string; // base64 string
        this.projectForm.patchValue({ projectLogo: logoPreview });
        // this.logoPreview = this.logoBase64;
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo() {
    this.projectForm.value.projectLogo = null;
  }

  onSubmit() {
    if (this.projectForm.valid) {
      console.log('Project Configuration:', this.projectForm.value);
      // Here you can call API to save settings
      this.updateProjectFiles();
    }
  }

  updateProjectFiles() {
    this.apiServices.saveConfig({
      id: this.projectData.id,
      ...this.projectForm.value
    }).subscribe({
      next: (res: any) => {
        if (!res?.success) {
          console.error("API Error:", res?.message || "Unknown error");
          return;
        }
        if (res.config) {
          this.storage.setPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION, JSON.stringify(res.config));
          this.notifyService.success(res.message, 'success');
          this.dialogRef.close(true);
        }
      },
      error: (err) => {
        console.error("HTTP Error:", err);
      },
      complete: () => {
        console.log("Request completed.");
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

}
