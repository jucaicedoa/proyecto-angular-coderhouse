import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Inscripcion } from '../models/inscripcion.interface';
import { INSCRIPCIONES_MOCK } from '../data/mock-data';
import { Alumno } from '../models/alumno.interface';
import { Curso } from '../models/curso.interface';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private inscripcionesSubject = new BehaviorSubject<Inscripcion[]>(INSCRIPCIONES_MOCK);
  public inscripciones$ = this.inscripcionesSubject.asObservable();

  constructor() {}

  getInscripciones(): Observable<Inscripcion[]> {
    return this.inscripciones$;
  }

  getInscripcionById(id: number): Inscripcion | undefined {
    return this.inscripcionesSubject.value.find(inscripcion => inscripcion.id === id);
  }

  agregarInscripcion(inscripcion: Omit<Inscripcion, 'id' | 'fechaInscripcion'>): void {
    const inscripciones = this.inscripcionesSubject.value;
    const nuevoId = Math.max(...inscripciones.map(i => i.id)) + 1;
    const nuevaInscripcion: Inscripcion = {
      ...inscripcion,
      id: nuevoId,
      fechaInscripcion: new Date()
    };
    this.inscripcionesSubject.next([...inscripciones, nuevaInscripcion]);
  }

  actualizarInscripcion(id: number, inscripcionActualizada: Partial<Inscripcion>): void {
    const inscripciones = this.inscripcionesSubject.value;
    const index = inscripciones.findIndex(i => i.id === id);
    if (index !== -1) {
      inscripciones[index] = { ...inscripciones[index], ...inscripcionActualizada };
      this.inscripcionesSubject.next([...inscripciones]);
    }
  }

  eliminarInscripcion(id: number): void {
    const inscripciones = this.inscripcionesSubject.value;
    const inscripcionesFiltradas = inscripciones.filter(i => i.id !== id);
    this.inscripcionesSubject.next(inscripcionesFiltradas);
  }

  getInscripcionesConDetalles(): Observable<(Inscripcion & { alumno?: Alumno; curso?: Curso })[]> {
    return new Observable(observer => {
      this.inscripciones$.subscribe(inscripciones => {
        observer.next(inscripciones);
      });
    });
  }
}
