import { Routes } from '@angular/router';
import { InscripcionesComponent } from './inscripciones.component';
import { InscripcionFormComponent } from './inscripcion-form.component';

export const INSCRIPCIONES_ROUTES: Routes = [
  { path: '', component: InscripcionesComponent },
  { path: 'nueva', component: InscripcionFormComponent },
  { path: 'editar/:id', component: InscripcionFormComponent }
];


