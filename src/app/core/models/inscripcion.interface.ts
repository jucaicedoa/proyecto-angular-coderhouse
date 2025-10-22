import { Alumno } from './alumno.interface';
import { Curso } from './curso.interface';

export interface Inscripcion {
  id: number;
  alumnoId: number;
  cursoId: number;
  fechaInscripcion: Date;
  estado: 'Activa' | 'Cancelada' | 'Completada';
  alumno?: Alumno;
  curso?: Curso;
}
