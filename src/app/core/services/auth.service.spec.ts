import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { USUARIOS_MOCK } from '../data/mock-data';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    // Asegurar estado limpio de localStorage antes de crear el servicio
    localStorage.removeItem('currentUser');
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.removeItem('currentUser');
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería iniciar no autenticado', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('debería autenticarse con credenciales válidas', () => {
    const usuarioValido = USUARIOS_MOCK[0];
    const setItemSpy = spyOn(localStorage, 'setItem').and.callThrough();

    const ok = service.login(usuarioValido.email, usuarioValido.password);

    expect(ok).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getCurrentUser()).not.toBeNull();
    expect(setItemSpy).toHaveBeenCalledWith('currentUser', jasmine.any(String));
  });

  it('no debería autenticarse con credenciales inválidas', () => {
    const ok = service.login('invalido@mail.com', 'wrong');
    expect(ok).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('debería identificar admin correctamente', () => {
    const admin = USUARIOS_MOCK.find(u => u.rol === 'Admin')!;
    service.login(admin.email, admin.password);
    expect(service.isAdmin()).toBeTrue();
  });

  it('debería cerrar sesión limpiando el usuario y localStorage', () => {
    const removeItemSpy = spyOn(localStorage, 'removeItem').and.callThrough();
    const usuario = USUARIOS_MOCK[1];
    service.login(usuario.email, usuario.password);

    service.logout();

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
    expect(removeItemSpy).toHaveBeenCalledWith('currentUser');
  });
});


