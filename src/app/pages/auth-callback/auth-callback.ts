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
    const code = this.route.snapshot.queryParamMap.get('code');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (error) {
      this.alertService.showError('No se pudo iniciar sesión con Google');
      this.router.navigate(['/login']);
      return;
    }

    if (!code) {
      this.alertService.showError('No se recibió el código de autenticación de Google');
      this.router.navigate(['/login']);
      return;
    }

    this.authService.exchangeGoogleCode(code).subscribe({
      next: response => {
        if (!response.success || !response.data) {
          this.alertService.showError(response.message || 'No se pudo iniciar sesión con Google');
          this.router.navigate(['/login']);
          return;
        }

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
      },
      error: () => {
        this.alertService.showError('El código de Google es inválido o expiró');
        this.router.navigate(['/login']);
      }
    });
  }
}
