import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayout } from '@shared/components/app-layout/app-layout';
import { AppToast } from './shared/components/app-toast/app-toast';
import { ConfirmDialog } from './shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-root',
  imports: [AppLayout, AppToast, ConfirmDialog, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
