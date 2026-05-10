import { Routes } from '@angular/router';

export const queueRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'receive'
  },
  {
    path: 'receive',
    loadComponent: () =>
      import('./ticket-reception/ticket-reception').then(
        (m) => m.TicketReception
      )
  },
  {
    path: 'display',
    loadComponent: () =>
      import('./ticket-display/ticket-display').then((m) => m.TicketDisplay)
  },
  {
    path: 'reset',
    loadComponent: () =>
      import('./reset-queue/reset-queue').then((m) => m.ResetQueue)
  }
];
