import { TestBed } from '@angular/core/testing';

import { ChartServices } from './chart-services';

describe('ChartServices', () => {
  let service: ChartServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
