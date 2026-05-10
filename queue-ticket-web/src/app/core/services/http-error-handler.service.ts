import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';

@Injectable({ providedIn: 'root' })
export class HttpErrorHandlerService {
  private readonly toastService = inject(ToastService);

  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          this.toastService.showError('ไม่สามารถเชื่อมต่อกับ Server ได้', 'กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
          break;
        case 401:
          this.toastService.showError('เซสชันหมดอายุ', 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
          // Logic for redirect to login could go here
          break;
        case 403:
          this.toastService.showError('ไม่มีสิทธิ์เข้าถึง', 'คุณไม่มีสิทธิ์ในการดำเนินการนี้');
          break;
        case 404:
          this.toastService.showError('ไม่พบข้อมูล', 'ไม่พบหน้าที่คุณต้องการ');
          break;
        case 500:
          this.toastService.showError('Server Error', 'เกิดข้อผิดพลาดที่ Server กรุณาลองใหม่อีกครั้ง');
          break;
        default:
          this.toastService.showError('เกิดข้อผิดพลาด', error.error?.message || 'กรุณาลองใหม่อีกครั้งในภายหลัง');
          break;
      }
    } else {
      this.toastService.showError('เกิดข้อผิดพลาดไม่ทราบสาเหตุ', 'กรุณาลองใหม่อีกครั้ง');
    }
  }
}
