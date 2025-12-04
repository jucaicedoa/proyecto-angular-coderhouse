import { createAction, props } from '@ngrx/store';
import { Usuario } from '../../core/models/usuario.interface';

export const setUsuario = createAction(
  '[Login Component] Set Usuario',
  props<{ usuario: Usuario }>()
);
