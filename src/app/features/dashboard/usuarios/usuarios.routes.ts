import { Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios.component';
import { UsuarioFormComponent } from './usuario-form.component';

export const USUARIOS_ROUTES: Routes = [
  { path: '', component: UsuariosComponent },
  { path: 'nuevo', component: UsuarioFormComponent },
  { path: 'editar/:id', component: UsuarioFormComponent }
];
