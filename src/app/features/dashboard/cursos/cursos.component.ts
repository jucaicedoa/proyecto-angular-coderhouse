import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';
import { Subject, takeUntil } from 'rxjs';
import { Curso } from '../../../core/models/curso.interface';
import { AuthService } from '../../../core/services/auth.service';
import { selectCourses, selectCoursesLoading } from '../../../store/courses/courses.selectors';
import { loadCourses, loadCoursesSuccess, deleteCourseSuccess } from '../../../store/courses/courses.actions';
import { CursoService } from '../../../core/services/curso.service';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})
export class CursosComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['nombre', 'descripcion', 'fechaInicio', 'fechaFin', 'cupoMaximo', 'cupoDisponible', 'activo', 'acciones'];
  dataSource: Curso[] = [];
  isAdmin = false;
  isLoading$!: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private cursoService: CursoService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Inicializar isLoading$ luego de que store esté disponible
    this.isLoading$ = this.store.select(selectCoursesLoading);
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    
    // Si no es admin, ocultar la columna de acciones
    if (!this.isAdmin) {
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'acciones');
    }

    // Cargar cursos desde el servicio y guardarlos en el store
    this.store.dispatch(loadCourses());
    //delay para mostrar el loading
    setTimeout(() => {
      this.cursoService.getCursos()
        .pipe(takeUntil(this.destroy$))
        .subscribe(cursos => {
          this.store.dispatch(loadCoursesSuccess({ courses: cursos }));
        });
    }, 3000);
    
    // Suscribirse a los cursos del store
    this.store.select(selectCourses)
      .pipe(takeUntil(this.destroy$))
      .subscribe(cursos => {
        this.dataSource = cursos;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  agregarCurso(): void {
    this.router.navigate(['/dashboard/cursos/nuevo']);
  }

  editarCurso(curso: Curso): void {
    this.router.navigate(['/dashboard/cursos/editar', curso.id]);
  }

  eliminarCurso(curso: Curso): void {
    if (confirm(`¿Está seguro de que desea eliminar el curso ${curso.nombre}?`)) {
      // Eliminar del servicio
      this.cursoService.eliminarCurso(curso.id);
      // Actualizar el store
      this.store.dispatch(deleteCourseSuccess({ id: curso.id }));
      this.snackBar.open('Curso eliminado correctamente', 'Cerrar', { duration: 3000 });
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}
