export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  cupoMaximo: number;
  cupoDisponible: number;
  activo: boolean;
}
