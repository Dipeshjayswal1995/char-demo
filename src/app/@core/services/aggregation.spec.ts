import { TestBed } from '@angular/core/testing';

import { Aggregation } from './aggregation';

describe('Aggregation', () => {
  let service: Aggregation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Aggregation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
