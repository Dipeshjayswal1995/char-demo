import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mapchart } from './mapchart';

describe('Mapchart', () => {
  let component: Mapchart;
  let fixture: ComponentFixture<Mapchart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapchart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mapchart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
