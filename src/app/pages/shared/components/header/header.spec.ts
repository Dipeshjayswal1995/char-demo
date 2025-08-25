import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Header } from './header';
import { WebServices } from '../../../@core/services/web-services';
import { NotificationMassageService } from '../../../@core/services/notification-massage-service';
import { ToastrModule } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../../../@core/interceptors/auth-interceptor';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockNotifyService: jasmine.SpyObj<NotificationMassageService>;
  let mockRouter: jasmine.SpyObj<Router>;


  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockNotifyService = jasmine.createSpyObj('NotificationMassageService', ['success']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);


    await TestBed.configureTestingModule({
      imports: [
        Header,
        ToastrModule.forRoot(),
        MatDialogModule,
        OverlayModule
      ],
      providers: [
        WebServices,
        NotificationMassageService,
        provideAnimations(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideRouter([]),
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: NotificationMassageService, useValue: mockNotifyService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1) should create', () => {
    expect(component).toBeTruthy();
  });

  it('2) should emit sidebarToggle event on toggleSidebar()', () => {
    spyOn(component.sidebarToggle, 'emit');
    component.toggleSidebar();
    expect(component.sidebarToggle.emit).toHaveBeenCalled();
  });

  it('3) should clear storage, navigate and show notification on logout confirm', fakeAsync(() => {
    spyOn(component['dialog'], 'open').and.returnValue({
      afterClosed: () => of(true)
    } as any);
    spyOn(localStorage, 'clear');
    component.onLogout();
    tick();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(mockNotifyService.success).toHaveBeenCalledWith('Logout Sucessfully...!!');
  }));




});
