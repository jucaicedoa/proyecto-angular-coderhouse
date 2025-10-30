import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../shared/shared.module';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { Inscripcion } from '../../core/models/inscripcion.interface';
import { Alumno } from '../../core/models/alumno.interface';
import { Curso } from '../../core/models/curso.interface';
import { InscripcionService } from '../../core/services/inscripcion.service';
import { AlumnoService } from '../../core/services/alumno.service';
import { CursoService } from '../../core/services/curso.service';

@Component({
  selector: 'app-inscripcion-form',
  standalone: true,
  imports: [SharedModule, MatSelectModule],
  templateUrl: './inscripcion-form.component.html',
  styleUrl: './inscripcion-form.component.css'
})
export class InscripcionFormComponent implements OnInit, OnDestroy {
  inscripcionForm: FormGroup;
  alumnos: Alumno[] = [];
  cursos: Curso[] = [];
  isEditMode = false;
  inscripcionId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private inscripcionService: InscripcionService,
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.inscripcionForm = this.fb.group({
      alumnoId: ['', [Validators.required]],
      cursoId: ['', [Validators.required]],
      estado: ['Activa', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['id']) {
          this.isEditMode = true;
          this.inscripcionId = +params['id'];
          this.cargarInscripcion();
        }
      });

    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDatos(): void {
    combineLatest([
      this.alumnoService.getAlumnos(),
      this.cursoService.getCursos()
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([alumnos, cursos]) => {
      this.alumnos = alumnos.filter(a => a.activo);
      this.cursos = cursos.filter(c => c.activo && c.cupoDisponible > 0);
    });
  }

  cargarInscripcion(): void {
    if (this.inscripcionId) {
      const inscripcion = this.inscripcionService.getInscripcionById(this.inscripcionId);
      if (inscripcion) {
        this.inscripcionForm.patchValue({
          alumnoId: inscripcion.alumnoId,
          cursoId: inscripcion.cursoId,
          estado: inscripcion.estado
        });
      }
    }
  }

  onSubmit(): void {
    if (this.inscripcionForm.valid) {
      const inscripcionData = this.inscripcionForm.value;
      
      if (this.isEditMode && this.inscripcionId) {
        this.inscripcionService.actualizarInscripcion(this.inscripcionId, inscripcionData);
        this.snackBar.open('Inscripción actualizada correctamente', 'Cerrar', { duration: 3000 });
      } else {
        this.inscripcionService.agregarInscripcion(inscripcionData);
        this.snackBar.open('Inscripción creada correctamente', 'Cerrar', { duration: 3000 });
      }
      
      this.router.navigate(['/inscripciones']);
    } else {
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
    }
  }

  cancelar(): void {
    this.router.navigate(['/inscripciones']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.inscripcionForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    return '';
  }
}


