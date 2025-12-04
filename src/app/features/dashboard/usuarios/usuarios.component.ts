import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../shared/shared.module';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from '../../../core/models/usuario.interface';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['nombre', 'apellido', 'email', 'telefono', 'direccion', 'perfil', 'rol', 'activo', 'acciones'];
  dataSource: Usuario[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usuarioService.getUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe(usuarios => {
        this.dataSource = usuarios;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  agregarUsuario(): void {
    this.router.navigate(['/dashboard/usuarios/nuevo']);
  }

  editarUsuario(usuario: Usuario): void {
    this.router.navigate(['/dashboard/usuarios/editar', usuario.id]);
  }

  eliminarUsuario(usuario: Usuario): void {
    // No permitir eliminar al usuario actual
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id === usuario.id) {
      this.snackBar.open('No puedes eliminar tu propio usuario', 'Cerrar', { duration: 3000 });
      return;
    }

    if (confirm(`¿Está seguro de que desea eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`)) {
      this.usuarioService.eliminarUsuario(usuario.id);
      this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', { duration: 3000 });
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}
