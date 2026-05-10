import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpClientService {
  private readonly http = inject(HttpClient);

  private getOptions(anonymous: boolean = false) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    if (anonymous) {
      headers = headers.set('Anonymous', 'true');
    }

    return {
      headers,
    };
  }

  get<T>(url: string, anonymous: boolean = false): Observable<T> {
    return this.http.get<T>(url, this.getOptions(anonymous));
  }

  post<T>(url: string, data: any, anonymous: boolean = false): Observable<T> {
    return this.http.post<T>(url, data, this.getOptions(anonymous));
  }

  put<T>(url: string, data: any, anonymous: boolean = false): Observable<T> {
    return this.http.put<T>(url, data, this.getOptions(anonymous));
  }

  delete<T>(url: string, anonymous: boolean = false): Observable<T> {
    return this.http.delete<T>(url, this.getOptions(anonymous));
  }
}
