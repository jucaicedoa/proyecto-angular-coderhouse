export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  cantidadHoras: number;
  cantidadClases: number;
  nombreProfesor: string;
  fechaInicio: Date;
  fechaFin: Date;
  cupoMaximo: number;
  cupoDisponible: number;
  activo: boolean;
}
