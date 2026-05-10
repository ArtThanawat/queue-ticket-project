import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  imports: [ButtonModule, DialogModule],
  templateUrl: './confirm-dialog.html'
})
export class ConfirmDialog {
  private readonly confirmDialogService = inject(ConfirmDialogService);

  readonly state = this.confirmDialogService.state;

  onReject(): void {
    this.confirmDialogService.reject();
  }

  onAccept(): void {
    this.confirmDialogService.accept();
  }

  onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.confirmDialogService.close();
    }
  }
}
