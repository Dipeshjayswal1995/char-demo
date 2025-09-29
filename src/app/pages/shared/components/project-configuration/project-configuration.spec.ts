import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectConfiguration } from './project-configuration';

describe('ProjectConfiguration', () => {
  let component: ProjectConfiguration;
  let fixture: ComponentFixture<ProjectConfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectConfiguration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectConfiguration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
