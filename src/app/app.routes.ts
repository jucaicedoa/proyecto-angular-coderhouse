import { Routes } from '@angular/router';
import { LayoutComponent } from './features/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'alumnos',
        loadChildren: () => import('./features/alumnos/alumnos.routes').then(m => m.ALUMNOS_ROUTES)
      },
      {
        path: 'cursos',
        loadChildren: () => import('./features/cursos/cursos.routes').then(m => m.CURSOS_ROUTES)
      },
      {
        path: 'inscripciones',
        loadChildren: () => import('./features/inscripciones/inscripciones.routes').then(m => m.INSCRIPCIONES_ROUTES)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
