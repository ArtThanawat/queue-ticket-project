import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, map } from 'rxjs';
import { Router } from '@angular/router';
import { ThaiDateTimePipe } from '@shared/pipes/thai-date-time.pipe';
import { ButtonModule } from 'primeng/button';
import { QueueFrame } from '../queue-frame/queue-frame';
import { QueueTicketApiService } from '../../../services/queue-ticket-api.service';
import { HttpErrorHandlerService } from '@core/services/http-error-handler.service';
import { QueueTicket } from '@app/models/queue-ticket.model';

@Component({
  selector: 'app-ticket-display',
  imports: [ButtonModule, QueueFrame, ThaiDateTimePipe],
  templateUrl: './ticket-display.html'
})
export class TicketDisplay implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly queueTicketApiService = inject(QueueTicketApiService);
  private readonly httpErrorHandler = inject(HttpErrorHandlerService);

  readonly ticket = signal<QueueTicket | null>(null);
  readonly loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    this.queueTicketApiService
      .getCurrentTicket()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
        map(res => res.data)
      )
      .subscribe({
        next: (ticket) => this.ticket.set(ticket),
        error: (err) => this.httpErrorHandler.handleError(err)
      });
  }

  goToReception() {
    this.router.navigate(['/queue/receive']);
  }
}
