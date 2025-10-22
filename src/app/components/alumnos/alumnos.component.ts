import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Alumno } from '../../core/models/alumno.interface';
import { AlumnoService } from '../../core/services/alumno.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.css'
})
export class AlumnosComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['nombre', 'apellido', 'email', 'telefono', 'fechaNacimiento', 'activo', 'acciones'];
  dataSource: Alumno[] = [];
  isAdmin = false;
  private destroy$ = new Subject<void>();

  constructor(
    private alumnoService: AlumnoService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    
    // Si no es admin, ocultar la columna de acciones
    if (!this.isAdmin) {
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'acciones');
    }

    this.alumnoService.getAlumnos()
      .pipe(takeUntil(this.destroy$))
      .subscribe(alumnos => {
        this.dataSource = alumnos;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  agregarAlumno(): void {
    this.router.navigate(['/alumnos/nuevo']);
  }

  editarAlumno(alumno: Alumno): void {
    this.router.navigate(['/alumnos/editar', alumno.id]);
  }

  eliminarAlumno(alumno: Alumno): void {
    if (confirm(`¿Está seguro de que desea eliminar al alumno ${alumno.nombre} ${alumno.apellido}?`)) {
      this.alumnoService.eliminarAlumno(alumno.id);
      this.snackBar.open('Alumno eliminado correctamente', 'Cerrar', { duration: 3000 });
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}
