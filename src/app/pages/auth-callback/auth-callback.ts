import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.scss'
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.alertService.showError('No se pudo iniciar sesión con Google');
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.authService.completeGoogleLogin(token);
      const role = this.authService.getUserRole();

      if (role === 'COACH') {
        this.router.navigate(['/dashboard-coach']);
        return;
      }

      if (role === 'STUDENT') {
        this.router.navigate(['/mis-planificaciones']);
        return;
      }

      this.router.navigate(['/dashboard-coach']);
    } catch {
      this.alertService.showError('El token de Google no es válido');
      this.router.navigate(['/login']);
    }
  }
}
