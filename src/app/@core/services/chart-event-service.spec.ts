import { TestBed } from '@angular/core/testing';

import { ChartEventService } from './chart-event-service';

describe('ChartEventService', () => {
  let service: ChartEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
