import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout } from './layout';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';


describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Layout,
        ToastrModule.forRoot(),
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1) should create', () => {
    expect(component).toBeTruthy();
  });
  it('2) should toggle sidebarVisible from false to true', () => {
    component.sidebarVisible = false;
    component.toggleSidebar();
    expect(component.sidebarVisible).toBeTrue();
  });

  it('3) should toggle sidebarVisible from true to false', () => {
    component.sidebarVisible = true;
    component.toggleSidebar();
    expect(component.sidebarVisible).toBeFalse();
  });
});
