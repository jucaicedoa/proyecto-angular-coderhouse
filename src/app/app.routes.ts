import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { AlumnoFormComponent } from './components/alumno-form/alumno-form.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { CursoFormComponent } from './components/curso-form/curso-form.component';
import { InscripcionesComponent } from './components/inscripciones/inscripciones.component';
import { InscripcionFormComponent } from './components/inscripcion-form/inscripcion-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'alumnos', component: AlumnosComponent },
      { path: 'alumnos/nuevo', component: AlumnoFormComponent },
      { path: 'alumnos/editar/:id', component: AlumnoFormComponent },
      { path: 'cursos', component: CursosComponent },
      { path: 'cursos/nuevo', component: CursoFormComponent },
      { path: 'cursos/editar/:id', component: CursoFormComponent },
      { path: 'inscripciones', component: InscripcionesComponent },
      { path: 'inscripciones/nueva', component: InscripcionFormComponent },
      { path: 'inscripciones/editar/:id', component: InscripcionFormComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
