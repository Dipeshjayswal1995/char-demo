import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { ApiServices } from './@core/services/api-services';
import { LOCAL_STORAGE_KEYS } from './@core/utils/local-storage-key.utility';
import { StorageService } from './@core/services/storage-service';
import { ChartEventService } from './@core/services/chart-event-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'chart-dashboard';
  constructor(private readonly apiServices: ApiServices, private readonly storage: StorageService, private readonly chartEventService: ChartEventService) {

  }

  ngOnInit() {
    this.loadConfig();
  }

  loadConfig() {
    this.apiServices.getConfig().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.storage.setPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION, JSON.stringify(res.config));
          console.log(res.config);
        }
      },
      error: (err) => {
        console.error("Error loading config", err);

      }
    });
  }

  saveConfig() {
    this.apiServices.saveConfig({ "manoj": "jayswal" }).subscribe({
      next: (res) => {
        console.log("Config saved:", res);
        alert("✅ Config saved successfully!");
      },
      error: (err) => {
        console.error("Error saving config", err);
      }
    });
  }



  loadFileList() {
    this.apiServices.getFiles().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.storage.setPersistentItem(LOCAL_STORAGE_KEYS.FILELIST, JSON.stringify(res.data));
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
      }
    });
  }

}
