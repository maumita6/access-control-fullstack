import { Routes } from '@angular/router';
import { RequestDashboardComponent } from './features/requests/request-dashboard/request-dashboard';
import { RequestDetailsComponent } from './features/requests/request-details/request-details';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'requests',
    pathMatch: 'full'
  },
  {
    path: 'requests',
    loadComponent: () => import('./features/requests/request-dashboard/request-dashboard')
      .then(m => m.RequestDashboardComponent)
  },
  {
    path: 'requests/:id',
    loadComponent: () => import('./features/requests/request-details/request-details')
      .then(m => m.RequestDetailsComponent)
  }
];

