import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/services/auth.service';
import { setUsuario } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      if (this.authService.login(email, password)) {
        // Obtener el usuario actual después del login exitoso
        const usuario = this.authService.getCurrentUser();
        if (usuario) {
          // Guardar el usuario completo en el store
          this.store.dispatch(setUsuario({ usuario }));
        }
        this.snackBar.open('Login exitoso', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      } else {
        this.snackBar.open('Credenciales incorrectas', 'Cerrar', { duration: 3000 });
      }
    }
  }
}
