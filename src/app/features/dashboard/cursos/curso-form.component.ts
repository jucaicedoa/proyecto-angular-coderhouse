import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { SharedModule } from '../../../shared/shared.module';
import { Subject, takeUntil } from 'rxjs';
import { Curso } from '../../../core/models/curso.interface';
import { CursoService } from '../../../core/services/curso.service';
import { addCourseSuccess, updateCourseSuccess } from '../../../store/courses/courses.actions';
import { selectCourses } from '../../../store/courses/courses.selectors';

@Component({
  selector: 'app-curso-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './curso-form.component.html',
  styleUrl: './curso-form.component.css'
})
export class CursoFormComponent implements OnInit, OnDestroy {
  cursoForm: FormGroup;
  isEditMode = false;
  cursoId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private cursoService: CursoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.cursoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      cantidadHoras: ['', [Validators.required, Validators.min(1)]],
      cantidadClases: ['', [Validators.required, Validators.min(1)]],
      nombreProfesor: ['', [Validators.required, Validators.minLength(3)]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      cupoMaximo: ['', [Validators.required, Validators.min(1)]],
      cupoDisponible: ['', [Validators.required, Validators.min(0)]],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['id']) {
          this.isEditMode = true;
          this.cursoId = +params['id'];
          this.cargarCurso();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarCurso(): void {
    if (this.cursoId) {
      const curso = this.cursoService.getCursoById(this.cursoId);
      if (curso) {
        this.cursoForm.patchValue({
          nombre: curso.nombre,
          descripcion: curso.descripcion,
          cantidadHoras: curso.cantidadHoras,
          cantidadClases: curso.cantidadClases,
          nombreProfesor: curso.nombreProfesor,
          fechaInicio: curso.fechaInicio,
          fechaFin: curso.fechaFin,
          cupoMaximo: curso.cupoMaximo,
          cupoDisponible: curso.cupoDisponible,
          activo: curso.activo
        });
      }
    }
  }

  onSubmit(): void {
    if (this.cursoForm.valid) {
      const cursoData = this.cursoForm.value;
      
      if (this.isEditMode && this.cursoId) {
        // Actualizar en el servicio
        this.cursoService.actualizarCurso(this.cursoId, cursoData);
        // Actualizar en el store
        const cursoActualizado: Curso = {
          ...cursoData,
          id: this.cursoId
        };
        this.store.dispatch(updateCourseSuccess({ course: cursoActualizado }));
        this.snackBar.open('Curso actualizado correctamente', 'Cerrar', { duration: 3000 });
      } else {
        // Agregar en el servicio
        this.cursoService.agregarCurso(cursoData);
        // Obtener el curso recién creado del servicio
        this.cursoService.getCursos()
          .pipe(takeUntil(this.destroy$))
          .subscribe(cursosList => {
            const nuevoCurso = cursosList[cursosList.length - 1];
            this.store.dispatch(addCourseSuccess({ course: nuevoCurso }));
          });
        this.snackBar.open('Curso creado correctamente', 'Cerrar', { duration: 3000 });
      }
      
      this.router.navigate(['/dashboard/cursos']);
    } else {
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/cursos']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.cursoForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('min')) {
      return `El valor mínimo es ${field.errors?.['min'].min}`;
    }
    return '';
  }
}
