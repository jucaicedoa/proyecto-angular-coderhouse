import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Curso } from '../../core/models/curso.interface';
import { CursoService } from '../../core/services/curso.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})
export class CursosComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['nombre', 'descripcion', 'fechaInicio', 'fechaFin', 'cupoMaximo', 'cupoDisponible', 'activo', 'acciones'];
  dataSource: Curso[] = [];
  isAdmin = false;
  private destroy$ = new Subject<void>();

  constructor(
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

    this.cursoService.getCursos()
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
    this.router.navigate(['/cursos/nuevo']);
  }

  editarCurso(curso: Curso): void {
    this.router.navigate(['/cursos/editar', curso.id]);
  }

  eliminarCurso(curso: Curso): void {
    if (confirm(`¿Está seguro de que desea eliminar el curso ${curso.nombre}?`)) {
      this.cursoService.eliminarCurso(curso.id);
      this.snackBar.open('Curso eliminado correctamente', 'Cerrar', { duration: 3000 });
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}
