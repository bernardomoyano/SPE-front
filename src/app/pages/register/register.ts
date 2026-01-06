import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { InputComponent as Input } from "../../components/input/input";
import { Left } from "./left/left";
import { Button } from "../../components/button/button";
import { Logo } from "../../shared/components/logo/logo";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CustomValidators } from '../../shared/validators/custom-validators';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  imports: [RouterLink, Input, Left, Button, Logo, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          CustomValidators.emailValidator()
        ]
      ],
      password: [
        '',
        [Validators.required]
      ]
    });
  }

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials: LoginRequest = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;

          if (response.success && response.data) {
            console.log('Login exitoso:', response.data);
            console.log('Token guardado:', response.data.token);
            console.log('Usuario:', response.data.name);
            console.log('Rol:', response.data.roleName);

            this.alertService.showSuccess(response.data.message, () => {
              // Redirigir según el rol del usuario
              if (response.data?.roleName === 'COACH') {
                this.router.navigate(['/dashboard-coach']);
              } else {
                this.router.navigate(['/dashboard']);
              }
            });
          } else {
            this.alertService.showError(response.message || 'Error al iniciar sesión');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en login:', error);

          // Verificar si el error tiene estructura de ApiResponse
          if (error.error && typeof error.error === 'object') {
            const apiError = error.error;

            // Errores de credenciales
            if (apiError.errors && apiError.errors.length > 0) {
              this.alertService.showError(apiError.errors.join(', '));
            } else if (apiError.message) {
              this.alertService.showError(apiError.message);
            } else {
              this.alertService.showError('Credenciales incorrectas. Verifica tu email y contraseña');
            }
          } else {
            // Error de servidor
            this.alertService.showError('Error del servidor. Intenta nuevamente más tarde');
          }
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}
