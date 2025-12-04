export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: Date;
  perfil: 'Desarrollador' | 'IT' | 'Usuario Final' | 'Otro';
  activo: boolean;
  fechaCreacion: Date;
}