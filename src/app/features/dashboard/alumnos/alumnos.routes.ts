import { Routes } from '@angular/router';
import { AlumnosComponent } from './alumnos.component';
import { AlumnoFormComponent } from './alumno-form.component';

export const ALUMNOS_ROUTES: Routes = [
  { path: '', component: AlumnosComponent },
  { path: 'nuevo', component: AlumnoFormComponent },
  { path: 'editar/:id', component: AlumnoFormComponent }
];
