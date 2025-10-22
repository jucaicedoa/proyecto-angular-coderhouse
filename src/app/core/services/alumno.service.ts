import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alumno } from '../models/alumno.interface';
import { ALUMNOS_MOCK } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private alumnosSubject = new BehaviorSubject<Alumno[]>(ALUMNOS_MOCK);
  public alumnos$ = this.alumnosSubject.asObservable();

  constructor() {}

  getAlumnos(): Observable<Alumno[]> {
    return this.alumnos$;
  }

  getAlumnoById(id: number): Alumno | undefined {
    return this.alumnosSubject.value.find(alumno => alumno.id === id);
  }

  agregarAlumno(alumno: Omit<Alumno, 'id' | 'fechaCreacion'>): void {
    const alumnos = this.alumnosSubject.value;
    const nuevoId = Math.max(...alumnos.map(a => a.id)) + 1;
    const nuevoAlumno: Alumno = {
      ...alumno,
      id: nuevoId,
      fechaCreacion: new Date()
    };
    this.alumnosSubject.next([...alumnos, nuevoAlumno]);
  }

  actualizarAlumno(id: number, alumnoActualizado: Partial<Alumno>): void {
    const alumnos = this.alumnosSubject.value;
    const index = alumnos.findIndex(a => a.id === id);
    if (index !== -1) {
      alumnos[index] = { ...alumnos[index], ...alumnoActualizado };
      this.alumnosSubject.next([...alumnos]);
    }
  }

  eliminarAlumno(id: number): void {
    const alumnos = this.alumnosSubject.value;
    const alumnosFiltrados = alumnos.filter(a => a.id !== id);
    this.alumnosSubject.next(alumnosFiltrados);
  }
}
