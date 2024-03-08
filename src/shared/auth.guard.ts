import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private readonly authSvr: AuthService) {}

  public canActivate(): boolean {
    const token = this.authSvr.getToken();
    if (token) {
      return true; // Si hay un token, permite la navegación
    } else {
      this.router.navigate(['public/login']); // Si no hay token, redirige al componente de inicio de sesión
      return false; // Bloquea la navegación
    }
  }
}
