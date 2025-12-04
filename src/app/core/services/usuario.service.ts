import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.interface';
import { USUARIOS_MOCK } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuariosSubject = new BehaviorSubject<Usuario[]>(USUARIOS_MOCK);
  public usuarios$ = this.usuariosSubject.asObservable();

  constructor() {}

  getUsuarios(): Observable<Usuario[]> {
    return this.usuarios$;
  }

  getUsuarioById(id: number): Usuario | undefined {
    return this.usuariosSubject.value.find(usuario => usuario.id === id);
  }

  agregarUsuario(usuario: Omit<Usuario, 'id' | 'fechaCreacion'>): void {
    const usuarios = this.usuariosSubject.value;
    const nuevoId = Math.max(...usuarios.map(u => u.id)) + 1;
    const nuevoUsuario: Usuario = {
      ...usuario,
      id: nuevoId,
      fechaCreacion: new Date()
    };
    this.usuariosSubject.next([...usuarios, nuevoUsuario]);
  }

  actualizarUsuario(id: number, usuarioActualizado: Partial<Usuario>): void {
    const usuarios = this.usuariosSubject.value;
    const index = usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      usuarios[index] = { ...usuarios[index], ...usuarioActualizado };
      this.usuariosSubject.next([...usuarios]);
    }
  }

  eliminarUsuario(id: number): void {
    const usuarios = this.usuariosSubject.value;
    const usuariosFiltrados = usuarios.filter(u => u.id !== id);
    this.usuariosSubject.next(usuariosFiltrados);
  }
}
