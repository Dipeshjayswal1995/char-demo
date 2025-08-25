import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mapchart5 } from './mapchart5';

describe('Mapchart5', () => {
  let component: Mapchart5;
  let fixture: ComponentFixture<Mapchart5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapchart5]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mapchart5);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
