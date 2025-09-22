import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePannel } from './side-pannel';

describe('SidePannel', () => {
  let component: SidePannel;
  let fixture: ComponentFixture<SidePannel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidePannel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidePannel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
