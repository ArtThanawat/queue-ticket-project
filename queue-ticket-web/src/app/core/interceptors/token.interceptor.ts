import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionStorageService } from '../services/session-storage.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionStorage = inject(SessionStorageService);
  const isAnonymous = req.headers.get('Anonymous') === 'true';

  if (isAnonymous) {
    const newHeaders = req.headers.delete('Anonymous');
    const authReq = req.clone({ headers: newHeaders });
    return next(authReq);
  }

  const token = sessionStorage.getAccessToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
