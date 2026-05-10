import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { QueueFrame } from '../queue-frame/queue-frame';
import { QueueTicketApiService } from '../../../services/queue-ticket-api.service';
import { HttpErrorHandlerService } from '@core/services/http-error-handler.service';

@Component({
  selector: 'app-ticket-reception',
  imports: [ButtonModule, QueueFrame],
  templateUrl: './ticket-reception.html'
})
export class TicketReception {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly queueTicketApiService = inject(QueueTicketApiService);
  private readonly httpErrorHandler = inject(HttpErrorHandlerService);

  readonly loading = signal(false);

  createTicket() {
    this.loading.set(true);
    this.queueTicketApiService
      .createTicket()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: () => this.router.navigate(['/queue/display']),
        error: (err) => this.httpErrorHandler.handleError(err)
      });
  }

  goToResetQueue() {
    this.router.navigate(['/queue/reset']);
  }
}
