import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '@core/services/app-config.service';
import { ApiResponse } from '@app/models/api-response.model';
import { QueueTicket } from '@app/models/queue-ticket.model';
import { HttpClientService } from '@core/services/http-client.service';

@Injectable({ providedIn: 'root' })
export class QueueTicketApiService {
  private readonly httpClient = inject(HttpClientService);
  private readonly appConfig = inject(AppConfigService);
  private readonly baseUrl = `${this.appConfig.apiUrl}/queue-tickets`;

  getCurrentTicket(): Observable<ApiResponse<QueueTicket>> {
    return this.httpClient.get<ApiResponse<QueueTicket>>(`${this.baseUrl}/current`, true);
  }

  createTicket(): Observable<ApiResponse<QueueTicket>> {
    return this.httpClient.post<ApiResponse<QueueTicket>>(this.baseUrl, {}, true);
  }

  resetQueue(): Observable<ApiResponse<QueueTicket>> {
    return this.httpClient.post<ApiResponse<QueueTicket>>(`${this.baseUrl}/reset`, {}, true);
  }
}
