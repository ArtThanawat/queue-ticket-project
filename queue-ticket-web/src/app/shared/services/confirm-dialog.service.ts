import { Injectable, signal } from '@angular/core';

type ConfirmDialogSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

export interface ConfirmDialogOptions {
  readonly header?: string;
  readonly message: string;
  readonly acceptLabel?: string;
  readonly rejectLabel?: string;
  readonly acceptSeverity?: ConfirmDialogSeverity;
  readonly accept?: () => void;
  readonly reject?: () => void;
}

export interface ConfirmDialogState {
  readonly visible: boolean;
  readonly header: string;
  readonly message: string;
  readonly acceptLabel: string;
  readonly rejectLabel: string;
  readonly acceptSeverity: ConfirmDialogSeverity;
  readonly accept?: () => void;
  readonly reject?: () => void;
}

const defaultState: ConfirmDialogState = {
  visible: false,
  header: 'ยืนยันการทำรายการ',
  message: '',
  acceptLabel: 'ยืนยัน',
  rejectLabel: 'ยกเลิก',
  acceptSeverity: 'danger'
};

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  readonly state = signal<ConfirmDialogState>(defaultState);

  confirm(options: ConfirmDialogOptions): void {
    this.state.set({
      visible: true,
      header: options.header ?? defaultState.header,
      message: options.message,
      acceptLabel: options.acceptLabel ?? defaultState.acceptLabel,
      rejectLabel: options.rejectLabel ?? defaultState.rejectLabel,
      acceptSeverity: options.acceptSeverity ?? defaultState.acceptSeverity,
      accept: options.accept,
      reject: options.reject
    });
  }

  close(): void {
    this.state.update((state) => ({ ...state, visible: false }));
  }

  accept(): void {
    const accept = this.state().accept;
    this.close();
    accept?.();
  }

  reject(): void {
    const reject = this.state().reject;
    this.close();
    reject?.();
  }
}
