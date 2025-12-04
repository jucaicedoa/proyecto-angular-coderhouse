export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  direccion: string;
  telefono: string;
  perfil: string;
  rol: 'Admin' | 'Usuario';
  activo: boolean;
  fechaCreacion: Date;
}
