import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { Inscripcion } from '../../core/models/inscripcion.interface';
import { Alumno } from '../../core/models/alumno.interface';
import { Curso } from '../../core/models/curso.interface';
import { InscripcionService } from '../../core/services/inscripcion.service';
import { AlumnoService } from '../../core/services/alumno.service';
import { CursoService } from '../../core/services/curso.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './inscripciones.component.html',
  styleUrl: './inscripciones.component.css'
})
export class InscripcionesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['alumno', 'curso', 'fechaInscripcion', 'estado', 'acciones'];
  dataSource: (Inscripcion & { alumno?: Alumno; curso?: Curso })[] = [];
  alumnos: Alumno[] = [];
  cursos: Curso[] = [];
  isAdmin = false;
  private destroy$ = new Subject<void>();

  constructor(
    private inscripcionService: InscripcionService,
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    
    // Si no es admin, ocultar la columna de acciones
    if (!this.isAdmin) {
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'acciones');
    }

    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDatos(): void {
    combineLatest([
      this.inscripcionService.getInscripciones(),
      this.alumnoService.getAlumnos(),
      this.cursoService.getCursos()
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([inscripciones, alumnos, cursos]) => {
      this.alumnos = alumnos;
      this.cursos = cursos;
      
      // Combinar datos de inscripciones con alumnos y cursos
      this.dataSource = inscripciones.map(inscripcion => ({
        ...inscripcion,
        alumno: alumnos.find(a => a.id === inscripcion.alumnoId),
        curso: cursos.find(c => c.id === inscripcion.cursoId)
      }));
    });
  }

  agregarInscripcion(): void {
    this.router.navigate(['/inscripciones/nueva']);
  }

  eliminarInscripcion(inscripcion: Inscripcion): void {
    const alumno = this.alumnos.find(a => a.id === inscripcion.alumnoId);
    const curso = this.cursos.find(c => c.id === inscripcion.cursoId);
    
    if (confirm(`¿Está seguro de que desea eliminar la inscripción de ${alumno?.nombre} ${alumno?.apellido} en ${curso?.nombre}?`)) {
      this.inscripcionService.eliminarInscripcion(inscripcion.id);
      this.snackBar.open('Inscripción eliminada correctamente', 'Cerrar', { duration: 3000 });
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  getNombreAlumno(alumnoId: number): string {
    const alumno = this.alumnos.find(a => a.id === alumnoId);
    return alumno ? `${alumno.nombre} ${alumno.apellido}` : 'N/A';
  }

  getNombreCurso(cursoId: number): string {
    const curso = this.cursos.find(c => c.id === cursoId);
    return curso ? curso.nombre : 'N/A';
  }
}
