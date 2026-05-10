import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, map } from 'rxjs';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { QueueFrame } from '../queue-frame/queue-frame';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { ToastService } from '../../../shared/services/toast.service';
import { QueueTicketApiService } from '../../../services/queue-ticket-api.service';
import { HttpErrorHandlerService } from '@core/services/http-error-handler.service';
import { QueueTicket } from '@app/models/queue-ticket.model';

@Component({
  selector: 'app-reset-queue',
  imports: [ButtonModule, QueueFrame],
  templateUrl: './reset-queue.html'
})
export class ResetQueue implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly toastService = inject(ToastService);
  private readonly queueTicketApiService = inject(QueueTicketApiService);
  private readonly httpErrorHandler = inject(HttpErrorHandlerService);

  readonly ticket = signal<QueueTicket | null>(null);
  readonly loading = signal(false);

  ngOnInit(){
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

  confirmResetQueue(){
    this.confirmDialogService.confirm({
      header: 'ยืนยันการล้างคิว',
      message: `ต้องการล้างคิวปัจจุบัน (${this.ticket()?.queueNumber ?? '-'}) และเริ่มใหม่ที่ A0 ใช่ไหม?`,
      acceptLabel: 'ล้างคิว',
      rejectLabel: 'ยกเลิก',
      acceptSeverity: 'danger',
      accept: () => this.resetQueue()
    });
  }

  private resetQueue(){
    this.loading.set(true);
    this.queueTicketApiService
      .resetQueue()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
        map(res => res.data)
      )
      .subscribe({
        next: (ticket) => {
          this.ticket.set(ticket);
          this.toastService.showSuccess('ล้างคิวสำเร็จ', `หมายเลขคิวปัจจุบัน ${ticket.queueNumber}`);
        },
        error: (err) => this.httpErrorHandler.handleError(err)
      });
  }

  goToReception(){
    this.router.navigate(['/queue/receive']);
  }
}
