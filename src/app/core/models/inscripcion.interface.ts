import { Alumno } from './alumno.interface';
import { Curso } from './curso.interface';

export interface Inscripcion {
  id: number;
  alumnoId: number;
  cursoId: number;
  usuarioId: number; // ID del usuario que realizó la inscripción
  fechaInscripcion: Date;
  estado: 'Activa' | 'Cancelada' | 'Completada';
  alumno?: Alumno;
  curso?: Curso;
}
