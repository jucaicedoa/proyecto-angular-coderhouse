import { Alumno } from '../models/alumno.interface';
import { Curso } from '../models/curso.interface';
import { Inscripcion } from '../models/inscripcion.interface';
import { Usuario } from '../models/usuario.interface';

export const ALUMNOS_MOCK: Alumno[] = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@email.com',
    telefono: '123456789',
    fechaNacimiento: new Date('1995-05-15'),
    activo: true,
    fechaCreacion: new Date('2024-01-15')
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'González',
    email: 'maria.gonzalez@email.com',
    telefono: '987654321',
    fechaNacimiento: new Date('1998-08-22'),
    activo: true,
    fechaCreacion: new Date('2024-01-20')
  },
  {
    id: 3,
    nombre: 'Carlos',
    apellido: 'López',
    email: 'carlos.lopez@email.com',
    telefono: '555666777',
    fechaNacimiento: new Date('1992-12-10'),
    activo: true,
    fechaCreacion: new Date('2024-02-01')
  }
];

export const CURSOS_MOCK: Curso[] = [
  {
    id: 1,
    nombre: 'Angular Fundamentals',
    descripcion: 'Curso completo de Angular desde cero',
    fechaInicio: new Date('2024-03-01'),
    fechaFin: new Date('2024-05-31'),
    cupoMaximo: 20,
    cupoDisponible: 15,
    activo: true
  },
  {
    id: 2,
    nombre: 'TypeScript Avanzado',
    descripcion: 'Programación avanzada con TypeScript',
    fechaInicio: new Date('2024-04-01'),
    fechaFin: new Date('2024-06-30'),
    cupoMaximo: 15,
    cupoDisponible: 10,
    activo: true
  },
  {
    id: 3,
    nombre: 'React y Redux',
    descripcion: 'Desarrollo con React y gestión de estado',
    fechaInicio: new Date('2024-05-01'),
    fechaFin: new Date('2024-07-31'),
    cupoMaximo: 25,
    cupoDisponible: 20,
    activo: true
  }
];

export const INSCRIPCIONES_MOCK: Inscripcion[] = [
  {
    id: 1,
    alumnoId: 1,
    cursoId: 1,
    fechaInscripcion: new Date('2024-02-15'),
    estado: 'Activa'
  },
  {
    id: 2,
    alumnoId: 2,
    cursoId: 1,
    fechaInscripcion: new Date('2024-02-20'),
    estado: 'Activa'
  },
  {
    id: 3,
    alumnoId: 3,
    cursoId: 2,
    fechaInscripcion: new Date('2024-03-01'),
    estado: 'Activa'
  }
];

export const USUARIOS_MOCK: Usuario[] = [
  {
    id: 1,
    nombre: 'Admin',
    apellido: 'Sistema',
    email: 'admin@sistema.com',
    password: 'admin123',
    rol: 'Admin',
    activo: true,
    fechaCreacion: new Date('2024-01-01')
  },
  {
    id: 2,
    nombre: 'Usuario',
    apellido: 'Prueba',
    email: 'usuario@prueba.com',
    password: 'usuario123',
    rol: 'Usuario',
    activo: true,
    fechaCreacion: new Date('2024-01-01')
  }
];
