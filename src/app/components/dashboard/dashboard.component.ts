import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Subject, takeUntil } from 'rxjs';
import { AlumnoService } from '../../core/services/alumno.service';
import { CursoService } from '../../core/services/curso.service';
import { InscripcionService } from '../../core/services/inscripcion.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalAlumnos = 0;
  totalCursos = 0;
  totalInscripciones = 0;
  alumnosActivos = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private inscripcionService: InscripcionService
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarEstadisticas(): void {
    this.alumnoService.getAlumnos()
      .pipe(takeUntil(this.destroy$))
      .subscribe(alumnos => {
        this.totalAlumnos = alumnos.length;
        this.alumnosActivos = alumnos.filter(a => a.activo).length;
      });

    this.cursoService.getCursos()
      .pipe(takeUntil(this.destroy$))
      .subscribe(cursos => {
        this.totalCursos = cursos.length;
      });

    this.inscripcionService.getInscripciones()
      .pipe(takeUntil(this.destroy$))
      .subscribe(inscripciones => {
        this.totalInscripciones = inscripciones.length;
      });
  }
}
