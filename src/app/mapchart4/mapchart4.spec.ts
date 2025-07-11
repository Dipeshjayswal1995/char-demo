import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mapchart4 } from './mapchart4';

describe('Mapchart4', () => {
  let component: Mapchart4;
  let fixture: ComponentFixture<Mapchart4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapchart4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mapchart4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
