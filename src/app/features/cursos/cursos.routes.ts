import { Routes } from '@angular/router';
import { CursosComponent } from './cursos.component';
import { CursoFormComponent } from './curso-form.component';

export const CURSOS_ROUTES: Routes = [
  { path: '', component: CursosComponent },
  { path: 'nuevo', component: CursoFormComponent },
  { path: 'editar/:id', component: CursoFormComponent }
];


