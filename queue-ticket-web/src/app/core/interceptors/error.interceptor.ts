import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SessionStorageService } from '../services/session-storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const sessionStorage = inject(SessionStorageService);

  return next(req).pipe(
    retry(2),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        sessionStorage.clear();
        void router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
