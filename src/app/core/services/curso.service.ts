import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Curso } from '../models/curso.interface';
import { CURSOS_MOCK } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private cursosSubject = new BehaviorSubject<Curso[]>(CURSOS_MOCK);
  public cursos$ = this.cursosSubject.asObservable();

  constructor() {}

  getCursos(): Observable<Curso[]> {
    return this.cursos$;
  }

  getCursoById(id: number): Curso | undefined {
    return this.cursosSubject.value.find(curso => curso.id === id);
  }

  agregarCurso(curso: Omit<Curso, 'id'>): void {
    const cursos = this.cursosSubject.value;
    const nuevoId = Math.max(...cursos.map(c => c.id)) + 1;
    const nuevoCurso: Curso = {
      ...curso,
      id: nuevoId
    };
    this.cursosSubject.next([...cursos, nuevoCurso]);
  }

  actualizarCurso(id: number, cursoActualizado: Partial<Curso>): void {
    const cursos = this.cursosSubject.value;
    const index = cursos.findIndex(c => c.id === id);
    if (index !== -1) {
      cursos[index] = { ...cursos[index], ...cursoActualizado };
      this.cursosSubject.next([...cursos]);
    }
  }

  eliminarCurso(id: number): void {
    const cursos = this.cursosSubject.value;
    const cursosFiltrados = cursos.filter(c => c.id !== id);
    this.cursosSubject.next(cursosFiltrados);
  }
}
