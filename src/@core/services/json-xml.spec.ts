import { TestBed } from '@angular/core/testing';

import { JsonXml } from './json-xml';

describe('JsonXml', () => {
  let service: JsonXml;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonXml);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
