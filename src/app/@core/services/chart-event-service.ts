import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LOCAL_STORAGE_KEYS } from '../utils/local-storage-key.utility';
import { StorageService } from './storage-service';

@Injectable({
  providedIn: 'root'
})
export class ChartEventService {
  createChartEventApi = new EventEmitter();
  changeTabEvent = new EventEmitter();
  createNewChatEvent = new EventEmitter();
  updateProjectConfig = new EventEmitter();
  private configSubject = new BehaviorSubject<any>(null);
  config$ = this.configSubject.asObservable();
  constructor(private readonly storage: StorageService) {

  }

  emitCreateChart(fileName: string) {
    this.createChartEventApi.emit(fileName);
  }

  changeTab(changeTab: any) {
    this.changeTabEvent.emit(changeTab);
  }

  createChart(createNew: any) {
    this.createNewChatEvent.emit(createNew);
  }

  projectConfigFire(createNew: any) {
    this.updateProjectConfig.emit(createNew);
  }

  setConfig(config: any) {
    this.storage.setPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION, JSON.stringify(config));
    this.configSubject.next(config);
  }

  loadConfigFromStorage() {
    const stored = this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION);
    const config = stored ? JSON.parse(stored) : null;

    if (config) {
      this.configSubject.next(config); // ✅ no second parse
    }
  }
}
