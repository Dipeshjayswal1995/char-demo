import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mapchart2 } from './mapchart2';

describe('Mapchart2', () => {
  let component: Mapchart2;
  let fixture: ComponentFixture<Mapchart2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapchart2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mapchart2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
