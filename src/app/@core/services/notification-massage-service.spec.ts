import { TestBed } from '@angular/core/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { NotificationMassageService } from './notification-massage-service';

describe('NotificationMassageService', () => {
  let service: NotificationMassageService;
  let toastrSpy: jasmine.SpyObj<ToastrService>;


  beforeEach(() => {
    const spy = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
      'warning',
      'info',
      'show',
      'clear',
      'remove'
    ]);
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot()
      ],
      providers: [
        NotificationMassageService,
        { provide: ToastrService, useValue: spy }
      ]
    });
    service = TestBed.inject(NotificationMassageService);
    toastrSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('1) should be created', () => {
    expect(service).toBeTruthy();
  });

  it('2) should call toastr.success', () => {
    service.success('Success message', 'Success title');
    expect(toastrSpy.success).toHaveBeenCalledWith('Success message', 'Success title', undefined);
  });

  it('3) should call toastr.error', () => {
    service.error('Error message', 'Error title');
    expect(toastrSpy.error).toHaveBeenCalledWith('Error message', 'Error title', undefined);
  });

  it('4) should call toastr.warning', () => {
    service.warning('Warning message', 'Warning title');
    expect(toastrSpy.warning).toHaveBeenCalledWith('Warning message', 'Warning title', undefined);
  });

  it('5) should call toastr.info', () => {
    service.info('Info message', 'Info title');
    expect(toastrSpy.info).toHaveBeenCalledWith('Info message', 'Info title', undefined);
  });

  it('6) should call toastr.show', () => {
    service.show('Show message', 'Show title');
    expect(toastrSpy.show).toHaveBeenCalledWith('Show message', 'Show title', undefined);
  });

  it('7) should call toastr.clear', () => {
    service.clear();
    expect(toastrSpy.clear).toHaveBeenCalled();
  });

  it('8) should call toastr.remove', () => {
    service.remove(123);
    expect(toastrSpy.remove).toHaveBeenCalledWith(123);
  });

  it('9) should call methods with custom options', () => {
    const options = { timeOut: 1000 };
    service.success('msg', 'title', options);
    service.error('msg', 'title', options);
    service.warning('msg', 'title', options);
    service.info('msg', 'title', options);
    service.show('msg', 'title', options);

    expect(toastrSpy.success).toHaveBeenCalledWith('msg', 'title', options);
    expect(toastrSpy.error).toHaveBeenCalledWith('msg', 'title', options);
    expect(toastrSpy.warning).toHaveBeenCalledWith('msg', 'title', options);
    expect(toastrSpy.info).toHaveBeenCalledWith('msg', 'title', options);
    expect(toastrSpy.show).toHaveBeenCalledWith('msg', 'title', options);
  })

});
