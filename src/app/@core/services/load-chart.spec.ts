import { TestBed } from '@angular/core/testing';

import { LoadChart } from './load-chart';

describe('LoadChart', () => {
  let service: LoadChart;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadChart);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
