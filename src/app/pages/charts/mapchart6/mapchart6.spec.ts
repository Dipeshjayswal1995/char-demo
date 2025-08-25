import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mapchart6 } from './mapchart6';

describe('Mapchart6', () => {
  let component: Mapchart6;
  let fixture: ComponentFixture<Mapchart6>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapchart6]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mapchart6);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
