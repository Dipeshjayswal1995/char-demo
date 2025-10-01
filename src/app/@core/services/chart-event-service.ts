import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartEventService {
  createChartEventApi = new EventEmitter();
  changeTabEvent = new EventEmitter();
  createNewChatEvent = new EventEmitter();
  updateProjectConfig = new EventEmitter();

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
}
