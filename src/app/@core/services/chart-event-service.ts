import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartEventService {
  createChartEvent = new EventEmitter();
  changeTabEvent = new EventEmitter();

  emitCreateChart(createChart: boolean) {
    this.createChartEvent.emit(createChart);
  }

  changeTab(changeTab: any) {
    this.changeTabEvent.emit(changeTab);
  }
}
