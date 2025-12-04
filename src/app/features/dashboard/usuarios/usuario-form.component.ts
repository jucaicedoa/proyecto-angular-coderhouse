import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../shared/shared.module';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from '../../../core/models/usuario.interface';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit, OnDestroy {
  usuarioForm: FormGroup;
  isEditMode = false;
  usuarioId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      perfil: ['', [Validators.required]],
      rol: ['Usuario', [Validators.required]],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['id']) {
          this.isEditMode = true;
          this.usuarioId = +params['id'];
          this.cargarUsuario();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarUsuario(): void {
    if (this.usuarioId) {
      const usuario = this.usuarioService.getUsuarioById(this.usuarioId);
      if (usuario) {
        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          password: usuario.password,
          direccion: usuario.direccion,
          telefono: usuario.telefono,
          perfil: usuario.perfil,
          rol: usuario.rol,
          activo: usuario.activo
        });
        // En modo edición, hacer el password opcional
        this.usuarioForm.get('password')?.clearValidators();
        this.usuarioForm.get('password')?.updateValueAndValidity();
      }
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const usuarioData = this.usuarioForm.value;
      
      // Si está en modo edición y no se cambió el password, no incluirlo
      if (this.isEditMode && !usuarioData.password) {
        delete usuarioData.password;
      }
      
      if (this.isEditMode && this.usuarioId) {
        this.usuarioService.actualizarUsuario(this.usuarioId, usuarioData);
        this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', { duration: 3000 });
      } else {
        this.usuarioService.agregarUsuario(usuarioData);
        this.snackBar.open('Usuario creado correctamente', 'Cerrar', { duration: 3000 });
      }
      
      this.router.navigate(['/dashboard/usuarios']);
    } else {
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/usuarios']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.usuarioForm.get(fieldName);
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
