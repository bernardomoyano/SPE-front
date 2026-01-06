import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { InputComponent as Input } from "../../components/input/input";
import { Left } from "../register/left/left";
import { Button } from "../../components/button/button";
import { Logo } from "../../shared/components/logo/logo";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Coach } from '../../services/coach';
import { CoachRegisterRequest } from '../../models/coach.model';
import { AlertService } from '../../services/alert.service';
import { CustomValidators } from '../../shared/validators/custom-validators';

@Component({
  selector: 'app-register-coach',
  imports: [RouterLink, Input, Left, Button, Logo, ReactiveFormsModule],
  templateUrl: './register-coach.html',
  styleUrl: './register-coach.scss',
})
export class RegisterCoach {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  
  // Errores del backend
  emailDuplicateError = '';
  phoneDuplicateError = '';
  serverError = '';
  
  constructor(
    private fb: FormBuilder,
    private coachService: Coach,
    private alertService: AlertService,
    private router: Router
  ){
    this.registerForm = this.fb.group({
      name: [
        '', 
        [
          Validators.required, 
          Validators.maxLength(100),
          CustomValidators.nameValidator()
        ]
      ],
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
        [
          Validators.required,
          CustomValidators.passwordValidator()
        ]
      ],
      confirmPassword: [
        '',
        [Validators.required]
      ],
      speciality: [
        '', 
        [
          Validators.required, 
          Validators.maxLength(150)
        ]
      ],
      phone: [
        '', 
        [
          Validators.required,
          CustomValidators.phoneValidator()
        ]
      ],
      country: [
        '', 
        [
          Validators.required, 
          Validators.maxLength(150)
        ]
      ],
      roleId: [2] 
    }, {
      validators: CustomValidators.passwordMatchValidator('password', 'confirmPassword')
    });
  }

  get nameControl(): FormControl {
    return this.registerForm.get('name') as FormControl;
  }

  get emailControl(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  get specialityControl(): FormControl {
    return this.registerForm.get('speciality') as FormControl;
  }

  get phoneControl(): FormControl {
    return this.registerForm.get('phone') as FormControl;
  }

  get countryControl(): FormControl {
    return this.registerForm.get('country') as FormControl;
  }

  private clearBackendErrors(): void {
    this.emailDuplicateError = '';
    this.phoneDuplicateError = '';
    this.serverError = '';
  }

  private processBackendErrors(errors: string[]): void {
    this.clearBackendErrors();

    errors.forEach(error => {
      const errorLower = error.toLowerCase();

      // Validaciones de duplicados
      if (errorLower.includes('email') && errorLower.includes('registrado')) {
        this.emailDuplicateError = error;
      } else if (errorLower.includes('teléfono') && (errorLower.includes('registrado') || errorLower.includes('existe'))) {
        this.phoneDuplicateError = error;
      } else if (errorLower.includes('telefono') && (errorLower.includes('registrado') || errorLower.includes('existe'))) {
        this.phoneDuplicateError = error;
      } else {
        // Cualquier otro error del servidor
        this.serverError = error;
      }
    });
  }

   onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.clearBackendErrors();
      const data: CoachRegisterRequest = this.registerForm.value;

      this.coachService.registerCoach(data).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.success) {
            // Si es exitoso, mostrar el mensaje del backend
            this.alertService.showSuccess(response.message, () => {
              this.registerForm.reset();
              this.router.navigate(['/login']);
            });
          } else {
            console.log('Entrando en el bloque de error');
            // Si no es exitoso pero hay errores controlados
            if (response.errors && response.errors.length > 0) {
              this.processBackendErrors(response.errors);
              
              // Mostrar error general solo si no es un error de duplicado
              if (!this.emailDuplicateError && !this.phoneDuplicateError && this.serverError) {
                this.alertService.showError(this.serverError);
              }
            } else {
              this.alertService.showError(response.message);
            }
          }
        },
        error: (error) => {
          this.isLoading = false;
          
          // Verificar si el error tiene la estructura de ApiResponse
          if (error.error && typeof error.error === 'object' && 'errors' in error.error) {
            const apiError = error.error;
            
            if (apiError.errors && apiError.errors.length > 0) {
              this.processBackendErrors(apiError.errors);
              
              // Mostrar error general solo si no es un error de duplicado
              if (!this.emailDuplicateError && !this.phoneDuplicateError && this.serverError) {
                this.alertService.showError(this.serverError);
              }
              return;
            }
          }
          
          // Manejar errores no controlados (errores de red, servidor no disponible, etc.)
          const errorMessage = error?.error?.message || 'No se pudo completar el registro. Intenta nuevamente';
          this.alertService.showError(errorMessage);
        }
      });
    }
    
  }
}
