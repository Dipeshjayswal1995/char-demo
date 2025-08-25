import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiServices } from '../../../../../@core/services/api-services';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule, MatSidenavModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  standalone: true,
})
export class Sidebar {
  files: { name: string; createdAt?: string }[] = [];
  constructor(public router: Router, private readonly apiServices: ApiServices) { }

  ngOnInit() {
    this.loadFileList();
  }

  getCleanFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9-]/g, '-');
  }

  loadFileList() {
    this.apiServices.getFiles().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.files = res.data;
          console.log('Files:', res.data);
        } else {
          this.files = [];
          console.error('API Error:', res.message);
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
      },
      complete: () => {
        console.log('Request completed.');
      }
    });
  }

  sanitizeFileName(fileName: string) {
    return encodeURIComponent(fileName.replace(/\s+/g, '_')); // Replace spaces with underscores
  }


  createNewChart() {

  }


}
