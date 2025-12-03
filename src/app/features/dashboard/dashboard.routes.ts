import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { adminGuard } from '../../core/guards/admin.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'alumnos',
        loadChildren: () => import('./alumnos/alumnos.routes').then(m => m.ALUMNOS_ROUTES)
      },
      {
        path: 'cursos',
        loadChildren: () => import('./cursos/cursos.routes').then(m => m.CURSOS_ROUTES)
      },
      {
        path: 'inscripciones',
        canActivate: [adminGuard],
        loadChildren: () => import('./inscripciones/inscripciones.routes').then(m => m.INSCRIPCIONES_ROUTES)
      }
    ]
  }
];
