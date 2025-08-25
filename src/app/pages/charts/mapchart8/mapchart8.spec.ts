import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mapchart8 } from './mapchart8';

describe('Mapchart8', () => {
  let component: Mapchart8;
  let fixture: ComponentFixture<Mapchart8>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapchart8]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mapchart8);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
