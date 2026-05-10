import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'queue/receive'
  },
  {
    path: 'queue',
    loadChildren: () => import('@features/queue/queue.routes').then((m) => m.queueRoutes)
  },
  {
    path: '**',
    redirectTo: 'queue/receive'
  }
];
