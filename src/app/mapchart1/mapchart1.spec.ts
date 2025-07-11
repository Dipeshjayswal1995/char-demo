import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mapchart1 } from './mapchart1';

describe('Mapchart1', () => {
  let component: Mapchart1;
  let fixture: ComponentFixture<Mapchart1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapchart1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mapchart1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
