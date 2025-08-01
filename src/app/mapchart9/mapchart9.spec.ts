import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mapchart9 } from './mapchart9';

describe('Mapchart9', () => {
  let component: Mapchart9;
  let fixture: ComponentFixture<Mapchart9>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapchart9]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mapchart9);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
