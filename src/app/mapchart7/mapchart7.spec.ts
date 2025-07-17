import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mapchart7 } from './mapchart7';

describe('Mapchart7', () => {
  let component: Mapchart7;
  let fixture: ComponentFixture<Mapchart7>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapchart7]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mapchart7);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
