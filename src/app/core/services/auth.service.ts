import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.interface';
import { USUARIOS_MOCK } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Verificar si hay un usuario logueado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): boolean {
    const usuario = USUARIOS_MOCK.find(u => u.email === email && u.password === password && u.activo);
    
    if (usuario) {
      this.currentUserSubject.next(usuario);
      localStorage.setItem('currentUser', JSON.stringify(usuario));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'Admin';
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
