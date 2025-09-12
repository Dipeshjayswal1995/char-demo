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
    // this.loadFileList();
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
