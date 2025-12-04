import { createReducer, on } from '@ngrx/store';
import { setUsuario } from './auth.actions';
import { Usuario } from '../../core/models/usuario.interface';

export interface AuthState {
  user: Usuario | null;
}

export const initialState: AuthState = {
  user: null
};

export const authReducer = createReducer(
  initialState,
  on(setUsuario, (state, { usuario }) => ({
    ...state,
    user: usuario
  }))
);
