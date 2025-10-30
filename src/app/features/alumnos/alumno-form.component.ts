import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../shared/shared.module';
import { Subject, takeUntil } from 'rxjs';
import { Alumno } from '../../core/models/alumno.interface';
import { AlumnoService } from '../../core/services/alumno.service';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './alumno-form.component.html',
  styleUrl: './alumno-form.component.css'
})
export class AlumnoFormComponent implements OnInit, OnDestroy {
  alumnoForm: FormGroup;
  isEditMode = false;
  alumnoId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.alumnoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      fechaNacimiento: ['', [Validators.required]],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['id']) {
          this.isEditMode = true;
          this.alumnoId = +params['id'];
          this.cargarAlumno();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarAlumno(): void {
    if (this.alumnoId) {
      const alumno = this.alumnoService.getAlumnoById(this.alumnoId);
      if (alumno) {
        this.alumnoForm.patchValue({
          nombre: alumno.nombre,
          apellido: alumno.apellido,
          email: alumno.email,
          telefono: alumno.telefono,
          fechaNacimiento: alumno.fechaNacimiento,
          activo: alumno.activo
        });
      }
    }
  }

  onSubmit(): void {
    if (this.alumnoForm.valid) {
      const alumnoData = this.alumnoForm.value;
      
      if (this.isEditMode && this.alumnoId) {
        this.alumnoService.actualizarAlumno(this.alumnoId, alumnoData);
        this.snackBar.open('Alumno actualizado correctamente', 'Cerrar', { duration: 3000 });
      } else {
        this.alumnoService.agregarAlumno(alumnoData);
        this.snackBar.open('Alumno creado correctamente', 'Cerrar', { duration: 3000 });
      }
      
      this.router.navigate(['/alumnos']);
    } else {
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
    }
  }

  cancelar(): void {
    this.router.navigate(['/alumnos']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.alumnoForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('email')) {
      return 'Ingrese un email válido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('pattern')) {
      return 'Formato de teléfono inválido';
    }
    return '';
  }
}


