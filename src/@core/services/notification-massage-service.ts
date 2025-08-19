import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class NotificationMassageService {

  constructor(private readonly toastr: ToastrService) { }

  success(message: string, title?: string, options?: Partial<any>): void {
    this.toastr.success(message, title, options);
  }

  error(message: string, title?: string, options?: Partial<any>): void {
    this.toastr.error(message, title, options);
  }

  warning(message: string, title?: string, options?: Partial<any>): void {
    this.toastr.warning(message, title, options);
  }

  info(message: string, title?: string, options?: Partial<any>): void {
    this.toastr.info(message, title, options);
  }

  show(message: string, title?: string, options?: Partial<any>): void {
    this.toastr.show(message, title, options);
  }

  clear(): void {
    this.toastr.clear();
  }

  remove(toastId: number): void {
    this.toastr.remove(toastId);
  }
}
