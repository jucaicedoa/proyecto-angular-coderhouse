import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { Subject, takeUntil, filter } from 'rxjs';
import { AlumnoService } from '../../core/services/alumno.service';
import { CursoService } from '../../core/services/curso.service';
import { InscripcionService } from '../../core/services/inscripcion.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalAlumnos = 0;
  totalCursos = 0;
  totalInscripciones = 0;
  alumnosActivos = 0;
  showPanel = true;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private inscripcionService: InscripcionService
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
    
    // Verificar si hay una ruta hija activa
    this.checkRoute();
    
    // Escuchar cambios de ruta
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkRoute();
      });
  }
  
  checkRoute(): void {
    const url = this.router.url;
    // Si la URL contiene alguna de las rutas hijas se oculta el panel
    this.showPanel = !url.includes('/alumnos') && 
                     !url.includes('/cursos') && 
                     !url.includes('/inscripciones');
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
