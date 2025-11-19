import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { AlumnoService } from '../../core/services/alumno.service';
import { CursoService } from '../../core/services/curso.service';
import { InscripcionService } from '../../core/services/inscripcion.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;

  const mockAlumnos = [
    { id: 1, nombre: 'A', apellido: 'A', email: '', telefono: '', fechaNacimiento: new Date(), activo: true, fechaCreacion: new Date() },
    { id: 2, nombre: 'B', apellido: 'B', email: '', telefono: '', fechaNacimiento: new Date(), activo: false, fechaCreacion: new Date() }
  ];
  const mockCursos = [
    { id: 1, nombre: 'C1', descripcion: '', fechaInicio: new Date(), fechaFin: new Date(), cupoMaximo: 10, cupoDisponible: 5, activo: true }
  ];
  const mockInscripciones = [
    { id: 1, alumnoId: 1, cursoId: 1, fechaInscripcion: new Date(), estado: 'Activa' }
  ];

  const alumnoServiceStub = {
    getAlumnos: () => of(mockAlumnos)
  } as Partial<AlumnoService>;

  const cursoServiceStub = {
    getCursos: () => of(mockCursos)
  } as Partial<CursoService>;

  const inscripcionServiceStub = {
    getInscripciones: () => of(mockInscripciones)
  } as Partial<InscripcionService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: AlumnoService, useValue: alumnoServiceStub },
        { provide: CursoService, useValue: cursoServiceStub },
        { provide: InscripcionService, useValue: inscripcionServiceStub }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit y las suscripciones
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar estadísticas correctas', () => {
    expect(component.totalAlumnos).toBe(2);
    expect(component.alumnosActivos).toBe(1);
    expect(component.totalCursos).toBe(1);
    expect(component.totalInscripciones).toBe(1);
  });
});


